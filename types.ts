
export enum TaskPriority {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
  priority: TaskPriority;
  dueDate?: string; // YYYY-MM-DD format
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export enum ViewMode {
  Dashboard = 'DASHBOARD',
  Tasks = 'TASKS',
  AIAssistant = 'AI_ASSISTANT',
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: GroundingChunkWeb;
}

export interface SuggestedTask {
  title: string;
  description: string;
}
