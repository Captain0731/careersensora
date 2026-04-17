const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema({
    uploadedResumeName: String,
    matchedKeywords: [String],
    keywordScore: Number,
    skillsDepthScore: Number,
    resumeQualityScore: Number,
    overallScore: Number,
    eligible: Boolean,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        trim: true
    },
    resumeAnalysis: resumeAnalysisSchema,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Application', applicationSchema);
