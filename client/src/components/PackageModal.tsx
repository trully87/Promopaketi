import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import type { Package as PackageType, PackageProduct } from '@shared/schema';

interface PackageModalProps {
  package: PackageType | null;
  products: PackageProduct[];
  open: boolean;
  onClose: () => void;
  onInquire: () => void;
}

function ProductImageGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative group">
      <div className="aspect-square overflow-hidden rounded-lg bg-muted">
        <img 
          src={images[currentIndex]} 
          alt={`Product ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          data-testid={`img-product-${currentIndex}`}
        />
      </div>
      
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToPrevious}
            data-testid="button-gallery-prev"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToNext}
            data-testid="button-gallery-next"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'bg-primary w-6' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                data-testid={`button-gallery-dot-${idx}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function PackageModal({ package: pkg, products, open, onClose, onInquire }: PackageModalProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('complete');

  // Reset activeTab to complete whenever modal opens or package changes
  useEffect(() => {
    if (open) {
      setActiveTab('complete');
    }
  }, [open, pkg?.id]);

  if (!pkg) return null;

  const packageName = language === 'me' ? pkg.nameME : pkg.nameEN;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl" data-testid="text-package-name">{packageName}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-5 gap-8 mt-4">
          <div className="md:col-span-2 space-y-4">
            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted sticky top-0">
              <img 
                src={pkg.image} 
                alt={packageName}
                className="w-full h-full object-cover"
                data-testid="img-package-main"
              />
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('common.price')}</p>
                    <p className="text-3xl font-bold text-primary" data-testid="text-package-price">€{pkg.price}</p>
                    <p className="text-sm text-muted-foreground">{t('common.perUnit')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{t('common.minOrder')}</p>
                    <p className="text-2xl font-semibold" data-testid="text-min-order">{pkg.minOrder}</p>
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
            <Badge variant="secondary" className="mb-2" data-testid="badge-category">
              {pkg.category === 'newyear' ? t('category.newyear') : t('category.corporate')}
            </Badge>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="complete" data-testid="tab-complete">
                  <Package className="w-4 h-4 mr-2" />
                  {language === 'me' ? 'Kompletan Paket' : 'Complete Package'}
                </TabsTrigger>
                
                <TabsTrigger value="products" data-testid="tab-products">
                  {language === 'me' ? 'Pojedinačni Proizvodi' : 'Individual Products'}
                </TabsTrigger>
              </TabsList>

              {/* Complete Package Tab - Non-clickable list */}
              <TabsContent value="complete" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold mb-3">
                      {language === 'me' ? 'Šta paket sadrži:' : 'Package Contents:'}
                    </h3>
                  </div>
                  
                  <div className="grid gap-3">
                    {products && products.length > 0 ? (
                      products.map((product, idx) => (
                        <Card key={product.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              {product.images && (product.images as string[]).length > 0 && (
                                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted">
                                  <img 
                                    src={(product.images as string[])[0]} 
                                    alt={language === 'me' ? product.nameME : product.nameEN}
                                    className="w-full h-full object-cover"
                                    data-testid={`img-product-thumb-${idx}`}
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                      <span className="text-primary font-bold text-sm">{idx + 1}</span>
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-base mb-1 truncate" data-testid={`text-product-name-${idx}`}>
                                      {language === 'me' ? product.nameME : product.nameEN}
                                    </h4>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      {language === 'me' ? product.descriptionME : product.descriptionEN}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>{language === 'me' ? 'Nema dostupnih detalja o proizvodima' : 'No product details available'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Individual Products Tab - Clickable list with links */}
              <TabsContent value="products" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold mb-3">
                      {language === 'me' ? 'Izaberite proizvod za detaljne informacije:' : 'Select a product for details:'}
                    </h3>
                  </div>
                  
                  <div className="grid gap-3">
                    {products && products.length > 0 ? (
                      products.map((product, idx) => (
                        <Card key={product.id} className="hover-elevate transition-all cursor-pointer" onClick={() => setActiveTab(`product-${idx}`)}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              {product.images && (product.images as string[]).length > 0 && (
                                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted">
                                  <img 
                                    src={(product.images as string[])[0]} 
                                    alt={language === 'me' ? product.nameME : product.nameEN}
                                    className="w-full h-full object-cover"
                                    data-testid={`img-product-clickable-thumb-${idx}`}
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                      <span className="text-primary font-bold text-sm">{idx + 1}</span>
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-base mb-1 truncate" data-testid={`text-product-clickable-name-${idx}`}>
                                      {language === 'me' ? product.nameME : product.nameEN}
                                    </h4>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      {language === 'me' ? product.descriptionME : product.descriptionEN}
                                    </p>
                                  </div>
                                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>{language === 'me' ? 'Nema dostupnih detalja o proizvodima' : 'No product details available'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Individual Product Detail Views */}
              {products.map((product, idx) => (
                <TabsContent key={product.id} value={`product-${idx}`} className="space-y-6 mt-6">
                  <Card className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Product Image Gallery */}
                        <div className="space-y-4">
                          {product.images && (product.images as string[]).length > 0 ? (
                            <ProductImageGallery images={product.images as string[]} />
                          ) : (
                            <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                              <Package className="w-16 h-16 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="space-y-4">
                          <div>
                            <Badge variant="outline" className="mb-3">
                              {language === 'me' ? 'Proizvod' : 'Product'} #{idx + 1}
                            </Badge>
                            <h3 className="text-2xl font-bold mb-3" data-testid={`text-product-detail-name-${idx}`}>
                              {language === 'me' ? product.nameME : product.nameEN}
                            </h3>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                              {language === 'me' ? 'Opis' : 'Description'}
                            </h4>
                            <p className="text-base leading-relaxed" data-testid={`text-product-description-${idx}`}>
                              {language === 'me' ? product.descriptionME : product.descriptionEN}
                            </p>
                          </div>

                          {(language === 'me' ? product.specsME : product.specsEN) && (
                            <>
                              <Separator />
                              <div>
                                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                                  {language === 'me' ? 'Specifikacije' : 'Specifications'}
                                </h4>
                                <div className="space-y-2">
                                  {((language === 'me' ? product.specsME : product.specsEN) || '').split('|').map((spec, specIdx) => (
                                    <div key={specIdx} className="flex items-start gap-2">
                                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                      <span className="text-sm" data-testid={`text-product-spec-${idx}-${specIdx}`}>{spec.trim()}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Navigation to other products */}
                  {products.length > 1 && (
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const prevIdx = idx === 0 ? products.length - 1 : idx - 1;
                          setActiveTab(`product-${prevIdx}`);
                        }}
                        data-testid="button-prev-product"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        {language === 'me' ? 'Prethodni' : 'Previous'}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setActiveTab('products')}
                        data-testid="button-back-products"
                      >
                        {language === 'me' ? 'Nazad na listu' : 'Back to List'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const nextIdx = idx === products.length - 1 ? 0 : idx + 1;
                          setActiveTab(`product-${nextIdx}`);
                        }}
                        data-testid="button-next-product"
                      >
                        {language === 'me' ? 'Sledeći' : 'Next'}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
