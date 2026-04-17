"use client";

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError, TOKEN_KEY } from '../../utils/apiClient';
import { USER_PROFILE_KEY } from '../../utils/session';
import './signup.scss';

export default function SignUp() {
	const router = useRouter();
	const [fullName, setFullName] = useState('');
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [acceptTerms, setAcceptTerms] = useState(true);
	const [message, setMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (password !== confirmPassword) {
			setMessage('Passwords do not match.');
			return;
		}
		
		if (!acceptTerms) {
			setMessage('You must accept the terms to continue.');
			return;
		}

		setIsLoading(true);
		setMessage('');

		try {
			const nameParts = fullName.trim().split(' ');
			const firstName = nameParts[0] || '';
			const lastName = nameParts.slice(1).join(' ') || '';
			const emailValue = email.trim().toLowerCase();
			const localPart = emailValue.includes('@') ? (emailValue.split('@')[0] || '') : emailValue;
			const username = localPart.replace(/[^a-z0-9._-]/gi, '').trim() || `user${Date.now()}`;
			const res = await apiClient.post<{ token: string; username: string }>('/auth/signup', {
				username,
				email: emailValue,
				phone: phone.trim(),
				password,
				first_name: firstName,
				last_name: lastName,
			});
			window.localStorage.setItem(TOKEN_KEY, res.token);
			window.localStorage.setItem(
				USER_PROFILE_KEY,
				JSON.stringify({ username: res.username, phone: phone.trim(), fullName: fullName.trim(), isRecruiter: false })
			);
			setMessage(`Welcome ${res.username}! Redirecting...`);
			setTimeout(() => {
				router.replace('/');
			}, 1000);
		} catch (error) {
			if (error instanceof ApiError) {
				setMessage(error.message);
			} else {
				setMessage('An error occurred during signup.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className="signupPage">
			<div className="signupGlow signupGlowOne" />
			<div className="signupGlow signupGlowTwo" />

			<div className="signupShell">
				<div className="signupCopy">
					<p className="eyebrow">Hireonix Access</p>
					<h1>Create your account</h1>
					<p className="headline">
						Join Hireonix to manage hiring, explore career tools, and keep everything in one place.
					</p>

					<div className="featureGrid">
						<div className="featureCard">
							<strong>Build your dashboard</strong>
							<span>Set up your workspace in minutes</span>
						</div>
						<div className="featureCard">
							<strong>Track applications</strong>
							<span>Stay updated on every hiring step</span>
						</div>
						<div className="featureCard">
							<strong>Discover insights</strong>
							<span>Use AI tools to guide your growth</span>
						</div>
					</div>
				</div>

				<div className="signupCard">
					<div className="cardHeader">
						<h2>Sign up</h2>
						<p>Create your account in a few quick steps.</p>
					</div>

					<form className="signupForm" onSubmit={handleSubmit}>
						<label>
							Full name
							<input
								type="text"
								value={fullName}
								onChange={(event) => setFullName(event.target.value)}
								placeholder="Your name"
								required
							/>
						</label>

						<label>
							Phone number
							<input
								type="tel"
								value={phone}
								onChange={(event) => setPhone(event.target.value)}
								placeholder="+91 98765 43210"
								required
							/>
						</label>

						<label>
							Email address
							<input
								type="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								placeholder="you@company.com"
								required
							/>
						</label>

						<label>
							Password
							<input
								type="password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								placeholder="Create a password"
								required
							/>
						</label>

						<label>
							Confirm password
							<input
								type="password"
								value={confirmPassword}
								onChange={(event) => setConfirmPassword(event.target.value)}
								placeholder="Repeat your password"
								required
							/>
						</label>

						<label className="checkboxRow">
							<input
								type="checkbox"
								checked={acceptTerms}
								onChange={(event) => setAcceptTerms(event.target.checked)}
							/>
							I agree to the terms and privacy policy
						</label>

						<button className="primaryBtn" type="submit" disabled={isLoading}>
							{isLoading ? 'Creating account...' : 'Create account'}
						</button>

						<Link className="secondaryBtn" href="/get-access">
							Login
						</Link>
					</form>

					{message && <p className="statusMessage">{message}</p>}

					<p className="footerText">
						Already have an account?{' '}
						<Link href="/get-access">Log in</Link>
					</p>
				</div>
			</div>
		</section>
	);
}
