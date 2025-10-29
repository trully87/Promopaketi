import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/i18n';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground font-serif font-bold text-xl">
                BB
              </div>
              <span className="font-serif font-bold text-xl">Brain Box</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.quick.links')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/novogodisnji" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.newyear')}
                </a>
              </li>
              <li>
                <a href="/korporativni" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.corporate')}
                </a>
              </li>
              <li>
                <a href="/kontakt" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.contact')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.contact.info')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <a href="mailto:info@brainbox.me" className="text-muted-foreground hover:text-primary transition-colors">
                  info@brainbox.me
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <a href="tel:+38267123456" className="text-muted-foreground hover:text-primary transition-colors">
                  +382 67 123 456
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  {language === 'me' ? 'Podgorica, Crna Gora' : 'Podgorica, Montenegro'}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.newsletter')}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {t('footer.newsletter.subtitle')}
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Email"
                className="flex-1"
                data-testid="input-newsletter"
              />
              <Button data-testid="button-subscribe">
                {t('footer.subscribe')}
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Brain Box. {t('footer.rights')}.
          </p>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-md"
              data-testid="button-facebook"
            >
              <Facebook className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-md"
              data-testid="button-instagram"
            >
              <Instagram className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-md"
              data-testid="button-linkedin"
            >
              <Linkedin className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
