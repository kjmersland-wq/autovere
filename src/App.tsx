import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./i18n/config";
import { LangSync } from "./i18n/LangSync";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import CarDetail, { CarsIndex } from "./pages/CarDetail.tsx";
import Compare, { CompareIndex } from "./pages/Compare.tsx";
import CollectionDetail, { CollectionsIndex } from "./pages/Collection.tsx";
import PersonalityDetail, { PersonalitiesIndex } from "./pages/Personality.tsx";
import LearnArticle, { LearnIndex } from "./pages/Learn.tsx";
import Watch from "./pages/Watch.tsx";
import Pricing from "./pages/Pricing.tsx";
import Contact from "./pages/Contact.tsx";
import Help from "./pages/Help.tsx";
import Discover from "./pages/Discover.tsx";
import Terms from "./pages/legal/Terms.tsx";
import Privacy from "./pages/legal/Privacy.tsx";
import Cookies from "./pages/legal/Cookies.tsx";
import Refund from "./pages/legal/Refund.tsx";
import Subscriptions from "./pages/legal/Subscriptions.tsx";
import Studio from "./pages/Studio.tsx";

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

const AppRoutes = () => (
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
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/help" element={<Help />} />
    <Route path="/discover" element={<Discover />} />
    <Route path="/legal/terms" element={<Terms />} />
    <Route path="/legal/privacy" element={<Privacy />} />
    <Route path="/legal/cookies" element={<Cookies />} />
    <Route path="/legal/refund" element={<Refund />} />
    <Route path="/legal/subscriptions" element={<Subscriptions />} />
    <Route path="/studio" element={<Studio />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollManager />
        <LangSync />
        <Routes>
          {/* Localized routes — same tree mounted under each language prefix */}
          <Route path="/en/*" element={<AppRoutes />} />
          <Route path="/no/*" element={<AppRoutes />} />
          <Route path="/de/*" element={<AppRoutes />} />
          <Route path="/sv/*" element={<AppRoutes />} />
          {/* Default (English) at root */}
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
