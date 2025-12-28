require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// 1. IMPROVED CORS (Allows your app's custom headers)
app.use(cors({
  origin: '*', // Allow all origins (Change to your specific domain in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Platform', 'X-App-Version', 'X-Device-ID']
}));

app.use(bodyParser.json());

// 2. DB Connection
const URI = process.env.MongoDB_URI_PROD; 
let cachedDb = null;

if (!URI) {
  console.error("❌ Error: MongoDB URI is missing in .env file");
}

// Robust connection for Vercel/Serverless
async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const client = await mongoose.connect(URI, { serverSelectionTimeoutMS: 5000 });
  cachedDb = client;
  return client;
}

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
  try {
    if (URI) await connectToDatabase();
    next();
  } catch (error) {
    console.error("DB Connection Failed:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// 3. Define Schemas
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, 
  phone: String,
});
const User = mongoose.model('User', UserSchema);

// Define Property Schema (Matches your frontend types)
const PropertySchema = new mongoose.Schema({
  title: String,
  price: Number,
  currency: { type: String, default: 'PKR' },
  listingType: String, // 'For Sale' | 'For Rent'
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
  datePosted: { type: Date, default: Date.now }
  // Add other fields as needed based on your frontend Property type
}, { strict: false }); // strict: false allows saving fields not defined here

const Property = mongoose.model('Property', PropertySchema);

// 4. API Routes

// --- Auth Routes ---
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

app.put('/update-profile', async (req, res) => {
  const { email, name, phone } = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: email }, 
      { name, phone }, 
      { new: true }
    );
    if (updatedUser) {
      res.json({ status: 'ok', user: updatedUser });
    } else {
      res.status(404).json({ status: 'error', message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// --- NEW: Property Routes (Fixes your 404s) ---

// Get All Properties (with pagination)
app.get('/properties', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const properties = await Property.find()
      .skip(skip)
      .limit(limit)
      .sort({ datePosted: -1 }); // Newest first

    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Property
app.get('/properties/:id', async (req, res) => {
  try {
    // Note: If using MongoDB native _id, use findById(req.params.id)
    // If using a numeric 'id' field, use findOne({ id: req.params.id })
    // Assuming standard Mongo _id for now, or match your data structure
    const property = await Property.findOne({ _id: req.params.id }).catch(() => null) 
                     || await Property.findOne({ id: req.params.id }); 

    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ error: "Property not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Local Development Server
if (require.main === module) {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

// Export for Vercel
module.exports = app;