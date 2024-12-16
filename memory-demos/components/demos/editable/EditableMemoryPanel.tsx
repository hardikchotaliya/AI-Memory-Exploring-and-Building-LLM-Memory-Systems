import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface EditableMemoryPanelProps {
  memory: string;
  onMemoryChange: (memory: string) => void;
}

export const EditableMemoryPanel = ({
  memory,
  onMemoryChange,
}: EditableMemoryPanelProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMemory, setEditedMemory] = useState(memory);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);

  // Focus textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  // Auto-scroll effect for both edit and view modes
  useEffect(() => {
    const scrollToBottom = () => {
      if (isEditing && textareaRef.current) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      } else if (!isEditing && viewRef.current) {
        viewRef.current.scrollTop = viewRef.current.scrollHeight;
      }
    };

    // Use requestAnimationFrame to ensure the DOM has updated
    requestAnimationFrame(scrollToBottom);
  }, [memory, editedMemory, isEditing]);

  const handleEdit = () => {
    setEditedMemory(memory);
    setIsEditing(true);
  };

  const handleSave = () => {
    onMemoryChange(editedMemory);
    setIsEditing(false);
  };

  return (
    <Card className={cn(
      "flex h-full flex-col transition-colors",
      isEditing && "border-orange-500 bg-orange-50/50"
    )}>
      <CardHeader className={cn(
        "flex flex-row items-center justify-between transition-colors shrink-0",
        isEditing && "bg-orange-100/50"
      )}>
        <div className="flex items-center gap-2">
          <CardTitle>Memory Editor</CardTitle>
          {isEditing && (
            <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
              Editing
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Memory
            </Button>
          ) : (
            <Button onClick={handleSave} variant="default" size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Memory
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-0">
        {isEditing ? (
          <div className="h-full p-4">
            <Textarea
              ref={textareaRef}
              value={editedMemory}
              onChange={(e) => setEditedMemory(e.target.value)}
              className={cn(
                "h-full min-h-0 font-mono transition-colors whitespace-pre-wrap resize-none",
                "bg-white"
              )}
              placeholder="Memory content will appear here. Click Edit to modify it."
            />
          </div>
        ) : (
          <div 
            ref={viewRef}
            className={cn(
              "h-full min-h-0 overflow-auto p-4"
            )}
          >
            <div className="rounded-md border bg-muted p-3">
              <ReactMarkdown
                className="prose prose-sm max-w-none dark:prose-invert"
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {memory || "Memory content will appear here. Click Edit to modify it."}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 