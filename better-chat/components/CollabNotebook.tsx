'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface CollabSpaceProps {
  content: string;
  onUpdate: (content: string) => void;
  messages?: Array<{ role: string; content: string }>;
  getSummaryFromAI: (content: string) => Promise<string | null>;
}

export function CollabNotebook({
  content,
  onUpdate,
  messages = [],
  getSummaryFromAI
}: CollabSpaceProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [collabInput, setCollabInput] = useState(content);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSaveCollabSpace = () => {
    onUpdate(collabInput);
    setIsEditing(false);
    toast({
      title: "Collab Notebook Updated",
      description: "Your changes have been saved.",
    });
  };

  const handleAIAddition = async () => {
    // Get the last assistant message
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
    if (!lastAssistantMessage) return;

    setIsProcessing(true);
    try {
      // Ask the AI to create a concise, noteworthy point from its last message
      const prompt = `Please review this message and create a single, concise bullet point that captures the most important or noteworthy information. The bullet point should:
- Be clear and standalone (understandable without context)
- Focus on technical details, solutions, or key insights
- Be written in a neutral, documentation-style tone
- Not include any conversational phrases or meta-references
- Be under 120 characters if possible

Message to summarize:
${lastAssistantMessage.content}`;

      const summary = await getSummaryFromAI(prompt);
      
      if (summary) {
        const newItem = `- ${summary.trim()}\n`;
        const updatedContent = content ? `${content}\n${newItem}` : newItem;
        onUpdate(updatedContent);
        setCollabInput(updatedContent);
        toast({
          title: "Added to Notebook",
          description: "Added a summary of the AI's response.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-80 border-l border-gray-200 dark:border-gray-800">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Collab Notebook</h2>
          <div className="flex gap-2">
            {!isEditing && (
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={handleAIAddition}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Add AI Note"}
              </Button>
            )}
            {isEditing ? (
              <Button size="sm" onClick={handleSaveCollabSpace}>
                Save
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
        </div>
        {isEditing ? (
          <Textarea
            value={collabInput}
            onChange={(e) => setCollabInput(e.target.value)}
            className="w-full h-[calc(100vh-8rem)] font-mono text-sm resize-none focus:ring-2"
            placeholder="Start typing your notes here..."
          />
        ) : (
          <div
            className="w-full h-[calc(100vh-8rem)] overflow-auto p-4 rounded-md border border-gray-200 dark:border-gray-800 cursor-text bg-white dark:bg-gray-950 whitespace-pre-wrap font-mono text-sm hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
            onClick={() => {
              setIsEditing(true);
              setCollabInput(content);
            }}
          >
            {content || 'Click here to start taking notes...'}
          </div>
        )}
      </div>
    </div>
  );
} 