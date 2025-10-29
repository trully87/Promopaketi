import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import type { Package, PackageProduct, PackageCategory } from "@shared/schema";

const packageFormSchema = z.object({
  nameME: z.string().min(1, "Name (ME) is required"),
  nameEN: z.string().min(1, "Name (EN) is required"),
  price: z.string().min(1, "Price is required"),
  minOrder: z.string().min(1, "Min order is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().min(1, "Package image is required"),
  products: z.array(z.object({
    nameME: z.string().min(1, "Product name (ME) is required"),
    nameEN: z.string().min(1, "Product name (EN) is required"),
    descriptionME: z.string().min(1, "Description (ME) is required"),
    descriptionEN: z.string().min(1, "Description (EN) is required"),
    specsME: z.string().optional(),
    specsEN: z.string().optional(),
    images: z.array(z.string()).default([]),
  })).default([]),
});

type PackageFormData = z.infer<typeof packageFormSchema>;

export default function PackageForm() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const isEditing = !!params.id;

  const { data: existingPackage } = useQuery<Package>({
    queryKey: ["/api/packages", params.id],
    enabled: isEditing,
  });

  const { data: existingProducts = [] } = useQuery<PackageProduct[]>({
    queryKey: ["/api/packages", params.id, "products"],
    enabled: isEditing,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<PackageCategory[]>({
    queryKey: ["/api/package-categories"],
  });

  const form = useForm<PackageFormData>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      nameME: "",
      nameEN: "",
      price: "",
      minOrder: "30",
      category: "",
      image: "",
      products: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  useEffect(() => {
    if (existingPackage) {
      form.reset({
        nameME: existingPackage.nameME,
        nameEN: existingPackage.nameEN,
        price: existingPackage.price.toString(),
        minOrder: existingPackage.minOrder.toString(),
        category: existingPackage.category,
        image: existingPackage.image,
        products: existingProducts.map(p => ({
          nameME: p.nameME,
          nameEN: p.nameEN,
          descriptionME: p.descriptionME,
          descriptionEN: p.descriptionEN,
          specsME: p.specsME || "",
          specsEN: p.specsEN || "",
          images: (p.images as string[]) || [],
        })),
      });
    }
  }, [existingPackage, existingProducts, form]);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    
    setUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Upload failed");
      }
      
      const data = await res.json();
      return data.url;
    } finally {
      setUploading(false);
    }
  };

  const handlePackageImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      form.setValue("image", url);
      toast({
        title: "Image uploaded",
        description: "Package image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, productIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      const currentImages = form.getValues(`products.${productIndex}.images`) || [];
      form.setValue(`products.${productIndex}.images`, [...currentImages, url]);
      toast({
        title: "Image uploaded",
        description: "Product image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (data: PackageFormData) => {
      const packageData = {
        nameME: data.nameME,
        nameEN: data.nameEN,
        price: parseInt(data.price),
        minOrder: parseInt(data.minOrder),
        category: data.category,
        image: data.image,
      };

      let pkg: Package;
      if (isEditing) {
        const res = await apiRequest("PATCH", `/api/packages/${params.id}`, packageData);
        pkg = await res.json();
      } else {
        const res = await apiRequest("POST", "/api/packages", packageData);
        pkg = await res.json();
      }

      for (const product of data.products) {
        await apiRequest("POST", `/api/packages/${pkg.id}/products`, {
          ...product,
          packageId: pkg.id,
          sortOrder: 0,
        });
      }

      return pkg;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      toast({
        title: isEditing ? "Package updated" : "Package created",
        description: `Package has been ${isEditing ? "updated" : "created"} successfully`,
      });
      setLocation("/admin");
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} package`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PackageFormData) => {
    saveMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/admin")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{isEditing ? "Edit Package" : "Create Package"}</h1>
          <p className="text-muted-foreground mt-1">
            {isEditing ? "Update package details and products" : "Add a new promotional gift package"}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Package Details</CardTitle>
                <CardDescription>Basic information about the package</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nameME"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name (Montenegrin)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Naziv paketa" data-testid="input-name-me" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nameEN"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name (English)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Package name" data-testid="input-name-en" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (€)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="25" data-testid="input-price" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Order</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="30" data-testid="input-min-order" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={categoriesLoading}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder={categoriesLoading ? "Loading categories..." : categories.length === 0 ? "No categories available" : "Select category"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.length === 0 && !categoriesLoading ? (
                              <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                                No categories available. Please create categories first.
                              </div>
                            ) : (
                              categories.map((category) => (
                                <SelectItem key={category.id} value={category.value}>
                                  {category.labelEN}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Image</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handlePackageImageUpload}
                            disabled={uploading}
                            data-testid="input-package-image"
                          />
                          {field.value && (
                            <div className="mt-2">
                              <img
                                src={field.value}
                                alt="Package preview"
                                className="h-32 w-32 object-cover rounded"
                                data-testid="img-package-preview"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>Upload main package image</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>Individual items in this package</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({
                      nameME: "",
                      nameEN: "",
                      descriptionME: "",
                      descriptionEN: "",
                      specsME: "",
                      specsEN: "",
                      images: [],
                    })}
                    data-testid="button-add-product"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No products added yet. Click "Add Product" to get started.
                  </div>
                ) : (
                  fields.map((field, index) => (
                    <Card key={field.id} className="border-2">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Product {index + 1}</CardTitle>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => remove(index)}
                            data-testid={`button-remove-product-${index}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`products.${index}.nameME`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name (ME)</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Naziv proizvoda" data-testid={`input-product-name-me-${index}`} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`products.${index}.nameEN`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name (EN)</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Product name" data-testid={`input-product-name-en-${index}`} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`products.${index}.descriptionME`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description (ME)</FormLabel>
                                <FormControl>
                                  <Textarea {...field} placeholder="Opis proizvoda" rows={3} data-testid={`input-product-desc-me-${index}`} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`products.${index}.descriptionEN`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description (EN)</FormLabel>
                                <FormControl>
                                  <Textarea {...field} placeholder="Product description" rows={3} data-testid={`input-product-desc-en-${index}`} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`products.${index}.specsME`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Specifications (ME) - Optional</FormLabel>
                                <FormControl>
                                  <Textarea {...field} placeholder="Specifikacije" rows={2} data-testid={`input-product-specs-me-${index}`} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`products.${index}.specsEN`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Specifications (EN) - Optional</FormLabel>
                                <FormControl>
                                  <Textarea {...field} placeholder="Specifications" rows={2} data-testid={`input-product-specs-en-${index}`} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`products.${index}.images`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Images (up to 3)</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  {field.value && field.value.length < 3 && (
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleProductImageUpload(e, index)}
                                      disabled={uploading}
                                      data-testid={`input-product-image-${index}`}
                                    />
                                  )}
                                  {field.value && field.value.length > 0 && (
                                    <div className="flex gap-2 mt-2">
                                      {field.value.map((img, imgIndex) => (
                                        <div key={imgIndex} className="relative">
                                          <img
                                            src={img}
                                            alt={`Product ${index + 1} image ${imgIndex + 1}`}
                                            className="h-20 w-20 object-cover rounded"
                                            data-testid={`img-product-preview-${index}-${imgIndex}`}
                                          />
                                          <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute -top-2 -right-2 h-6 w-6"
                                            onClick={() => {
                                              const newImages = field.value.filter((_, i) => i !== imgIndex);
                                              form.setValue(`products.${index}.images`, newImages);
                                            }}
                                            data-testid={`button-remove-image-${index}-${imgIndex}`}
                                          >
                                            ×
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </FormControl>
                              <FormDescription>Upload up to 3 images for this product</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/admin")}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saveMutation.isPending || uploading}
                data-testid="button-save"
              >
                {saveMutation.isPending ? "Saving..." : isEditing ? "Update Package" : "Create Package"}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
