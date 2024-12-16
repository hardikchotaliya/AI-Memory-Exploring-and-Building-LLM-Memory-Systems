'use client';

import { useEffect, useRef, useState } from 'react';
import { Message } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface ApiPayloadPanelProps {
  systemMessage: Message;
  memoryMessages: Message[];
  currentMessage?: Message;
  className?: string;
}

export function ApiPayloadPanel({
  systemMessage,
  memoryMessages,
  currentMessage,
  className,
}: ApiPayloadPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isJsonView, setIsJsonView] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      requestAnimationFrame(() => {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      });
    }
  }, [systemMessage, memoryMessages, currentMessage]);

  const formatMessage = (message: Message) => (
    <div className="text-slate-600">
      <ReactMarkdown
        className="prose prose-sm max-w-none dark:prose-invert"
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  );

  const renderJsonView = () => {
    const payload = {
      messages: [
        systemMessage,
        ...memoryMessages,
        ...(currentMessage ? [currentMessage] : []),
      ],
    };

    return (
      <pre className="whitespace-pre-wrap text-sm text-slate-600">
        {JSON.stringify(payload, null, 2)}
      </pre>
    );
  };

  const renderVisualView = () => (
    <>
      {systemMessage && (
        <div className="mb-4">
          <div className="mb-2 font-medium text-slate-500">System Message</div>
          <div className="rounded-md border border-slate-200 p-2">
            {formatMessage(systemMessage)}
          </div>
        </div>
      )}
      
      {memoryMessages.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 font-medium text-slate-500">Conversation Memory</div>
          <div className="rounded-md border border-slate-200 p-2 space-y-2">
            {memoryMessages.map((msg, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-xs font-medium text-slate-400">
                  {msg.role}:
                </span>
                {formatMessage(msg)}
              </div>
            ))}
          </div>
        </div>
      )}

      {currentMessage && (
        <div className="mb-4">
          <div className="mb-2 font-medium text-slate-500">New User Message</div>
          <div className="rounded-md border border-slate-200 p-2">
            {formatMessage(currentMessage)}
          </div>
        </div>
      )}
    </>
  );

  return (
    <Card className={cn('flex min-h-0 flex-col overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between shrink-0">
        <CardTitle>Latest API Request</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Show JSON</span>
          <Switch
            checked={isJsonView}
            onCheckedChange={setIsJsonView}
          />
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden p-0">
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto p-4">
          {isJsonView ? renderJsonView() : renderVisualView()}
        </div>
      </CardContent>
    </Card>
  );
}
