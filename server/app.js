require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const trackRoutes = require('./routes/trackRoutes');

connectDB().catch((err) => console.error('MongoDB connection failed:', err.message));

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ success: true, message: 'Delivery Wala API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/track', trackRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
