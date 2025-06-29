interface MarkdownRendererProps {
	content: string;
	className?: string;
}

export function MarkdownRenderer({
	content,
	className = '',
}: MarkdownRendererProps) {
	return (
		<div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
			{content.split('\n').map((paragraph, i) => {
				if (paragraph.startsWith('# ')) {
					return (
						<h1 key={i} className="mt-6 mb-4 text-2xl font-bold">
							{paragraph.substring(2)}
						</h1>
					);
				} else if (paragraph.startsWith('## ')) {
					return (
						<h2 key={i} className="mt-5 mb-3 text-xl font-bold">
							{paragraph.substring(3)}
						</h2>
					);
				} else if (paragraph.startsWith('### ')) {
					return (
						<h3 key={i} className="mt-4 mb-2 text-lg font-bold">
							{paragraph.substring(4)}
						</h3>
					);
				} else if (paragraph.startsWith('- ')) {
					return (
						<li key={i} className="ml-6">
							{paragraph.substring(2)}
						</li>
					);
				} else if (paragraph.trim() === '') {
					return <div key={i} className="h-4"></div>;
				} else {
					return (
						<p key={i} className="my-2">
							{paragraph}
						</p>
					);
				}
			})}
		</div>
	);
}
