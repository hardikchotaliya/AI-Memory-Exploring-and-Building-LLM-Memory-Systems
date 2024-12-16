'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil } from "lucide-react";
import { Chat } from "@/types/chat";
import { ChatImportExport } from "./ChatImportExport";

interface ChatListProps {
  chats: Chat[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onImportChat: (chat: Chat) => void;
}

export function ChatList({ 
  chats, 
  currentChatId, 
  onNewChat, 
  onSelectChat, 
  onRenameChat,
  onImportChat
}: ChatListProps) {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleTitleDoubleClick = (chat: Chat) => {
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (editingTitle.trim()) {
        onRenameChat(chatId, editingTitle.trim());
        setEditingChatId(null);
      }
    } else if (e.key === 'Escape') {
      setEditingChatId(null);
    }
  };

  const handleTitleBlur = (chatId: string) => {
    if (editingTitle.trim()) {
      onRenameChat(chatId, editingTitle.trim());
    }
    setEditingChatId(null);
  };

  const currentChat = chats.find(chat => chat.id === currentChatId);

  return (
    <div className="w-64 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
      <div className="p-4">
        <Button className="w-full" onClick={onNewChat}>
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-2 cursor-pointer rounded flex items-center justify-between group ${
                chat.id === currentChatId
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="flex-1">
                {editingChatId === chat.id ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => handleTitleKeyDown(e, chat.id)}
                    onBlur={() => handleTitleBlur(chat.id)}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  chat.title
                )}
              </div>
              {!editingChatId && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-50 hover:opacity-100 h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTitleDoubleClick(chat);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <ChatImportExport
        currentChat={currentChat}
        onImportChat={onImportChat}
      />
    </div>
  );
} 