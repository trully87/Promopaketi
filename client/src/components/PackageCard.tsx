import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, GitCompareArrows } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useComparison } from '@/contexts/ComparisonContext';
import LazyImage from '@/components/LazyImage';
import type { Package } from '@shared/schema';

export interface PackageCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  minOrder: number;
  image: string;
  items: string[];
  category: string;
  packageData?: Package; // Real package data from API for comparison
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

export default function PackageCard({ id, name, price, minOrder, image, items, category, description, packageData, onLearnMore }: PackageCardProps) {
  const { t, language } = useLanguage();
  const { addToComparison, isInComparison, comparisonList, maxComparisons } = useComparison();
  const tierStyle = getTierStyle(category);
  
  const inComparison = isInComparison(id);
  const canAddMore = comparisonList.length < maxComparisons;

  const handleAddToComparison = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inComparison && canAddMore && packageData) {
      addToComparison(packageData);
    }
  };

  return (
    <Card 
      className={`overflow-hidden card-lift flex flex-col h-full cursor-pointer border-2 ${tierStyle.borderColor} ${tierStyle.glowClass} transition-all duration-300`}
      onClick={onLearnMore}
      data-testid={`card-package-${id}`}
    >
      <div className="aspect-[3/4] bg-muted image-zoom">
        <LazyImage 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-start justify-between gap-2">
          <Badge className={`w-fit ${tierStyle.badgeColor} border-0`}>
            {category === 'newyear' ? t('category.newyear') : t('category.corporate')}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAddToComparison}
            disabled={inComparison || !canAddMore}
            className={`h-8 w-8 flex-shrink-0 ${inComparison ? 'text-primary' : ''}`}
            data-testid={`button-add-compare-${id}`}
            title={inComparison 
              ? (language === 'me' ? 'U poređenju' : 'In comparison') 
              : !canAddMore 
              ? (language === 'me' ? 'Maksimum dostignut' : 'Maximum reached')
              : (language === 'me' ? 'Dodaj u poređenje' : 'Add to comparison')
            }
          >
            <GitCompareArrows className="w-4 h-4" />
          </Button>
        </div>
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
          data-testid={`button-learn-more-${name?.toLowerCase().replace(/\s+/g, '-') || 'package'}`}
        >
          {t('common.learnMore')}
        </Button>
      </CardFooter>
    </Card>
  );
}
