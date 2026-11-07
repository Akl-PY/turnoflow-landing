import { AiCompletionRequest, AiCompletionResponse, AiModelProvider, ToolCall } from './types';
import { getServerEnv, clientEnv } from '../../config/env';

export class OpenAiModelProvider implements AiModelProvider {
  public id = 'openai';
  public name = 'OpenAI API';

  public isAvailable(): boolean {
    const { openaiApiKey } = getServerEnv();
    return Boolean(openaiApiKey && openaiApiKey.startsWith('sk-'));
  }

  public async complete(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    const { openaiApiKey } = getServerEnv();

    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY no configurada en las variables de servidor.');
    }

    const modelName = clientEnv.aiModel || 'gpt-4o-mini';

    const openAiTools = request.tools?.map((tool) => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      },
    }));

    const messages = [
      ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
      ...request.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const body: Record<string, any> = {
      model: modelName,
      messages,
      temperature: request.temperature ?? 0.3,
      max_tokens: request.maxTokens || 1024,
    };

    if (openAiTools && openAiTools.length > 0) {
      body.tools = openAiTools;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Error comunicando con OpenAI API.');
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    const message = choice?.message;

    const toolCalls: ToolCall[] = [];
    if (message?.tool_calls) {
      for (const tc of message.tool_calls) {
        toolCalls.push({
          id: tc.id,
          name: tc.function.name,
          parameters: JSON.parse(tc.function.arguments || '{}'),
        });
      }
    }

    return {
      content: message?.content || '',
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
    };
  }
}
