import Navbar from '../../components/Navbar/navbar';
import RoadmapCard from '../../components/Roadmap/RoadmapCard';
import { roadmaps } from '../../utils/roadmapData';
import '../../components/Roadmap/roadmap.scss';

export default function RoadmapListingPage() {
	const roleRoadmaps = roadmaps.filter((r) => r.category === 'role');
	const skillRoadmaps = roadmaps.filter((r) => r.category === 'skill');

	return (
		<>
			<Navbar />
			<main className="roadmapListing">
				<header className="listingHeader">
					<p className="mapperKicker">Step-by-Step Guides</p>
					<h1>Career Roadmaps</h1>
					<p>Explore our structured learning paths to master your dream role or skill.</p>
				</header>

				<section className="listingGroup">
					<h2 className="mapperKicker">Role-based Roadmaps</h2>
					<div className="roadmapGrid">
						{roleRoadmaps.map((r) => (
							<RoadmapCard key={r.slug} roadmap={r} />
						))}
					</div>
				</section>

				<section id="skills" className="listingGroup" style={{ marginTop: '80px' }}>
					<h2 className="mapperKicker">Skill-based Roadmaps</h2>
					<div className="roadmapGrid">
						{skillRoadmaps.map((r) => (
							<RoadmapCard key={r.slug} roadmap={r} />
						))}
					</div>
				</section>
			</main>
		</>
	);
}
