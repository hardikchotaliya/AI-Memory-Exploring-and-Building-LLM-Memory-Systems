import { Message } from '@/types';
import { BaseChatContainer } from '@/components/shared/BaseChatContainer';

interface ChatContainerProps {
  memory: string;
  messages: Message[];
  onMessagesChange: (messages: Message[]) => void;
}

export const parseMemoryToMessages = (memory: string): Message[] => {
  if (!memory.trim()) return [];
  try {
    const messages: Message[] = [];
    let currentMessage: Message | null = null;

    memory.split('\n\n')
      .filter(block => block.trim())
      .forEach(block => {
        const colonIndex = block.indexOf(': ');
        if (colonIndex === -1) {
          // If there's no colon and we have a current message, treat this as a continuation
          if (currentMessage) {
            currentMessage.content += '\n\n' + block;
          }
          return;
        }
        
        const role = block.substring(0, colonIndex).toLowerCase();
        const content = block.substring(colonIndex + 2);
        
        if (role === 'user' || role === 'assistant' || role === 'a') {
          currentMessage = {
            role: role === 'a' ? 'assistant' : role as 'user' | 'assistant',
            content,
            timestamp: Date.now(),
          };
          messages.push(currentMessage);
        }
      });

    return messages;
  } catch (error) {
    console.error('Error parsing memory:', error);
    return [];
  }
};

export const ChatContainer = ({ memory, messages, onMessagesChange }: ChatContainerProps) => {
  const getMessagesForApi = (newMessage: Message): Message[] => {
    const memoryMessages = parseMemoryToMessages(memory);
    return [...memoryMessages, newMessage];
  };

  return (
    <BaseChatContainer
      messages={messages}
      onMessagesChange={onMessagesChange}
      getMessagesForApi={getMessagesForApi}
      className="flex-1 flex flex-col overflow-hidden"
    />
  );
}; 