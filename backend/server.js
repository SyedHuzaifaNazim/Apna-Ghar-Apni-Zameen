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

app.put('/update-profile', async (req, res) => {
  const { email, name, phone } = req.body;
  
  try {
    // Find user by email and update their details
    // { new: true } returns the updated document instead of the old one
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

if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = app;
