import { Message } from '@/types';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <div
      className={cn(
        'mb-4 flex w-full',
        isUser ? 'justify-end' : 'justify-start',
        isSystem && 'opacity-75'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-2',
          isUser ? 'bg-blue-500/90 [&_.prose]:text-white [&_.prose_strong]:text-white [&_.prose_em]:text-blue-100' : 'bg-gray-200 text-gray-900',
          isSystem && 'bg-yellow-100 italic text-gray-900'
        )}
      >
        <ReactMarkdown
          className="prose prose-sm max-w-none dark:prose-invert"
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
