import CareerMatchingDetail from '../../../pages/Craeer Machi Detail/careearmatchingdetail';

export const dynamic = 'force-dynamic';

type CareerMatchingDetailPageProps = {
	searchParams?: {
		career?: string;
	};
};

export default function CareerMatchingDetailPage({ searchParams }: CareerMatchingDetailPageProps) {
	return <CareerMatchingDetail selectedCareerId={searchParams?.career} />;
}
