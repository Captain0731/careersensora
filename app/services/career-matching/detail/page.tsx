import { Suspense } from 'react';
import CareerMatchingDetail from '../../../pages/Craeer Machi Detail/careearmatchingdetail';

export const dynamic = 'force-dynamic';

type CareerMatchingDetailPageProps = {
	searchParams?: Promise<{ career?: string }> | { career?: string };
};

export default async function CareerMatchingDetailPage({ searchParams }: CareerMatchingDetailPageProps) {
	const params = searchParams ? await Promise.resolve(searchParams) : {};
	return (
		<Suspense
			fallback={
				<main className="careerDetailPage" style={{ padding: 24 }}>
					<p>Loading career detail…</p>
				</main>
			}
		>
			<CareerMatchingDetail selectedCareerId={params.career} />
		</Suspense>
	);
}
