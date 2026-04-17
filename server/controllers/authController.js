const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/signup
const signup = async (req, res) => {
    const { username, email, password, firstName, lastName, phone } = req.body;

    try {
        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            return res.status(400).json({ detail: 'User already exists' });
        }

        const user = await User.create({
            username,
            email,
            password,
            firstName,
            lastName,
            phone,
            isRecruiter: false
        });

        if (user) {
            res.status(201).json({
                token: generateToken(user._id),
                username: user.username
            });
        } else {
            res.status(400).json({ detail: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
const login = async (req, res) => {
    const { username: identifier, password } = req.body;

    try {
        const user = await User.findOne({ 
            $or: [
                { email: identifier.toLowerCase() }, 
                { username: identifier }
            ] 
        });

        if (user && (await user.comparePassword(password))) {
            res.json({
                token: generateToken(user._id),
                username: user.username
            });
        } else {
            res.status(401).json({ detail: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
};

// @desc    Get recruiter login (Admin bypass like Django)
// @route   POST /api/auth/recruiter-login
const recruiterLogin = async (req, res) => {
    const { username, password } = req.body;

    // Hardcoded logic to match the Django mock-up for now
    if (username.toLowerCase() === 'admin@careerai.com' || username === 'admin') {
        if (password === 'Admin@123') {
            let user = await User.findOne({ email: 'admin@careerai.com' });
            
            if (!user) {
                user = await User.create({
                    username: 'admin',
                    email: 'admin@careerai.com',
                    password: password,
                    firstName: 'Admin',
                    lastName: 'CareerAI',
                    isRecruiter: true
                });
            } else {
                user.isRecruiter = true;
                await user.save();
            }

            return res.json({
                token: generateToken(user._id),
                username: user.username
            });
        }
    }

    res.status(401).json({ detail: 'Invalid recruiter credentials' });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
    const user = req.user;
    if (user) {
        res.json({
            username: user.username,
            email: user.email,
            phone: user.phone,
            is_recruiter: user.isRecruiter,
            first_name: user.firstName,
            last_name: user.lastName
        });
    } else {
        res.status(404).json({ detail: 'User not found' });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'hireonix-mern-secret-key-replace-in-prod', {
        expiresIn: '7d'
    });
};

module.exports = { signup, login, recruiterLogin, getMe };
