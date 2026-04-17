const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
    questionText: String,
    keywords: [String],
    order: Number,
    answerText: {
        type: String,
        default: ''
    },
    score: {
        type: Number,
        default: 0
    },
    feedback: {
        type: String,
        default: ''
    }
});

const interviewSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    totalQuestions: {
        type: Number,
        default: 0
    },
    completed: {
        type: Boolean,
        default: false
    },
    overallScore: {
        type: Number,
        default: null
    },
    questions: [interviewQuestionSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('Interview', interviewSessionSchema);
