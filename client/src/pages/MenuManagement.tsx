import { useState } from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { MenuItem } from "@shared/schema";

export default function MenuManagement() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    labelME: '',
    labelEN: '',
    path: '',
    sortOrder: 0,
    isActive: 1,
  });

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  const { data: menuItems = [], refetch } = useQuery<MenuItem[]>({
    queryKey: ["/api/admin/menu-items"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("POST", "/api/menu-items", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/menu-items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({
        title: "Menu item created",
        description: "Menu item has been created successfully",
      });
      resetForm();
      setIsDialogOpen(false);
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create menu item",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      await apiRequest("PATCH", `/api/menu-items/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/menu-items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({
        title: "Menu item updated",
        description: "Menu item has been updated successfully",
      });
      resetForm();
      setEditingItem(null);
      setIsDialogOpen(false);
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update menu item",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/menu-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/menu-items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({
        title: "Menu item deleted",
        description: "Menu item has been deleted successfully",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      labelME: '',
      labelEN: '',
      path: '',
      sortOrder: 0,
      isActive: 1,
    });
    setEditingItem(null);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      labelME: item.labelME,
      labelEN: item.labelEN,
      path: item.path,
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleReorder = (itemId: string, direction: 'up' | 'down') => {
    const itemIndex = menuItems.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;

    const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    if (targetIndex < 0 || targetIndex >= menuItems.length) return;

    const currentItem = menuItems[itemIndex];
    const targetItem = menuItems[targetIndex];

    updateMutation.mutate({
      id: currentItem.id,
      data: { sortOrder: targetItem.sortOrder },
    });

    updateMutation.mutate({
      id: targetItem.id,
      data: { sortOrder: currentItem.sortOrder },
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
              <h1 className="text-2xl font-bold">Menu Management</h1>
              <p className="text-sm text-muted-foreground">Manage navigation menu items</p>
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
            <h2 className="text-3xl font-bold">Navigation Menu Items</h2>
            <p className="text-muted-foreground mt-1">Create and manage menu navigation</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-menu-item">
                <Plus className="h-4 w-4 mr-2" />
                Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Create New Menu Item'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="labelME">Label (ME)</Label>
                    <Input
                      id="labelME"
                      value={formData.labelME}
                      onChange={(e) => setFormData(prev => ({ ...prev, labelME: e.target.value }))}
                      required
                      data-testid="input-label-me"
                      placeholder="Početna"
                    />
                  </div>
                  <div>
                    <Label htmlFor="labelEN">Label (EN)</Label>
                    <Input
                      id="labelEN"
                      value={formData.labelEN}
                      onChange={(e) => setFormData(prev => ({ ...prev, labelEN: e.target.value }))}
                      required
                      data-testid="input-label-en"
                      placeholder="Home"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="path">Path (URL or ID)</Label>
                  <Input
                    id="path"
                    value={formData.path}
                    onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
                    required
                    data-testid="input-path"
                    placeholder="/ or #packages or #contact"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use "/" for pages or "#elementId" for scroll to element
                  </p>
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
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-submit"
                  >
                    {editingItem ? 'Update' : 'Create'} Menu Item
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {menuItems.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No menu items yet. Create your first menu item!</p>
              </CardContent>
            </Card>
          ) : (
            menuItems.map((item, index) => (
              <Card key={item.id} data-testid={`card-menu-item-${item.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.labelME} / {item.labelEN}</h3>
                      <p className="text-sm text-muted-foreground">Path: {item.path}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-muted rounded">Order: {item.sortOrder}</span>
                        <span className={`text-xs px-2 py-1 rounded ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleReorder(item.id, 'up')}
                        disabled={index === 0}
                        data-testid={`button-move-up-${item.id}`}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleReorder(item.id, 'down')}
                        disabled={index === menuItems.length - 1}
                        data-testid={`button-move-down-${item.id}`}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                        data-testid={`button-edit-${item.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="destructive"
                            data-testid={`button-delete-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this menu item? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(item.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
