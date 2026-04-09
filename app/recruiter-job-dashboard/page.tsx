"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import JobDashbord from '../components/Job Dashbord/jobdashbord';

export default function RecruiterJobDashboardPage() {
	const router = useRouter();
	const [isAuthorized, setIsAuthorized] = useState(false);

	useEffect(() => {
		const adminAuth = window.localStorage.getItem('hireonix-admin-auth');
		if (adminAuth !== 'true') {
			router.replace('/get-access');
			return;
		}

		setIsAuthorized(true);
	}, [router]);

	if (!isAuthorized) {
		return (
			<section style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #f5f8fb 0%, #edf6f0 100%)' }}>
				<div style={{ background: '#fff', padding: '24px 28px', borderRadius: 14, border: '1px solid rgba(52, 197, 109, 0.18)', boxShadow: '0 14px 40px rgba(15, 23, 42, 0.12)' }}>
					Loading dashboard...
				</div>
			</section>
		);
	}

	return <JobDashbord />;
}
