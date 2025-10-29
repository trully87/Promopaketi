import Hero from '../Hero';
import { LanguageProvider } from '@/lib/i18n';

export default function HeroExample() {
  return (
    <LanguageProvider>
      <Hero />
    </LanguageProvider>
  );
}
