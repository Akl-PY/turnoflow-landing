export type AiRole = 'system' | 'user' | 'assistant' | 'tool';

export interface ChatMessage {
  id: string;
  role: AiRole;
  content: string;
  toolCalls?: ToolCall[];
  toolResult?: ToolResult;
  timestamp: number;
}

export interface ToolCall {
  id: string;
  name: string;
  parameters: Record<string, any>;
}

export interface ToolResult {
  toolCallId: string;
  name: string;
  result: any;
  error?: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description: string; enum?: string[] }>;
    required: string[];
  };
}

export interface AiCompletionRequest {
  messages: ChatMessage[];
  systemPrompt?: string;
  tools?: ToolDefinition[];
  temperature?: number;
  maxTokens?: number;
}

export interface AiCompletionResponse {
  content: string;
  toolCalls?: ToolCall[];
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  isMock?: boolean;
}

export interface AiModelProvider {
  id: string;
  name: string;
  isAvailable(): boolean;
  complete(request: AiCompletionRequest): Promise<AiCompletionResponse>;
}
