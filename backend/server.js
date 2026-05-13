import axios from "axios"
import bcrypt from "bcryptjs"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

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
if (!URI) {
  console.error("❌ MongoDB URI missing. Running without DB.");
} else {
  mongoose.connect(URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ Connection Error:", err));
}

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

    res.json({
      status: "ok",
      message: "User registered successfully (Mocked)"
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

    const token = jwt.sign(
      {
        id: "mock_user_123",
        email: email,
        role: "Buyer"
      },
      process.env.JWT_SECRET || "mock_secret",
      { expiresIn: "30d" } 
    )

    res.json({
      status: "ok",
      user: {
        id: "mock_user_123",
        name: "Mock User",
        email: email,
        phone: "03001234567",
        role: "Buyer"
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const karachiAreas = [
      { area: "DHA Phase 8", city: "Karachi", lat: 24.7891, lng: 67.0485 },
      { area: "Clifton", city: "Karachi", lat: 24.8215, lng: 67.0326 },
      { area: "Gulshan-e-Iqbal", city: "Karachi", lat: 24.9197, lng: 67.0970 },
      { area: "PECHS", city: "Karachi", lat: 24.8716, lng: 67.0599 },
      { area: "Bahria Town", city: "Karachi", lat: 25.0441, lng: 67.3195 }
    ];

    const generateMockProperties = (count, startId) => {
      let mockData = [];
      for(let i = 0; i < count; i++) {
        let loc = karachiAreas[Math.floor(Math.random() * karachiAreas.length)];
        let type = Math.random() > 0.5 ? "House" : "Apartment";
        let listingType = Math.random() > 0.3 ? "Sale" : "Rent";
        let price = listingType === "Sale" ? (Math.floor(Math.random() * 50) + 10) * 1000000 : (Math.floor(Math.random() * 100) + 30) * 1000;
        
        mockData.push({
          id: startId + i,
          title: `Beautiful ${type} in ${loc.area}`,
          price: price,
          currency: "PKR",
          listingType: listingType,
          propertyCategory: type,
          address: {
            city: loc.city,
            area: loc.area,
            line1: `Street ${Math.floor(Math.random() * 20) + 1}, ${loc.area}`,
            latitude: loc.lat + (Math.random() - 0.5) * 0.01,
            longitude: loc.lng + (Math.random() - 0.5) * 0.01
          },
          bedrooms: Math.floor(Math.random() * 4) + 2,
          areaSize: Math.floor(Math.random() * 400) + 100,
          areaUnit: "Sq. Yd.",
          images: [`https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80`],
          isFeatured: Math.random() > 0.8,
          description: `This is a mock description for a ${type} located in the heart of ${loc.area}, Karachi. Features all basic amenities.`,
          datePosted: new Date().toISOString()
        });
      }
      return mockData;
    };

    const totalPosts = 100; // Mock total 100 items
    const totalPages = Math.ceil(totalPosts / limit);
    
    const data = generateMockProperties(limit, (page - 1) * limit);

    res.json({
      total: totalPosts,
      totalPages: totalPages,
      page,
      limit,
      data: data 
    });

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
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;