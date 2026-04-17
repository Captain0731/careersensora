import { Suspense } from 'react';
import Jobfrom from '../pages/Job Form/jobfrom';

export default function JobApplicationPage() {
	return (
		<Suspense fallback={null}>
			<Jobfrom />
		</Suspense>
	);
}
