import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Package, Paintbrush } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import type { PackageCardProps } from './PackageCard';

interface PackageModalProps {
  package: PackageCardProps | null;
  open: boolean;
  onClose: () => void;
  onInquire: () => void;
}

export default function PackageModal({ package: pkg, open, onClose, onInquire }: PackageModalProps) {
  const { t, language } = useLanguage();

  if (!pkg) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl">{pkg.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8 mt-4">
          <div className="space-y-4">
            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted">
              <img 
                src={pkg.image} 
                alt={pkg.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
              <div>
                <p className="text-sm text-muted-foreground">{t('common.price')}</p>
                <p className="text-3xl font-bold text-primary">{pkg.price}€</p>
                <p className="text-sm text-muted-foreground">{t('common.perUnit')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{t('common.minOrder')}</p>
                <p className="text-2xl font-semibold">{pkg.minOrder}</p>
                <p className="text-sm text-muted-foreground">{t('common.pieces')}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-4">
                {pkg.category === 'newyear' ? t('category.newyear') : t('category.corporate')}
              </Badge>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-3">{t('common.includes')}:</h3>
                    <ul className="space-y-2">
                      {pkg.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-1" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <Paintbrush className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">{t('common.customization')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'me' 
                        ? 'Personalizacija putem štampe logotipa ili inicijala pruža jedinstven poslovni pečat.'
                        : 'Customization through logo or initial printing provides a unique business touch.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full"
              onClick={() => {
                onInquire();
                onClose();
              }}
              data-testid="button-inquire-modal"
            >
              {t('common.inquire')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
