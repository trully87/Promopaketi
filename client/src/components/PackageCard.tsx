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
  category: 'newyear' | 'corporate';
  onLearnMore: () => void;
}

export default function PackageCard({ name, price, minOrder, image, items, category, onLearnMore }: PackageCardProps) {
  const { t, language } = useLanguage();

  return (
    <Card 
      className="overflow-hidden hover-elevate transition-all duration-300 hover:-translate-y-1 flex flex-col h-full cursor-pointer"
      onClick={onLearnMore}
    >
      <div className="aspect-[3/4] overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <CardHeader className="space-y-3 pb-4">
        <Badge variant="secondary" className="w-fit">
          {category === 'newyear' ? t('category.newyear') : t('category.corporate')}
        </Badge>
        <h3 className="font-serif text-2xl font-semibold leading-tight">
          {name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary" data-testid="text-package-card-price">{price} RSD</span>
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
              <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
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
