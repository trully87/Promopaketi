import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export interface PackageCardProps {
  id: string;
  name: string;
  price: number;
  minOrder: number;
  image: string;
  items: string[];
  category: string;
  onLearnMore: () => void;
}

// Tier-based styling configuration
const getTierStyle = (category: string) => {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('premium') || lowerCategory.includes('vip')) {
    return {
      borderColor: 'border-gold/50 hover:border-gold',
      badgeColor: 'bg-gold text-gold-foreground',
      glowClass: 'soft-glow-gold',
      iconColor: 'text-gold'
    };
  } else if (lowerCategory.includes('corporate') || lowerCategory.includes('korporativni')) {
    return {
      borderColor: 'border-silver/50 hover:border-silver',
      badgeColor: 'bg-silver text-silver-foreground',
      glowClass: '',
      iconColor: 'text-silver'
    };
  } else if (lowerCategory.includes('eko') || lowerCategory.includes('eco')) {
    return {
      borderColor: 'border-emerald/50 hover:border-emerald',
      badgeColor: 'bg-emerald text-emerald-foreground',
      glowClass: '',
      iconColor: 'text-emerald'
    };
  } else {
    // Default for newyear and others
    return {
      borderColor: 'border-primary/50 hover:border-primary',
      badgeColor: 'bg-primary text-primary-foreground',
      glowClass: 'soft-glow-primary',
      iconColor: 'text-primary'
    };
  }
};

export default function PackageCard({ name, price, minOrder, image, items, category, onLearnMore }: PackageCardProps) {
  const { t, language } = useLanguage();
  const tierStyle = getTierStyle(category);

  return (
    <Card 
      className={`overflow-hidden card-lift flex flex-col h-full cursor-pointer border-2 ${tierStyle.borderColor} ${tierStyle.glowClass} transition-all duration-300`}
      onClick={onLearnMore}
    >
      <div className="aspect-[3/4] overflow-hidden bg-muted image-zoom">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardHeader className="space-y-3 pb-4">
        <Badge className={`w-fit ${tierStyle.badgeColor} border-0`}>
          {category === 'newyear' ? t('category.newyear') : t('category.corporate')}
        </Badge>
        <h3 className="font-serif text-2xl font-semibold leading-tight">
          {name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold ${tierStyle.iconColor}`} data-testid="text-package-card-price">€{price}</span>
          <span className="text-sm text-muted-foreground">{t('common.perUnit')}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {t('common.minOrder')}: {minOrder} {t('common.pieces')}
        </p>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pt-0">
        <h4 className="font-semibold text-sm">{t('common.includes')}:</h4>
        <ul className="space-y-2">
          {items.slice(0, 4).map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <Check className={`w-4 h-4 ${tierStyle.iconColor} shrink-0 mt-0.5`} />
              <span>{item}</span>
            </li>
          ))}
          {items.length > 4 && (
            <li className="text-sm text-muted-foreground pl-6">
              +{items.length - 4} {language === 'me' ? 'više proizvoda' : 'more items'}
            </li>
          )}
        </ul>
      </CardContent>

      <CardFooter className="pt-4">
        <Button 
          className="w-full" 
          onClick={(e) => {
            e.stopPropagation();
            onLearnMore();
          }}
          data-testid={`button-learn-more-${name.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {t('common.learnMore')}
        </Button>
      </CardFooter>
    </Card>
  );
}
