import { Platform } from 'react-native';
import { clientEnv } from '../../config/env';

export type AnalyticsEventType =
  | 'page_view'
  | 'lead_magnet_view'
  | 'lead_captured'
  | 'sales_page_view'
  | 'cta_clicked'
  | 'checkout_started'
  | 'purchase_completed'
  | 'agent_opened'
  | 'agent_conversation_started'
  | 'agent_lead_captured';

export interface AnalyticsEventPayload {
  route?: string;
  ctaText?: string;
  leadEmail?: string;
  leadType?: string;
  orderId?: string;
  amount?: number;
  currency?: string;
  items?: string[];
  [key: string]: any;
}

class AnalyticsService {
  private hasConsent: boolean = true;
  private eventHistory: { event: AnalyticsEventType; payload?: AnalyticsEventPayload; timestamp: number }[] = [];

  constructor() {
    this.checkConsent();
    this.initProviders();
  }

  private checkConsent() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const stored = localStorage.getItem('turnoflow_cookie_consent');
      if (stored !== null) {
        this.hasConsent = stored === 'accepted';
      }
    }
  }

  public setConsent(granted: boolean) {
    this.hasConsent = granted;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      localStorage.setItem('turnoflow_cookie_consent', granted ? 'accepted' : 'rejected');
    }
  }

  public getConsent(): boolean {
    return this.hasConsent;
  }

  private initProviders() {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    // Google Analytics 4 (if configured)
    if (clientEnv.googleAnalyticsId && this.hasConsent) {
      try {
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${clientEnv.googleAnalyticsId}`;
        document.head.appendChild(gaScript);

        const inlineGa = document.createElement('script');
        inlineGa.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${clientEnv.googleAnalyticsId}', { send_page_view: false });
        `;
        document.head.appendChild(inlineGa);
      } catch (err) {
        console.warn('Could not initialize Google Analytics:', err);
      }
    }

    // Meta Pixel (if configured)
    if (clientEnv.metaPixelId && this.hasConsent) {
      try {
        const metaScript = document.createElement('script');
        metaScript.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${clientEnv.metaPixelId}');
        `;
        document.head.appendChild(metaScript);
      } catch (err) {
        console.warn('Could not initialize Meta Pixel:', err);
      }
    }
  }

  public track(event: AnalyticsEventType, payload?: AnalyticsEventPayload) {
    if (!this.hasConsent) return;

    const record = {
      event,
      payload,
      timestamp: Date.now(),
    };
    this.eventHistory.push(record);

    if (__DEV__) {
      console.log(`[Analytics Event] ${event}`, payload || {});
    }

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // Dispatch to Google Analytics
      if ((window as any).gtag && clientEnv.googleAnalyticsId) {
        (window as any).gtag('event', event, payload);
      }

      // Dispatch to Meta Pixel
      if ((window as any).fbq && clientEnv.metaPixelId) {
        const standardMetaEvent = this.mapToMetaPixelEvent(event);
        if (standardMetaEvent) {
          (window as any).fbq('track', standardMetaEvent, payload);
        } else {
          (window as any).fbq('trackCustom', event, payload);
        }
      }
    }
  }

  private mapToMetaPixelEvent(event: AnalyticsEventType): string | null {
    switch (event) {
      case 'page_view':
        return 'PageView';
      case 'lead_captured':
        return 'Lead';
      case 'checkout_started':
        return 'InitiateCheckout';
      case 'purchase_completed':
        return 'Purchase';
      default:
        return null;
    }
  }

  public getHistory() {
    return [...this.eventHistory];
  }
}

export const analytics = new AnalyticsService();
