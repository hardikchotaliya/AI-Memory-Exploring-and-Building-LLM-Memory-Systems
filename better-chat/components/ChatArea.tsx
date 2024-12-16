'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Message } from "@/types/chat";

// Uncomment to activate EditMemoryDialog
// import { EditMemoryDialog } from './EditMemoryDialog';

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (message: string) => Promise<void>;
  onUpdateMemory?: (messages: Message[]) => void;
  isLoading?: boolean;
}

export function ChatArea({ 
  messages, 
  onSendMessage,
  onUpdateMemory,
  isLoading = false
}: ChatAreaProps) {
  const [messageInput, setMessageInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const userMessage = messageInput;
    setMessageInput('');

    try {
      await onSendMessage(userMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="w-full max-w-[70ch] mx-auto h-full flex flex-col relative">
        <ScrollArea className="flex-1 p-4 h-[calc(100vh-8rem)]" ref={scrollAreaRef}>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center text-gray-500 mt-4">Loading messages...</div>
            ) : messages.length > 0 ? (
              messages.map((message: Message, index: number) => (
                <div
                  key={index}
                  className={`flex flex-col mb-4 max-w-[85%] ${
                    message.role === 'user' ? 'ml-auto' : 'mr-auto'
                  }`}
                >
                  {message.timestamp && (
                    <div className="text-xs text-gray-400 mb-1 px-4">
                      {formatTime(message.timestamp)}
                    </div>
                  )}
                  <div
                    className={`p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-blue-50 dark:bg-blue-900/20 rounded-tr-none'
                        : 'bg-gray-50 dark:bg-gray-800/50 rounded-tl-none'
                    }`}
                  >
                    <div className="font-semibold mb-1">
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </div>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 mt-4">No messages yet</div>
            )}
            <div ref={messagesEndRef} /> {/* Scroll anchor */}
          </div>
        </ScrollArea>
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
          <form onSubmit={handleSendMessage}>
            <div className="flex gap-2">
              <Textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1"
                rows={3}
              />
              <Button type="submit">Send</Button>
              {/* Uncomment to activate EditMemoryDialog */}
              {/*
               {onUpdateMemory && (
                <EditMemoryDialog
                  messages={messages}
                 onUpdateMemory={onUpdateMemory}
                />
              )} 
               */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 