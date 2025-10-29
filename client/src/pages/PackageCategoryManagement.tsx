import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { PackageCategory } from "@shared/schema";

export default function PackageCategoryManagement() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PackageCategory | null>(null);
  const [formData, setFormData] = useState({
    labelME: "",
    labelEN: "",
    value: "",
    sortOrder: 0,
    isActive: 1,
  });

  const { data: authQuery } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  const { data: categories = [], isLoading } = useQuery<PackageCategory[]>({
    queryKey: ["/api/admin/package-categories"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("POST", "/api/admin/package-categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/package-categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/package-categories"] });
      toast({
        title: "Uspešno!",
        description: "Kategorija je uspešno kreirana",
      });
      handleCloseDialog();
    },
    onError: () => {
      toast({
        title: "Greška",
        description: "Nije moguće kreirati kategoriju",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      await apiRequest("PATCH", `/api/admin/package-categories/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/package-categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/package-categories"] });
      toast({
        title: "Uspešno!",
        description: "Kategorija je uspešno ažurirana",
      });
      handleCloseDialog();
    },
    onError: () => {
      toast({
        title: "Greška",
        description: "Nije moguće ažurirati kategoriju",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/package-categories/${id}`, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/package-categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/package-categories"] });
      toast({
        title: "Uspešno!",
        description: "Kategorija je uspešno obrisana",
      });
    },
    onError: () => {
      toast({
        title: "Greška",
        description: "Nije moguće obrisati kategoriju",
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (category?: PackageCategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        labelME: category.labelME,
        labelEN: category.labelEN,
        value: category.value,
        sortOrder: category.sortOrder,
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        labelME: "",
        labelEN: "",
        value: "",
        sortOrder: categories.length,
        isActive: 1,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({
      labelME: "",
      labelEN: "",
      value: "",
      sortOrder: 0,
      isActive: 1,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete ovu kategoriju?")) {
      deleteMutation.mutate(id);
    }
  };

  if (!authQuery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/admin")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Kategorije Paketa</h1>
              <p className="text-sm text-muted-foreground">
                Upravljajte kategorijama poklon paketa
              </p>
            </div>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            data-testid="button-add-category"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Kategorija
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Sve Kategorije</CardTitle>
            <CardDescription>
              Ovde možete dodati, urediti ili obrisati kategorije paketa
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Učitavanje...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Nema kategorija. Kliknite "Nova Kategorija" da dodate prvu.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Red</TableHead>
                    <TableHead>Naziv (ME)</TableHead>
                    <TableHead>Naziv (EN)</TableHead>
                    <TableHead>Vrednost (ID)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Akcije</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{category.sortOrder}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {category.labelME}
                      </TableCell>
                      <TableCell>{category.labelEN}</TableCell>
                      <TableCell>
                        <code className="px-2 py-1 bg-muted rounded text-sm">
                          {category.value}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant={category.isActive === 1 ? "default" : "secondary"}>
                          {category.isActive === 1 ? "Aktivna" : "Neaktivna"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(category)}
                            data-testid={`button-edit-${category.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(category.id)}
                            data-testid={`button-delete-${category.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Uredi Kategoriju" : "Nova Kategorija"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="labelME">Naziv (Crnogorski)</Label>
              <Input
                id="labelME"
                value={formData.labelME}
                onChange={(e) => setFormData({ ...formData, labelME: e.target.value })}
                placeholder="npr. Novogodišnji Paketi"
                required
                data-testid="input-label-me"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="labelEN">Naziv (Engleski)</Label>
              <Input
                id="labelEN"
                value={formData.labelEN}
                onChange={(e) => setFormData({ ...formData, labelEN: e.target.value })}
                placeholder="e.g. New Year Packages"
                required
                data-testid="input-label-en"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Vrednost (ID)</Label>
              <Input
                id="value"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="npr. novogodisnji, eko, lokalni"
                required
                data-testid="input-value"
              />
              <p className="text-xs text-muted-foreground">
                Koristi se za identifikaciju kategorije. Samo mala slova, bez razmaka.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Redosled Prikaza</Label>
              <Input
                id="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                min={0}
                required
                data-testid="input-sort-order"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isActive">Status</Label>
              <select
                id="isActive"
                value={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: parseInt(e.target.value) })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                data-testid="select-active"
              >
                <option value={1}>Aktivna</option>
                <option value={0}>Neaktivna</option>
              </select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                data-testid="button-cancel"
              >
                Otkaži
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save"
              >
                {(createMutation.isPending || updateMutation.isPending) ? "Čuvanje..." : "Sačuvaj"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
