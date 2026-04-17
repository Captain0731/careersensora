const mongoose = require('mongoose');
const Job = require('../models/Job');
const Application = require('../models/Application');

// Constants from original Django implementation
const META_CATEGORIES = ["All", "Web Development", "Data Science", "AI / ML", "Mobile Development", "UI/UX Design", "Cyber Security"];
const META_LOCATIONS = ["All Locations", "Remote", "Ahmedabad", "Bangalore"];
const META_EXPERIENCE = ["All Levels", "Fresher", "1-3 Years", "3-5 Years", "3+ Years"];
const META_WORK_TYPES = ["All Work Types", "Remote", "Part Time", "Full Time", "Night Job", "Contract", "Internship"];
const REQUIRED_KEYWORDS = ["React.js", "Next.js", "REST APIs", "GraphQL", "TypeScript"];
const RESUME_PAGE_KEYWORDS = ["react", "nextjs", "typescript", "node", "python", "sql", "docker", "aws", "api", "testing"];

// Helper to determine if query means "All"
const isAll = (val) => !val || val.toLowerCase().trim() === 'all' || val.toLowerCase().trim() === 'all levels' || val.toLowerCase().trim() === 'all locations' || val.toLowerCase().trim() === 'all work types';

// @desc    Get metadata options
// @route   GET /api/jobs/meta
const getJobsMeta = (req, res) => {
    res.json({
        categories: META_CATEGORIES,
        locationOptions: META_LOCATIONS,
        experienceOptions: META_EXPERIENCE,
        workTypeOptions: META_WORK_TYPES
    });
};

// @desc    List jobs with filters
// @route   GET /api/jobs
const listJobs = async (req, res) => {
    const { category, location, experience, work_type } = req.query;
    
    let query = { status: 'open' };

    if (!isAll(category)) query.category = category.trim();
    if (!isAll(experience)) query.experience = experience.trim();
    if (!isAll(work_type)) query.workType = work_type.trim();
    if (!isAll(location)) query.location = { $regex: location.trim(), $options: 'i' };

    try {
        const jobs = await Job.find(query).sort({ createdAt: -1 });
        res.json({
            jobs: jobs.map(j => ({
                id: j._id,
                title: j.title,
                company: j.company,
                location: j.location,
                salary: j.salary,
                workType: j.workType,
                experience: j.experience,
                category: j.category,
                skills: j.skills,
                description: j.description,
                responsibilities: j.responsibilities,
                requirements: j.requirements,
                niceToHave: j.niceToHave,
                badge: j.badge
            })),
            count: jobs.length
        });
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
};

// @desc    Get job detail
// @route   GET /api/jobs/:id
const getJobDetail = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ detail: 'Job not found (invalid ID format)' });
        }
        
        const job = await Job.findOne({ _id: id, status: 'open' });
        if (!job) return res.status(404).json({ detail: 'Job not found or closed' });
        res.json({
            id: job._id,
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            workType: job.workType,
            experience: job.experience,
            category: job.category,
            skills: job.skills,
            description: job.description,
            responsibilities: job.responsibilities,
            requirements: job.requirements,
            niceToHave: job.niceToHave,
            badge: job.badge
        });
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
};

// @desc    Apply to a job
// @route   POST /api/jobs/apply
const applyToJob = async (req, res) => {
    const { job_id, full_name, email, phone, message } = req.body;

    if (!full_name || !email) {
        return res.status(400).json({ detail: 'Full name and email are required' });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(job_id)) {
            return res.status(404).json({ detail: 'Job not found (invalid ID format)' });
        }
        const job = await Job.findOne({ _id: job_id, status: 'open' });
        if (!job) return res.status(404).json({ detail: 'Job not found' });

        const application = await Application.create({
            jobId: job_id,
            fullName: full_name,
            email: email.toLowerCase(),
            phone,
            message
        });

        res.status(201).json({ ok: true, application_id: application._id });
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
};

// @desc    Analyze resume (Seeded logic from Django)
// @route   POST /api/jobs/applications/:id/resume-analysis
const analyzeResume = async (req, res) => {
    const { id: application_id } = req.params;
    const { candidate_skills } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(application_id)) {
            return res.status(404).json({ detail: 'Application not found (invalid ID format)' });
        }
        const app = await Application.findById(application_id);
        if (!app) return res.status(404).json({ detail: 'Application not found' });

        let skills = [];
        if (candidate_skills) {
            try {
                skills = typeof candidate_skills === 'string' ? JSON.parse(candidate_skills) : candidate_skills;
            } catch (e) {
                console.error('JSON Parse Error for skills:', candidate_skills);
                skills = [];
            }
        }
        const normalized = skills.map(s => s.toLowerCase().trim());
        const matched = REQUIRED_KEYWORDS.filter(kw => normalized.includes(kw.toLowerCase()));

        const keywordScore = Math.round((matched.length / REQUIRED_KEYWORDS.length) * 100);
        const skillsDepthScore = Math.min(100, Math.round((normalized.length / 8) * 100));
        const resumeQualityScore = 90;
        const overallScore = Math.round((keywordScore * 0.6) + (skillsDepthScore * 0.25) + (resumeQualityScore * 0.15));
        const eligible = overallScore >= 70;

        app.resumeAnalysis = {
            uploadedResumeName: 'resume.pdf',
            matchedKeywords: matched,
            keywordScore,
            skillsDepthScore,
            resumeQualityScore,
            overallScore,
            eligible
        };

        await app.save();

        res.json({
            ok: true,
            analysis_id: app._id,
            matched,
            keywordScore,
            skillsDepthScore,
            resumeQualityScore,
            overallScore,
            eligible
        });

    } catch (error) {
        console.error('Analyze Resume Error:', error);
        res.status(500).json({ detail: error.message });
    }
};

// @desc    General resume analysis (Standalone page)
// @route   POST /api/jobs/resume-analysis
const analyzeResumeGeneral = async (req, res) => {
    try {
        // Mock analysis logic for standalone page
        const score = 85;
        const atsScore = 78;
        const strengths = ["Clear layout", "Relevant skills", "Good summary"];
        const weaknesses = ["Missing quantifiable impacts", "Skills section could be more granular"];
        const suggestions = ["Add more metrics to your achievements", "Includes a dedicated certifications section"];
        const extractedSkills = ["React", "JavaScript", "Node.js", "MongoDB", "Express"];
        const missingKeywords = ["TypeScript", "Docker", "AWS", "CI/CD"];

        res.json({
            ok: true,
            analysis_id: "general-" + Date.now(),
            score,
            atsScore,
            strengths,
            weaknesses,
            suggestions,
            extractedSkills,
            missingKeywords
        });
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
};

const listJobsManage = async (req, res) => {
    try {
        const jobs = await Job.aggregate([
            {
                $lookup: {
                    from: 'applications',
                    localField: '_id',
                    foreignField: 'jobId',
                    as: 'apps'
                }
            },
            {
                $project: {
                    id: "$_id",
                    title: 1,
                    company: 1,
                    location: 1,
                    salary: 1,
                    workType: 1,
                    experience: 1,
                    category: 1,
                    skills: 1,
                    description: 1,
                    listingStatus: "$status",
                    applications: { $size: "$apps" }
                }
            }
        ]);
        res.json({ jobs, count: jobs.length });
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
};

module.exports = { getJobsMeta, listJobs, getJobDetail, applyToJob, analyzeResume, analyzeResumeGeneral, listJobsManage };
