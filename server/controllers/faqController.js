const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// @desc    FAQ Chat generation
// @route   POST /api/v1/faq-chat
const faqChat = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ detail: 'Message is required' });
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are the Hireonix FAQ Assistant. Answer questions about careers, resumes, and hiring in a helpful, concise way (max 3 sentences)." },
                { role: "user", content: message }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.5
        });

        res.json({ reply: chatCompletion.choices[0].message.content });
    } catch (error) {
        console.error('FAQ Chat Error:', error);
        if (error.status === 401) {
            return res.status(500).json({ detail: 'Groq API Key (GROQ_API_KEY) is missing or invalid in server/.env' });
        }
        res.status(502).json({ detail: 'AI generation failed', detail_extra: error.message });
    }
};

module.exports = { faqChat };
