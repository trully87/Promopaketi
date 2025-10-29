import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, Package, Paintbrush, ListChecks } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import type { PackageCardProps } from './PackageCard';
import type { ProductItem } from '@/data/packages';

interface PackageModalProps {
  package: PackageCardProps & { products?: ProductItem[] } | null;
  open: boolean;
  onClose: () => void;
  onInquire: () => void;
}

export default function PackageModal({ package: pkg, open, onClose, onInquire }: PackageModalProps) {
  const { t, language } = useLanguage();

  if (!pkg) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl">{pkg.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-5 gap-8 mt-4">
          <div className="md:col-span-2 space-y-4">
            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted sticky top-0">
              <img 
                src={pkg.image} 
                alt={pkg.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
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
                
                <Separator className="my-4" />
                
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
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3 space-y-6">
            <Badge variant="secondary" className="mb-2">
              {pkg.category === 'newyear' ? t('category.newyear') : t('category.corporate')}
            </Badge>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview" data-testid="tab-overview">
                  <ListChecks className="w-4 h-4 mr-2" />
                  {language === 'me' ? 'Pregled' : 'Overview'}
                </TabsTrigger>
                <TabsTrigger value="products" data-testid="tab-products">
                  <Package className="w-4 h-4 mr-2" />
                  {language === 'me' ? 'Pojedinačni proizvodi' : 'Individual Products'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
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

                <Card className="bg-muted/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Paintbrush className="w-5 h-5 text-primary shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-2">{t('common.customization')}</h3>
                        <p className="text-sm text-muted-foreground">
                          {language === 'me' 
                            ? 'Personalizacija putem štampe logotipa ili inicijala pruža jedinstven poslovni pečat. Svi proizvodi u paketu mogu biti prilagođeni potrebama Vaše firme sa custom made pakovanjem i brendiranjem.'
                            : 'Customization through logo or initial printing provides a unique business touch. All products in the package can be customized to your company needs with custom made packaging and branding.'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products" className="space-y-4 mt-6">
                {pkg.products && pkg.products.length > 0 ? (
                  <div className="space-y-4">
                    {pkg.products.map((product, idx) => (
                      <Card key={idx} className="overflow-hidden hover-elevate transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-bold">{idx + 1}</span>
                              </div>
                            </div>
                            <div className="flex-1 space-y-2">
                              <h4 className="font-semibold text-lg">
                                {product.name[language]}
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {product.description[language]}
                              </p>
                              {product.specs && (
                                <div className="flex items-center gap-2 pt-2">
                                  <Badge variant="outline" className="font-normal">
                                    {product.specs[language]}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{language === 'me' ? 'Nema dostupnih detalja o proizvodima' : 'No product details available'}</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
