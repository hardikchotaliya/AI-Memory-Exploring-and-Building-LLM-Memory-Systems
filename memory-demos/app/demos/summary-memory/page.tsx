'use client';

import { useState, useEffect, useRef } from 'react';
import { Message } from '@/types';
import { useMemoryManager } from '@/hooks/useMemoryManager';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BaseChatContainer } from '@/components/shared/BaseChatContainer';
import { useOpenAI } from '@/hooks/useOpenAI';

interface SummaryState {
  points: string[];
  lastUpdated: number;
}

const SummaryMemoryDemo = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [displayMessages, setDisplayMessages] = useState<Message[]>([]);
  const [summary, setSummary] = useState<SummaryState>({ points: [], lastUpdated: 0 });
  const { memoryState, addMessage, clearMemory } = useMemoryManager();
  const { sendMessage } = useOpenAI();
  const currentMemoryRef = useRef<HTMLPreElement>(null);

  // Keep display messages in sync with memory state
  useEffect(() => {
    const filteredMessages = memoryState.messages.filter(
      (message) => message.role !== 'system'
    );
    setDisplayMessages(filteredMessages);

    // Auto-summarize when messages exceed 10 exchanges
    if (filteredMessages.length >= 20 && Date.now() - summary.lastUpdated > 30000) {
      handleSummarize();
    }
  }, [memoryState.messages]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-scroll effect for current memory
  useEffect(() => {
    if (currentMemoryRef.current) {
      currentMemoryRef.current.scrollTop = currentMemoryRef.current.scrollHeight;
    }
  }, [memoryState.messages]);

  const handleMessagesChange = (newMessages: Message[]) => {
    const latestMessages = newMessages.slice(displayMessages.length);
    latestMessages.forEach(message => {
      addMessage(message);
    });
    setDisplayMessages(newMessages);
  };

  const getMessagesForApi = (newMessage: Message): Message[] => {
    let messages: Message[] = [];
    
    // If we have a summary, include it as context
    if (summary.points.length > 0) {
      messages.push({
        role: 'assistant',
        content: 'Previous conversation summary:\n' + summary.points.join('\n'),
        timestamp: Date.now()
      });
      
      // Add last 3 message pairs
      const recentMessages = memoryState.messages
        .filter(msg => msg.role !== 'system')
        .slice(-6);
      messages = [...messages, ...recentMessages];
    } else {
      // If no summary, use all messages
      messages = memoryState.messages.filter(msg => msg.role !== 'system');
    }
    
    return [...messages, newMessage];
  };

  const handleSummarize = async () => {
    const conversationMessages = memoryState.messages.filter(msg => msg.role !== 'system');
    const summaryRequest: Message = {
      role: 'user',
      content: `Please provide a concise bullet-point summary of our conversation so far. Each point should capture key information shared. If there's an existing summary, keep those points that are still relevant and add new points.${
        summary.points.length > 0 
          ? '\n\nExisting summary points:\n' + summary.points.join('\n')
          : ''
      }`,
      timestamp: Date.now()
    };

    try {
      const response = await sendMessage([...conversationMessages, summaryRequest]);
      const summaryPoints = response.content
        .split('\n')
        .filter((line: string) => line.trim().startsWith('-'))
        .map((point: string) => point.trim());

      setSummary({
        points: summaryPoints,
        lastUpdated: Date.now()
      });

      // Keep only the last 3 exchanges (6 messages) plus system message
      const recentMessages = memoryState.messages
        .filter(msg => msg.role === 'system')
        .concat(memoryState.messages
          .filter(msg => msg.role !== 'system')
          .slice(-6)
        );

      // Add summary as first assistant message
      const summaryMessage: Message = {
        role: 'assistant',
        content: 'Previous conversation summary:\n' + summaryPoints.join('\n'),
        timestamp: Date.now()
      };

      // Clear memory and add new messages
      clearMemory();
      const systemMessage = recentMessages.shift(); // Remove and store system message
      if (systemMessage) {
        addMessage(systemMessage);
        addMessage(summaryMessage);
        recentMessages.forEach(msg => addMessage(msg));
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="container mx-auto flex min-h-0 flex-1 flex-col overflow-hidden p-4">
        <Link 
          href="/" 
          className="mb-2 flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Home
        </Link>
        
        <h1 className="mb-8 text-2xl font-bold">Summary Memory Demo</h1>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden md:grid-cols-3">
          <BaseChatContainer
            messages={displayMessages}
            onMessagesChange={handleMessagesChange}
            getMessagesForApi={getMessagesForApi}
            className="min-h-0 overflow-hidden"
          />

          <Card className="flex min-h-0 flex-col overflow-hidden">
            <CardHeader className="shrink-0">
              <CardTitle>Current Memory</CardTitle>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-y-auto p-4">
              <pre 
                ref={currentMemoryRef}
                className="whitespace-pre-wrap text-sm h-full overflow-y-auto"
              >
                {JSON.stringify(memoryState.messages, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card className="flex min-h-0 flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between shrink-0">
              <CardTitle>Summary Memory</CardTitle>
              <Button onClick={handleSummarize} variant="outline" size="sm">
                Summarize Memory
              </Button>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-y-auto p-4">
              <Textarea
                value={summary.points.join('\n')}
                readOnly
                className="h-full min-h-[500px] font-mono"
                placeholder="Summary will appear here. Click 'Summarize Memory' to generate a summary."
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 shrink-0 rounded-lg bg-yellow-50 p-4">
          <h2 className="mb-2 font-semibold">How this demo works:</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Type and send messages in the chat panel</li>
            <li>Watch the current memory update in real-time</li>
            <li>Click &quot;Summarize Memory&quot; to generate a point-form summary</li>
            <li>After 10 exchanges, memory will be automatically summarized</li>
            <li>New messages will include the summary and last 3 message pairs</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SummaryMemoryDemo;
