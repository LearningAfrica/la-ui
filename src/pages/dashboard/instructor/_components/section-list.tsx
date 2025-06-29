import { useMemo } from 'react';
import { Section } from './section';

interface SectionListProps {
	sections: any[];
	onMoveSection: (dragIndex: number, hoverIndex: number) => void;
	onMoveLesson: (
		sectionId: string,
		dragIndex: number,
		hoverIndex: number,
		targetSectionId?: string,
	) => void;
	onDeleteSection: (sectionId: string) => void;
	onDeleteLesson: (sectionId: string, lessonId: string) => void;
	onUpdateSection: (sectionId: string, data: { title: string }) => void;
	onUpdateLesson: (
		sectionId: string,
		lessonId: string,
		data: {
			title: string;
			type: string;
			duration: string;
			isPublished: boolean;
		},
	) => void;
	onAddLesson: (sectionId: string) => void;
}

export function SectionList({
	sections,
	onMoveSection,
	onMoveLesson,
	onDeleteSection,
	onDeleteLesson,
	onUpdateSection,
	onUpdateLesson,
	onAddLesson,
}: SectionListProps) {
	// Memoize the sections to prevent unnecessary re-renders
	const memoizedSections = useMemo(() => {
		return sections.map((section, index) => (
			<Section
				key={section.id}
				section={section}
				index={index}
				onMoveSection={onMoveSection}
				onMoveLesson={onMoveLesson}
				onDeleteSection={onDeleteSection}
				onDeleteLesson={onDeleteLesson}
				onUpdateSection={onUpdateSection}
				onUpdateLesson={onUpdateLesson}
				onAddLesson={onAddLesson}
				allSections={sections}
			/>
		));
	}, [
		sections,
		onMoveSection,
		onMoveLesson,
		onDeleteSection,
		onDeleteLesson,
		onUpdateSection,
		onUpdateLesson,
		onAddLesson,
	]);

	return <div className="space-y-4">{memoizedSections}</div>;
}
