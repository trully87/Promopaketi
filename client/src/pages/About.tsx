import { useLanguage } from '@/lib/i18n';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Target, Handshake, Award } from 'lucide-react';
import MetaTags from '@/components/MetaTags';

export default function About() {
  const { t, language } = useLanguage();

  const stats = [
    {
      value: '500+',
      label: t('about.stats.clients'),
    },
    {
      value: '2,000+',
      label: t('about.stats.packages'),
    },
    {
      value: '15+',
      label: t('about.stats.experience'),
    },
    {
      value: '99%',
      label: t('about.stats.satisfaction'),
    },
  ];

  const values = [
    {
      icon: Award,
      title: t('about.value.quality.title'),
      description: t('about.value.quality.desc'),
      color: 'text-amber-600',
    },
    {
      icon: Sparkles,
      title: t('about.value.innovation.title'),
      description: t('about.value.innovation.desc'),
      color: 'text-blue-600',
    },
    {
      icon: Handshake,
      title: t('about.value.partnership.title'),
      description: t('about.value.partnership.desc'),
      color: 'text-emerald-600',
    },
    {
      icon: Target,
      title: t('about.value.excellence.title'),
      description: t('about.value.excellence.desc'),
      color: 'text-primary',
    },
  ];

  const aboutSEO = {
    title: language === 'me' ? 'O Nama | Brain Box' : 'About Us | Brain Box',
    description: language === 'me'
      ? 'Vaš pouzdani partner za end-to-end rješenja poslovnih poklona. Saznajte više o našoj misiji, vrijednostima i pristupu.'
      : 'Your trusted partner for end-to-end business gift solutions. Learn more about our mission, values and approach.',
    keywords: language === 'me'
      ? ['o nama', 'brain box', 'premium pokloni', 'korporativni', 'vrijednosti', 'partnerstvo']
      : ['about us', 'brain box', 'premium gifts', 'corporate', 'values', 'partnership'],
    type: 'website' as const,
  };

  return (
    <div className="min-h-screen bg-background">
      <MetaTags config={aboutSEO} />
      
      {/* Hero Section with Gradient */}
      <section 
        className="relative py-24 bg-gradient-to-br from-accent/30 via-background to-accent/20 overflow-hidden"
        data-testid="section-hero"
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
            data-testid="text-hero-title"
          >
            {t('about.hero.title')}
          </h1>
          <p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            {t('about.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-accent/20" data-testid="section-stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center"
                data-testid={`stat-${index}`}
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20" data-testid="section-story">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            className="text-4xl font-bold mb-8 text-center"
            data-testid="text-story-title"
          >
            {t('about.story.title')}
          </h2>
          <div className="prose prose-lg max-w-none">
            <p 
              className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line"
              data-testid="text-story-content"
            >
              {t('about.story.content')}
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-accent/20" data-testid="section-values">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            className="text-4xl font-bold mb-12 text-center"
            data-testid="text-values-title"
          >
            {t('about.values.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card
                  key={index}
                  className="p-6 hover-elevate transition-all duration-300 bg-card/80 backdrop-blur-sm"
                  data-testid={`card-value-${index}`}
                >
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent">
                      <IconComponent className={`w-7 h-7 ${value.color}`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" data-testid="section-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="text-4xl font-bold mb-4"
            data-testid="text-cta-title"
          >
            {t('about.cta.title')}
          </h2>
          <p 
            className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            data-testid="text-cta-desc"
          >
            {t('about.cta.desc')}
          </p>
          <Button
            asChild
            size="lg"
            className="soft-glow-primary"
            data-testid="button-cta"
          >
            <Link href="/#contact">
              {t('about.cta.button')}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
