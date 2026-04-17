require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hireonix';

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hireonix Backend (Node.js/Express) is running' });
});

// Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/jobs', require('./routes/jobs.routes'));
app.use('/api/v1/interviews', require('./routes/interviews.routes'));
app.use('/api/v1/career-mapper', require('./routes/career.routes')); // Renamed to match frontend
app.use('/api/v1/parallel-insights', require('./routes/parallel.routes'));
app.use('/api/v1/faq-chat', require('./routes/faq.routes'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
    });
