"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Message } from "@/types/chat";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EditMemoryDialogProps {
  messages: Message[];
  onUpdateMemory: (messages: Message[]) => void;
}

export function EditMemoryDialog({
  messages,
  onUpdateMemory,
}: EditMemoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editedMemory, setEditedMemory] = useState("");

  const formatMessages = (msgs: Message[]): string => {
    return msgs
      .map((msg) => {
        // Convert role to display name
        const displayRole =
          msg.role === "assistant"
            ? "Assistant"
            : msg.role === "user"
            ? "User"
            : "System";
        return `${displayRole} {\n${msg.content}\n}`;
      })
      .join("\n\n");
  };

  const parseMessages = (text: string): Message[] => {
    // Split by message blocks
    const messageBlocks = text
      .split(/(?:Assistant|User|System)\s*\{/)
      .slice(1) // Remove the first empty split
      .map((block) => block.split(/\}/)[0]) // Take content before closing brace
      .map((block) => block.trim())
      .filter((block) => block);

    // Get role from what precedes each block
    const roles = text.match(/(?:Assistant|User|System)\s*\{/g) || [];
    const normalizedRoles = roles.map((role) =>
      role.trim().toLowerCase().startsWith("assistant")
        ? "assistant"
        : role.trim().toLowerCase().startsWith("user")
        ? "user"
        : "system"
    );

    if (messageBlocks.length !== normalizedRoles.length) {
      throw new Error('Invalid format. Each message must start with "Role {"');
    }

    return messageBlocks.map((block, index) => ({
      role: normalizedRoles[index] as "user" | "assistant" | "system",
      content: block.trim(),
      timestamp: new Date().toISOString(),
    }));
  };

  const handleOpen = () => {
    setEditedMemory(formatMessages(messages));
    setIsOpen(true);
  };

  const handleSave = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    const newMessages = parseMessages(editedMemory);
    onUpdateMemory(newMessages);
    setShowConfirm(false);
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            onClick={handleOpen}
            className="absolute top-4 right-4"
          >
            Edit Memory
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Chat Memory</DialogTitle>
            <DialogDescription>
              Edit the chat memory below. Format should be &quot;Role{" "}
              {" followed by the message content and "}&quot; with blank lines
              between messages.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editedMemory}
            onChange={(e) => setEditedMemory(e.target.value)}
            className="min-h-[300px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save edited memory</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will override the current memory of the chat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
