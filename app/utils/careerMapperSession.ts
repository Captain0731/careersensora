export const CAREER_MAPPER_SESSION_KEY = 'career_mapper_payload';
export const CAREER_MATCHES_KEY = 'career_mapper_matches';

export type CareerMapperPayload = {
	skills: string[];
	interests: string[];
	experienceLevel: string;
};

/** Snapshot of one match card from the matching page (for detail + Groq). */
export type StoredCareerMatch = {
	id: string;
	title: string;
	level: string;
	score: number;
	fitReason: string;
	roadmapHint: string;
	languageChoice: string;
	matchScore: number;
	successProbability: number;
	successTrack: string;
	salaryInsights: string;
	jobAvailability: string;
	nextBestSkillsToLearn: string[];
	skillBasedImprovementRate: string;
	missingSkills: string[];
};

export function saveCareerMapperPayload(payload: CareerMapperPayload): void {
	if (typeof window === 'undefined') return;
	window.sessionStorage.setItem(CAREER_MAPPER_SESSION_KEY, JSON.stringify(payload));
}

export function readCareerMapperPayload(): CareerMapperPayload | null {
	if (typeof window === 'undefined') return null;
	const raw = window.sessionStorage.getItem(CAREER_MAPPER_SESSION_KEY);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as CareerMapperPayload;
	} catch {
		return null;
	}
}

export function saveCareerMatches(matches: StoredCareerMatch[]): void {
	if (typeof window === 'undefined') return;
	window.sessionStorage.setItem(CAREER_MATCHES_KEY, JSON.stringify(matches));
}

export function readCareerMatches(): StoredCareerMatch[] | null {
	if (typeof window === 'undefined') return null;
	const raw = window.sessionStorage.getItem(CAREER_MATCHES_KEY);
	if (!raw) return null;
	try {
		const data = JSON.parse(raw) as StoredCareerMatch[];
		return Array.isArray(data) ? data : null;
	} catch {
		return null;
	}
}
