import { useState, useEffect, useRef } from 'react';
import { Message } from '@/types';
import { useMemoryManager } from '@/hooks/useMemoryManager';
import { BaseChatContainer } from '@/components/shared/BaseChatContainer';
import { ApiPayloadPanel } from './ApiPayloadPanel';
import { MemoryPanel } from './MemoryPanel';

export const ChatContainer = () => {
  const {
    memoryState,
    addMessage,
    clearMemory,
    toggleMemory,
    togglePause,
    getApiPayload,
  } = useMemoryManager();
  const [displayMessages, setDisplayMessages] = useState<Message[]>([]);
  const [lastSentPayload, setLastSentPayload] = useState<{
    systemMessage: Message;
    memoryMessages: Message[];
    userMessage?: Message;
  }>();

  const handleMessagesChange = (newMessages: Message[]) => {
    const latestMessages = newMessages.slice(displayMessages.length);
    
    // Always update display messages regardless of memory state
    setDisplayMessages(newMessages);
    
    // Only add to memory if not paused
    if (!memoryState.paused) {
      latestMessages.forEach(message => {
        addMessage(message);
      });
    }
  };

  const getMessagesForApi = (newMessage: Message): Message[] => {
    // Only use messages from memory for API calls
    const messagesForApi = [...getApiPayload(), newMessage];
    
    // Update the last sent payload for display
    setLastSentPayload({
      systemMessage: memoryState.messages[0],
      memoryMessages: memoryState.messages.slice(1),
      userMessage: newMessage
    });

    return messagesForApi;
  };

  const handleClearMemory = () => {
    clearMemory();
    setLastSentPayload(undefined);
  };

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden md:grid-cols-3">
      <BaseChatContainer
        messages={displayMessages}
        onMessagesChange={handleMessagesChange}
        getMessagesForApi={getMessagesForApi}
        className="min-h-0 overflow-hidden"
      />
      <ApiPayloadPanel
        systemMessage={lastSentPayload?.systemMessage || memoryState.messages[0]}
        memoryMessages={lastSentPayload?.memoryMessages || memoryState.messages.slice(1)}
        currentMessage={lastSentPayload?.userMessage}
        className="min-h-0 overflow-hidden"
      />
      <MemoryPanel
        memoryState={memoryState}
        onToggleMemory={toggleMemory}
        onTogglePause={togglePause}
        onClear={handleClearMemory}
        className="min-h-0 overflow-hidden"
      />
    </div>
  );
}; 