'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '../../../components/Navbar/navbar';
import RoadmapFlow from '../../../components/Roadmap/RoadmapFlow';
import TopicDetails from '../../../components/Roadmap/TopicDetails';
import { roadmaps, Topic } from '../../../utils/roadmapData';
import '../../../components/Roadmap/roadmap.scss';

export default function RoadmapDetailPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = use(params);
	const roadmap = roadmaps.find((r) => r.slug === slug);

	const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	if (!roadmap) {
		notFound();
	}

	const handleTopicClick = (topic: Topic) => {
		setSelectedTopic(topic);
		setIsDrawerOpen(true);
	};

	return (
		<>
			<Navbar />
			<main className="roadmapDetailPage">
				<header className="detailHeader">
					<Link href="/resources/career-roadmaps" className="backLink">
						<span>←</span> Back to All Roadmaps
					</Link>
					<h1>{roadmap.title}</h1>
					<p>{roadmap.description}</p>
				</header>

				<RoadmapFlow roadmap={roadmap} onTopicClick={handleTopicClick} />

				<TopicDetails
					topic={selectedTopic}
					isOpen={isDrawerOpen}
					onClose={() => setIsDrawerOpen(false)}
				/>
			</main>
		</>
	);
}
