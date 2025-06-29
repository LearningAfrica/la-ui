import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
	ThumbsUp,
	MessageSquare,
	MoreHorizontal,
	Flag,
	Trash,
	Edit,
} from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export interface CommentProps {
	id: string;
	content: string;
	author: {
		id: string;
		name: string;
		image?: string;
		role: 'student' | 'instructor' | 'admin';
	};
	createdAt: string;
	updatedAt?: string;
	likes: number;
	isLiked: boolean;
	replies?: CommentProps[];
	currentUserId: string;
	onReply?: (commentId: string, content: string) => void;
	onEdit?: (commentId: string, content: string) => void;
	onDelete?: (commentId: string) => void;
	onLike?: (commentId: string) => void;
	onReport?: (commentId: string) => void;
}

export function CommentItem({
	id,
	content,
	author,
	createdAt,
	updatedAt,
	likes,
	isLiked,
	replies = [],
	currentUserId,
	onReply,
	onEdit,
	onDelete,
	onLike,
	onReport,
}: CommentProps) {
	const [isReplying, setIsReplying] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [replyContent, setReplyContent] = useState('');
	const [editContent, setEditContent] = useState(content);
	const [showReplies, setShowReplies] = useState(false);

	const isAuthor = currentUserId === author.id;
	const hasReplies = replies.length > 0;

	const handleReplySubmit = () => {
		if (replyContent.trim() && onReply) {
			onReply(id, replyContent);
			setReplyContent('');
			setIsReplying(false);
			toast.success(
				// 	{
				// 	title: 'Reply posted',
				// 	description: 'Your reply has been posted successfully.',
				// }
				<div>
					<p className="text-sm">Your reply has been posted successfully.</p>
					<div className="mt-2">
						<Button
							variant="secondary"
							size="sm"
							onClick={() => setReplyContent('')}
						>
							Write another reply
						</Button>
					</div>
				</div>,
			);
		}
	};

	const handleEditSubmit = () => {
		if (editContent.trim() && onEdit) {
			onEdit(id, editContent);
			setIsEditing(false);
			// toast({
			// 	title: 'Comment updated',
			// 	description: 'Your comment has been updated successfully.',
			// });
			toast.success(
				<div>
					<p className="text-sm">Your comment has been updated successfully.</p>
					<div className="mt-2">
						<Button
							variant="secondary"
							size="sm"
							onClick={() => setEditContent('')}
						>
							Edit another comment
						</Button>
					</div>
				</div>,
			);
		}
	};

	const handleDelete = () => {
		if (onDelete) {
			onDelete(id);
			// toast({
			// 	title: 'Comment deleted',
			// 	description: 'Your comment has been deleted successfully.',
			// });
			toast.success(
				<div>
					<p className="text-sm">Your comment has been deleted successfully.</p>
					<div className="mt-2">
						<Button
							variant="secondary"
							size="sm"
							onClick={() => setEditContent('')}
						>
							Delete another comment
						</Button>
					</div>
				</div>,
			);
		}
	};

	const handleReport = () => {
		if (onReport) {
			onReport(id);
			// toast({
			// 	title: 'Comment reported',
			// 	description: 'This comment has been reported for review.',
			// });
			toast.success(
				<div>
					<p className="text-sm">This comment has been reported for review.</p>
					<div className="mt-2">
						<Button
							variant="secondary"
							size="sm"
							onClick={() => setEditContent('')}
						>
							Report another comment
						</Button>
					</div>
				</div>,
			);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex gap-4">
				<Avatar className="h-8 w-8">
					<AvatarImage
						src={author.image || '/placeholder.svg'}
						alt={author.name}
					/>
					<AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
				</Avatar>
				<div className="flex-1 space-y-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="font-medium">{author.name}</span>
							{author.role === 'instructor' && (
								<span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
									Instructor
								</span>
							)}
							<span className="text-muted-foreground text-xs">
								{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
								{updatedAt && ' (edited)'}
							</span>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="h-8 w-8">
									<MoreHorizontal className="h-4 w-4" />
									<span className="sr-only">More options</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{isAuthor ? (
									<>
										<DropdownMenuItem onClick={() => setIsEditing(true)}>
											<Edit className="mr-2 h-4 w-4" />
											Edit
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={handleDelete}
											className="text-destructive focus:text-destructive"
										>
											<Trash className="mr-2 h-4 w-4" />
											Delete
										</DropdownMenuItem>
									</>
								) : (
									<DropdownMenuItem onClick={handleReport}>
										<Flag className="mr-2 h-4 w-4" />
										Report
									</DropdownMenuItem>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{isEditing ? (
						<div className="space-y-2">
							<Textarea
								value={editContent}
								onChange={(e) => setEditContent(e.target.value)}
								className="min-h-[100px]"
								placeholder="Edit your comment..."
							/>
							<div className="flex justify-end gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setIsEditing(false)}
								>
									Cancel
								</Button>
								<Button size="sm" onClick={handleEditSubmit}>
									Save
								</Button>
							</div>
						</div>
					) : (
						<div className="text-sm">{content}</div>
					)}

					<div className="flex items-center gap-4 pt-1">
						<Button
							variant="ghost"
							size="sm"
							className={`flex items-center gap-1 text-xs ${isLiked ? 'text-primary' : ''}`}
							onClick={() => onLike && onLike(id)}
						>
							<ThumbsUp className="h-3.5 w-3.5" />
							<span>{likes > 0 ? likes : ''}</span>
							<span>{isLiked ? 'Liked' : 'Like'}</span>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="flex items-center gap-1 text-xs"
							onClick={() => setIsReplying(!isReplying)}
						>
							<MessageSquare className="h-3.5 w-3.5" />
							<span>Reply</span>
						</Button>
					</div>

					{isReplying && (
						<div className="mt-4 space-y-2">
							<Textarea
								value={replyContent}
								onChange={(e) => setReplyContent(e.target.value)}
								placeholder="Write a reply..."
								className="min-h-[80px]"
							/>
							<div className="flex justify-end gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setIsReplying(false)}
								>
									Cancel
								</Button>
								<Button size="sm" onClick={handleReplySubmit}>
									Reply
								</Button>
							</div>
						</div>
					)}

					{hasReplies && (
						<div className="mt-2">
							<Button
								variant="ghost"
								size="sm"
								className="flex items-center gap-1 text-xs"
								onClick={() => setShowReplies(!showReplies)}
							>
								{showReplies ? 'Hide' : 'Show'} {replies.length}{' '}
								{replies.length === 1 ? 'reply' : 'replies'}
							</Button>
						</div>
					)}

					{showReplies && hasReplies && (
						<div className="mt-4 space-y-4 pt-2 pl-6">
							{replies.map((reply) => (
								<CommentItem
									key={reply.id}
									{...reply}
									currentUserId={currentUserId}
									onReply={onReply}
									onEdit={onEdit}
									onDelete={onDelete}
									onLike={onLike}
									onReport={onReport}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
