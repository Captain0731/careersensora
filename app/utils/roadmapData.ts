export interface Resource {
	title: string;
	url: string;
}

export interface Topic {
	id: string;
	title: string;
	description: string;
	resources: Resource[];
	type: 'essential' | 'recommended' | 'optional';
}

export interface RoadmapNode {
	id: string;
	topicId: string;
	children?: RoadmapNode[];
}

export interface Roadmap {
	slug: string;
	title: string;
	description: string;
	icon: string;
	category: 'role' | 'skill';
	rootNode: RoadmapNode;
	topics: Record<string, Topic>;
}

export const roadmaps: Roadmap[] = [
	{
		slug: 'frontend-developer',
		title: 'Frontend Developer',
		description: 'Step by step guide to becoming a modern frontend developer in 2026',
		icon: '🌐',
		category: 'role',
		rootNode: {
			id: 'fe-node-1',
			topicId: 'internet',
			children: [
				{
					id: 'fe-node-2',
					topicId: 'html',
					children: [
						{
							id: 'fe-node-3',
							topicId: 'css',
							children: [
								{
									id: 'fe-node-4',
									topicId: 'javascript',
									children: [
										{
											id: 'fe-node-5',
											topicId: 'version-control',
										},
                                        {
                                            id: 'fe-node-6',
                                            topicId: 'react',
                                        }
									],
								},
							],
						},
					],
				},
			],
		},
		topics: {
			internet: {
				id: 'internet',
				title: 'The Internet',
				description: 'How the internet works, HTTP, browsers, DNS, and hosting.',
				type: 'essential',
				resources: [
					{ title: 'MDN: How the web works', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works' },
					{ title: 'Intro to Internet', url: 'https://www.google.com' },
				],
			},
			html: {
				id: 'html',
				title: 'HTML',
				description: 'Learn the basics of HTML, semantic elements, and forms.',
				type: 'essential',
				resources: [
					{ title: 'HTML5 Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
				],
			},
			css: {
				id: 'css',
				title: 'CSS',
				description: 'Learn layouts (Flexbox, Grid), box model, and responsiveness.',
				type: 'essential',
				resources: [
					{ title: 'CSS Layouts', url: 'https://web.dev/learn/css/' },
				],
			},
			javascript: {
				id: 'javascript',
				title: 'JavaScript',
				description: 'DOM manipulation, ES6+, Fetch API, and asynchronous programming.',
				type: 'essential',
				resources: [
					{ title: 'JavaScript.info', url: 'https://javascript.info/' },
				],
			},
			'version-control': {
				id: 'version-control',
				title: 'Version Control (Git)',
				description: 'Managing source code, branching, merging, and collaboration.',
				type: 'essential',
				resources: [
					{ title: 'Git Handbook', url: 'https://guides.github.com/introduction/git-handbook/' },
				],
			},
			react: {
				id: 'react',
				title: 'React',
				description: 'Components, hooks, state management, and ecosystem.',
				type: 'recommended',
				resources: [
					{ title: 'React Documentation', url: 'https://react.dev' },
				],
			},
		},
	},
	{
		slug: 'backend-developer',
		title: 'Backend Developer',
		description: 'Path to becoming a professional backend developer',
		icon: '⚙️',
		category: 'role',
		rootNode: {
			id: 'be-node-1',
			topicId: 'internet',
			children: [
				{
					id: 'be-node-2',
					topicId: 'os-knowledge',
					children: [
						{
							id: 'be-node-3',
							topicId: 'python',
							children: [
								{ id: 'be-node-4', topicId: 'databases' },
								{ id: 'be-node-5', topicId: 'apis' },
							],
						},
					],
				},
			],
		},
		topics: {
			internet: {
				id: 'internet',
				title: 'The Internet',
				description: 'How the internet works, DNS, and HTTP basics.',
				type: 'essential',
				resources: [],
			},
			'os-knowledge': {
				id: 'os-knowledge',
				title: 'OS Knowledge',
				description: 'Terminal usage, process management, memory and storage.',
				type: 'essential',
				resources: [],
			},
			python: {
				id: 'python',
				title: 'Python',
				description: 'Data structures, classes, and popular frameworks like Django/FastAPI.',
				type: 'essential',
				resources: [],
			},
			databases: {
				id: 'databases',
				title: 'Databases (Relational)',
				description: 'PostgreSQL, MySQL, and SQL basics.',
				type: 'essential',
				resources: [],
			},
			apis: {
				id: 'apis',
				title: 'APIs',
				description: 'REST, GraphQL, JSON, and WebSockets.',
				type: 'recommended',
				resources: [],
			},
		},
	},
    {
		slug: 'python',
		title: 'Python Mastery',
		description: 'Learn Python from scratch to advanced level',
		icon: '🐍',
		category: 'skill',
		rootNode: {
			id: 'py-node-1',
			topicId: 'py-basics',
			children: [
				{
					id: 'py-node-2',
					topicId: 'py-data-struct',
					children: [
						{
							id: 'py-node-3',
							topicId: 'py-advanced',
						},
					],
				},
			],
		},
		topics: {
			'py-basics': {
				id: 'py-basics',
				title: 'Python Basics',
				description: 'Syntax, variables, loops, and conditions.',
				type: 'essential',
				resources: [],
			},
			'py-data-struct': {
				id: 'py-data-struct',
				title: 'Data Structures',
				description: 'Lists, Dictionaries, Sets, and Tuples.',
				type: 'essential',
				resources: [],
			},
			'py-advanced': {
				id: 'py-advanced',
				title: 'Advanced Python',
				description: 'Decorators, Generators, AsyncIO, and Metaprogramming.',
				type: 'recommended',
				resources: [],
			},
		},
	},
    {
		slug: 'system-design',
		title: 'System Design',
		description: 'Master the art of designing scalable systems',
		icon: '🏗️',
		category: 'skill',
		rootNode: {
			id: 'sd-node-1',
			topicId: 'sd-basics',
			children: [
				{
					id: 'sd-node-2',
					topicId: 'sd-scaling',
					children: [
						{
							id: 'sd-node-3',
							topicId: 'sd-caching',
						},
                        {
                            id: 'sd-node-4',
                            topicId: 'sd-db-sharding',
                        }
					],
				},
			],
		},
		topics: {
			'sd-basics': {
				id: 'sd-basics',
				title: 'Design Basics',
				description: 'Load balancing, Proxies, and Monolith vs Microservices.',
				type: 'essential',
				resources: [],
			},
			'sd-scaling': {
				id: 'sd-scaling',
				title: 'Scaling Strategies',
				description: 'Horizontal vs Vertical scaling.',
				type: 'essential',
				resources: [],
			},
			'sd-caching': {
				id: 'sd-caching',
				title: 'Caching',
				description: 'Redis, Memcached, and CDNs.',
				type: 'recommended',
				resources: [],
			},
			'sd-db-sharding': {
				id: 'sd-db-sharding',
				title: 'Database Sharding',
				description: 'Partitioning and replication.',
				type: 'recommended',
				resources: [],
			},
		},
	},
	{
		slug: 'full-stack-developer',
		title: 'Full Stack Developer',
		description: 'The complete path to mastering both frontend and backend development',
		icon: '🎯',
		category: 'role',
		rootNode: {
			id: 'fs-node-1',
			topicId: 'internet',
			children: [
				{
					id: 'fs-node-2',
					topicId: 'frontend-basics',
					children: [{ id: 'fs-node-3', topicId: 'backend-basics' }],
				},
			],
		},
		topics: {
			internet: {
				id: 'internet',
				title: 'Internet & Web',
				description: 'Fundamentals of the web, DNS, HTTP/S, and browsers.',
				type: 'essential',
				resources: [],
			},
			'frontend-basics': {
				id: 'frontend-basics',
				title: 'Frontend Mastery',
				description: 'HTML, CSS, JS, and modern frameworks like React.',
				type: 'essential',
				resources: [],
			},
			'backend-basics': {
				id: 'backend-basics',
				title: 'Backend Mastery',
				description: 'Server-side logic, Databases, and APIs.',
				type: 'essential',
				resources: [],
			},
		},
	},
	{
		slug: 'devops',
		title: 'DevOps Engineer',
		description: 'Master CI/CD, Infrastructure as Code, and Cloud operations',
		icon: '♾️',
		category: 'role',
		rootNode: {
			id: 'do-node-1',
			topicId: 'os-linux',
			children: [
				{
					id: 'do-node-2',
					topicId: 'ci-cd',
					children: [{ id: 'do-node-3', topicId: 'containers' }],
				},
			],
		},
		topics: {
			'os-linux': {
				id: 'os-linux',
				title: 'Linux & Terminal',
				description: 'Shell scripting, file permissions, and process management.',
				type: 'essential',
				resources: [],
			},
			'ci-cd': {
				id: 'ci-cd',
				title: 'CI/CD Pipelines',
				description: 'Automating builds, tests, and deployments.',
				type: 'essential',
				resources: [],
			},
			'containers': {
				id: 'containers',
				title: 'Containers & Orchestration',
				description: 'Docker, Kubernetes, and containerizing applications.',
				type: 'essential',
				resources: [],
			},
		},
	},
];
