import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HeroSection } from '../src/components/landing/HeroSection';
import { ProblemSection } from '../src/components/landing/ProblemSection';
import { LateCostSection } from '../src/components/landing/LateCostSection';
import { ValuePropSection } from '../src/components/landing/ValuePropSection';
import { InteractiveDemoSection } from '../src/components/landing/InteractiveDemoSection';
import { HowItWorksSection } from '../src/components/landing/HowItWorksSection';
import { FeaturesSection } from '../src/components/landing/FeaturesSection';
import { PackageIncludesSection } from '../src/components/landing/PackageIncludesSection';
import { TargetAudienceSection } from '../src/components/landing/TargetAudienceSection';
import { PricingSection } from '../src/components/landing/PricingSection';
import { FaqSection } from '../src/components/landing/FaqSection';
import { CtaSection } from '../src/components/landing/CtaSection';

export default function IndexPage() {
  return (
    <View style={styles.container}>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Problemas habituales del negocio */}
      <ProblemSection />

      {/* 3. Costos de no atender consultas oportunamente */}
      <LateCostSection />

      {/* 4. Presentación de TurnoFlow AI */}
      <ValuePropSection />

      {/* 5. Demostración interactiva de WhatsApp */}
      <InteractiveDemoSection />

      {/* 6. Cómo funciona en tres pasos */}
      <HowItWorksSection />

      {/* 7. Funcionalidades */}
      <FeaturesSection />

      {/* 8. Qué incluye el producto */}
      <PackageIncludesSection />

      {/* 9. Para quién es y para quién no */}
      <TargetAudienceSection />

      {/* 10. Precio */}
      <PricingSection />

      {/* 11. Preguntas frecuentes */}
      <FaqSection />

      {/* 12. CTA final */}
      <CtaSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
