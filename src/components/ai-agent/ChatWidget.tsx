import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { MessageSquare, X, Send, Sparkles, RefreshCw, Bot } from 'lucide-react-native';
import { salesAssistant } from '../../services/ai/salesAssistantService';
import { ChatMessage } from '../../services/ai/types';
import { aiRegistry } from '../../services/ai/providerRegistry';
import { analytics } from '../../services/analytics/analyticsService';
import { theme } from '../../styles/theme';
import { ChatMessageBubble } from './ChatMessageBubble';
import { QuickSuggestions } from './QuickSuggestions';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => salesAssistant.getMessages());
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<any>(null);
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  const activeProvider = aiRegistry.getActiveProvider();

  useEffect(() => {
    if (isOpen) {
      analytics.track('agent_opened');
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd?.({ animated: true });
      }, 100);
    }
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setInputText('');
    setIsLoading(true);

    try {
      await salesAssistant.sendMessage(text);
      setMessages([...salesAssistant.getMessages()]);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd?.({ animated: true });
      }, 100);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    salesAssistant.resetConversation();
    setMessages([...salesAssistant.getMessages()]);
  };

  return (
    <View style={styles.container}>
      {/* Expanded Chat Box */}
      {isOpen ? (
        <View style={[styles.chatBox, isMobile ? styles.chatBoxMobile : styles.chatBoxDesktop]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <View style={styles.headerAvatar}>
                <Bot size={18} color="#FFFFFF" />
                <View style={styles.onlineDot} />
              </View>
              <View>
                <View style={styles.headerTitleRow}>
                  <Text style={styles.headerTitle}>TurnoFlow Assistant</Text>
                  <Sparkles size={13} color={theme.colors.accent} />
                </View>
                <Text style={styles.headerSubtitle}>
                  {activeProvider.id === 'mock'
                    ? 'Simulador Comercial Activo'
                    : `Conectado a ${activeProvider.name}`}
                </Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleReset}
                accessibilityLabel="Reiniciar conversación"
                style={styles.iconBtn}
              >
                <RefreshCw size={15} color={theme.colors.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsOpen(false)}
                accessibilityLabel="Cerrar chat"
                style={styles.iconBtn}
              >
                <X size={18} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages Scroll Area */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd?.({ animated: true })}
          >
            {messages.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <View style={styles.loadingBubble}>
                <ActivityIndicator size="small" color={theme.colors.accent} />
                <Text style={styles.loadingText}>TurnoFlow está analizando...</Text>
              </View>
            )}
          </ScrollView>

          {/* Quick Suggestions Chips */}
          <QuickSuggestions onSelect={(q) => handleSend(q)} disabled={isLoading} />

          {/* Input Footer */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Escribí tu consulta sobre TurnoFlow..."
              placeholderTextColor={theme.colors.textLight}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSend()}
              style={styles.input}
              returnKeyType="send"
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSend()}
              disabled={isLoading || !inputText.trim()}
              style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            >
              <Send size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* Floating Launcher Button */
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setIsOpen(true)}
          style={styles.floatingButton}
        >
          <View style={styles.floatingIconWrapper}>
            <MessageSquare size={24} color="#FFFFFF" />
            <View style={styles.floatingBadge} />
          </View>
          <View style={styles.floatingLabelContainer}>
            <Text style={styles.floatingLabelText}>¿Dudas? Hablá con TurnoFlow</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute' as any,
    bottom: 24,
    right: 24,
    zIndex: 9990,
  },
  floatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingVertical: 10,
    paddingHorizontal: 16,
    ...theme.shadows.floating,
    gap: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  floatingIconWrapper: {
    position: 'relative',
  },
  floatingBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.accent,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  floatingLabelContainer: {
    display: 'flex',
  },
  floatingLabelText: {
    color: '#FFFFFF',
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.semibold,
    fontFamily: theme.typography.fontDisplay,
  },
  chatBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.floating,
    flexDirection: 'column',
  },
  chatBoxDesktop: {
    width: 380,
    height: 540,
  },
  chatBoxMobile: {
    width: '92vw' as any,
    height: '80vh' as any,
    maxWidth: 380,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: theme.colors.surfaceDark,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceDarkBorder,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#34D399',
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceDark,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.bold,
    color: '#FFFFFF',
    fontFamily: theme.typography.fontDisplay,
  },
  headerSubtitle: {
    fontSize: 11,
    color: theme.colors.textLight,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 6,
    borderRadius: theme.radius.sm,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  messagesContent: {
    padding: 16,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.md,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  loadingText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontDisplay,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.full,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 13.5,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});
