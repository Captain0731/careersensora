"use client";

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import './signup.scss';

export default function SignUp() {
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [acceptTerms, setAcceptTerms] = useState(true);
	const [message, setMessage] = useState('');

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (password !== confirmPassword) {
			setMessage('Passwords do not match.');
			return;
		}

		setMessage(`Welcome ${fullName || 'back'}! Your account is ready${acceptTerms ? '' : ' once you accept the terms'}.`);
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

						<button className="primaryBtn" type="submit">
							Create account
						</button>
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
