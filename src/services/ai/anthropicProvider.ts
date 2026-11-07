import { AiCompletionRequest, AiCompletionResponse, AiModelProvider, ToolCall } from './types';
import { getServerEnv, clientEnv } from '../../config/env';

export class AnthropicClaudeProvider implements AiModelProvider {
  public id = 'anthropic';
  public name = 'Anthropic Claude';

  public isAvailable(): boolean {
    const { anthropicApiKey } = getServerEnv();
    return Boolean(anthropicApiKey && anthropicApiKey.startsWith('sk-ant-'));
  }

  public async complete(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    const { anthropicApiKey } = getServerEnv();

    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY no está configurada en las variables de servidor.');
    }

    const modelName = clientEnv.aiModel || 'claude-3-5-sonnet-20241022';

    // Formatear tools para Anthropic Messages API
    const anthropicTools = request.tools?.map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.parameters,
    }));

    // Formatear mensajes
    const anthropicMessages = request.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));

    const body: Record<string, any> = {
      model: modelName,
      max_tokens: request.maxTokens || 1024,
      system: request.systemPrompt,
      messages: anthropicMessages,
    };

    if (anthropicTools && anthropicTools.length > 0) {
      body.tools = anthropicTools;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Error comunicando con Anthropic API.');
    }

    const data = await response.json();
    let textContent = '';
    const toolCalls: ToolCall[] = [];

    if (Array.isArray(data.content)) {
      for (const block of data.content) {
        if (block.type === 'text') {
          textContent += block.text;
        } else if (block.type === 'tool_use') {
          toolCalls.push({
            id: block.id,
            name: block.name,
            parameters: block.input || {},
          });
        }
      }
    }

    return {
      content: textContent,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
    };
  }
}
