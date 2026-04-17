const mongoose = require('mongoose');

const getDbState = () => {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    return states[mongoose.connection.readyState] || 'unknown';
};

const dbReady = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            detail: 'MongoDB is not connected yet',
            dbState: getDbState(),
        });
    }

    next();
};

module.exports = { dbReady };
