import { useState, useEffect } from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import type { ContactInfo } from "@shared/schema";

export default function ContactInfoManagement() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    whatsapp: '',
    viber: '',
    addressME: '',
    addressEN: '',
    mapLatitude: '',
    mapLongitude: '',
  });

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  const { data: contactInfo, isLoading } = useQuery<ContactInfo>({
    queryKey: ["/api/admin/contact-info"],
  });

  // Update form when data loads
  useEffect(() => {
    if (contactInfo) {
      setFormData({
        phone: contactInfo.phone || '',
        email: contactInfo.email || '',
        whatsapp: contactInfo.whatsapp || '',
        viber: contactInfo.viber || '',
        addressME: contactInfo.addressME || '',
        addressEN: contactInfo.addressEN || '',
        mapLatitude: contactInfo.mapLatitude || '',
        mapLongitude: contactInfo.mapLongitude || '',
      });
    }
  }, [contactInfo]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!contactInfo?.id) {
        throw new Error("Contact info not initialized");
      }
      await apiRequest("PATCH", `/api/admin/contact-info/${contactInfo.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-info"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contact-info"] });
      toast({
        title: "Kontakt informacije sačuvane",
        description: "Kontakt informacije su uspešno ažurirane",
      });
    },
    onError: () => {
      toast({
        title: "Greška",
        description: "Neuspešno ažuriranje kontakt informacija",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-page-title">Kontakt Informacije</h1>
            <p className="text-muted-foreground mt-1">Upravljajte kontakt informacijama koje se prikazuju na sajtu</p>
          </div>
          <Button variant="outline" onClick={() => setLocation('/admin')} data-testid="button-back">
            Nazad
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kontakt Detalji</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8" data-testid="text-loading">Učitavanje...</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon *</Label>
                    <Input
                      id="phone"
                      data-testid="input-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+382 XX XXX XXX"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      data-testid="input-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="info@brainbox.me"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      data-testid="input-whatsapp"
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                      placeholder="+382 XX XXX XXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="viber">Viber</Label>
                    <Input
                      id="viber"
                      data-testid="input-viber"
                      type="tel"
                      value={formData.viber}
                      onChange={(e) => setFormData(prev => ({ ...prev, viber: e.target.value }))}
                      placeholder="+382 XX XXX XXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressME">Adresa (Crnogorski)</Label>
                  <Textarea
                    id="addressME"
                    data-testid="input-address-me"
                    value={formData.addressME}
                    onChange={(e) => setFormData(prev => ({ ...prev, addressME: e.target.value }))}
                    placeholder="Ulica i broj, Grad, Crna Gora"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressEN">Address (English)</Label>
                  <Textarea
                    id="addressEN"
                    data-testid="input-address-en"
                    value={formData.addressEN}
                    onChange={(e) => setFormData(prev => ({ ...prev, addressEN: e.target.value }))}
                    placeholder="Street and number, City, Montenegro"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mapLatitude">Mapa Latitude (opciono)</Label>
                    <Input
                      id="mapLatitude"
                      data-testid="input-latitude"
                      type="text"
                      value={formData.mapLatitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, mapLatitude: e.target.value }))}
                      placeholder="42.4304"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mapLongitude">Mapa Longitude (opciono)</Label>
                    <Input
                      id="mapLongitude"
                      data-testid="input-longitude"
                      type="text"
                      value={formData.mapLongitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, mapLongitude: e.target.value }))}
                      placeholder="19.2594"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    data-testid="button-save"
                    disabled={updateMutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateMutation.isPending ? "Čuvanje..." : "Sačuvaj Promene"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
