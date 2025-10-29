import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import heroImage from '@assets/generated_images/Hero_luxury_gift_packages_ecdca547.png';

export default function Hero() {
  const { t } = useLanguage();

  const scrollToPackages = () => {
    document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Luxury gift packages" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
          {t('hero.title')}
        </h1>
        <p className="text-xl sm:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="min-w-[200px]"
            onClick={scrollToPackages}
            data-testid="button-view-packages"
          >
            {t('hero.cta.view')}
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="min-w-[200px] bg-background/10 backdrop-blur-sm border-white/30 text-white hover:bg-background/20"
            onClick={scrollToContact}
            data-testid="button-contact-hero"
          >
            {t('hero.cta.contact')}
          </Button>
        </div>
      </div>

      <button
        onClick={scrollToPackages}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce"
        data-testid="button-scroll-indicator"
      >
        <ChevronDown className="w-8 h-8 text-white/80" />
      </button>
    </section>
  );
}
