import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Package as PackageIcon, ImageIcon, Menu, Phone, Info, Mail, Tags, Sparkles } from "lucide-react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      setLocation("/admin/login");
    },
  });

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    setLocation("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PackageIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Brain Box Admin</h1>
              <p className="text-sm text-muted-foreground">Package Management</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Manage website content and packages
          </p>
        </div>

        {/* Content Management Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover-elevate cursor-pointer" onClick={() => setLocation("/admin/packages")} data-testid="card-packages">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <PackageIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Packages</CardTitle>
                  <CardDescription>Manage gift packages</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover-elevate cursor-pointer" onClick={() => setLocation("/admin/package-categories")} data-testid="card-categories">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Tags className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Package Categories</CardTitle>
                  <CardDescription>Manage categories</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover-elevate cursor-pointer" onClick={() => setLocation("/admin/hero-slider")} data-testid="card-hero">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Hero Slider</CardTitle>
                  <CardDescription>Homepage carousel</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover-elevate cursor-pointer" onClick={() => setLocation("/admin/menu-items")} data-testid="card-menu">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Menu className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Navigation Menu</CardTitle>
                  <CardDescription>Menu items & links</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover-elevate cursor-pointer" onClick={() => setLocation("/admin/contact-info")} data-testid="card-contact">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Contact Info</CardTitle>
                  <CardDescription>Contact & social links</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover-elevate cursor-pointer" onClick={() => setLocation("/admin/about")} data-testid="card-about">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>About Page</CardTitle>
                  <CardDescription>About Us content</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover-elevate cursor-pointer" onClick={() => setLocation("/admin/newsletter-subscribers")} data-testid="card-newsletter">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Newsletter</CardTitle>
                  <CardDescription>Email subscribers</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover-elevate cursor-pointer" onClick={() => setLocation("/admin/custom-package-section")} data-testid="card-custom-section">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Custom Package Section</CardTitle>
                  <CardDescription>Homepage CTA section</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
