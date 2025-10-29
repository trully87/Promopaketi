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
import { Save, Upload, X } from "lucide-react";
import type { AboutPage } from "@shared/schema";

export default function AboutPageManagement() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    titleME: '',
    titleEN: '',
    contentME: '',
    contentEN: '',
    missionME: '',
    missionEN: '',
    visionME: '',
    visionEN: '',
    image: '',
  });

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  const { data: aboutPage, isLoading } = useQuery<AboutPage>({
    queryKey: ["/api/admin/about"],
  });

  // Update form when data loads
  useEffect(() => {
    if (aboutPage) {
      setFormData({
        titleME: aboutPage.titleME || '',
        titleEN: aboutPage.titleEN || '',
        contentME: aboutPage.contentME || '',
        contentEN: aboutPage.contentEN || '',
        missionME: aboutPage.missionME || '',
        missionEN: aboutPage.missionEN || '',
        visionME: aboutPage.visionME || '',
        visionEN: aboutPage.visionEN || '',
        image: aboutPage.image || '',
      });
    }
  }, [aboutPage]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: (data) => {
      setFormData(prev => ({ ...prev, image: data.url }));
      setUploadingImage(false);
      toast({
        title: "Slika uploadovana",
        description: "Slika je uspešno uploadovana",
      });
    },
    onError: () => {
      setUploadingImage(false);
      toast({
        title: "Greška",
        description: "Neuspešan upload slike",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingImage(true);
      uploadMutation.mutate(file);
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!aboutPage?.id) {
        throw new Error("About page not initialized");
      }
      await apiRequest("PATCH", `/api/admin/about/${aboutPage.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/about"] });
      queryClient.invalidateQueries({ queryKey: ["/api/about"] });
      toast({
        title: "Stranica sačuvana",
        description: "O Nama stranica je uspešno ažurirana",
      });
    },
    onError: () => {
      toast({
        title: "Greška",
        description: "Neuspešno ažuriranje stranice",
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
            <h1 className="text-3xl font-bold" data-testid="text-page-title">O Nama Stranica</h1>
            <p className="text-muted-foreground mt-1">Upravljajte sadržajem O Nama stranice</p>
          </div>
          <Button variant="outline" onClick={() => setLocation('/admin')} data-testid="button-back">
            Nazad
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sadržaj Stranice</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8" data-testid="text-loading">Učitavanje...</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Titles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="titleME">Naslov (Crnogorski) *</Label>
                    <Input
                      id="titleME"
                      data-testid="input-title-me"
                      value={formData.titleME}
                      onChange={(e) => setFormData(prev => ({ ...prev, titleME: e.target.value }))}
                      placeholder="O Nama"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="titleEN">Title (English) *</Label>
                    <Input
                      id="titleEN"
                      data-testid="input-title-en"
                      value={formData.titleEN}
                      onChange={(e) => setFormData(prev => ({ ...prev, titleEN: e.target.value }))}
                      placeholder="About Us"
                      required
                    />
                  </div>
                </div>

                {/* Main Content */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contentME">Glavni Sadržaj (Crnogorski) *</Label>
                    <Textarea
                      id="contentME"
                      data-testid="input-content-me"
                      value={formData.contentME}
                      onChange={(e) => setFormData(prev => ({ ...prev, contentME: e.target.value }))}
                      placeholder="Opišite vašu kompaniju, istoriju, vrednosti..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contentEN">Main Content (English) *</Label>
                    <Textarea
                      id="contentEN"
                      data-testid="input-content-en"
                      value={formData.contentEN}
                      onChange={(e) => setFormData(prev => ({ ...prev, contentEN: e.target.value }))}
                      placeholder="Describe your company, history, values..."
                      rows={6}
                      required
                    />
                  </div>
                </div>

                {/* Mission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="missionME">Misija (Crnogorski)</Label>
                    <Textarea
                      id="missionME"
                      data-testid="input-mission-me"
                      value={formData.missionME}
                      onChange={(e) => setFormData(prev => ({ ...prev, missionME: e.target.value }))}
                      placeholder="Naša misija je..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="missionEN">Mission (English)</Label>
                    <Textarea
                      id="missionEN"
                      data-testid="input-mission-en"
                      value={formData.missionEN}
                      onChange={(e) => setFormData(prev => ({ ...prev, missionEN: e.target.value }))}
                      placeholder="Our mission is..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="visionME">Vizija (Crnogorski)</Label>
                    <Textarea
                      id="visionME"
                      data-testid="input-vision-me"
                      value={formData.visionME}
                      onChange={(e) => setFormData(prev => ({ ...prev, visionME: e.target.value }))}
                      placeholder="Naša vizija je..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visionEN">Vision (English)</Label>
                    <Textarea
                      id="visionEN"
                      data-testid="input-vision-en"
                      value={formData.visionEN}
                      onChange={(e) => setFormData(prev => ({ ...prev, visionEN: e.target.value }))}
                      placeholder="Our vision is..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image">Slika (opciono)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      data-testid="input-image-upload"
                      className="flex-1"
                    />
                    {formData.image && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        data-testid="button-remove-image"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Preporučene dimenzije: 1200x800px | Max: 5MB | Format: JPG, PNG
                  </p>
                  {formData.image && (
                    <div className="mt-2">
                      <img
                        src={formData.image}
                        alt="About page"
                        className="w-full max-w-md h-48 object-cover rounded-md"
                        data-testid="img-preview"
                      />
                    </div>
                  )}
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
