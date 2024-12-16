import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Chat, Message, ChatState } from '@/types/chat';

const STORAGE_KEY = 'better-chat-state';

export function useChat() {
  const [state, setState] = useState<ChatState>({
    chats: [],
    currentChatId: null,
    collabSpace: '',
  });

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setState(JSON.parse(saved));
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const clearAllChats = () => {
    setState({
      chats: [],
      currentChatId: null,
      collabSpace: '',
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      collabSpace: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      chats: [...prev.chats, newChat],
      currentChatId: newChat.id,
    }));

    return newChat.id;
  };

  const getCurrentChat = () => {
    return state.chats.find(chat => chat.id === state.currentChatId);
  };

  const sendMessage = async (content: string, hideUserMessage: boolean = false) => {
    if (!state.currentChatId) return;

    const currentChat = state.chats.find(chat => chat.id === state.currentChatId);
    if (!currentChat) return;

    // Create new user message
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    // Immediately update the UI with the user message if not hidden
    if (!hideUserMessage) {
      setState(prev => ({
        ...prev,
        chats: prev.chats.map(chat => {
          if (chat.id === state.currentChatId) {
            return {
              ...chat,
              messages: [...chat.messages, userMessage],
              updatedAt: new Date().toISOString(),
            };
          }
          return chat;
        }),
      }));
    }

    try {
      // Send to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...currentChat.messages, userMessage],
          collabSpace: currentChat.collabSpace,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Create assistant message from the response
      const assistantMessage = {
        ...data.response,
        timestamp: new Date().toISOString(),
      };

      setState(prev => ({
        ...prev,
        chats: prev.chats.map(chat => {
          if (chat.id === state.currentChatId) {
            const messages = hideUserMessage 
              ? [...chat.messages, assistantMessage]
              : [...chat.messages, assistantMessage];
            return {
              ...chat,
              messages,
              updatedAt: new Date().toISOString(),
            };
          }
          return chat;
        }),
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const updateCollabSpace = (content: string) => {
    if (!state.currentChatId) return;

    setState(prev => ({
      ...prev,
      chats: prev.chats.map(chat => {
        if (chat.id === state.currentChatId) {
          return {
            ...chat,
            collabSpace: content,
            updatedAt: new Date().toISOString(),
          };
        }
        return chat;
      }),
    }));
  };

  const setCurrentChatId = (chatId: string) => {
    setState(prev => ({
      ...prev,
      currentChatId: chatId,
    }));
  };

  const hideUserMessages = (chatId: string) => {
    setState(prev => ({
      ...prev,
      chats: prev.chats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: chat.messages.filter(msg => msg.role === 'assistant')
          };
        }
        return chat;
      })
    }));
  };

  const renameChat = (chatId: string, newTitle: string) => {
    setState(prev => ({
      ...prev,
      chats: prev.chats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            title: newTitle,
            updatedAt: new Date().toISOString(),
          };
        }
        return chat;
      }),
    }));
  };

  const getSummaryFromAI = async (content: string) => {
    if (!state.currentChatId) return null;

    try {
      // Send to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content,
            timestamp: new Date().toISOString(),
          }],
          collabSpace: '',
          skipHistory: true, // Signal to the API that this should not be stored
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      return data.response.content;
    } catch (error) {
      console.error('Error getting summary:', error);
      throw error;
    }
  };

  const updateChatMessages = (chatId: string, messages: Message[]) => {
    setState(prev => ({
      ...prev,
      chats: prev.chats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages,
            updatedAt: new Date().toISOString(),
          };
        }
        return chat;
      }),
    }));
  };

  return {
    state,
    setState,
    createNewChat,
    getCurrentChat,
    sendMessage,
    updateCollabSpace,
    setCurrentChatId,
    clearAllChats,
    hideUserMessages,
    renameChat,
    getSummaryFromAI,
    updateChatMessages,
  };
} 