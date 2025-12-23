require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. Get the URI from .env
const URI = process.env.MongoDB_URI_PROD; 

if (!URI) {
  console.error("❌ Error: MongoDB URI is missing in .env file");
  process.exit(1);
}

// 2. Connect to MongoDB (Cleaned up version)
mongoose.connect(URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Connection Error:", err));

// 3. Define User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, 
  phone: String,
});

const User = mongoose.model('User', UserSchema);

// 4. API Routes

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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});