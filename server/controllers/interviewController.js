const mongoose = require('mongoose');
const Interview = require('../models/Interview');
const User = require('../models/User');

// Deterministic evaluation logic from Django
const evaluateAnswer = (answerText, keywords) => {
    const normalized = answerText.toLowerCase();
    let keywordHits = 0;
    keywords.forEach(kw => {
        if (normalized.includes(String(kw).toLowerCase())) keywordHits++;
    });
    const lengthScore = Math.min(25, Math.floor(answerText.trim().length / 8));
    const score = Math.min(100, 40 + (keywordHits * 20) + lengthScore);
    
    let feedback = "";
    if (score >= 80) feedback = "Excellent response! You demonstrated strong understanding and covered key concepts well.";
    else if (score >= 60) feedback = "Good response. Consider adding more specific examples and technical depth.";
    else feedback = "Your answer could be improved. Try to include more relevant technical details and structure your response better.";

    return { score: parseFloat(score), feedback };
};

const getStrengths = (score) => {
    if (score >= 80) return ["Strong clarity and structure", "Relevant technical depth", "Good interview confidence"];
    if (score >= 60) return ["Clear intent in answers", "Good topic coverage", "Room for stronger examples"];
    return ["Basic understanding of the topic", "Good start on communication", "Can improve structure and depth"];
};

// @desc    Start an interview session
// @route   POST /api/interviews/start
const startInterview = async (req, res) => {
    const { domain, difficulty, mode } = req.body;
    
    if (!domain || !difficulty || !mode) {
        return res.status(400).json({ detail: 'domain, difficulty, and mode are required' });
    }

    let userId;
    try {
        if (req.user) {
            userId = req.user._id;
        } else {
            const guest = await User.findOne({ username: 'guest_ai_interview' });
            userId = guest ? guest._id : (await User.create({
                username: 'guest_ai_interview',
                email: 'guest@hireonix.local',
                password: 'guest-no-password',
                firstName: 'Guest',
                isRecruiter: false
            }))._id;
        }

        const questionsBank = [
            { prompt: `What is the most challenging aspect of ${domain}?`, keywords: [domain, 'architecture', 'scalability'] },
            { prompt: `How do you handle state management in a ${domain} project?`, keywords: ['state', 'context', 'redux', 'hooks'] },
            { prompt: `Explain the concept of decorators/higher-order components in ${domain}.`, keywords: ['hoc', 'closure', 'middleware'] }
        ];

        const mappedQuestions = questionsBank.map((q, idx) => ({
            questionText: `${mode.charAt(0).toUpperCase() + mode.slice(1)} interview ${idx + 1}: ${q.prompt}`,
            keywords: q.keywords,
            order: idx
        }));

        const session = await Interview.create({
            userId,
            domain,
            difficulty,
            mode,
            totalQuestions: mappedQuestions.length,
            questions: mappedQuestions
        });

        res.status(201).json({
            id: session._id,
            domain: session.domain,
            difficulty: session.difficulty,
            mode: session.mode,
            total_questions: session.totalQuestions,
            questions: session.questions.map(q => ({ id: q._id, question_text: q.questionText, order: q.order })),
            created_at: session.createdAt
        });
    } catch (error) {
        console.error('Start Interview Error:', error);
        res.status(500).json({ detail: error.message });
    }
};

// @desc    Submit an answer
// @route   POST /api/interviews/:sessionId/answer
const submitAnswer = async (req, res) => {
    const { sessionId } = req.params;
    const { question_id, answer_text } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(sessionId)) {
            return res.status(404).json({ detail: 'Session not found (invalid ID format)' });
        }
        const session = await Interview.findById(sessionId);
        if (!session) return res.status(404).json({ detail: 'Session not found' });

        const question = session.questions.id(question_id);
        if (!question) return res.status(404).json({ detail: 'Question not found' });

        const { score, feedback } = evaluateAnswer(answer_text, question.keywords);
        
        question.answerText = answer_text;
        question.score = session.mode === 'text' ? score : Math.max(65, score);
        question.feedback = feedback;

        await session.save();

        res.json({
            question_id: question._id,
            question_text: question.questionText,
            answer_text: question.answerText,
            score: question.score,
            feedback: question.feedback
        });
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
};

// @desc    Get results
// @route   GET /api/interviews/:sessionId/results
const getResults = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.sessionId)) {
            return res.status(404).json({ detail: 'Session not found (invalid ID format)' });
        }
        const session = await Interview.findById(req.params.sessionId);
        if (!session) return res.status(404).json({ detail: 'Session not found' });

        const answeredQuestions = session.questions.filter(q => q.answerText);
        const totalScore = answeredQuestions.reduce((acc, q) => acc + q.score, 0);
        const overall = totalScore / Math.max(1, answeredQuestions.length);

        if (!session.completed) {
            session.completed = true;
            session.overallScore = overall;
            session.completedAt = new Date();
            await session.save();
        }

        res.json({
            session_id: session._id,
            domain: session.domain,
            difficulty: session.difficulty,
            mode: session.mode,
            overall_score: overall,
            total_questions: session.totalQuestions,
            answers: session.questions.map(q => ({
                question_id: q._id,
                question_text: q.questionText,
                answer_text: q.answerText || '',
                score: q.score,
                feedback: q.feedback || 'No answer submitted.'
            })),
            strengths: getStrengths(overall),
            weak_areas: ["Concrete examples", "Technical depth"],
            suggestions: ["Use STAR method", "Slow down delivery"],
            completed_at: session.completedAt
        });
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
};

module.exports = { startInterview, submitAnswer, getResults };
