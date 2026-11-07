import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Bot, User, Wrench } from 'lucide-react-native';
import { ChatMessage } from '../../services/ai/types';
import { theme } from '../../styles/theme';

export interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.container, isUser ? styles.containerUser : styles.containerAssistant]}>
      {/* Bot avatar on left */}
      {!isUser && (
        <View style={[styles.avatar, styles.avatarAssistant]}>
          <Bot size={14} color="#FFFFFF" />
        </View>
      )}

      <View style={[styles.bubbleWrapper, isUser && styles.bubbleWrapperUser]}>
        {/* Tool execution badge if present */}
        {message.toolCalls && message.toolCalls.length > 0 ? (
          <View style={styles.toolBadgeContainer}>
            {message.toolCalls.map((tc) => (
              <View key={tc.id} style={styles.toolBadge}>
                <Wrench size={10} color={theme.colors.accentDark} />
                <Text style={styles.toolBadgeText}>Herramienta: {tc.name}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Message Content */}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
          <Text style={[styles.messageText, isUser ? styles.messageTextUser : styles.messageTextAssistant]}>
            {message.content}
          </Text>
        </View>

        {/* Time */}
        <Text style={[styles.timestamp, isUser && styles.timestampUser]}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      {/* User avatar on right */}
      {isUser && (
        <View style={[styles.avatar, styles.avatarUser]}>
          <User size={13} color="#FFFFFF" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: theme.spacing[3],
    alignItems: 'flex-end',
    gap: 8,
  },
  containerUser: {
    justifyContent: 'flex-end',
  },
  containerAssistant: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarUser: {
    backgroundColor: theme.colors.primary,
  },
  avatarAssistant: {
    backgroundColor: theme.colors.accent,
  },
  bubbleWrapper: {
    maxWidth: '82%',
    flexDirection: 'column',
  },
  bubbleWrapperUser: {
    alignItems: 'flex-end',
  },
  toolBadgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 4,
  },
  toolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.accentSubtle,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
  },
  toolBadgeText: {
    fontSize: 10,
    color: '#065F46',
    fontWeight: theme.typography.weight.medium,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.lg,
  },
  bubbleUser: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderBottomLeftRadius: 4,
    ...theme.shadows.subtle,
  },
  messageText: {
    fontSize: 13.5,
    lineHeight: 19,
    fontFamily: theme.typography.fontDisplay,
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  messageTextAssistant: {
    color: theme.colors.textPrimary,
  },
  timestamp: {
    fontSize: 10,
    color: theme.colors.textLight,
    marginTop: 2,
    marginLeft: 4,
  },
  timestampUser: {
    marginRight: 4,
  },
});
