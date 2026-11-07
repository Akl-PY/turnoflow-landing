import { Platform } from 'react-native';
import { LeadCaptureInput } from '../../validations/schemas';
import { analytics } from '../analytics/analyticsService';

export interface StoredLead extends LeadCaptureInput {
  id: string;
  createdAt: string;
  source: string;
  isExisting: boolean;
}

const STORAGE_KEY = 'turnoflow_registered_leads';

class LeadStorageService {
  private inMemoryLeads: Map<string, StoredLead> = new Map();

  constructor() {
    this.hydrate();
  }

  private hydrate() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: StoredLead[] = JSON.parse(raw);
          parsed.forEach((item) => this.inMemoryLeads.set(item.email.toLowerCase(), item));
        }
      } catch (err) {
        console.warn('Could not hydrate stored leads:', err);
      }
    }
  }

  private persist() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const list = Array.from(this.inMemoryLeads.values());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (err) {
        console.warn('Could not persist leads:', err);
      }
    }
  }

  /**
   * Registra un lead nuevo o recupera el existente sin duplicación.
   */
  public async registerLead(input: LeadCaptureInput, source: string = 'lead-magnet'): Promise<{
    lead: StoredLead;
    isDuplicate: boolean;
  }> {
    const emailKey = input.email.trim().toLowerCase();
    const existing = this.inMemoryLeads.get(emailKey);

    if (existing) {
      // Registrar evento analítico indicando lead ya existente
      analytics.track('lead_captured', {
        leadEmail: emailKey,
        leadType: input.businessType,
        isReturning: true,
        source,
      });

      return {
        lead: { ...existing, isExisting: true },
        isDuplicate: true,
      };
    }

    const newLead: StoredLead = {
      ...input,
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      source,
      isExisting: false,
    };

    this.inMemoryLeads.set(emailKey, newLead);
    this.persist();

    // Evento de conversión
    analytics.track('lead_captured', {
      leadEmail: emailKey,
      leadType: input.businessType,
      isReturning: false,
      source,
    });

    return {
      lead: newLead,
      isDuplicate: false,
    };
  }

  public getLeadByEmail(email: string): StoredLead | undefined {
    return this.inMemoryLeads.get(email.trim().toLowerCase());
  }

  public getAllLeads(): StoredLead[] {
    return Array.from(this.inMemoryLeads.values());
  }
}

export const leadStorage = new LeadStorageService();
