"use client";

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient, ApiError, TOKEN_KEY } from '../../utils/apiClient';
import { USER_PROFILE_KEY } from '../../utils/session';
import './login.scss';

export default function Login() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const mode = searchParams.get('mode') === 'recruiter' ? 'recruiter' : 'main';
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const existingSession = window.localStorage.getItem(TOKEN_KEY);
		if (existingSession) {
			void (async () => {
				try {
					const profile = await apiClient.get<{ is_recruiter: boolean }>('/auth/me');
					router.replace(profile.is_recruiter ? '/recruiter-job-dashboard' : '/');
				} catch {
					router.replace('/');
				}
			})();
		}
	}, [router]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			const endpoint = mode === 'recruiter' ? '/auth/recruiter-login' : '/auth/login';
			const res = await apiClient.post<{ token: string; username: string }>(endpoint, {
				username: email.trim(),
				password,
			});
			window.localStorage.setItem(TOKEN_KEY, res.token);
			const profile = await apiClient.get<{
				username: string;
				email: string;
				phone: string;
				first_name: string;
				last_name: string;
				is_recruiter: boolean;
			}>('/auth/me');

			window.localStorage.setItem(
				USER_PROFILE_KEY,
				JSON.stringify({
					username: profile.username,
					phone: profile.phone,
					fullName: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.username,
					isRecruiter: profile.is_recruiter,
				})
			);

			// Always redirect recruiters to the dashboard, regardless of login mode
			router.replace(profile.is_recruiter ? '/recruiter-job-dashboard' : '/');
		} catch (err) {
			if (err instanceof ApiError) {
				setError(err.message || 'Invalid credentials. Please try again.');
			} else {
				setError('An unexpected error occurred.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className="loginPage">
			<div className="loginGlow loginGlowOne" />
			<div className="loginGlow loginGlowTwo" />

			<div className="loginShell">
				<div className="loginCopy">
						<p className="eyebrow">Hireonix Access</p>
						<h1>{mode === 'recruiter' ? 'Recruiter Login' : 'Login'}</h1>
					<p className="headline">
						{mode === 'recruiter'
							? 'Enter recruiter credentials to access the job dashboard.'
								: 'Enter your credentials to access your account and saved profile.'}
					</p>

					<div className="featureGrid">
						<div className="featureCard">
							<strong>{mode === 'recruiter' ? 'Authorized only' : 'Profile access'}</strong>
							<span>{mode === 'recruiter' ? 'Recruiter dashboard access is restricted' : 'Your name and phone appear in the navbar'}</span>
						</div>
						<div className="featureCard">
							<strong>{mode === 'recruiter' ? 'Fast login' : 'Quick login'}</strong>
							<span>{mode === 'recruiter' ? 'Quick access with verified recruiter credentials' : 'Sign in to keep your account ready'}</span>
						</div>
						<div className="featureCard">
							<strong>{mode === 'recruiter' ? 'Recruiter tools' : 'Main web tools'}</strong>
							<span>{mode === 'recruiter' ? 'Manage jobs and candidates securely' : 'Use AI tools and job services across the site'}</span>
						</div>
					</div>
				</div>

				<div className="loginCard">
					<div className="cardHeader">
						<h2>{mode === 'recruiter' ? 'Recruiter Login' : 'Login'}</h2>
						<p>{mode === 'recruiter' ? 'Enter recruiter ID and password to continue.' : 'Enter your username or email and password.'}</p>
					</div>

					<form className="loginForm" onSubmit={handleSubmit}>
						<label>
							{mode === 'recruiter' ? 'Admin ID / Email' : 'Username / Email'}
							<input
								type="text"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								placeholder={mode === 'recruiter' ? 'admin@careerai.com' : 'you@example.com'}
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
							{isLoading ? 'Logging in...' : mode === 'recruiter' ? 'Login to dashboard' : 'Login'}
						</button>

						{mode !== 'recruiter' ? (
							<Link className="secondaryBtn" href="/sign-up">
								Sign up
							</Link>
						) : null}
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
						{mode === 'recruiter' ? (
							<>
								Need main access? <Link href="/get-access">User login</Link>
							</>
						) : (
							<>
								Need a recruiter account? <Link href="/get-access?mode=recruiter">Recruiter login</Link>
							</>
						)}
					</p>
				</div>
			</div>
		</section>
	);
}
