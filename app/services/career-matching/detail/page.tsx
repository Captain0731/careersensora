import CareerMatchingDetail from '../../../pages/Craeer Machi Detail/careearmatchingdetail';

type CareerMatchingDetailPageProps = {
	searchParams?: {
		career?: string;
	};
};

export default function CareerMatchingDetailPage({ searchParams }: CareerMatchingDetailPageProps) {
	return <CareerMatchingDetail selectedCareerId={searchParams?.career} />;
}
