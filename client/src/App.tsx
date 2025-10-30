import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/i18n";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ComparisonBar from "@/components/ComparisonBar";
import Home from "@/pages/Home";
import About from "@/pages/About";
import SearchPage from "@/pages/SearchPage";
import CategoryPage from "@/pages/CategoryPage";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import PackageForm from "@/pages/PackageForm";
import HeroSliderManagement from "@/pages/HeroSliderManagement";
import MenuManagement from "@/pages/MenuManagement";
import ContactInfoManagement from "@/pages/ContactInfoManagement";
import AboutPageManagement from "@/pages/AboutPageManagement";
import NewsletterSubscribers from "@/pages/NewsletterSubscribers";
import PackageCategoryManagement from "@/pages/PackageCategoryManagement";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={SearchPage} />
      <Route path="/packages/:category" component={CategoryPage} />
      <Route path="/about" component={About} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/hero-slider" component={HeroSliderManagement} />
      <Route path="/admin/menu-items" component={MenuManagement} />
      <Route path="/admin/contact-info" component={ContactInfoManagement} />
      <Route path="/admin/about" component={AboutPageManagement} />
      <Route path="/admin/newsletter-subscribers" component={NewsletterSubscribers} />
      <Route path="/admin/package-categories" component={PackageCategoryManagement} />
      <Route path="/admin/packages/new" component={PackageForm} />
      <Route path="/admin/packages/:id/edit" component={PackageForm} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <RecentlyViewedProvider>
            <FavoritesProvider>
              <ComparisonProvider>
                <div className="flex flex-col min-h-screen">
                  <Navigation />
                  <main className="flex-1">
                    <Router />
                  </main>
                  <Footer />
                </div>
                <ComparisonBar />
              </ComparisonProvider>
            </FavoritesProvider>
          </RecentlyViewedProvider>
        </LanguageProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
