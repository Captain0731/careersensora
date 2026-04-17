import Link from 'next/link';
import { Roadmap } from '../../utils/roadmapData';

export default function RoadmapCard({ roadmap }: { roadmap: Roadmap }) {
	return (
		<Link href={`/resources/career-roadmaps/${roadmap.slug}`} className="roadmapCard">
			<div className="cardIcon">{roadmap.icon}</div>
			<div className="cardContent">
				<h3>{roadmap.title}</h3>
				<p>{roadmap.description}</p>
			</div>
			<div className="cardFooter">
                Explore Roadmap <span>→</span>
			</div>
		</Link>
	);
}
