import { useState } from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Upload, X } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { HeroSlide } from "@shared/schema";

export default function HeroSliderManagement() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    titleME: '',
    titleEN: '',
    subtitleME: '',
    subtitleEN: '',
    image: '',
    sortOrder: 0,
    isActive: 1,
  });

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  const { data: slides = [], refetch } = useQuery<HeroSlide[]>({
    queryKey: ["/api/admin/hero-slides"],
  });

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
      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("POST", "/api/hero-slides", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hero-slides"] });
      queryClient.invalidateQueries({ queryKey: ["/api/hero-slides"] });
      toast({
        title: "Slide created",
        description: "Hero slide has been created successfully",
      });
      resetForm();
      setIsDialogOpen(false);
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create slide",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      await apiRequest("PATCH", `/api/hero-slides/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hero-slides"] });
      queryClient.invalidateQueries({ queryKey: ["/api/hero-slides"] });
      toast({
        title: "Slide updated",
        description: "Hero slide has been updated successfully",
      });
      resetForm();
      setEditingSlide(null);
      setIsDialogOpen(false);
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update slide",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/hero-slides/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hero-slides"] });
      queryClient.invalidateQueries({ queryKey: ["/api/hero-slides"] });
      toast({
        title: "Slide deleted",
        description: "Hero slide has been deleted successfully",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete slide",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingImage(true);
      await uploadMutation.mutateAsync(file);
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlide) {
      updateMutation.mutate({ id: editingSlide.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      titleME: '',
      titleEN: '',
      subtitleME: '',
      subtitleEN: '',
      image: '',
      sortOrder: 0,
      isActive: 1,
    });
    setEditingSlide(null);
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      titleME: slide.titleME,
      titleEN: slide.titleEN,
      subtitleME: slide.subtitleME,
      subtitleEN: slide.subtitleEN,
      image: slide.image,
      sortOrder: slide.sortOrder,
      isActive: slide.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleReorder = (slideId: string, direction: 'up' | 'down') => {
    const slideIndex = slides.findIndex(s => s.id === slideId);
    if (slideIndex === -1) return;

    const targetIndex = direction === 'up' ? slideIndex - 1 : slideIndex + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const currentSlide = slides[slideIndex];
    const targetSlide = slides[targetIndex];

    updateMutation.mutate({
      id: currentSlide.id,
      data: { sortOrder: targetSlide.sortOrder },
    });

    updateMutation.mutate({
      id: targetSlide.id,
      data: { sortOrder: currentSlide.sortOrder },
    });
  };

  if (!user) {
    setLocation("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Hero Slider Management</h1>
              <p className="text-sm text-muted-foreground">Manage homepage carousel slides</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setLocation("/admin")} data-testid="button-back-admin">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Hero Slides</h2>
            <p className="text-muted-foreground mt-1">Create and manage carousel slides</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-slide">
                <Plus className="h-4 w-4 mr-2" />
                Add Slide
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingSlide ? 'Edit Slide' : 'Create New Slide'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="titleME">Title (ME)</Label>
                    <Input
                      id="titleME"
                      value={formData.titleME}
                      onChange={(e) => setFormData(prev => ({ ...prev, titleME: e.target.value }))}
                      required
                      data-testid="input-title-me"
                    />
                  </div>
                  <div>
                    <Label htmlFor="titleEN">Title (EN)</Label>
                    <Input
                      id="titleEN"
                      value={formData.titleEN}
                      onChange={(e) => setFormData(prev => ({ ...prev, titleEN: e.target.value }))}
                      required
                      data-testid="input-title-en"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subtitleME">Subtitle (ME)</Label>
                    <Input
                      id="subtitleME"
                      value={formData.subtitleME}
                      onChange={(e) => setFormData(prev => ({ ...prev, subtitleME: e.target.value }))}
                      required
                      data-testid="input-subtitle-me"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitleEN">Subtitle (EN)</Label>
                    <Input
                      id="subtitleEN"
                      value={formData.subtitleEN}
                      onChange={(e) => setFormData(prev => ({ ...prev, subtitleEN: e.target.value }))}
                      required
                      data-testid="input-subtitle-en"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image">Slide Image</Label>
                  <div className="mt-2">
                    {formData.image ? (
                      <div className="relative">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                          data-testid="button-remove-image"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded-md p-4 space-y-2">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={uploadingImage}
                          data-testid="input-image"
                        />
                        <p className="text-xs text-muted-foreground">
                          Preporučene dimenzije: 1920x800px (široka) | Max: 5MB | Format: JPG, PNG
                        </p>
                        {uploadingImage && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) }))}
                      data-testid="input-sort-order"
                    />
                  </div>
                  <div>
                    <Label htmlFor="isActive">Status</Label>
                    <select
                      id="isActive"
                      value={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: parseInt(e.target.value) }))}
                      className="w-full h-10 rounded-md border border-input bg-background px-3"
                      data-testid="select-status"
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(false);
                    }}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending || !formData.image}
                    data-testid="button-submit"
                  >
                    {editingSlide ? 'Update' : 'Create'} Slide
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {slides.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No slides yet. Create your first slide!</p>
              </CardContent>
            </Card>
          ) : (
            slides.map((slide, index) => (
              <Card key={slide.id} data-testid={`card-slide-${slide.id}`}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={slide.image}
                      alt={slide.titleEN}
                      className="w-32 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{slide.titleME} / {slide.titleEN}</h3>
                          <p className="text-sm text-muted-foreground">{slide.subtitleME} / {slide.subtitleEN}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-muted rounded">Order: {slide.sortOrder}</span>
                            <span className={`text-xs px-2 py-1 rounded ${slide.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {slide.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleReorder(slide.id, 'up')}
                            disabled={index === 0}
                            data-testid={`button-move-up-${slide.id}`}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleReorder(slide.id, 'down')}
                            disabled={index === slides.length - 1}
                            data-testid={`button-move-down-${slide.id}`}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleEdit(slide)}
                            data-testid={`button-edit-${slide.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="destructive"
                                data-testid={`button-delete-${slide.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Slide</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this slide? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(slide.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
