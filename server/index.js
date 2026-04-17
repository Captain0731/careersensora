require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hireonix';
const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const getDbState = () => {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    return states[mongoose.connection.readyState] || 'unknown';
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hireonix Backend (Node.js/Express) is running' });
});

app.use('/api/v1', (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            detail: 'MongoDB is not connected yet',
            dbState: getDbState(),
        });
    }

    next();
});

// Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/jobs', require('./routes/jobs.routes'));
app.use('/api/v1/interviews', require('./routes/interviews.routes'));
app.use('/api/v1/career-mapper', require('./routes/career.routes')); // Renamed to match frontend
app.use('/api/v1/parallel-insights', require('./routes/parallel.routes'));
app.use('/api/v1/faq-chat', require('./routes/faq.routes'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), dbState: getDbState() });
});

// Start the HTTP server immediately so Render keeps the service alive.
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
    });
