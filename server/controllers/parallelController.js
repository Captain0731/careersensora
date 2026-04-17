const { DomainInsight } = require('../models/CareerMapper');
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const _rowToComparison = (row) => ({
    name: row.name,
    description: row.description,
    analysis: row.analysis,
    salary: row.salaryText,
    salaryRange: [row.salaryMin, row.salaryMax],
    growth: row.growth,
    growthScore: row.growthScore,
    demand: row.demand,
    demandScore: row.demandScore,
    skills: row.skills,
    recommendation: row.recommendation,
    whyRecommended: row.whyRecommended,
    chooseIfPrimary: row.chooseIfPrimary,
    chooseIfOther: row.chooseIfOther,
    finalSuggestion: row.finalSuggestion
});

const _scoreDomain = (row) => {
    const avgSalary = (row.salaryMin + row.salaryMax) / 2;
    const salaryScore = Math.min(100.0, (avgSalary / 30.0) * 100.0);
    const skillsScore = Math.min(100.0, row.skills.length * 10);
    return (row.growthScore * 0.4) + (row.demandScore * 0.35) + (salaryScore * 0.2) + (skillsScore * 0.05);
};

// @desc    Get parallel insights configuration
// @route   GET /api/v1/parallel-insights/config
const getParallelConfig = async (req, res) => {
    try {
        const rows = await DomainInsight.find().sort({ sortOrder: 1, _id: 1 });
        const domains = rows.map(r => ({ id: r.slug, name: r.name, color: r.color }));
        const comparison = {};
        rows.forEach(r => {
            comparison[r.slug] = _rowToComparison(r);
        });
        res.json({ domains, comparison });
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
};

// @desc    Compare two domains
// @route   POST /api/v1/parallel-insights/compare
const compareDomains = async (req, res) => {
    const { domain1, domain2 } = req.body;
    const d1 = (domain1 || "").trim().toLowerCase();
    const d2 = (domain2 || "").trim().toLowerCase();

    if (!d1 || !d2) {
        return res.status(400).json({ detail: "Both domain1 and domain2 are required." });
    }
    if (d1 === d2) {
        return res.status(400).json({ detail: "Please select different domains to compare." });
    }

    try {
        const row1 = await DomainInsight.findOne({ slug: d1 });
        const row2 = await DomainInsight.findOne({ slug: d2 });

        if (!row1 || !row2) {
            return res.status(404).json({ detail: "One or both selected domains were not found." });
        }

        const score1 = _scoreDomain(row1);
        const score2 = _scoreDomain(row2);
        const best = score1 >= score2 ? row1 : row2;

        let aiSummary = null;
        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a concise career advisor." },
                    {
                        role: "user",
                        content: `Compare these two domains and provide a 2-3 sentence recommendation.\nDomain 1: ${row1.name}; growth=${row1.growth}; demand=${row1.demand}; salary=${row1.salaryText}\nDomain 2: ${row2.name}; growth=${row2.growth}; demand=${row2.demand}; salary=${row2.salaryText}\nCurrent best pick: ${best.name}`
                    }
                ],
                model: "llama-3.1-8b-instant",
                temperature: 0.3
            });
            aiSummary = chatCompletion.choices[0].message.content;
        } catch (err) {
            console.error('Groq Error in Comparison:', err);
        }

        res.json({
            domain1: row1.slug,
            domain2: row2.slug,
            bestDomain: best.slug,
            whyRecommended: best.whyRecommended,
            chooseIfDomain1: row1.chooseIfPrimary,
            chooseIfDomain2: row2.chooseIfPrimary,
            finalSuggestion: best.finalSuggestion,
            aiSummary
        });

    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
};

module.exports = { getParallelConfig, compareDomains };
