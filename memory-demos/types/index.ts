export type Role = 'system' | 'user' | 'assistant';

export type Message = {
  role: Role;
  content: string;
  timestamp?: number; // Optional, useful for demo purposes
};

export type MemoryState = {
  enabled: boolean;
  paused: boolean;
  messages: Message[];
};

// For the Observable Memory Demo
export type ApiPayload = {
  systemMessage: Message;
  memoryMessages: Message[];
  currentMessage: Message;
};

// For the Editable Memory Demo
export type EditableMemory = {
  rawText: string;
  parsed: Message[];
};

// For the Context Window Demo
export type TokenCount = {
  total: number;
  limit: number;
};

export type ContextWindowState = {
  content: string;
  tokenCount: TokenCount;
};

// For the Summary Memory Demo
export type SummaryPoint = {
  id: string;
  content: string;
  lastUpdated: number;
};

export type SummaryState = {
  points: SummaryPoint[];
  lastSummarized: number;
};

// Shared control states
export type MemoryControls = {
  isEnabled: boolean;
  isPaused: boolean;
  onToggleMemory: () => void;
  onTogglePause: () => void;
  onClear: () => void;
};
