import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Slot, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from '../src/components/layout/Navbar';
import { Footer } from '../src/components/layout/Footer';
import { ChatWidget } from '../src/components/ai-agent/ChatWidget';
import { CookieConsentBanner } from '../src/components/analytics/CookieConsentBanner';
import { analytics } from '../src/services/analytics/analyticsService';

const queryClient = new QueryClient();

export default function RootLayout() {
  const pathname = usePathname();

  React.useEffect(() => {
    analytics.track('page_view', { route: pathname });
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.rootContainer}>
        <StatusBar style="dark" />
        <Navbar />
        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
          <Slot />
          <Footer />
        </ScrollView>
        {/* Persistent Floating AI Sales Assistant Widget */}
        <ChatWidget />
        {/* Privacy Cookie Banner */}
        <CookieConsentBanner />
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    minHeight: '100vh' as any,
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    flexGrow: 1,
  },
});
