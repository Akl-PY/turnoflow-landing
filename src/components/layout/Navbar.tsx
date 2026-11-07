import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react-native';
import { theme } from '../../styles/theme';
import { siteConfig } from '../../config/site';
import { Container } from './Container';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Recurso Gratis (15 Respuestas)', path: '/free-guide' },
    { label: 'Propuesta Comercial', path: '/sales' },
  ];

  const handleNavigate = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path as any);
  };

  return (
    <View style={styles.headerWrapper}>
      <Container>
        <View style={styles.navbar}>
          {/* Logo Brand */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleNavigate('/')}
            style={styles.brand}
          >
            <View style={styles.logoIcon}>
              <Sparkles size={18} color="#FFFFFF" />
            </View>
            <View style={styles.brandTextContainer}>
              <Text style={styles.brandName}>{siteConfig.name}</Text>
              <View style={styles.brandBadge}>
                <Text style={styles.brandBadgeText}>24/7</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Desktop Navigation Links */}
          {isDesktop ? (
            <View style={styles.desktopLinks}>
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <TouchableOpacity
                    key={link.path}
                    activeOpacity={0.7}
                    onPress={() => handleNavigate(link.path)}
                    style={[styles.navItem, isActive && styles.navItemActive]}
                  >
                    <Text style={[styles.navText, isActive && styles.navTextActive]}>
                      {link.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}

          {/* CTA & Mobile Toggle */}
          <View style={styles.actions}>
            {isDesktop ? (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleNavigate('/checkout')}
                style={styles.ctaButton}
              >
                <Text style={styles.ctaButtonText}>Comenzar ahora</Text>
                <ArrowRight size={15} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={styles.mobileToggle}
              >
                {mobileMenuOpen ? <X size={24} color={theme.colors.textPrimary} /> : <Menu size={24} color={theme.colors.textPrimary} />}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Mobile Dropdown */}
        {!isDesktop && mobileMenuOpen && (
          <View style={styles.mobileMenu}>
            {navLinks.map((link) => (
              <TouchableOpacity
                key={link.path}
                onPress={() => handleNavigate(link.path)}
                style={styles.mobileMenuItem}
              >
                <Text style={styles.mobileMenuText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => handleNavigate('/checkout')}
              style={styles.mobileCtaButton}
            >
              <Text style={styles.mobileCtaText}>Quiero automatizar mi negocio</Text>
            </TouchableOpacity>
          </View>
        )}
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    position: 'relative' as any,
    zIndex: 50,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 72,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  brandTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandName: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    letterSpacing: -0.4,
  },
  brandBadge: {
    backgroundColor: theme.colors.accentSubtle,
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: theme.radius.full,
  },
  brandBadgeText: {
    fontSize: 10,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.accentDark,
    fontFamily: theme.typography.fontDisplay,
  },
  desktopLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
  },
  navItem: {
    paddingVertical: 6,
  },
  navItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.accent,
  },
  navText: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontDisplay,
  },
  navTextActive: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weight.bold,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    gap: 8,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.semibold,
    fontFamily: theme.typography.fontDisplay,
  },
  mobileToggle: {
    padding: 8,
  },
  mobileMenu: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    gap: 12,
  },
  mobileMenuItem: {
    paddingVertical: 10,
  },
  mobileMenuText: {
    fontSize: theme.typography.size.base,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weight.medium,
  },
  mobileCtaButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: 8,
  },
  mobileCtaText: {
    color: '#FFFFFF',
    fontWeight: theme.typography.weight.semibold,
    fontSize: theme.typography.size.sm,
  },
});
