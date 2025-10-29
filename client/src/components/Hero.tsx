import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import type { HeroSlide } from '@shared/schema';
import heroImage1 from '@assets/generated_images/Hero_luxury_gift_packages_ecdca547.png';
import heroImage2 from '@assets/generated_images/Luxury_gift_boxes_marble_7e7fe90d.png';
import heroImage3 from '@assets/generated_images/Executive_corporate_hamper_desk_74479cd4.png';
import heroImage4 from '@assets/generated_images/New_Year_luxury_collection_fdd3c4e8.png';
import heroImage5 from '@assets/generated_images/Eco_corporate_products_wood_533f2d6b.png';

// Fallback images if no slides in database
const fallbackImages = [heroImage1, heroImage2, heroImage3, heroImage4, heroImage5];

export default function Hero() {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Load hero slides from database
  const { data: slides = [] } = useQuery<HeroSlide[]>({
    queryKey: ["/api/hero-slides"],
  });

  // Use database slides if available, otherwise fallback
  const hasSlides = slides.length > 0;
  const totalSlides = hasSlides ? slides.length : fallbackImages.length;

  // Auto-advance slides every 5 seconds (unless paused)
  useEffect(() => {
    if (isPaused || totalSlides === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, currentSlide, totalSlides]);

  const scrollToPackages = () => {
    document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToPrevious = () => {
    setIsPaused(true);
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    setTimeout(() => setIsPaused(false), 5000); // Resume after 5 seconds
  };

  const goToNext = () => {
    setIsPaused(true);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsPaused(false), 5000); // Resume after 5 seconds
  };

  const goToSlide = (index: number) => {
    setIsPaused(true);
    setCurrentSlide(index);
    setTimeout(() => setIsPaused(false), 5000); // Resume after 5 seconds
  };

  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden group">
      {/* Slider Images */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 transition-opacity duration-1000">
          <img 
            src={hasSlides ? slides[currentSlide].image : fallbackImages[currentSlide]} 
            alt={hasSlides ? (language === 'me' ? slides[currentSlide].titleME : slides[currentSlide].titleEN) : `Luxury gift packages ${currentSlide + 1}`}
            className="w-full h-full object-cover"
            data-testid={`img-hero-slide-${currentSlide}`}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3"
        data-testid="button-hero-prev"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3"
        data-testid="button-hero-next"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? 'true' : 'false'}
            className={`transition-all ${
              index === currentSlide 
                ? 'w-8 h-2 bg-white' 
                : 'w-2 h-2 bg-white/50 hover:bg-white/75'
            } rounded-full`}
            data-testid={`button-hero-dot-${index}`}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
          {hasSlides ? (language === 'me' ? slides[currentSlide].titleME : slides[currentSlide].titleEN) : t('hero.title')}
        </h1>
        <p className="text-xl sm:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
          {hasSlides ? (language === 'me' ? slides[currentSlide].subtitleME : slides[currentSlide].subtitleEN) : t('hero.subtitle')}
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

      {/* Scroll Indicator */}
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
