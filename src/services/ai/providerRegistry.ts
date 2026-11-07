import { AiModelProvider } from './types';
import { AnthropicClaudeProvider } from './anthropicProvider';
import { OpenAiModelProvider } from './openAIProvider';
import { MockSalesAssistantProvider } from './mockProvider';
import { clientEnv } from '../../config/env';

class AiProviderRegistry {
  private providers: Map<string, AiModelProvider> = new Map();

  constructor() {
    this.register(new MockSalesAssistantProvider());
    this.register(new AnthropicClaudeProvider());
    this.register(new OpenAiModelProvider());
  }

  public register(provider: AiModelProvider) {
    this.providers.set(provider.id, provider);
  }

  public getActiveProvider(): AiModelProvider {
    const configuredId = clientEnv.aiProvider;
    const provider = this.providers.get(configuredId);

    // Si el proveedor configurado está disponible con sus claves de servidor, usarlo
    if (provider && provider.isAvailable()) {
      return provider;
    }

    // De lo contrario, retornar de forma transparente y segura el adaptador Mock identificado
    return this.providers.get('mock')!;
  }

  public getAvailableProviders(): { id: string; name: string; isAvailable: boolean }[] {
    return Array.from(this.providers.values()).map((p) => ({
      id: p.id,
      name: p.name,
      isAvailable: p.isAvailable(),
    }));
  }
}

export const aiRegistry = new AiProviderRegistry();
