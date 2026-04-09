"use client";

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './login.scss';

const ADMIN_EMAIL = 'admin@careerai.com';
const ADMIN_PASSWORD = 'Admin@123';

export default function Login() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const existingSession = window.localStorage.getItem('hireonix-admin-auth');
		if (existingSession === 'true') {
			router.replace('/recruiter-job-dashboard');
		}
	}, [router]);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError('');
		setIsLoading(true);

		window.setTimeout(() => {
			const isValid = email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;

			if (!isValid) {
				setError('Invalid credentials. Please try again.');
				setIsLoading(false);
				return;
			}

			window.localStorage.setItem('hireonix-admin-auth', 'true');
			router.replace('/recruiter-job-dashboard');
		}, 450);
	};

	return (
		<section className="loginPage">
			<div className="loginGlow loginGlowOne" />
			<div className="loginGlow loginGlowTwo" />

			<div className="loginShell">
				<div className="loginCopy">
					<p className="eyebrow">Hireonix Admin Access</p>
					<h1>Admin Login</h1>
					<p className="headline">
						Enter your credentials to access the recruiter dashboard.
					</p>

					<div className="featureGrid">
						<div className="featureCard">
							<strong>Authorized only</strong>
							<span>Recruiter dashboard access is restricted</span>
						</div>
						<div className="featureCard">
							<strong>Fast login</strong>
							<span>Quick access with verified admin credentials</span>
						</div>
						<div className="featureCard">
							<strong>Recruiter tools</strong>
							<span>Manage jobs and candidates securely</span>
						</div>
					</div>
				</div>

				<div className="loginCard">
					<div className="cardHeader">
						<h2>Admin Login</h2>
						<p>Enter admin ID and password to continue.</p>
					</div>

					<form className="loginForm" onSubmit={handleSubmit}>
						<label>
							Admin ID / Email
							<input
								type="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								placeholder="admin@careerai.com"
								required
							/>
						</label>

						<label>
							Password
							<input
								type="password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								placeholder="Admin@123"
								required
							/>
						</label>

						<button className="primaryBtn" type="submit" disabled={isLoading}>
							{isLoading ? 'Logging in...' : 'Login'}
						</button>
					</form>

					{error && <p className="errorMessage">{error}</p>}

					<div className="divider">
						<span>or continue with</span>
					</div>

					<div className="socialGrid">
						<button type="button" className="socialBtn">
							Google
						</button>
						<button type="button" className="socialBtn">
							LinkedIn
						</button>
					</div>

					<p className="footerText">
						Need a recruiter account? <Link href="/sign-up">Sign up</Link>
					</p>
				</div>
			</div>
		</section>
	);
}
