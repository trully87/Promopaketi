import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Check, Minus } from 'lucide-react';
import { useComparison } from '@/contexts/ComparisonContext';
import { useLanguage } from '@/lib/i18n';
import { formatPrice } from '@/lib/utils';

interface ComparisonModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ComparisonModal({ open, onClose }: ComparisonModalProps) {
  const { comparisonList, removeFromComparison } = useComparison();
  const { language } = useLanguage();

  if (comparisonList.length === 0) {
    return null;
  }

  // Comparison features
  const features = [
    { key: 'price', labelME: 'Cena', labelEN: 'Price' },
    { key: 'minOrder', labelME: 'Min. Porudžbina', labelEN: 'Min. Order' },
    { key: 'category', labelME: 'Kategorija', labelEN: 'Category' },
    { key: 'description', labelME: 'Opis', labelEN: 'Description' },
  ];

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, { me: string, en: string }> = {
      'newyear': { me: 'Novogodišnji', en: 'New Year' },
      'corporate': { me: 'Korporativni', en: 'Corporate' },
      'eko': { me: 'Eko', en: 'Eco' },
      'local': { me: 'Lokalni Proizvođači', en: 'Local Producers' },
      'premium': { me: 'Premium VIP', en: 'Premium VIP' },
    };
    return language === 'me' ? (labels[category]?.me || category) : (labels[category]?.en || category);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {language === 'me' ? 'Poređenje Paketa' : 'Package Comparison'}
          </DialogTitle>
          <DialogDescription>
            {language === 'me' 
              ? 'Uporedite karakteristike i cene odabranih paketa'
              : 'Compare features and prices of selected packages'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left font-semibold border-b-2 border-border bg-muted/50 sticky left-0 z-10">
                    {language === 'me' ? 'Karakteristike' : 'Features'}
                  </th>
                  {comparisonList.map((pkg) => (
                    <th key={pkg.id} className="p-4 border-b-2 border-border min-w-[250px]">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-lg">
                            {language === 'me' ? pkg.nameME : pkg.nameEN}
                          </h3>
                          <button
                            onClick={() => removeFromComparison(pkg.id)}
                            className="hover:bg-destructive/20 rounded-full p-1 transition-colors flex-shrink-0"
                            data-testid={`button-remove-modal-${pkg.id}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {pkg.image && (
                          <img
                            src={pkg.image}
                            alt={language === 'me' ? pkg.nameME : pkg.nameEN}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Price Row */}
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium border-b border-border bg-background/50 sticky left-0 z-10">
                    {language === 'me' ? 'Cena' : 'Price'}
                  </td>
                  {comparisonList.map((pkg) => (
                    <td key={pkg.id} className="p-4 border-b border-border text-center">
                      <div className="text-2xl font-bold text-primary">
                        {formatPrice(pkg.price)}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Min Order Row */}
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium border-b border-border bg-background/50 sticky left-0 z-10">
                    {language === 'me' ? 'Min. Porudžbina' : 'Min. Order'}
                  </td>
                  {comparisonList.map((pkg) => (
                    <td key={pkg.id} className="p-4 border-b border-border text-center">
                      <Badge variant="secondary">
                        {pkg.minOrder} {language === 'me' ? 'kom' : 'pcs'}
                      </Badge>
                    </td>
                  ))}
                </tr>

                {/* Category Row */}
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium border-b border-border bg-background/50 sticky left-0 z-10">
                    {language === 'me' ? 'Kategorija' : 'Category'}
                  </td>
                  {comparisonList.map((pkg) => (
                    <td key={pkg.id} className="p-4 border-b border-border text-center">
                      <Badge>{getCategoryLabel(pkg.category)}</Badge>
                    </td>
                  ))}
                </tr>

                {/* Description Row */}
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium border-b border-border bg-background/50 sticky left-0 z-10">
                    {language === 'me' ? 'Opis' : 'Description'}
                  </td>
                  {comparisonList.map((pkg) => (
                    <td key={pkg.id} className="p-4 border-b border-border">
                      <p className="text-sm text-muted-foreground text-left">
                        {language === 'me' ? pkg.nameME : pkg.nameEN}
                      </p>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} data-testid="button-close-comparison">
              {language === 'me' ? 'Zatvori' : 'Close'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
