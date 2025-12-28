require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// 1. Allow Custom Headers
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Platform', 'X-App-Version', 'X-Device-ID']
}));

app.use(bodyParser.json());

// 2. Connect DB
const URI = process.env.MongoDB_URI_PROD; 
if (!URI) console.error("❌ MongoDB URI missing");

mongoose.connect(URI || '')
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Connection Error:", err));

// 3. Define Schemas
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, 
  phone: String,
});
const User = mongoose.model('User', UserSchema);

// PROPERTY SCHEMA (You were missing this!)
const PropertySchema = new mongoose.Schema({
  title: String,
  price: Number,
  currency: { type: String, default: 'PKR' },
  listingType: String,
  propertyCategory: String,
  address: {
    city: String,
    area: String,
    line1: String,
    latitude: Number,
    longitude: Number
  },
  bedrooms: Number,
  areaSize: Number,
  areaUnit: String,
  images: [String],
  isFeatured: Boolean,
  description: String,
  datePosted: { type: Date, default: Date.now }
}, { strict: false });

const Property = mongoose.model('Property', PropertySchema);

// 4. Routes
app.post('/signup', async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const newUser = new User({ name, email, password, phone });
    await newUser.save();
    res.json({ status: 'ok', message: 'User created' });
  } catch (error) {
    res.status(400).json({ status: 'error', error: 'Email likely already exists' });
  }
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ status: 'ok', user });
    } else {
      res.status(401).json({ status: 'error', user: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// PROPERTY ROUTES (You were missing these!)
app.get('/properties', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const properties = await Property.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ datePosted: -1 });
      
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findOne({ 
      $or: [{ _id: mongoose.Types.ObjectId.isValid(req.params.id) ? req.params.id : null }, { id: req.params.id }]
    });
    if (property) res.json(property);
    else res.status(404).json({ error: "Not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 8000;
    app.listen(port, () => console.log(`Server running on ${port}`));
}

module.exports = app;