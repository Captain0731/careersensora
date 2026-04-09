"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import './navbar.scss';

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
	{ label: 'How It Works', href: '/resources/how-it-works' },
	{ label: 'Career Roadmaps', href: '/resources/career-roadmaps' },
	{ label: 'Success Stories', href: '/resources/success-stories' },
	{ label: 'Career Insights', href: '/resources/career-insights' },
];

export default function Navbar() {
	const pathname = usePathname();
	const router = useRouter();
	const isRecruiterDashboard = pathname?.startsWith('/recruiter-job-dashboard');

	const handleLogout = () => {
		window.localStorage.removeItem('hireonix-admin-auth');
		router.push('/get-access');
	};

	if (isRecruiterDashboard) {
		return (
			<header className="navbarWrap">
				<nav className="navbar" aria-label="Primary">
					<Link className="brand" href="/" aria-label="Hireonix home">
						<span className="brandMark">H</span>
						<span className="brandText">
							Hireonix
							<small>Culture intelligence</small>
						</span>
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
				<span className="brandMark">H</span>
				<span className="brandText">
					Hireonix
					<small>Culture intelligence</small>
				</span>
			</Link>

				<div className="navLinks">
					<Link href={topLinks[0].href}>{topLinks[0].label}</Link>
					<Link href={topLinks[1].href}>{topLinks[1].label}</Link>

					<div className="navItem dropdown">
						<button className="navTrigger" type="button" aria-haspopup="true">
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

					<div className="navItem dropdown">
						<button className="navTrigger" type="button" aria-haspopup="true">
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
					<Link href={topLinks[2].href}>{topLinks[2].label}</Link>
				</div>

				<div className="navActions">
					<Link className="primaryBtn" href="/get-access">
						Get Early Access
					</Link>
				</div>
			</nav>
		</header>
	);
}
