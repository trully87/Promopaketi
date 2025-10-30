import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCustomPackageSectionSchema } from "@shared/schema";
import type { CustomPackageSection } from "@shared/schema";
import { z } from "zod";
import { useState, useEffect } from "react";

const formSchema = insertCustomPackageSectionSchema;
type FormData = z.infer<typeof formSchema>;

export default function CustomPackageSectionManagement() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const { data: section, isLoading, error } = useQuery<CustomPackageSection>({
    queryKey: ["/api/admin/custom-package-section"],
    retry: false,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titleME: "",
      titleEN: "",
      descriptionME: "",
      descriptionEN: "",
      ctaTextME: "",
      ctaTextEN: "",
      image: "",
    },
  });

  useEffect(() => {
    if (section) {
      form.reset({
        titleME: section.titleME,
        titleEN: section.titleEN,
        descriptionME: section.descriptionME,
        descriptionEN: section.descriptionEN,
        ctaTextME: section.ctaTextME,
        ctaTextEN: section.ctaTextEN,
        image: section.image,
      });
    }
  }, [section, form]);

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest("POST", "/api/admin/custom-package-section", data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/admin/custom-package-section"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/custom-package-section"] });
      toast({
        title: "Success",
        description: "Custom package section created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create custom package section",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!section) return;
      await apiRequest("PATCH", `/api/admin/custom-package-section/${section.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/custom-package-section"] });
      queryClient.invalidateQueries({ queryKey: ["/api/custom-package-section"] });
      toast({
        title: "Success",
        description: "Custom package section updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update custom package section",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      form.setValue("image", data.url);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: FormData) => {
    if (section) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/admin")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Custom Package Section</h1>
                <p className="text-sm text-muted-foreground">Manage homepage custom package CTA</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>{section ? "Edit" : "Create"} Custom Package Section</CardTitle>
            <CardDescription>
              {section ? "Update" : "Create"} the custom package section content and image displayed on homepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Image Upload */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Image</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {field.value && (
                            <img
                              src={field.value}
                              alt="Custom package section"
                              className="w-full h-64 object-cover rounded-md"
                            />
                          )}
                          <div className="flex items-center gap-4">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={uploading}
                              data-testid="input-image"
                            />
                            {uploading && (
                              <div className="text-sm text-muted-foreground">Uploading...</div>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Montenegrin/Serbian Content */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold">Crnogorski/Srpski Sadržaj</h3>
                  
                  <FormField
                    control={form.control}
                    name="titleME"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Naslov (ME)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Kreirajte Svoj Savršeni Paket" data-testid="input-title-me" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="descriptionME"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opis (ME)</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={4} data-testid="textarea-description-me" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ctaTextME"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CTA Tekst Dugmeta (ME)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Kontaktirajte Nas" data-testid="input-cta-me" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* English Content */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold">English Content</h3>
                  
                  <FormField
                    control={form.control}
                    name="titleEN"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (EN)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Create Your Perfect Package" data-testid="input-title-en" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="descriptionEN"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (EN)</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={4} data-testid="textarea-description-en" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ctaTextEN"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CTA Button Text (EN)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Contact Us" data-testid="input-cta-en" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending || createMutation.isPending}
                    data-testid="button-save"
                  >
                    {(updateMutation.isPending || createMutation.isPending) ? "Saving..." : section ? "Save Changes" : "Create Section"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
