require('dotenv').config();
const mongoose = require('mongoose');
const { Skill, Interest, CareerPath, DomainInsight } = require('./models/CareerMapper');
const Job = require('./models/Job');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hireonix';

const skills = [
    { name: 'React.js', sortOrder: 1 },
    { name: 'Node.js', sortOrder: 2 },
    { name: 'Python', sortOrder: 3 },
    { name: 'Django', sortOrder: 4 },
    { name: 'TypeScript', sortOrder: 5 },
    { name: 'AWS', sortOrder: 6 },
    { name: 'Docker', sortOrder: 7 },
    { name: 'SQL', sortOrder: 8 },
    { name: 'MongoDB', sortOrder: 9 },
    { name: 'Machine Learning', sortOrder: 10 },
    { name: 'UI/UX Design', sortOrder: 11 },
    { name: 'Figma', sortOrder: 12 },
    { name: 'PostgreSQL', sortOrder: 13 },
    { name: 'Redis', sortOrder: 14 },
    { name: 'Kubernetes', sortOrder: 15 },
    { name: 'GraphQL', sortOrder: 16 },
    { name: 'Go', sortOrder: 17 },
    { name: 'Java', sortOrder: 18 },
    { name: 'Spring Boot', sortOrder: 19 },
    { name: 'Flutter', sortOrder: 20 }
];

const interests = [
    { key: 'Frontend Development', sortOrder: 1 },
    { key: 'Backend Systems', sortOrder: 2 },
    { key: 'Problem Solving', sortOrder: 3 },
    { key: 'User Experience', sortOrder: 4 },
    { key: 'Data Analytics', sortOrder: 5 },
    { key: 'Cloud Architecture', sortOrder: 6 },
    { key: 'AI & Innovation', sortOrder: 7 },
    { key: 'Mobile Apps', sortOrder: 8 },
    { key: 'Cyber Security', sortOrder: 9 },
    { key: 'Game Development', sortOrder: 10 }
];

