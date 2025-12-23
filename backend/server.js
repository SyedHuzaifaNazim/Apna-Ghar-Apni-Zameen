const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
// const bcrypt = require('bcryptjs'); // Recommended for hashing passwords later
const URI = process.env.MongoDB_URI_PROD;
const app = express();
app.use(cors());
app.use(bodyParser.json());

if (!URI) {
  console.error("❌ Error: MongoDB URI is missing in .env file");
  process.exit(1);
}

mongoose.connect(URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Connection Error:", err));

// 1. Connect to MongoDB (Replace with your connection string)
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected")).catch(err => console.log(err));

// 2. Define User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // In production, hash this!
  phone: String,
});

const User = mongoose.model('User', UserSchema);

// 3. API Routes

// Sign Up
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

// Sign In
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password }); // In prod, compare hashed password
  
  if (user) {
    res.json({ status: 'ok', user });
  } else {
    res.status(401).json({ status: 'error', user: false, message: "Invalid credentials" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});