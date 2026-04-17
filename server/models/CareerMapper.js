const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    isBase: {
        type: Boolean,
        default: true
    }
});

const interestSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    sortOrder: {
        type: Number,
        default: 0
    }
});

const careerPathSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    summary: String,
    sortOrder: {
        type: Number,
        default: 0
    },
    skillMatches: [String],
    interestMatches: [String],
    bestFor: [String],
    roadmap: [mongoose.Schema.Types.Mixed] // Flexible for JSON-like roadmap structure
});

const domainInsightSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    color: String,
    sortOrder: {
        type: Number,
        default: 0
    },
    description: String,
    analysis: String,
    salaryText: String,
    salaryMin: Number,
    salaryMax: Number,
    growth: String,
    growthScore: Number,
    demand: String,
    demandScore: Number,
    skills: [String],
    recommendation: String,
    whyRecommended: [String],
    chooseIfPrimary: [String],
    chooseIfOther: [String],
    finalSuggestion: String
});

module.exports = {
    Skill: mongoose.model('Skill', skillSchema),
    Interest: mongoose.model('Interest', interestSchema),
    CareerPath: mongoose.model('CareerPath', careerPathSchema),
    DomainInsight: mongoose.model('DomainInsight', domainInsightSchema)
};
