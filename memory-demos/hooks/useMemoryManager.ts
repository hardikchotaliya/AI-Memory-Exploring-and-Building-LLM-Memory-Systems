import { useState, useCallback } from 'react';
import { MemoryState, Message } from '@/types';

const DEFAULT_SYSTEM_MESSAGE: Message = {
  role: 'system',
  content: 'You are a helpful assistant.',
  timestamp: Date.now(),
};

export const useMemoryManager = (
  initialSystemMessage = DEFAULT_SYSTEM_MESSAGE
) => {
  const [memoryState, setMemoryState] = useState<MemoryState>({
    enabled: true,
    paused: false,
    messages: [initialSystemMessage],
  });

  const addMessage = useCallback(
    (message: Message) => {
      if (!memoryState.enabled || memoryState.paused) return;

      setMemoryState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            ...message,
            timestamp: Date.now(),
          },
        ],
      }));
    },
    [memoryState.enabled, memoryState.paused]
  );

  const addMessages = useCallback(
    (messages: Message[]) => {
      if (!memoryState.enabled || memoryState.paused) return;

      setMemoryState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          ...messages.map((msg) => ({
            ...msg,
            timestamp: Date.now(),
          })),
        ],
      }));
    },
    [memoryState.enabled, memoryState.paused]
  );

  const clearMemory = useCallback(() => {
    setMemoryState((prev) => ({
      ...prev,
      messages: [initialSystemMessage],
    }));
  }, [initialSystemMessage]);

  const toggleMemory = useCallback(() => {
    setMemoryState((prev) => ({
      ...prev,
      enabled: !prev.enabled,
    }));
  }, []);

  const togglePause = useCallback(() => {
    setMemoryState((prev) => ({
      ...prev,
      paused: !prev.paused,
    }));
  }, []);

  const updateSystemMessage = useCallback(
    (content: string) => {
      setMemoryState((prev) => ({
        ...prev,
        messages: [
          { ...initialSystemMessage, content, timestamp: Date.now() },
          ...prev.messages.slice(1),
        ],
      }));
    },
    [initialSystemMessage]
  );

  const getApiPayload = useCallback(() => {
    if (!memoryState.enabled) {
      return [initialSystemMessage];
    }
    return memoryState.messages;
  }, [memoryState.enabled, memoryState.messages, initialSystemMessage]);

  return {
    memoryState,
    addMessage,
    addMessages,
    clearMemory,
    toggleMemory,
    togglePause,
    updateSystemMessage,
    getApiPayload,
    setMemoryState, // Exposed for editable memory demo
  };
};
