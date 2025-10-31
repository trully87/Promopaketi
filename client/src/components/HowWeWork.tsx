import { useLanguage } from '@/lib/i18n';
import { CheckCircle2, Lightbulb, Factory, Truck } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function HowWeWork() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: CheckCircle2,
      title: t('howwework.understanding.title'),
      description: t('howwework.understanding.desc'),
      color: 'text-primary',
    },
    {
      icon: Lightbulb,
      title: t('howwework.design.title'),
      description: t('howwework.design.desc'),
      color: 'text-amber-600',
    },
    {
      icon: Factory,
      title: t('howwework.production.title'),
      description: t('howwework.production.desc'),
      color: 'text-blue-600',
    },
    {
      icon: Truck,
      title: t('howwework.delivery.title'),
      description: t('howwework.delivery.desc'),
      color: 'text-emerald-600',
    },
  ];

  return (
    <section className="py-24 bg-accent/30" data-testid="section-how-we-work">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            {t('howwework.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('howwework.subtitle')}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card
                key={index}
                className="p-6 hover-elevate transition-all duration-300 bg-card/80 backdrop-blur-sm"
                data-testid={`card-step-${index + 1}`}
              >
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent">
                    <IconComponent className={`w-7 h-7 ${step.color}`} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA - Optional */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            {t('howwework.subtitle')}
          </p>
        </div>
      </div>
    </section>
  );
}
