import { useState, useEffect, useRef } from 'react';
import { Message } from '@/types';
import { useOpenAI } from '@/hooks/useOpenAI';
import { ChatPanel } from '@/components/shared/ChatPanel';

interface BaseChatContainerProps {
  messages: Message[];
  onMessagesChange: (messages: Message[]) => void;
  getMessagesForApi: (newMessage: Message) => Message[];
  sendInitialMessage?: boolean;
  className?: string;
}

export const BaseChatContainer = ({ 
  messages, 
  onMessagesChange, 
  getMessagesForApi,
  sendInitialMessage = true,
  className 
}: BaseChatContainerProps) => {
  const { sendMessage, isLoading } = useOpenAI();
  const hasSentInitialMessage = useRef(false);

  // Send initial "Hello" message if enabled
  useEffect(() => {
    const sendInitial = async () => {
      if (!sendInitialMessage || hasSentInitialMessage.current) return;
      hasSentInitialMessage.current = true;
      
      try {
        const initialMessage: Message = {
          role: 'user',
          content: 'Hello',
          timestamp: Date.now(),
        };
        
        const messagesForApi = getMessagesForApi(initialMessage);
        console.log('Sending initial message to API:', messagesForApi);
        const response = await sendMessage(messagesForApi);
        onMessagesChange([initialMessage, response]);
      } catch (error) {
        console.error('Error sending initial message:', error);
      }
    };

    sendInitial();
  }, [sendInitialMessage, getMessagesForApi]);

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    try {
      const messagesForApi = getMessagesForApi(newMessage);
      console.log('Sending message to API:', messagesForApi);
      const response = await sendMessage(messagesForApi);
      const assistantMessage = {
        ...response,
        timestamp: Date.now(),
      };

      onMessagesChange([...messages, newMessage, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <ChatPanel
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      className={className}
    />
  );
}; 