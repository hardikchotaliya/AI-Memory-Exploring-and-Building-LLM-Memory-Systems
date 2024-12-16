import { Button } from "@/components/ui/button";
import { Chat, ChatExport } from "@/types/chat";
import { Download, Upload } from "lucide-react";

interface ChatImportExportProps {
  currentChat: Chat | undefined;
  onImportChat: (chat: Chat) => void;
}

export function ChatImportExport({ currentChat, onImportChat }: ChatImportExportProps) {
  const handleExport = () => {
    if (!currentChat) return;

    const exportData: ChatExport = {
      version: '1.0',
      chat: currentChat
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentChat.title.toLowerCase().replace(/\s+/g, '-')}-${currentChat.id.slice(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content) as ChatExport;
        
        // Basic validation
        if (!importData.version || !importData.chat || !importData.chat.id) {
          throw new Error('Invalid chat export file format');
        }

        onImportChat(importData.chat);
        
        // Reset the file input
        event.target.value = '';
      } catch (error) {
        console.error('Failed to import chat:', error);
        // You might want to show a toast message here
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex gap-2 p-4 border-t border-gray-200 dark:border-gray-800">
      <Button
        variant="outline"
        size="sm"
        className="flex-1"
        onClick={handleExport}
        disabled={!currentChat}
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex-1"
        onClick={() => document.getElementById('chat-import')?.click()}
      >
        <Upload className="h-4 w-4 mr-2" />
        Import
      </Button>
      <input
        type="file"
        id="chat-import"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />
    </div>
  );
} 