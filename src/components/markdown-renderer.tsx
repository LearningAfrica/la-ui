interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      {content.split("\n").map((paragraph, i) => {
        if (paragraph.startsWith("# ")) {
          return (
            <h1 key={i} className="text-2xl font-bold mt-6 mb-4">
              {paragraph.substring(2)}
            </h1>
          )
        } else if (paragraph.startsWith("## ")) {
          return (
            <h2 key={i} className="text-xl font-bold mt-5 mb-3">
              {paragraph.substring(3)}
            </h2>
          )
        } else if (paragraph.startsWith("### ")) {
          return (
            <h3 key={i} className="text-lg font-bold mt-4 mb-2">
              {paragraph.substring(4)}
            </h3>
          )
        } else if (paragraph.startsWith("- ")) {
          return (
            <li key={i} className="ml-6">
              {paragraph.substring(2)}
            </li>
          )
        } else if (paragraph.trim() === "") {
          return <div key={i} className="h-4"></div>
        } else {
          return (
            <p key={i} className="my-2">
              {paragraph}
            </p>
          )
        }
      })}
    </div>
  )
}
