import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, ArrowLeft, Package as PackageIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Package, PackageCategory } from "@shared/schema";

export default function PackageManagement() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: packages = [], isLoading: packagesLoading, refetch } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const { data: categories = [] } = useQuery<PackageCategory[]>({
    queryKey: ["/api/package-categories"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/packages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      toast({
        title: "Package deleted",
        description: "Package has been deleted successfully",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive",
      });
    },
  });

  const getCategoryLabel = (categoryValue: string) => {
    const category = categories.find(c => c.value === categoryValue);
    return category?.labelEN || categoryValue;
  };

  if (packagesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading packages...</p>
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
              <PackageIcon className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Package Management</h1>
                <p className="text-sm text-muted-foreground">Manage all gift packages</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">All Packages</h2>
            <p className="text-muted-foreground mt-1">
              Total: {packages.length} packages
            </p>
          </div>
          <Button
            onClick={() => setLocation("/admin/packages/new")}
            data-testid="button-create-package"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Package
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Packages</CardTitle>
            <CardDescription>
              View, edit, and delete promotional gift packages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {packages.length === 0 ? (
              <div className="text-center py-12">
                <PackageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No packages yet</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first package
                </p>
                <Button onClick={() => setLocation("/admin/packages/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Package
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name (ME)</TableHead>
                    <TableHead>Name (EN)</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Min Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id} data-testid={`row-package-${pkg.id}`}>
                      <TableCell>
                        <img
                          src={pkg.image}
                          alt={pkg.nameME}
                          className="h-12 w-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{pkg.nameME}</TableCell>
                      <TableCell>{pkg.nameEN}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getCategoryLabel(pkg.category)}
                        </Badge>
                      </TableCell>
                      <TableCell>€{pkg.price}</TableCell>
                      <TableCell>{pkg.minOrder} pcs</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLocation(`/admin/packages/${pkg.id}/edit`)}
                            data-testid={`button-edit-${pkg.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                data-testid={`button-delete-${pkg.id}`}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Package</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{pkg.nameME}"? This action cannot be undone and will also delete all associated products.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(pkg.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  data-testid="button-confirm-delete"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
