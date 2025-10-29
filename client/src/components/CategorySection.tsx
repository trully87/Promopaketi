import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';
import { ArrowRight } from 'lucide-react';

interface CategorySectionProps {
  title: string;
  description: string;
  image: string;
  onViewAll: () => void;
  align?: 'left' | 'right';
}

export default function CategorySection({ title, description, image, onViewAll, align = 'left' }: CategorySectionProps) {
  const { t, language } = useLanguage();

  return (
    <div className={`grid md:grid-cols-2 gap-8 items-center ${align === 'right' ? 'md:grid-flow-dense' : ''}`}>
      <div className={`${align === 'right' ? 'md:col-start-2' : ''} space-y-6`}>
        <div>
          <h2 className="font-serif text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>
        
        <Button 
          size="lg" 
          className="group"
          onClick={onViewAll}
          data-testid={`button-view-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {language === 'me' ? 'Pogledaj sve' : 'View All'}
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      <div className={`${align === 'right' ? 'md:col-start-1 md:row-start-1' : ''} relative group overflow-hidden rounded-lg`}>
        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        </div>
      </div>
    </div>
  );
}
