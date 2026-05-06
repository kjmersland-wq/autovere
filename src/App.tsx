import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import CarDetail, { CarsIndex } from "./pages/CarDetail.tsx";
import Compare, { CompareIndex } from "./pages/Compare.tsx";
import CollectionDetail, { CollectionsIndex } from "./pages/Collection.tsx";
import PersonalityDetail, { PersonalitiesIndex } from "./pages/Personality.tsx";
import LearnArticle, { LearnIndex } from "./pages/Learn.tsx";
import Watch from "./pages/Watch.tsx";

const queryClient = new QueryClient();

const ScrollManager = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollManager />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cars" element={<CarsIndex />} />
          <Route path="/cars/:slug" element={<CarDetail />} />
          <Route path="/compare" element={<CompareIndex />} />
          <Route path="/compare/:slug" element={<Compare />} />
          <Route path="/collections" element={<CollectionsIndex />} />
          <Route path="/collections/:slug" element={<CollectionDetail />} />
          <Route path="/personalities" element={<PersonalitiesIndex />} />
          <Route path="/personalities/:slug" element={<PersonalityDetail />} />
          <Route path="/learn" element={<LearnIndex />} />
          <Route path="/learn/:slug" element={<LearnArticle />} />
          <Route path="/watch" element={<Watch />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
