import { Topic } from '../../utils/roadmapData';

interface TopicDetailsProps {
	topic: Topic | null;
	isOpen: boolean;
	onClose: () => void;
}

export default function TopicDetails({ topic, isOpen, onClose }: TopicDetailsProps) {
	if (!topic) return null;

	return (
		<aside className={`topicDrawer ${isOpen ? 'isOpen' : ''}`}>
			<header className="drawerHeader">
				<h2>{topic.title}</h2>
				<button type="button" className="closeBtn" onClick={onClose} aria-label="Close details">
					&times;
				</button>
			</header>

			<div className={`topicType ${topic.type}`}>
				{topic.type}
			</div>

			<p className="topicDescription">{topic.description}</p>

			<section className="resourcesSection">
				<h3>Learning Resources</h3>
				<div className="resourceList">
					{topic.resources.length > 0 ? (
						topic.resources.map((res, i) => (
							<a
								key={i}
								href={res.url}
								target="_blank"
								rel="noopener noreferrer"
								className="resourceLink"
							>
								<span className="linkIcon">🔗</span>
								{res.title}
							</a>
						))
					) : (
						<p>Resources for this topic are coming soon!</p>
					)}
				</div>
			</section>
		</aside>
	);
}
