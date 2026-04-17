"""Interview question bank (same domains/difficulties as the AI Interview UI)."""

QUESTION_BANK: dict = {
	"Full Stack Development": {
		"easy": [
			{"prompt": "Explain the difference between client-side and server-side rendering.", "keywords": ["client", "server", "rendering"]},
			{"prompt": "How do you structure a responsive React component?", "keywords": ["react", "responsive", "component"]},
			{"prompt": "What is REST and why is it useful in full stack apps?", "keywords": ["rest", "api", "full stack"]},
		],
		"medium": [
			{"prompt": "How would you manage authentication across frontend and backend?", "keywords": ["authentication", "token", "session"]},
			{"prompt": "How do you optimize API calls in a large React application?", "keywords": ["api", "optimization", "react"]},
			{"prompt": "Describe how you would design a scalable project architecture.", "keywords": ["architecture", "scalable", "modules"]},
		],
		"hard": [
			{"prompt": "How would you handle performance bottlenecks in a distributed full stack system?", "keywords": ["performance", "distributed", "scaling"]},
			{"prompt": "Explain strategies for zero-downtime deployments.", "keywords": ["deployment", "downtime", "strategy"]},
			{"prompt": "How would you secure API gateways and sensitive user data?", "keywords": ["secure", "api", "data"]},
		],
	},
	"Data Science": {
		"easy": [
			{"prompt": "What is the difference between structured and unstructured data?", "keywords": ["structured", "unstructured", "data"]},
			{"prompt": "How would you explain a dashboard to a non-technical stakeholder?", "keywords": ["dashboard", "stakeholder", "insight"]},
			{"prompt": "What does data cleaning mean in a project workflow?", "keywords": ["cleaning", "missing", "quality"]},
		],
		"medium": [
			{"prompt": "How do you evaluate whether a model or analysis is reliable?", "keywords": ["reliable", "validation", "metrics"]},
			{"prompt": "When would you choose Power BI over a custom analytics solution?", "keywords": ["power bi", "dashboard", "report"]},
			{"prompt": "How do you handle outliers in a business dataset?", "keywords": ["outliers", "analysis", "business"]},
		],
		"hard": [
			{"prompt": "How would you diagnose bias in data used for business decisions?", "keywords": ["bias", "data", "decision"]},
			{"prompt": "Explain a robust approach to experimentation and A/B testing.", "keywords": ["experiment", "a/b", "testing"]},
			{"prompt": "How would you design a data pipeline for a high-volume platform?", "keywords": ["pipeline", "volume", "scalable"]},
		],
	},
	"Machine Learning": {
		"easy": [
			{"prompt": "What is the difference between supervised and unsupervised learning?", "keywords": ["supervised", "unsupervised", "learning"]},
			{"prompt": "How do you explain training and testing data?", "keywords": ["training", "testing", "data"]},
			{"prompt": "What is overfitting in simple terms?", "keywords": ["overfitting", "generalization", "model"]},
		],
		"medium": [
			{"prompt": "How do you choose the right evaluation metric for a model?", "keywords": ["metric", "precision", "recall"]},
			{"prompt": "How do you reduce overfitting in practice?", "keywords": ["regularization", "dropout", "validation"]},
			{"prompt": "Describe how you would tune hyperparameters.", "keywords": ["hyperparameters", "tuning", "grid"]},
		],
		"hard": [
			{"prompt": "How would you explain model drift and monitoring?", "keywords": ["drift", "monitoring", "production"]},
			{"prompt": "What would you do if your model performs well offline but poorly in production?", "keywords": ["production", "offline", "generalization"]},
			{"prompt": "How do you decide when to use deep learning versus classical methods?", "keywords": ["deep learning", "classical", "tradeoff"]},
		],
	},
	"Artificial Intelligence": {
		"easy": [
			{"prompt": "What is AI in everyday product terms?", "keywords": ["ai", "automation", "assistant"]},
			{"prompt": "How do AI features improve user experience?", "keywords": ["user experience", "automation", "personalization"]},
			{"prompt": "What is the role of prompts in AI systems?", "keywords": ["prompt", "instruction", "output"]},
		],
		"medium": [
			{"prompt": "How would you evaluate the quality of AI responses?", "keywords": ["quality", "accuracy", "feedback"]},
			{"prompt": "How do you balance AI usefulness with reliability?", "keywords": ["reliability", "risk", "accuracy"]},
			{"prompt": "What are common risks when deploying AI in products?", "keywords": ["bias", "privacy", "risk"]},
		],
		"hard": [
			{"prompt": "How would you design an AI system with human-in-the-loop review?", "keywords": ["human-in-the-loop", "review", "safety"]},
			{"prompt": "How do you measure hallucination risk in generative AI?", "keywords": ["hallucination", "risk", "evaluation"]},
			{"prompt": "How would you create guardrails for an enterprise AI feature?", "keywords": ["guardrails", "enterprise", "control"]},
		],
	},
	"Web Development": {
		"easy": [
			{"prompt": "What makes a web page responsive?", "keywords": ["responsive", "layout", "media query"]},
			{"prompt": "How do HTML, CSS, and JavaScript work together?", "keywords": ["html", "css", "javascript"]},
			{"prompt": "Why is semantic HTML important?", "keywords": ["semantic", "accessibility", "html"]},
		],
		"medium": [
			{"prompt": "How do you improve web performance on the frontend?", "keywords": ["performance", "bundle", "optimization"]},
			{"prompt": "What is the difference between controlled and uncontrolled inputs?", "keywords": ["controlled", "inputs", "react"]},
			{"prompt": "How do you handle browser compatibility issues?", "keywords": ["compatibility", "browser", "testing"]},
		],
		"hard": [
			{"prompt": "How would you architect a large-scale frontend app?", "keywords": ["architecture", "frontend", "scalable"]},
			{"prompt": "How do you reduce layout shift and improve UX stability?", "keywords": ["layout shift", "stability", "performance"]},
			{"prompt": "How would you secure a modern web application?", "keywords": ["security", "xss", "csrf"]},
		],
	},
	"Mobile Development": {
		"easy": [
			{"prompt": "What makes a mobile app feel native?", "keywords": ["native", "mobile", "ux"]},
			{"prompt": "How do mobile app layouts adapt to different screens?", "keywords": ["screens", "responsive", "layout"]},
			{"prompt": "Why is offline support useful in mobile apps?", "keywords": ["offline", "sync", "user experience"]},
		],
		"medium": [
			{"prompt": "How do you manage state in a mobile app?", "keywords": ["state", "navigation", "storage"]},
			{"prompt": "How would you optimize battery and performance?", "keywords": ["battery", "performance", "optimization"]},
			{"prompt": "How do you handle API errors gracefully on mobile?", "keywords": ["error", "api", "retry"]},
		],
		"hard": [
			{"prompt": "How would you ensure secure data storage on mobile?", "keywords": ["secure", "storage", "encryption"]},
			{"prompt": "How do you design a scalable mobile release process?", "keywords": ["release", "scalable", "testing"]},
			{"prompt": "How would you debug a hard-to-reproduce crash in production?", "keywords": ["debug", "crash", "production"]},
		],
	},
	"UI/UX Design": {
		"easy": [
			{"prompt": "What is the difference between UI and UX?", "keywords": ["ui", "ux", "experience"]},
			{"prompt": "Why are design systems helpful?", "keywords": ["design system", "consistency", "components"]},
			{"prompt": "How do you use whitespace in a design?", "keywords": ["whitespace", "layout", "clarity"]},
		],
		"medium": [
			{"prompt": "How would you improve usability on a complex dashboard?", "keywords": ["usability", "dashboard", "navigation"]},
			{"prompt": "How do you validate your design decisions?", "keywords": ["validate", "testing", "feedback"]},
			{"prompt": "How do you create a consistent visual hierarchy?", "keywords": ["hierarchy", "typography", "spacing"]},
		],
		"hard": [
			{"prompt": "How do you balance business goals with user needs?", "keywords": ["business", "user", "tradeoff"]},
			{"prompt": "How would you improve a product with low engagement?", "keywords": ["engagement", "research", "iteration"]},
			{"prompt": "How do you design for accessibility at scale?", "keywords": ["accessibility", "inclusive", "contrast"]},
		],
	},
}


def get_questions(domain: str, difficulty: str) -> list[dict]:
	return QUESTION_BANK.get(domain, {}).get(difficulty, QUESTION_BANK["Web Development"]["easy"])
