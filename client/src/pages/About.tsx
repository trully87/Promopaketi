import { useLanguage } from '@/lib/i18n';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Target, Handshake, Award } from 'lucide-react';
import MetaTags from '@/components/MetaTags';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// Animated Counter Component
function AnimatedCounter({ end, duration = 2 }: { end: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Extract number from string (e.g., "500+" -> 500, "99%" -> 99)
  const numericValue = parseInt(end.replace(/[^0-9]/g, ''));
  const suffix = end.replace(/[0-9,]/g, '');
  
  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * numericValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, numericValue, duration]);
  
  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-primary mb-2">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

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
      bgGradient: 'from-amber-500/10 to-amber-600/5',
    },
    {
      icon: Sparkles,
      title: t('about.value.innovation.title'),
      description: t('about.value.innovation.desc'),
      color: 'text-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/5',
    },
    {
      icon: Handshake,
      title: t('about.value.partnership.title'),
      description: t('about.value.partnership.desc'),
      color: 'text-emerald-600',
      bgGradient: 'from-emerald-500/10 to-emerald-600/5',
    },
    {
      icon: Target,
      title: t('about.value.excellence.title'),
      description: t('about.value.excellence.desc'),
      color: 'text-primary',
      bgGradient: 'from-primary/10 to-primary/5',
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <MetaTags config={aboutSEO} />
      
      {/* Hero Section with Enhanced Gradient & Floating Shapes */}
      <section 
        className="relative py-32 bg-gradient-to-br from-accent/40 via-background to-accent/20 overflow-hidden"
        data-testid="section-hero"
      >
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-primary to-amber-500 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/60"
              data-testid="text-hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('about.hero.title')}
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
              data-testid="text-hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('about.hero.subtitle')}
            </motion.p>
          </motion.div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/30 rounded-full"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <motion.section 
        className="relative py-20 bg-gradient-to-b from-accent/30 to-background"
        data-testid="section-stats"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center group"
                data-testid={`stat-${index}`}
                variants={itemVariants}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-block"
                >
                  <AnimatedCounter end={stat.value} />
                </motion.div>
                <motion.div 
                  className="text-sm md:text-base text-muted-foreground font-medium mt-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Story Section with Fade-in Animation */}
      <motion.section 
        className="relative py-24"
        data-testid="section-story"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUpVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/10 to-background" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
            data-testid="text-story-title"
            variants={itemVariants}
          >
            {t('about.story.title')}
          </motion.h2>
          <motion.div 
            className="relative"
            variants={itemVariants}
          >
            {/* Decorative quote mark */}
            <div className="absolute -left-4 -top-4 text-8xl text-primary/10 font-serif leading-none">"</div>
            
            <div className="prose prose-lg max-w-none relative">
              <p 
                className="text-lg md:text-xl leading-relaxed text-muted-foreground whitespace-pre-line"
                data-testid="text-story-content"
              >
                {t('about.story.content')}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Values Section with Staggered Animation */}
      <motion.section 
        className="relative py-24 bg-gradient-to-b from-background to-accent/20"
        data-testid="section-values"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-16 text-center"
            data-testid="text-values-title"
            variants={fadeInUpVariants}
          >
            {t('about.values.title')}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card
                    className={`relative p-8 h-full overflow-hidden group hover-elevate transition-all duration-500 bg-gradient-to-br ${value.bgGradient} backdrop-blur-sm border-2 border-transparent hover:border-accent`}
                    data-testid={`card-value-${index}`}
                  >
                    {/* Animated background gradient on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={false}
                    />
                    
                    <div className="relative">
                      <motion.div 
                        className="mb-6"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${value.bgGradient} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                          <IconComponent className={`w-8 h-8 ${value.color}`} />
                        </div>
                      </motion.div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                        {value.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* CTA Section with Animated Button */}
      <motion.section 
        className="relative py-28 overflow-hidden"
        data-testid="section-cta"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUpVariants}
      >
        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-background to-background" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-6"
            data-testid="text-cta-title"
            variants={itemVariants}
          >
            {t('about.cta.title')}
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            data-testid="text-cta-desc"
            variants={itemVariants}
          >
            {t('about.cta.desc')}
          </motion.p>
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              asChild
              size="lg"
              className="soft-glow-primary text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
              data-testid="button-cta"
            >
              <Link href="/#contact">
                {t('about.cta.button')}
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
