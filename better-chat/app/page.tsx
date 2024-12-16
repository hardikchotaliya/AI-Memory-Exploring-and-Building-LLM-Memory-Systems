'use client';

import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useChat } from "@/hooks/useChat";
import { ChatArea } from "@/components/ChatArea";
import { Chat } from "@/types/chat";

// Uncomment to activate ChatList
// import { ChatList } from "@/components/ChatList";

// Uncomment to activate CollabNotebook
// import { CollabNotebook } from "@/components/CollabNotebook";

export default function Home() {
  const { toast } = useToast();
  const {
    state,
    setState,
    createNewChat,
    sendMessage,
    updateCollabSpace,
    setCurrentChatId,
    clearAllChats,
    renameChat,
    getSummaryFromAI,
    updateChatMessages,
  } = useChat();

  const [isLoading, setIsLoading] = useState(true);
  const initRef = useRef(false);

  // Get current chat directly from state
  const currentChat = state.chats.find(chat => chat.id === state.currentChatId);

  // Initialize chat
  useEffect(() => {
    const init = async () => {
      if (initRef.current) return;
      initRef.current = true;

      try {
        clearAllChats();
        const chatId = createNewChat();
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        toast({
          title: "Error",
          description: "Failed to initialize chat.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Send initial hello message after app is loaded
  useEffect(() => {
    const sendInitialMessage = async () => {
      if (!currentChat || currentChat.messages.length > 0) return;
      try {
        await sendMessage('hello');
      } catch (error) {
        console.error('Failed to send initial message:', error);
      }
    };

    if (!isLoading && currentChat) {
      sendInitialMessage();
    }
  }, [isLoading, currentChat]);

  // Update loading state when messages change
  useEffect(() => {
    if (currentChat?.messages && currentChat.messages.length > 0) {
      setIsLoading(false);
    }
  }, [currentChat?.messages]);

  const handleImportChat = (importedChat: Chat) => {
    try {
      // Add the imported chat to the state
      setState(prev => ({
        ...prev,
        chats: [...prev.chats, importedChat],
        currentChatId: importedChat.id,
      }));

      toast({
        title: "Success",
        description: "Chat imported successfully.",
      });
    } catch (error) {
      console.error('Failed to import chat:', error);
      toast({
        title: "Error",
        description: "Failed to import chat.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen overflow-x-hidden">
      {/* Left Sidebar */}
      <div className="flex-none w-64 border-r border-gray-200 dark:border-gray-800">
        {/* Uncomment to activate ChatList */}
        {/* 
        <ChatList
          chats={state.chats}
          currentChatId={state.currentChatId}
          onNewChat={createNewChat}
          onSelectChat={setCurrentChatId}
          onRenameChat={renameChat}
          onImportChat={handleImportChat}
        />
        */}
      </div>       

      {/* Main Chat Area */}
      <div className="flex-1">
        <ChatArea
          messages={currentChat?.messages.filter((msg, index) => !(index === 0 && msg.role === 'user')) || []}
          onSendMessage={sendMessage}
          onUpdateMemory={(messages) => {
            if (currentChat) {
              updateChatMessages(currentChat.id, messages);
            }
          }}
          isLoading={isLoading}
        />
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-gray-200 dark:border-gray-800">
        {/* Uncomment to activate CollabNotebook */}
        {/*         
        <CollabNotebook
          content={currentChat?.collabSpace || ''}
          onUpdate={(content) => updateCollabSpace(content)}
          messages={currentChat?.messages || []}
          getSummaryFromAI={getSummaryFromAI}
        />
         */}
      </div>
    </div>
  );
}
