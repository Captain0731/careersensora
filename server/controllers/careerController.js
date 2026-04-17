const { Skill, Interest, CareerPath } = require('../models/CareerMapper');
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// @desc    Get career mapper configuration
// @route   GET /api/v1/career-mapper/config
const getCareerConfig = async (req, res) => {
    try {
        const skills = await Skill.find().sort({ sortOrder: 1, _id: 1 });
        const interests = await Interest.find().sort({ sortOrder: 1, _id: 1 });
        const paths = await CareerPath.find().sort({ sortOrder: 1, _id: 1 });

        res.json({
            base_skills: skills.map(s => s.name),
            interests: interests.map(i => ({ id: i.key })),
            experience_levels: ["Beginner", "Intermediate", "Advanced"],
            career_paths: paths.map(p => ({
                id: p.slug,
                title: p.title,
                summary: p.summary,
                skillMatches: p.skillMatches,
                interestMatches: p.interestMatches,
                bestFor: p.bestFor,
                roadmap: p.roadmap
            }))
        });
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
};

// Helper for AI JSON parsing
const parseAIJSON = (text) => {
    let raw = (text || "").trim();
    if (raw.startsWith("```")) {
        raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "");
    }
    raw = raw.trim();
    try {
        return JSON.parse(raw);
    } catch (e) {
        const start = raw.indexOf("{");
        const end = raw.lastIndexOf("}");
        if (start !== -1 && end !== -1 && end > start) {
            return JSON.parse(raw.substring(start, end + 1));
        }
        throw e;
    }
};

// @desc    Generate career matches using Groq
// @route   POST /api/v1/career-mapper/generate
const generateMatches = async (req, res) => {
    const { skills, interests, experienceLevel } = req.body;

    if (!skills || !interests || !experienceLevel) {
        return res.status(400).json({ detail: 'Skills, interests, and experienceLevel are required' });
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a career advisor. Return ONLY JSON with key `matches` as an array of exactly 4 objects. Each object must include fields: id,title,level,score,fitReason,roadmapHint,languageChoice,matchScore,successProbability,successTrack,salaryInsights,jobAvailability,nextBestSkillsToLearn,skillBasedImprovementRate,missingSkills."
                },
                {
                    role: "user",
                    content: `Skills: ${skills.join(', ')}\nInterests: ${interests.join(', ')}\nExperience Level: ${experienceLevel}\nLevel must be one of: High Match, Medium Match, Good Match. score/matchScore/successProbability must be integers 60-95. nextBestSkillsToLearn and missingSkills must contain 3-6 short skill names each. salaryInsights and successTrack must be short and practical.`
                }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        const payload = parseAIJSON(chatCompletion.choices[0].message.content);
        let matches = payload.matches || [];

        const normalized = matches.slice(0, 4).map((m, idx) => ({
            id: String(m.id || `career-${idx + 1}`).trim(),
            title: String(m.title || "Career Path").trim(),
            level: String(m.level || "Medium Match").trim(),
            score: Math.max(60, Math.min(95, parseInt(m.score || 70))),
            fitReason: String(m.fitReason || "Matches your profile."),
            roadmapHint: String(m.roadmapHint || "Build one strong project."),
            languageChoice: String(m.languageChoice || "Tech Stack"),
            matchScore: Math.max(60, Math.min(95, parseInt(m.matchScore || 70))),
            successProbability: Math.max(60, Math.min(95, parseInt(m.successProbability || 70))),
            successTrack: String(m.successTrack || "Steady career path."),
            salaryInsights: String(m.salaryInsights || "Stable earnings."),
            jobAvailability: String(m.jobAvailability || "High demand."),
            nextBestSkillsToLearn: m.nextBestSkillsToLearn || [],
            skillBasedImprovementRate: String(m.skillBasedImprovementRate || "+10% per quarter."),
            missingSkills: m.missingSkills || []
        }));

        res.json({ matches: normalized });
    } catch (error) {
        console.error('Groq Error:', error);
        if (error.status === 401) {
            return res.status(500).json({ detail: 'Groq API Key (GROQ_API_KEY) is missing or invalid in server/.env' });
        }
        res.status(502).json({ detail: 'AI generation failed', detail_extra: error.message });
    }
};

// @desc    Get detailed career insights
// @route   POST /api/v1/career-mapper/detail
const getCareerDetail = async (req, res) => {
    const { title, skills } = req.body;
    
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a career analyst. Return ONLY one JSON object with keys: title, matchScore, successProbability, salaryInsight, growthPotential, jobAvailability, availabilityHint, nextSkills, learningSpeed, improvementRate, successFactors, missingSkills."
                },
                {
                    role: "user",
                    content: `Role: ${title}\nUser Skills: ${skills.join(', ')}\nProvide deep analysis.`
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        const out = parseAIJSON(chatCompletion.choices[0].message.content);
        res.json({
            ...out,
            id: req.body.careerId,
            selectedSkills: skills
        });
    } catch (error) {
        res.status(502).json({ detail: 'AI analysis failed', detail_extra: error.message });
    }
};

module.exports = { getCareerConfig, generateMatches, getCareerDetail };