const careerPaths = [
    {
        slug: 'frontend-engineer',
        title: 'Frontend Engineer',
        summary: 'Specialize in building beautiful, responsive, and performance-driven user interfaces.',
        skillMatches: ['React.js', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
        interestMatches: ['User Experience', 'Frontend Development'],
        bestFor: ['Beginner', 'Intermediate'],
        roadmap: [
            { id: 'html-css', label: 'HTML & CSS Fundamentals', type: 'node' },
            { id: 'js-basics', label: 'JavaScript ES6+', type: 'node' },
            { id: 'react-core', label: 'React.js Core Concepts', type: 'node' },
            { id: 'state-mgmt', label: 'State Management (Redux/Context)', type: 'node' },
            { id: 'nextjs', label: 'Next.js & Server Side Rendering', type: 'node' }
        ]
    },
    {
        slug: 'backend-developer',
        title: 'Backend Developer',
        summary: 'Focus on server-side logic, database management, and building robust APIs.',
        skillMatches: ['Node.js', 'Python', 'SQL', 'MongoDB', 'Django'],
        interestMatches: ['Backend Systems', 'Problem Solving'],
        bestFor: ['Intermediate', 'Advanced'],
        roadmap: [
            { id: 'server-basics', label: 'Server Fundamentals', type: 'node' },
            { id: 'api-design', label: 'REST & GraphQL API Design', type: 'node' },
            { id: 'db-mastery', label: 'Database Modeling & Optimization', type: 'node' },
            { id: 'system-design', label: 'Scalable System Design', type: 'node' }
        ]
    },
    {
        slug: 'full-stack-developer',
        title: 'Full Stack Developer',
        summary: 'Master both client and server side development to build complete products.',
        skillMatches: ['React.js', 'Node.js', 'TypeScript', 'SQL', 'Docker'],
        interestMatches: ['Frontend Development', 'Backend Systems'],
        bestFor: ['Intermediate'],
        roadmap: [
            { id: 'frontend-base', label: 'Frontend Mastery', type: 'node' },
            { id: 'backend-base', label: 'Backend Mastery', type: 'node' },
            { id: 'deployment', label: 'CI/CD & Deployment', type: 'node' }
        ]
    },
    {
        slug: 'ai-engineer',
        title: 'AI/ML Engineer',
        summary: 'Develop and deploy machine learning models and AI-driven applications.',
        skillMatches: ['Python', 'Machine Learning', 'SQL', 'Docker'],
        interestMatches: ['AI & Innovation', 'Data Analytics'],
        bestFor: ['Advanced'],
        roadmap: [
            { id: 'python-advanced', label: 'Advanced Python', type: 'node' },
            { id: 'math-ml', label: 'Math for ML', type: 'node' },
            { id: 'deep-learning', label: 'Deep Learning Frameworks', type: 'node' }
        ]
    }
];

const domainInsights = [
    {
        slug: 'ai',
        name: 'Artificial Intelligence',
        color: '#8B5CF6',
        description: 'Building systems that can perform tasks that normally require human intelligence.',
        analysis: 'High growth potential with rapid innovation in LLMs and computer vision.',
        salaryText: '₹12L - ₹45L LPA',
        salaryMin: 12,
        salaryMax: 45,
        growth: 'Very High',
        growthScore: 95,
        demand: 'Extremely High',
        demandScore: 98,
        skills: ['Python', 'PyTorch', 'Mathematics', 'Deep Learning'],
        recommendation: 'Excellent choice if you enjoy complex problem solving and mathematics.',
        whyRecommended: ['Future-proof career', 'High pay', 'Cutting edge tech'],
        chooseIfPrimary: ['Love math', 'Want to build autonomous systems'],
        finalSuggestion: 'Start with Python and basic Statistics before diving into Neural Networks.'
    },
    {
        slug: 'web',
        name: 'Web Development',
        color: '#3B82F6',
        description: 'Creating websites and applications for the internet or private networks.',
        analysis: 'Massive job market with steady demand across all industries.',
        salaryText: '₹6L - ₹28L LPA',
        salaryMin: 6,
        salaryMax: 28,
        growth: 'Stable',
        growthScore: 85,
        demand: 'High',
        demandScore: 90,
        skills: ['JavaScript', 'React', 'Node.js', 'HTML/CSS'],
        recommendation: 'Safe and versatile choice for anyone wanting to enter tech quickly.',
        whyRecommended: ['Tons of jobs', 'Remote work friendly', 'Easy to showcase portfolio'],
        chooseIfPrimary: ['Like visual feedback', 'Want to build user-facing products'],
        finalSuggestion: 'Master JavaScript fundamentals before moving to frameworks like React.'
    },
    {
        slug: 'mobile',
        name: 'Mobile Development',
        color: '#10B981',
        description: 'Developing applications specifically for mobile devices like smartphones and tablets.',
        analysis: 'Mobile-first world ensures endless opportunities in consumer and enterprise apps.',
        salaryText: '₹8L - ₹32L LPA',
        salaryMin: 8,
        salaryMax: 32,
        growth: 'High',
        growthScore: 88,
        demand: 'High',
        demandScore: 85,
        skills: ['Flutter', 'React Native', 'Swift', 'Kotlin'],
        recommendation: 'Great choice if you prioritize mobile accessibility and on-the-go user interaction.',
        whyRecommended: ['High user engagement', 'Rapid development cycles', 'Creative freedom'],
        chooseIfPrimary: ['Mobile user enthusiast', 'Performance focus'],
        finalSuggestion: 'Learn cross-platform frameworks like Flutter or React Native first.'
    }
];

const sampleJobs = [
    {
        title: 'Senior Frontend Developer',
        company: 'Varchas Tech',
        location: 'Bangalore, India (Remote)',
        salary: '₹18L - ₹25L',
        workType: 'Full Time',
        experience: '3-5 Years',
        category: 'Web Development',
        skills: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS'],
        description: 'We are looking for a Senior Frontend Developer to lead our UI efforts...',
        responsibilities: ['Architect UI components', 'Optimize performance', 'Mentor junior devs'],
        requirements: ['Strong React skills', 'Experience with Next.js', 'Good communication'],
        niceToHave: ['Experience with Three.js', 'Unit testing knowledge'],
        badge: 'Priority Hire',
        status: 'open'
    },
    {
        title: 'Full Stack Engineer (Node/React)',
        company: 'Hireonix Solutions',
        location: 'Ahmedabad, India',
        salary: '₹12L - ₹18L',
        workType: 'Remote',
        experience: '1-3 Years',
        category: 'Web Development',
        skills: ['React.js', 'Node.js', 'MongoDB', 'Express'],
        description: 'Join our team to build the next generation of recruitment tools...',
        responsibilities: ['Build end-to-end features', 'Maintain core services'],
        requirements: ['Full stack proficiency', 'Database optimization skills'],
        niceToHave: ['Cloud deployment experience'],
        status: 'open'
    },
    {
        title: 'AI Research Scientist',
        company: 'Neural Labs',
        location: 'Hyderabad, India',
        salary: '₹25L - ₹40L',
        workType: 'Full Time',
        experience: '5+ Years',
        category: 'AI / ML',
        skills: ['Python', 'PyTorch', 'TensorFlow', 'NLP'],
        description: 'Research and develop cutting-edge LLMs for enterprise applications...',
        responsibilities: ['Fine-tune models', 'Publish research', 'Optimize inference'],
        requirements: ['PhD or Masters in CS/AI', 'Strong ML fundamentals', 'Python mastery'],
        badge: 'Hiring Fast',
        status: 'open'
    },
    {
        title: 'Junior Web Developer',
        company: 'StartUp Hub',
        location: 'Remote',
        salary: '₹4L - ₹8L',
        workType: 'Internship',
        experience: 'Fresher',
        category: 'Web Development',
        skills: ['HTML', 'CSS', 'JavaScript'],
        description: 'Learn and grow while building modern web interfaces...',
        responsibilities: ['Implement basic UI', 'Fix CSS bugs', 'Learn from seniors'],
        requirements: ['Hunger to learn', 'Solid JS basics'],
        status: 'open'
    },
    {
        title: 'Cloud Architect',
        company: 'Global Systems',
        location: 'Pune, India',
        salary: '₹30L - ₹50L',
        workType: 'Full Time',
        experience: '5+ Years',
        category: 'Cloud Architecture',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
        description: 'Design and manage large scale cloud infrastructure...',
        responsibilities: ['Optimize cloud spend', 'Manage K8s clusters', 'Implement CI/CD'],
        requirements: ['AWS Professional Certification', 'Strong DevOps background'],
        status: 'open'
    },
    {
        title: 'UI/UX Designer',
        company: 'Creative Studio',
        location: 'Mumbai, India',
        salary: '₹10L - ₹18L',
        workType: 'Contract',
        experience: '1-3 Years',
        category: 'UI/UX Design',
        skills: ['Figma', 'Adobe XD', 'Prototyping'],
        description: 'Create intuitive and stunning designs for our clients...',
        responsibilities: ['User research', 'Wireframing', 'Visual design'],
        requirements: ['Strong portfolio', 'Pixel perfect eye'],
        status: 'open'
    },
    {
        title: 'Cyber Security Analyst',
        company: 'SecureNet',
        location: 'Bangalore, India',
        salary: '₹15L - ₹22L',
        workType: 'Full Time',
        experience: '3-5 Years',
        category: 'Cyber Security',
        skills: ['Pentesting', 'Network Security', 'Linux', 'Python'],
        description: 'Identify and mitigate security risks for our infrastructure...',
        responsibilities: ['Vulnerability assessments', 'Incident response', 'Security audits'],
        requirements: ['CEH or OSCP certification', 'Strong analytical skills'],
        status: 'open'
    },
    {
        title: 'Backend Engineer (Go/Redis)',
        company: 'Fast API Inc',
        location: 'Remote',
        salary: '₹20L - ₹35L',
        workType: 'Full Time',
        experience: '3+ Years',
        category: 'Backend Systems',
        skills: ['Go', 'Redis', 'PostgreSQL', 'GRPC'],
        description: 'High performance backend development for a fintech startup...',
        responsibilities: ['Build low latency services', 'Optimize DB queries'],
        requirements: ['Go expertise', 'Distributed systems knowledge'],
        status: 'open'
    }
];

const seed = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Skill.deleteMany({});
        await Interest.deleteMany({});
        await CareerPath.deleteMany({});
        await DomainInsight.deleteMany({});
        await Job.deleteMany({});

        // Insert new data
        await Skill.insertMany(skills);
        await Interest.insertMany(interests);
        await CareerPath.insertMany(careerPaths);
        await DomainInsight.insertMany(domainInsights);
        await Job.insertMany(sampleJobs);

        console.log('✅ Seeding completed successfully with expanded dummy data!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seed();
