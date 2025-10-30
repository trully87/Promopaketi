import { X, GitCompareArrows } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useComparison } from '@/contexts/ComparisonContext';
import { useLanguage } from '@/lib/i18n';
import { useState } from 'react';
import ComparisonModal from '@/components/ComparisonModal';

export default function ComparisonBar() {
  const { comparisonList, removeFromComparison, clearComparison, maxComparisons } = useComparison();
  const { language } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  if (comparisonList.length === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t shadow-premium">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left side - package pills */}
            <div className="flex items-center gap-3 flex-1 overflow-x-auto">
              <GitCompareArrows className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-sm font-medium flex-shrink-0">
                {language === 'me' ? 'Poređenje' : 'Comparison'} ({comparisonList.length}/{maxComparisons})
              </span>
              
              <div className="flex gap-2">
                {comparisonList.map((pkg) => (
                  <Badge
                    key={pkg.id}
                    variant="secondary"
                    className="flex items-center gap-2 pl-3 pr-2 py-1.5"
                    data-testid={`badge-comparison-${pkg.id}`}
                  >
                    <span className="truncate max-w-[150px]">
                      {language === 'me' ? pkg.nameME : pkg.nameEN}
                    </span>
                    <button
                      onClick={() => removeFromComparison(pkg.id)}
                      className="hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                      data-testid={`button-remove-comparison-${pkg.id}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Right side - actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={clearComparison}
                data-testid="button-clear-comparison"
              >
                {language === 'me' ? 'Očisti' : 'Clear All'}
              </Button>
              
              <Button
                onClick={() => setModalOpen(true)}
                disabled={comparisonList.length < 2}
                size="sm"
                data-testid="button-compare"
              >
                <GitCompareArrows className="w-4 h-4 mr-2" />
                {language === 'me' ? 'Uporedi' : 'Compare'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      <ComparisonModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
