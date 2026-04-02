const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/mongodb');
const connectCloudinary = require('./config/cloudinary.js');
const seedAdmin = require('./config/seedAdmin');
const auth = require('./routes/auth.js');
const coins = require('./routes/coins.js');
const wishlist = require('./routes/wishlist.js');
const inquiries = require('./routes/inquiries.js');
const articles = require('./routes/articles.js');
const admin = require('./routes/admin.js');

const app = express()
const port = process.env.PORT || 5000
connectDB().then(() => seedAdmin())
connectCloudinary()

// BUG FIX: Allow multiple origins - frontend (8080) + admin (8081) + any deployed URLs
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
  : ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}))
app.use(express.json())
// Routes
app.use('/api/auth', auth);
app.use('/api/coins', coins);
app.use('/api/wishlist', wishlist);
app.use('/api/inquiries', inquiries);
app.use('/api/articles', articles);
app.use('/api/admin', admin);

// Health check
app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>console.log("Server running at: "+port))