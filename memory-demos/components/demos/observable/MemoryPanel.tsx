'use client';

import { useEffect, useRef } from 'react';
import { MemoryState } from '@/types';
import { MemoryControls } from '@/components/shared/MemoryControls';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MemoryPanelProps {
  memoryState: MemoryState;
  onToggleMemory: () => void;
  onTogglePause: () => void;
  onClear: () => void;
  className?: string;
}

export function MemoryPanel({
  memoryState,
  onToggleMemory,
  onTogglePause,
  onClear,
  className,
}: MemoryPanelProps) {
  const messagesRef = useRef<HTMLDivElement>(null);

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString();
  };

  // Auto-scroll effect when messages change
  useEffect(() => {
    if (messagesRef.current) {
      const scrollElement = messagesRef.current;
      requestAnimationFrame(() => {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      });
    }
  }, [memoryState.messages]);

  return (
    <Card className={cn('flex min-h-0 flex-col overflow-hidden', className)}>
      <CardHeader className="shrink-0">
        <CardTitle>Memory State</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
        <MemoryControls
          isEnabled={memoryState.enabled}
          isPaused={memoryState.paused}
          onToggleMemory={onToggleMemory}
          onTogglePause={onTogglePause}
          onClear={onClear}
          className="mb-4 shrink-0"
        />

        <div
          ref={messagesRef}
          className="min-h-0 flex-1 overflow-y-auto rounded-md border p-4"
        >
          <div className="space-y-4">
            {memoryState.messages.map((message, index) => (
              <div key={index} className="border-b pb-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{message.role}</span>
                  <span>{formatTimestamp(message.timestamp)}</span>
                </div>
                <p className="mt-1 whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
