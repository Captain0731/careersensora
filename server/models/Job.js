const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    salary: {
        type: String,
        trim: true
    },
    workType: {
        type: String,
        trim: true
    },
    experience: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        trim: true
    },
    skills: [String],
    description: {
        type: String,
        required: true
    },
    responsibilities: [String],
    requirements: [String],
    niceToHave: [String],
    badge: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['open', 'paused', 'closed'],
        default: 'open'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

jobSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Job', jobSchema);
