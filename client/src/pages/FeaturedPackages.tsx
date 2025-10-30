import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Star, StarOff } from "lucide-react";
import type { Package } from "@shared/schema";

export default function FeaturedPackages() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: packages, isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, isFeatured, featuredOrder }: { id: string; isFeatured: boolean; featuredOrder?: number | null }) => {
      return await apiRequest("PATCH", `/api/packages/${id}/featured`, {
        isFeatured,
        featuredOrder
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      toast({
        title: "Uspješno ažurirano",
        description: "Status istaknutog paketa je promijenjen",
      });
    },
    onError: () => {
      toast({
        title: "Greška",
        description: "Nije moguće ažurirati status",
        variant: "destructive",
      });
    },
  });

  const featuredPackages = packages?.filter(pkg => pkg.isFeatured === 1).sort((a, b) => {
    if (a.featuredOrder === null) return 1;
    if (b.featuredOrder === null) return -1;
    return a.featuredOrder - b.featuredOrder;
  }) || [];

  const regularPackages = packages?.filter(pkg => pkg.isFeatured === 0) || [];

  const handleToggleFeatured = (pkg: Package) => {
    const newIsFeatured = pkg.isFeatured === 1 ? false : true;
    let featuredOrder: number | null = null;

    if (newIsFeatured) {
      // When marking as featured, assign next available order
      const maxOrder = Math.max(0, ...featuredPackages.map(p => p.featuredOrder || 0));
      featuredOrder = maxOrder + 1;
    }

    toggleFeaturedMutation.mutate({
      id: pkg.id,
      isFeatured: newIsFeatured,
      featuredOrder,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Učitavanje...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/admin")}
            className="mb-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Nazad na Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Istaknuti Paketi</h1>
          <p className="text-muted-foreground mt-1">
            Odaberite do 8 paketa koji će biti prikazani kao istaknuti na početnoj stranici
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Featured Packages Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              Istaknuti na Homepage-u ({featuredPackages.length}/8)
            </h2>
          </div>

          {featuredPackages.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Trenutno nema istaknutih paketa. Kliknite na zvjezdicu ispod da dodate pakete.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredPackages.map((pkg) => (
                <Card key={pkg.id} className="relative" data-testid={`card-featured-${pkg.id}`}>
                  <CardHeader className="pb-3">
                    <div className="aspect-square w-full overflow-hidden rounded-md mb-3">
                      <img
                        src={pkg.image}
                        alt={pkg.nameME}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-base line-clamp-2">
                      {pkg.nameME}
                    </CardTitle>
                    <CardDescription>€{pkg.price}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleToggleFeatured(pkg)}
                      disabled={toggleFeaturedMutation.isPending}
                      data-testid={`button-unfeatured-${pkg.id}`}
                    >
                      <StarOff className="h-4 w-4 mr-2" />
                      Ukloni
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Available Packages Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Dostupni Paketi</h2>
          
          {featuredPackages.length >= 8 && (
            <div className="mb-4 p-4 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                ⚠️ Dostigli ste maksimalan broj istaknutih paketa (8). Uklonite neki paket da biste dodali novi.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {regularPackages.map((pkg) => (
              <Card key={pkg.id} className="relative" data-testid={`card-regular-${pkg.id}`}>
                <CardHeader className="pb-3">
                  <div className="aspect-square w-full overflow-hidden rounded-md mb-3">
                    <img
                      src={pkg.image}
                      alt={pkg.nameME}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-base line-clamp-2">
                    {pkg.nameME}
                  </CardTitle>
                  <CardDescription>€{pkg.price}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => handleToggleFeatured(pkg)}
                    disabled={toggleFeaturedMutation.isPending || featuredPackages.length >= 8}
                    data-testid={`button-feature-${pkg.id}`}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Istakni
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
