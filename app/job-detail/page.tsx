import { Suspense } from 'react';
import Jobdetail from '../pages/Job Detail/jobdetail';

export default function JobDetailPage() {
	return (
		<Suspense fallback={null}>
			<Jobdetail />
		</Suspense>
	);
}
