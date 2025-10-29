import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useLanguage } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, Building2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone is required'),
  company: z.string().optional(),
  packageType: z.string().optional(),
  quantity: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

interface ContactFormProps {
  selectedPackage?: string;
}

export default function ContactForm({ selectedPackage }: ContactFormProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      packageType: selectedPackage || '',
      quantity: '',
      message: '',
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await apiRequest("POST", "/api/inquiries", data);
    },
    onSuccess: () => {
      toast({
        title: t('form.success'),
        description: t('form.subtitle'),
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: language === 'me' ? 'Greška' : 'Error',
        description: language === 'me' ? 'Nešto je pošlo po zlu. Pokušajte ponovo.' : 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (data: FormData) => {
    submitMutation.mutate(data);
  };

  const packages = [
    t('package.basic.newyear'),
    t('package.standard.newyear'),
    t('package.premium.thermos'),
    t('package.premium.olive'),
    t('package.basic.corporate.bag'),
    t('package.basic.corporate.box'),
    t('package.active.life'),
    t('package.smart.living'),
    t('package.eco.friendly'),
  ];

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold mb-4">{t('form.title')}</h2>
          <p className="text-lg text-muted-foreground">{t('form.subtitle')}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-8 rounded-lg border">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.name')}</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder={t('form.name')}
                        data-testid="input-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.email')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          {...field} 
                          type="email"
                          placeholder={t('form.email')}
                          className="pl-10"
                          data-testid="input-email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.phone')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          {...field} 
                          placeholder={t('form.phone')}
                          className="pl-10"
                          data-testid="input-phone"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.company')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          {...field} 
                          placeholder={t('form.company')}
                          className="pl-10"
                          data-testid="input-company"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="packageType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.package')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-package">
                          <SelectValue placeholder={t('form.package')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {packages.map((pkg) => (
                          <SelectItem key={pkg} value={pkg}>
                            {pkg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.quantity')}</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        placeholder={t('form.quantity')}
                        data-testid="input-quantity"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.message')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={5}
                      placeholder={t('form.message')}
                      data-testid="textarea-message"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              disabled={submitMutation.isPending}
              data-testid="button-submit-contact"
            >
              {submitMutation.isPending ? (language === 'me' ? 'Slanje...' : 'Sending...') : t('form.submit')}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
