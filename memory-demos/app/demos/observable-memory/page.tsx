'use client';

import { useState, useEffect } from 'react';
import { ChatContainer } from '@/components/demos/observable/ChatContainer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const ObservableMemoryDemo = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        
        <h1 className="mb-8 text-2xl font-bold">Observable Memory Demo</h1>

        <ChatContainer />

        <div className="mt-4 shrink-0 rounded-lg bg-yellow-50 p-4">
          <h2 className="mb-2 font-semibold">How this demo works:</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Type and send messages in the chat panel</li>
            <li>Watch the API payload update in real-time</li>
            <li>Observe how messages are stored in memory</li>
            <li>
              Toggle memory features to see how they affect the conversation
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ObservableMemoryDemo;
