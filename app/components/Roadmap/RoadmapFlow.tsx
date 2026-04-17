'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Roadmap, RoadmapNode, Topic } from '../../utils/roadmapData';

interface RoadmapFlowProps {
	roadmap: Roadmap;
	onTopicClick: (topic: Topic) => void;
}

export default function RoadmapFlow({ roadmap, onTopicClick }: RoadmapFlowProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [lines, setLines] = useState<string[]>([]);

	const calculateLines = useCallback(() => {
		if (!containerRef.current) return;

		const nextLines: string[] = [];
		const containerRect = containerRef.current.getBoundingClientRect();

		const processNode = (node: RoadmapNode) => {
			const parentEl = containerRef.current?.querySelector(`[data-node-id="${node.id}"]`);
			if (!parentEl) return;

			const parentRect = parentEl.getBoundingClientRect();
			const parentX = parentRect.left + parentRect.width / 2 - containerRect.left;
			const parentY = parentRect.top + parentRect.height - containerRect.top;

			node.children?.forEach((child) => {
				const childEl = containerRef.current?.querySelector(`[data-node-id="${child.id}"]`);
				if (!childEl) return;

				const childRect = childEl.getBoundingClientRect();
				const childX = childRect.left + childRect.width / 2 - containerRect.left;
				const childY = childRect.top - containerRect.top;

				// Create a smooth curve (Cubic Bezier)
				const cp1y = parentY + (childY - parentY) / 2;
				const cp2y = childY - (childY - parentY) / 2;
				const path = `M ${parentX} ${parentY} C ${parentX} ${cp1y}, ${childX} ${cp2y}, ${childX} ${childY}`;
				nextLines.push(path);

				processNode(child);
			});
		};

		processNode(roadmap.rootNode);
		setLines(nextLines);
	}, [roadmap]);

	useEffect(() => {
		const handle = requestAnimationFrame(calculateLines);
		window.addEventListener('resize', calculateLines);
		return () => {
			cancelAnimationFrame(handle);
			window.removeEventListener('resize', calculateLines);
		};
	}, [calculateLines]);

	const renderNode = (node: RoadmapNode) => {
		const topic = roadmap.topics[node.topicId];
		if (!topic) return null;

		return (
			<div key={node.id} className="nodeWrapper">
				<button
					type="button"
					className={`roadmapNode ${topic.type}`}
					data-node-id={node.id}
					onClick={() => onTopicClick(topic)}
				>
					<h4>{topic.title}</h4>
				</button>
				{node.children && (
					<div className="nodeChildren">
						{node.children.map((child) => renderNode(child))}
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="roadmapFlowWrap" ref={containerRef}>
			<svg className="svgConnectors">
				{lines.map((path, i) => (
					<path key={i} d={path} />
				))}
			</svg>
			<div className="roadmapFlowContainer">
				{renderNode(roadmap.rootNode)}
			</div>
		</div>
	);
}
