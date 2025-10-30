import { useState } from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { SiWhatsapp, SiViber } from 'react-icons/si';
import logo from '@assets/brain-box-logo.png';
import type { ContactInfo } from '@shared/schema';

export default function Footer() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const { data: contactInfo } = useQuery<ContactInfo>({
    queryKey: ["/api/contact-info"],
  });

  const subscribeMutation = useMutation({
    mutationFn: async (email: string) => {
      await apiRequest("POST", "/api/newsletter/subscribe", { email, status: 'active' });
    },
    onSuccess: () => {
      toast({
        title: language === 'me' ? "Uspešno!" : "Success!",
        description: language === 'me' 
          ? "Uspešno ste se pretplatili na newsletter" 
          : "Successfully subscribed to newsletter",
      });
      setEmail('');
    },
    onError: (error: any) => {
      const isAlreadySubscribed = error?.message?.includes('409') || error?.message?.includes('already');
      toast({
        title: language === 'me' ? "Greška" : "Error",
        description: isAlreadySubscribed
          ? (language === 'me' ? "Email je već pretplaćen" : "Email already subscribed")
          : (language === 'me' ? "Neuspešna pretplata" : "Failed to subscribe"),
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      subscribeMutation.mutate(email);
    } else {
      toast({
        title: language === 'me' ? "Greška" : "Error",
        description: language === 'me' ? "Unesite validnu email adresu" : "Please enter a valid email address",
        variant: "destructive",
      });
    }
  };

  // Use contact info from database or fallback to defaults
  const phoneNumber = contactInfo?.phone || '+382 67 123 456';
  const emailAddress = contactInfo?.email || 'info@brainbox.me';
  const whatsappNumber = contactInfo?.whatsapp || '';
  const viberNumber = contactInfo?.viber || '';
  const address = language === 'me' 
    ? (contactInfo?.addressME || 'Podgorica, Crna Gora')
    : (contactInfo?.addressEN || 'Podgorica, Montenegro');

  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <img 
                src={logo} 
                alt="Brain Box Logo" 
                className="h-16 w-auto mb-3 -ml-2"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {t('footer.tagline')}
            </p>
            
            {/* WhatsApp and Viber Buttons */}
            {(whatsappNumber || viberNumber) && (
              <div className="flex gap-2 mt-4">
                {whatsappNumber && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    asChild
                    data-testid="button-whatsapp"
                  >
                    <a href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                      <SiWhatsapp className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                  </Button>
                )}
                {viberNumber && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    asChild
                    data-testid="button-viber"
                  >
                    <a href={`viber://chat?number=${viberNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                      <SiViber className="w-4 h-4" />
                      <span>Viber</span>
                    </a>
                  </Button>
                )}
              </div>
            )}
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
                <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  {language === 'me' ? 'O Nama' : 'About Us'}
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
                <a href={`mailto:${emailAddress}`} className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-email">
                  {emailAddress}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-phone">
                  {phoneNumber}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground" data-testid="text-address">
                  {address}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.newsletter')}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {t('footer.newsletter.subtitle')}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                data-testid="input-newsletter"
                disabled={subscribeMutation.isPending}
                required
              />
              <Button 
                type="submit" 
                data-testid="button-subscribe"
                disabled={subscribeMutation.isPending}
              >
                {subscribeMutation.isPending ? '...' : t('footer.subscribe')}
              </Button>
            </form>
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
