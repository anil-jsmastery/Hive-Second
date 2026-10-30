import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Skill content as Markdown, in the design's .md styles. Raw HTML is not rendered.
export function Markdown({ content }: { content: string }) {
  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
