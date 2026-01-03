import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import bodyParser from "body-parser"
import axios from "axios"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

dotenv.config()

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
  role: String,
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
  try {
    const { name, email, password, phone } = req.body

    const missingFields = []
    if (!name) missingFields.push("name")
    if (!email) missingFields.push("email")
    if (!password) missingFields.push("password")
    if (!phone) missingFields.push("phone")

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "error",
        error: `Missing fields: ${missingFields.join(", ")}`
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "error",
        error: "Invalid email format"
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: "error",
        error: "Password must be at least 8 characters"
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        error: "Email already exists"
      })
    }

      const existingName = await User.findOne({ name })
    if (existingName) {
      return res.status(400).json({
        status: "error",
        error: "Username already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "Buyer"
    })
    await newUser.save()

    res.json({
      status: "ok",
      message: "User registered successfully"
    })

  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    })
  }
})

app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body

    const missingFields = []
    if (!email) missingFields.push("email")
    if (!password) missingFields.push("password")

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "error",
        error: `Missing fields: ${missingFields.join(", ")}`
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "error",
        error: "Invalid email format"
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: "error",
        error: "Password must be at least 8 characters"
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        status: "error",
        user: false,
        message: "Invalid credentials"
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        user: false,
        message: "Invalid credentials",
      })
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" } 
    )

    res.json({
      status: "ok",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    })

  } catch (err) {
    res.status(500).json({
      status: "error",
      error: err.message
    })
  }
})

app.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "error",
        error: "Invalid user ID format"
      })
    }

    const user = await User.findById(id).select("-password") // password hide

    if (!user) {
      return res.status(404).json({
        status: "error",
        error: "User not found"
      })
    }

    res.json({
      status: "ok",
      user
    })

  } catch (err) {
    res.status(500).json({
      status: "error",
      error: err.message
    })
  }
})

app.put("/user/role/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "error",
        error: "Invalid user ID"
      })
    }

    if (!status) {
      return res.status(400).json({
        status: "error",
        error: "Status is required"
      })
    }

    if (!["Buyer", "Seller"].includes(status)) {
      return res.status(400).json({
        status: "error",
        error: "Status must be Buyer or Seller"
      })
    }

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({
        status: "error",
        error: "User not found"
      })
    }

    user.role = status
    await user.save()

    res.json({
      status: "ok",
      message: "Role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (err) {
    res.status(500).json({
      status: "error",
      error: err.message
    })
  }
})

app.get('/properties', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
   
    const limit = parseInt(req.query.limit) || 20

    const response = await axios.get("https://apnagharapnizameen.com/wp-json/mo/v1/posts")
    const allData = response.data

    const total = allData.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedData = allData.slice(start, end)

    res.json({
      total,
      totalPages,
      page,
      limit,
      data: paginatedData
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

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
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;