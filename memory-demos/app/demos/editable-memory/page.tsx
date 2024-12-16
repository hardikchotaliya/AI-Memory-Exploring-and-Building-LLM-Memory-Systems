'use client';

import { useState, useEffect } from 'react';
import { ChatContainer } from '@/components/demos/editable/ChatContainer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { EditableMemoryPanel } from '@/components/demos/editable/EditableMemoryPanel';
import { Message } from '@/types';

const EditableMemoryDemo = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [memory, setMemory] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleMessagesChange = (newMessages: Message[]) => {
    setMessages(newMessages);
    if (newMessages.length > messages.length) {
      const newMessageBlocks = newMessages.slice(messages.length)
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n\n');
      
      setMemory(prevMemory => {
        const separator = prevMemory.trim() ? '\n\n' : '';
        return prevMemory + separator + newMessageBlocks;
      });
    }
  };

  const handleMemoryChange = (newMemory: string) => {
    setMemory(newMemory);
  };

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
        
        <h1 className="mb-8 text-2xl font-bold">Editable Memory Demo</h1>

        <div className="grid flex-1 grid-cols-2 gap-4 overflow-hidden">
          <div className="flex flex-col overflow-hidden">
            <ChatContainer 
              memory={memory} 
              messages={messages}
              onMessagesChange={handleMessagesChange}
            />
          </div>
          
          <div className="flex flex-col overflow-hidden">
            <EditableMemoryPanel 
              memory={memory} 
              onMemoryChange={handleMemoryChange}
            />
          </div>
        </div>

        <div className="mt-4 shrink-0 rounded-lg bg-yellow-50 p-4">
          <h2 className="mb-2 font-semibold">How this demo works:</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Type and send messages in the chat panel</li>
            <li>Click &quot;Edit Memory&quot; to modify the conversation history</li>
            <li>Click &quot;Save Memory&quot; to apply your changes</li>
            <li>New messages will use your edited memory for context</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditableMemoryDemo;
