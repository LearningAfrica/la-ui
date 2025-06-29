import type { Editor } from '@tiptap/react';
import {
	Bold,
	Italic,
	List,
	ListOrdered,
	AlignLeft,
	AlignCenter,
	AlignRight,
	Heading1,
	Heading2,
	Heading3,
	Link,
	Code,
	Table,
	Highlighter,
	Undo,
	Redo,
	Image,
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface ToolbarProps {
	editor: Editor;
}

export function Toolbar({ editor }: ToolbarProps) {
	const [linkUrl, setLinkUrl] = useState('');
	const [imageUrl, setImageUrl] = useState('');

	const addLink = () => {
		if (linkUrl) {
			editor
				.chain()
				.focus()
				.extendMarkRange('link')
				.setLink({ href: linkUrl })
				.run();
			setLinkUrl('');
		} else {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
		}
	};

	const addImage = () => {
		if (imageUrl) {
			editor.chain().focus().setImage({ src: imageUrl }).run();
			setImageUrl('');
		}
	};

	return (
		<TooltipProvider>
			<div className="bg-background flex flex-wrap items-center gap-1 border-b p-1">
				<div className="flex items-center">
					<Tooltip>
						<TooltipTrigger asChild>
							<Toggle
								size="sm"
								pressed={editor.isActive('bold')}
								onPressedChange={() =>
									editor.chain().focus().toggleBold().run()
								}
								aria-label="Toggle bold"
							>
								<Bold className="h-4 w-4" />
							</Toggle>
						</TooltipTrigger>
						<TooltipContent>Bold</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Toggle
								size="sm"
								pressed={editor.isActive('italic')}
								onPressedChange={() =>
									editor.chain().focus().toggleItalic().run()
								}
								aria-label="Toggle italic"
							>
								<Italic className="h-4 w-4" />
							</Toggle>
						</TooltipTrigger>
						<TooltipContent>Italic</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Toggle
								size="sm"
								pressed={editor.isActive('highlight')}
								onPressedChange={() =>
									editor.chain().focus().toggleHighlight().run()
								}
							>
								<Highlighter className="h-4 w-4" />
							</Toggle>
						</TooltipTrigger>
						<TooltipContent>Highlight</TooltipContent>
					</Tooltip>
				</div>

				<Separator orientation="vertical" className="h-6" />

				<div className="flex items-center">
					<Tooltip>
						<TooltipTrigger asChild>
							<Toggle
								size="sm"
								pressed={editor.isActive('heading', { level: 1 })}
								onPressedChange={() =>
									editor.chain().focus().toggleHeading({ level: 1 }).run()
								}
							>
								<Heading1 className="h-4 w-4" />
							</Toggle>
						</TooltipTrigger>
						<TooltipContent>Heading 1</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Toggle
								size="sm"
								pressed={editor.isActive('heading', { level: 2 })}
								onPressedChange={() =>
									editor.chain().focus().toggleHeading({ level: 2 }).run()
								}
								aria-label="Toggle h2"
							>
								<Heading2 className="h-4 w-4" />
							</Toggle>
						</TooltipTrigger>
						<TooltipContent>Heading 2</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Toggle
								size="sm"
								pressed={editor.isActive('heading', { level: 3 })}
								onPressedChange={() =>
									editor.chain().focus().toggleHeading({ level: 3 }).run()
								}
								aria-label="Toggle h3"
							>
								<Heading3 className="h-4 w-4" />
							</Toggle>
						</TooltipTrigger>
						<TooltipContent>Heading 3</TooltipContent>
					</Tooltip>
				</div>

				<Separator orientation="vertical" className="h-6" />

				<div className="flex items-center">
					<Tooltip>
						<TooltipTrigger asChild>
							<Toggle
								size="sm"
								pressed={editor.isActive('bulletList')}
								onPressedChange={() =>
									editor.chain().focus().toggleBulletList().run()
								}
								aria-label="Toggle bullet list"
							>
								<List className="h-4 w-4" />
							</Toggle>
						</TooltipTrigger>
						<TooltipContent>Bullet List</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Toggle
								size="sm"
								pressed={editor.isActive('orderedList')}
								onPressedChange={() =>
									editor.chain().focus().toggleOrderedList().run()
								}
								aria-label="Toggle ordered list"
							>
								<ListOrdered className="h-4 w-4" />
							</Toggle>
						</TooltipTrigger>
						<TooltipContent>Ordered List</TooltipContent>
					</Tooltip>
				</div>

				<Separator orientation="vertical" className="h-6" />

				<div className="flex items-center">
					<Tooltip>
						<TooltipTrigger asChild>
							<Toggle
								size="sm"
								pressed={editor.isActive({ textAlign: 'left' })}
								onPressedChange={() =>
									editor.chain().focus().setTextAlign('left').run()
								}
							>
								<AlignLeft className="h-4 w-4" />
							</Toggle>
						</TooltipTrigger>
						<TooltipContent>Align Left</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Toggle
								size="sm"
								pressed={editor.isActive({ textAlign: 'center' })}
								onPressedChange={() =>
									editor.chain().focus().setTextAlign('center').run()
								}
							>
								<AlignCenter className="h-4 w-4" />
							</Toggle>
						</TooltipTrigger>
						<TooltipContent>Align Center</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Toggle
								size="sm"
								pressed={editor.isActive({ textAlign: 'right' })}
								onPressedChange={() =>
									editor.chain().focus().setTextAlign('right').run()
								}
							>
								<AlignRight className="h-4 w-4" />
							</Toggle>
						</TooltipTrigger>
						<TooltipContent>Align Right</TooltipContent>
					</Tooltip>
				</div>

				<Separator orientation="vertical" className="h-6" />

				<div className="flex items-center">
					<Popover>
						<Tooltip>
							<TooltipTrigger asChild>
								<PopoverTrigger asChild>
									<Toggle
										size="sm"
										pressed={editor.isActive('link')}
										aria-label="Add link"
									>
										<Link className="h-4 w-4" />
									</Toggle>
								</PopoverTrigger>
							</TooltipTrigger>
							<TooltipContent>Add Link</TooltipContent>
						</Tooltip>
						<PopoverContent className="w-80 p-4">
							<div className="flex flex-col gap-2">
								<h3 className="font-medium">Insert Link</h3>
								<Input
									placeholder="https://example.com"
									value={linkUrl}
									onChange={(e) => setLinkUrl(e.target.value)}
								/>
								<div className="flex justify-between">
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											editor
												.chain()
												.focus()
												.extendMarkRange('link')
												.unsetLink()
												.run()
										}
										disabled={!editor.isActive('link')}
									>
										Remove Link
									</Button>
									<Button size="sm" onClick={addLink}>
										{editor.isActive('link') ? 'Update Link' : 'Add Link'}
									</Button>
								</div>
							</div>
						</PopoverContent>
					</Popover>

					<Popover>
						<Tooltip>
							<TooltipTrigger asChild>
								<PopoverTrigger asChild>
									<Toggle size="sm" aria-label="Add image">
										<Image className="h-4 w-4" />
									</Toggle>
								</PopoverTrigger>
							</TooltipTrigger>
							<TooltipContent>Add Image</TooltipContent>
						</Tooltip>
						<PopoverContent className="w-80 p-4">
							<div className="flex flex-col gap-2">
								<h3 className="font-medium">Insert Image</h3>
								<Input
									placeholder="https://example.com/image.jpg"
									value={imageUrl}
									onChange={(e) => setImageUrl(e.target.value)}
								/>
								<Button size="sm" onClick={addImage}>
									Add Image
								</Button>
							</div>
						</PopoverContent>
					</Popover>

					<Tooltip>
						<TooltipTrigger asChild>
							<Toggle
								size="sm"
								pressed={editor.isActive('codeBlock')}
								onPressedChange={() =>
									editor.chain().focus().toggleCodeBlock().run()
								}
								aria-label="Toggle code block"
							>
								<Code className="h-4 w-4" />
							</Toggle>
						</TooltipTrigger>
						<TooltipContent>Code Block</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Toggle
								size="sm"
								onPressedChange={() =>
									editor
										.chain()
										.focus()
										.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
										.run()
								}
							>
								<Table className="h-4 w-4" />
							</Toggle>
						</TooltipTrigger>
						<TooltipContent>Insert Table</TooltipContent>
					</Tooltip>
				</div>

				<Separator orientation="vertical" className="h-6" />

				<div className="flex items-center">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => editor.chain().focus().undo().run()}
								disabled={!editor.can().undo()}
								aria-label="Undo"
							>
								<Undo className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Undo</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => editor.chain().focus().redo().run()}
								disabled={!editor.can().redo()}
								aria-label="Redo"
							>
								<Redo className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Redo</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</TooltipProvider>
	);
}
