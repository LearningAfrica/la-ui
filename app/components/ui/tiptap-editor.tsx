import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Bold from "~icons/lucide/bold";
import Italic from "~icons/lucide/italic";
import UnderlineIcon from "~icons/lucide/underline";
import Strikethrough from "~icons/lucide/strikethrough";
import List from "~icons/lucide/list";
import ListOrdered from "~icons/lucide/list-ordered";
import Quote from "~icons/lucide/quote";
import Code from "~icons/lucide/code";
import AlignLeft from "~icons/lucide/align-left";
import AlignCenter from "~icons/lucide/align-center";
import AlignRight from "~icons/lucide/align-right";
import LinkIcon from "~icons/lucide/link";
import Undo from "~icons/lucide/undo";
import Redo from "~icons/lucide/redo";
import ChevronDown from "~icons/lucide/chevron-down";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/** Compact icon toggle with a brand active state. */
function Tool({
  icon: Icon,
  label,
  active,
  onClick,
  disabled,
}: {
  icon: typeof Bold;
  label: string;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Toggle
      size="sm"
      pressed={!!active}
      onPressedChange={onClick}
      disabled={disabled}
      aria-label={label}
      className="text-la-ink-2 data-[state=on]:bg-la-forest-wash data-[state=on]:text-la-forest hover:bg-la-cream size-8 rounded-md"
    >
      <Icon className="size-4" />
    </Toggle>
  );
}

function Divider() {
  return <span className="bg-la-rule mx-1 h-5 w-px shrink-0" aria-hidden />;
}

const BLOCKS = [
  { label: "Paragraph", isActive: (e: Editor) => e.isActive("paragraph") },
  {
    label: "Heading 1",
    isActive: (e: Editor) => e.isActive("heading", { level: 1 }),
  },
  {
    label: "Heading 2",
    isActive: (e: Editor) => e.isActive("heading", { level: 2 }),
  },
  {
    label: "Heading 3",
    isActive: (e: Editor) => e.isActive("heading", { level: 3 }),
  },
  { label: "Quote", isActive: (e: Editor) => e.isActive("blockquote") },
  { label: "Code block", isActive: (e: Editor) => e.isActive("codeBlock") },
] as const;

function applyBlock(editor: Editor, label: (typeof BLOCKS)[number]["label"]) {
  const chain = editor.chain().focus();

  switch (label) {
    case "Heading 1":
      return chain.setHeading({ level: 1 }).run();
    case "Heading 2":
      return chain.setHeading({ level: 2 }).run();
    case "Heading 3":
      return chain.setHeading({ level: 3 }).run();
    case "Quote":
      return chain.toggleBlockquote().run();
    case "Code block":
      return chain.toggleCodeBlock().run();
    default:
      return chain.setParagraph().run();
  }
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  disabled = false,
  className,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-la-forest underline cursor-pointer" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  if (!editor) return null;

  const currentBlock =
    BLOCKS.find((b) => b.label !== "Paragraph" && b.isActive(editor))?.label ??
    "Paragraph";

  const text = editor.getText();
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div
      className={cn(
        "border-la-rule-strong bg-la-paper overflow-hidden rounded-lg border",
        disabled && "opacity-50",
        className
      )}
    >
      {/* Toolbar */}
      <div className="bg-la-paper border-la-rule sticky top-0 z-10 flex items-center gap-0.5 border-b px-2 py-1.5">
        <div className="flex flex-1 flex-wrap items-center gap-0.5">
          {/* Block type */}
          <DropdownMenu>
            <DropdownMenuTrigger
              disabled={disabled}
              className="text-la-ink hover:bg-la-cream flex h-8 items-center gap-1 rounded-md px-2 text-sm font-medium outline-none"
            >
              {currentBlock}
              <ChevronDown className="text-la-muted size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-40">
              {BLOCKS.map((b) => (
                <DropdownMenuItem
                  key={b.label}
                  onClick={() => applyBlock(editor, b.label)}
                  className={cn(
                    b.isActive(editor) && "text-la-forest font-medium"
                  )}
                >
                  {b.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Divider />

          <Tool
            icon={Bold}
            label="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={disabled}
          />
          <Tool
            icon={Italic}
            label="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={disabled}
          />
          <Tool
            icon={UnderlineIcon}
            label="Underline"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={disabled}
          />
          <Tool
            icon={Strikethrough}
            label="Strikethrough"
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={disabled}
          />

          <Divider />

          <Tool
            icon={List}
            label="Bullet list"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={disabled}
          />
          <Tool
            icon={ListOrdered}
            label="Ordered list"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={disabled}
          />
          <Tool
            icon={Quote}
            label="Quote"
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={disabled}
          />
          <Tool
            icon={Code}
            label="Code block"
            active={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            disabled={disabled}
          />

          <Divider />

          <Tool
            icon={AlignLeft}
            label="Align left"
            active={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            disabled={disabled}
          />
          <Tool
            icon={AlignCenter}
            label="Align center"
            active={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            disabled={disabled}
          />
          <Tool
            icon={AlignRight}
            label="Align right"
            active={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            disabled={disabled}
          />

          <Divider />

          <Tool
            icon={LinkIcon}
            label="Link"
            active={editor.isActive("link")}
            onClick={() => {
              if (editor.isActive("link")) {
                editor.chain().focus().unsetLink().run();
              } else {
                const url = window.prompt("Enter URL");

                if (url) editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            disabled={disabled}
          />

          <Divider />

          <Tool
            icon={Undo}
            label="Undo"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={disabled || !editor.can().undo()}
          />
          <Tool
            icon={Redo}
            label="Redo"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={disabled || !editor.can().redo()}
          />
        </div>
      </div>

      {/* Content — WYSIWYG (formatting renders inline as you type). Bounded
          scroll box so the sticky toolbar never scrolls away on long content. */}
      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert prose-headings:font-display prose-headings:tracking-tight [&_.tiptap_p.is-editor-empty:first-child::before]:text-la-muted max-h-[50vh] max-w-none overflow-y-auto px-4 py-3 [&_.tiptap]:min-h-40 [&_.tiptap]:outline-none [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
      />

      {/* Footer — word count + hint */}
      <div className="border-la-rule text-la-muted flex items-center justify-between border-t px-3 py-1.5 text-xs">
        <span className="tabular-nums">
          {words} {words === 1 ? "word" : "words"}
        </span>
        <span>Markdown shortcuts supported</span>
      </div>
    </div>
  );
}
