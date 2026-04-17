"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { apiClient } from '../../utils/apiClient';
import { TOKEN_KEY } from '../../utils/session';
import { USER_PROFILE_KEY } from '../../utils/session';
import './navbar.scss';

type UserProfile = {
	username: string;
	phone: string;
	fullName?: string;
	isRecruiter?: boolean;
};

const topLinks = [
	{ label: 'Home', href: '/' },
	{ label: 'About', href: '/about' },
	{ label: 'Contact', href: '/contact' },
];

const servicesGroups = [
	{
		title: 'JobSphere',
		items: [
			{ label: 'Job Apply', href: '/job-apply' },
			{ label: 'AI Interview Practice', href: '/services/ai-interview' },
			{ label: 'Resume Analysis', href: '/services/resume-analysis' },
		],
	},
	{
		title: 'Career Studio',
		items: [
			{ label: 'Career Mapper', href: '/services/career-mapper' },
			{ label: 'Parallel Insights', href: '/services/parallel-domain-comparison' },
			{ label: 'FAQ Chatting', href: '/services/faq-chatting' },
		],
	},
    
];

const resourceLinks = [
	{ label: 'Career Roadmaps', href: '/resources/career-roadmaps' },
	{ label: 'Skill-based Learning Paths', href: '/resources/career-roadmaps#skills' },
	{ label: 'Interactive Roadmap Visualization', href: '/resources/career-roadmaps' },
	{ label: 'Topic-wise Learning Structure', href: '/resources/career-roadmaps' },
];

export default function Navbar() {
	const pathname = usePathname();
	const router = useRouter();
	const isRecruiterDashboard = pathname?.startsWith('/recruiter-job-dashboard');
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [servicesOpen, setServicesOpen] = useState(false);
	const [resourcesOpen, setResourcesOpen] = useState(false);

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		const token = window.localStorage.getItem(TOKEN_KEY);
		if (!token) {
			setUserProfile(null);
			return;
		}

		const cached = window.localStorage.getItem(USER_PROFILE_KEY);
		if (cached) {
			try {
				setUserProfile(JSON.parse(cached) as UserProfile);
			} catch {
				/* ignore malformed cache */
			}
		}

		let cancelled = false;
		(async () => {
			try {
				const profile = await apiClient.get<{
					username: string;
					email: string;
					phone: string;
					first_name: string;
					last_name: string;
					is_recruiter: boolean;
				}>('/auth/me');
				if (cancelled) {
					return;
				}
				const nextProfile: UserProfile = {
					username: profile.username,
					phone: profile.phone,
					fullName: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.username,
					isRecruiter: profile.is_recruiter,
				};
				setUserProfile(nextProfile);
				window.localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(nextProfile));
			} catch {
				if (!cancelled && !cached) {
					setUserProfile(null);
				}
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [pathname]);

	useEffect(() => {
		setIsMobileMenuOpen(false);
		setServicesOpen(false);
		setResourcesOpen(false);
	}, [pathname]);

	const handleDropdownToggle = (
		key: 'services' | 'resources',
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		if (typeof window === 'undefined' || !window.matchMedia('(max-width: 980px)').matches) {
			return;
		}

		event.preventDefault();
		if (key === 'services') {
			setServicesOpen((current) => !current);
			setResourcesOpen(false);
			return;
		}

		setResourcesOpen((current) => !current);
		setServicesOpen(false);
	};

	const handleLogout = () => {
		window.localStorage.removeItem(TOKEN_KEY);
		window.localStorage.removeItem('hireonix-admin-auth');
		window.localStorage.removeItem(USER_PROFILE_KEY);
		setUserProfile(null);
		router.push('/get-access');
	};

	if (isRecruiterDashboard) {
		return (
			<header className="navbarWrap">
				<nav className="navbar" aria-label="Primary">
					<Link className="brand" href="/" aria-label="Hireonix home">
						<img src="/logos.png" alt="Hireonix" className="brandLogo" />
					</Link>

					<div className="navActions">
						<button className="primaryBtn" type="button" onClick={handleLogout}>
							Logout
						</button>
					</div>
				</nav>
			</header>
		);
	}

	return (
		<header className="navbarWrap">
			<nav className="navbar" aria-label="Primary">
				<Link className="brand" href="/" aria-label="Hireonix home">
					<img src="/logos.png" alt="Hireonix" className="brandLogo" />
				</Link>

				<button
					className="mobileMenuBtn"
					type="button"
					onClick={() => setIsMobileMenuOpen((current) => !current)}
					aria-label="Toggle navigation menu"
					aria-expanded={isMobileMenuOpen}
				>
					<span />
					<span />
					<span />
				</button>

				<div className={`navLinks${isMobileMenuOpen ? ' isOpen' : ''}`}>
					<Link href={topLinks[0].href} onClick={() => setIsMobileMenuOpen(false)}>{topLinks[0].label}</Link>
					<Link href={topLinks[1].href} onClick={() => setIsMobileMenuOpen(false)}>{topLinks[1].label}</Link>

					<div className={`navItem dropdown${servicesOpen ? ' mobileOpen' : ''}`}>
						<button
							className="navTrigger"
							type="button"
							aria-haspopup="true"
							aria-expanded={servicesOpen}
							onClick={(event) => handleDropdownToggle('services', event)}
						>
							Services
							<span aria-hidden="true">▾</span>
						</button>

						<div className="dropdownMenu megaMenu" role="menu" aria-label="Services menu">
							{servicesGroups.map((group) => (
								<div key={group.title} className="dropdownGroup">
									<p className="dropdownGroupTitle">{group.title}</p>
									<div className="dropdownList">
										{group.items.map((item) => (
												<Link key={item.label} href={item.href} className="dropdownLink" role="menuitem">
													{item.label}
												</Link>
										))}
									</div>
								</div>
							))}
						</div>
					</div>

					<div className={`navItem dropdown${resourcesOpen ? ' mobileOpen' : ''}`}>
						<button
							className="navTrigger"
							type="button"
							aria-haspopup="true"
							aria-expanded={resourcesOpen}
							onClick={(event) => handleDropdownToggle('resources', event)}
						>
							Resources
							<span aria-hidden="true">▾</span>
						</button>

						<div className="dropdownMenu resourceMenu" role="menu" aria-label="Resources menu">
							<div className="dropdownList">
								{resourceLinks.map((item) => (
										<Link key={item.label} href={item.href} className="dropdownLink" role="menuitem">
											{item.label}
										</Link>
								))}
							</div>
						</div>
					</div>
					<Link href={topLinks[2].href} onClick={() => setIsMobileMenuOpen(false)}>{topLinks[2].label}</Link>
				</div>

				<div className={`navActions${isMobileMenuOpen ? ' isOpen' : ''}`}>
					{userProfile ? (
						<div className="userBadge" aria-label="Authenticated user">
							<span className="userName">{userProfile.fullName || userProfile.username}</span>
							<span className="userPhone">{userProfile.phone || 'No phone saved'}</span>
							<button className="ghostBtn" type="button" onClick={handleLogout}>
								Logout
							</button>
						</div>
					) : (
						<Link className="primaryBtn" href="/get-access">
							Get Early Access
						</Link>
					)}
				</div>
			</nav>
		</header>
	);
}
