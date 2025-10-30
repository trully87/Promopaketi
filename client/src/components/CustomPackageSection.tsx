import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useState, useEffect } from "react";
import type { CustomPackageSection as CustomPackageSectionType } from "@shared/schema";

export default function CustomPackageSection() {
  const { language } = useLanguage();
  const [imageError, setImageError] = useState(false);
  
  const { data: section } = useQuery<CustomPackageSectionType>({
    queryKey: ["/api/custom-package-section"],
    retry: false,
    throwOnError: false,
  });

  // Reset imageError when section.image changes (new upload)
  useEffect(() => {
    setImageError(false);
  }, [section?.image]);

  if (!section) return null;

  const title = language === 'me' ? section.titleME : section.titleEN;
  const description = language === 'me' ? section.descriptionME : section.descriptionEN;
  const ctaText = language === 'me' ? section.ctaTextME : section.ctaTextEN;

  const handleContactClick = () => {
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-background via-background to-accent/5">
      <div className="max-w-7xl mx-auto">
        <Card className="overflow-hidden">
          <div className={`grid ${!imageError && section.image ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-0`}>
            {/* Image Side - Only show if image exists and hasn't errored */}
            {!imageError && section.image && (
              <div className="relative h-[400px] md:h-auto">
                <img
                  src={section.image}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
              </div>
            )}

            {/* Content Side */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {language === 'me' ? 'Prilagođeno Za Vas' : 'Tailored For You'}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                {title}
              </h2>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {description}
              </p>

              <div>
                <Button
                  size="lg"
                  onClick={handleContactClick}
                  className="text-lg px-8"
                  data-testid="button-custom-package-cta"
                >
                  {ctaText}
                </Button>
              </div>

              {/* Feature Highlights */}
              <div className="mt-8 pt-8 border-t grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">100%</div>
                  <div className="text-xs text-muted-foreground">
                    {language === 'me' ? 'Prilagođeno' : 'Customized'}
                  </div>
                </div>
                <div className="text-center border-x">
                  <div className="text-2xl font-bold text-primary mb-1">24h</div>
                  <div className="text-xs text-muted-foreground">
                    {language === 'me' ? 'Odgovor' : 'Response'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">✓</div>
                  <div className="text-xs text-muted-foreground">
                    {language === 'me' ? 'Premium' : 'Premium'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
