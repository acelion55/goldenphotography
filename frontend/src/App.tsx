import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "@/contexts/AdminContext";
import { useState } from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import CategoryGallery from "./pages/CategoryGallery";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingScreen from "./components/LoadingScreen";

const queryClient = new QueryClient();

const App = () => {
  const [loaded, setLoaded] = useState(false);

  const handleLoadComplete = () => {
    setLoaded(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminProvider>
          <ErrorBoundary>
            <Toaster />
            <Sonner />
            {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}
            <BrowserRouter>
              <Routes>
                <Route path="/" element={loaded ? <Index /> : <div className="min-h-screen bg-background" />} />
                <Route path="/about" element={<About />} />
                <Route path="/category/:category" element={<CategoryGallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </AdminProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
