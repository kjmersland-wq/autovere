import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./i18n/config";
import { LangSync } from "./i18n/LangSync";
import { PaymentTestModeBanner } from "./components/PaymentTestModeBanner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { CookieConsent } from "./components/CookieConsent";

// Eagerly loaded — critical path
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";

// Lazy-loaded page chunks — EV ecosystem
const EVHub = lazy(() => import("./pages/ev/EVHub.tsx"));
const EVCharging = lazy(() => import("./pages/ev/EVCharging.tsx"));
const EVRoutePlanner = lazy(() => import("./pages/ev/EVRoutePlanner.tsx"));
const EVCalculator = lazy(() => import("./pages/ev/EVCalculator.tsx"));
const EVGuides = lazy(() => import("./pages/ev/EVGuides.tsx"));
const EVReviews = lazy(() => import("./pages/ev/EVReviews.tsx"));
const EVModelDetail = lazy(() => import("./pages/ev/EVModelDetail.tsx"));
const EVCompare = lazy(() => import("./pages/ev/EVCompare.tsx"));
const EVAdvisor = lazy(() => import("./pages/ev/EVAdvisor.tsx"));
const EVMarkets = lazy(() => import("./pages/ev/EVMarkets.tsx"));
const EVDatabase = lazy(() => import("./pages/ev/EVDatabase.tsx"));
const EVNews = lazy(() => import("./pages/ev/EVNews.tsx"));
const EVArticle = lazy(() => import("./pages/ev/EVArticle.tsx"));
const EVNetworkDetail = lazy(() => import("./pages/ev/EVNetworkDetail.tsx"));

// Lazy-loaded page chunks — core pages
const Garage = lazy(() => import("./pages/Garage.tsx"));
const FAQ = lazy(() => import("./pages/FAQ.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const CarDetail = lazy(() => import("./pages/CarDetail.tsx"));
const Compare = lazy(() => import("./pages/Compare.tsx"));
const CollectionDetail = lazy(() => import("./pages/Collection.tsx"));
const PersonalityDetail = lazy(() => import("./pages/Personality.tsx"));
const LearnArticle = lazy(() => import("./pages/Learn.tsx"));
const Watch = lazy(() => import("./pages/Watch.tsx"));
const Pricing = lazy(() => import("./pages/Pricing.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Help = lazy(() => import("./pages/Help.tsx"));
const Discover = lazy(() => import("./pages/Discover.tsx"));
const Studio = lazy(() => import("./pages/Studio.tsx"));
const Terms = lazy(() => import("./pages/legal/Terms.tsx"));
const Privacy = lazy(() => import("./pages/legal/Privacy.tsx"));
const Cookies = lazy(() => import("./pages/legal/Cookies.tsx"));
const Refund = lazy(() => import("./pages/legal/Refund.tsx"));
const Subscriptions = lazy(() => import("./pages/legal/Subscriptions.tsx"));

// Named exports from files with multiple exports — resolved at module level
import type { FC } from "react";

const EVModelsIndexLazy = lazy(() =>
  import("./pages/ev/EVModelDetail.tsx").then((m) => ({ default: m.EVModelsIndex }))
);
const EVNetworksIndexLazy = lazy(() =>
  import("./pages/ev/EVNetworkDetail.tsx").then((m) => ({ default: m.EVNetworksIndex }))
);
const CarsIndex = lazy(() =>
  import("./pages/CarDetail.tsx").then((m) => ({ default: m.CarsIndex as FC }))
);
const CompareIndex = lazy(() =>
  import("./pages/Compare.tsx").then((m) => ({ default: m.CompareIndex as FC }))
);
const CollectionsIndex = lazy(() =>
  import("./pages/Collection.tsx").then((m) => ({ default: m.CollectionsIndex as FC }))
);
const PersonalitiesIndex = lazy(() =>
  import("./pages/Personality.tsx").then((m) => ({ default: m.PersonalitiesIndex as FC }))
);
const LearnIndex = lazy(() =>
  import("./pages/Learn.tsx").then((m) => ({ default: m.LearnIndex as FC }))
);

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
  </div>
);

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
  <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
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
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<About />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/legal/terms" element={<Terms />} />
        <Route path="/legal/privacy" element={<Privacy />} />
        <Route path="/legal/cookies" element={<Cookies />} />
        <Route path="/legal/refund" element={<Refund />} />
        <Route path="/legal/subscriptions" element={<Subscriptions />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/garage" element={<Garage />} />
        {/* EV ecosystem */}
        <Route path="/ev" element={<EVHub />} />
        <Route path="/ev/charging" element={<EVCharging />} />
        <Route path="/ev/route-planner" element={<EVRoutePlanner />} />
        <Route path="/ev/calculator" element={<EVCalculator />} />
        <Route path="/ev/guides" element={<EVGuides />} />
        <Route path="/ev/reviews" element={<EVReviews />} />
        <Route path="/ev/models" element={<EVModelsIndexLazy />} />
        <Route path="/ev/models/:slug" element={<EVModelDetail />} />
        <Route path="/ev/networks" element={<EVNetworksIndexLazy />} />
        <Route path="/ev/networks/:slug" element={<EVNetworkDetail />} />
        <Route path="/ev/compare" element={<EVCompare />} />
        <Route path="/ev/advisor" element={<EVAdvisor />} />
        <Route path="/ev/markets" element={<EVMarkets />} />
        <Route path="/ev/database" element={<EVDatabase />} />
        <Route path="/ev/news" element={<EVNews />} />
        <Route path="/ev/news/:slug" element={<EVArticle />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </ErrorBoundary>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollManager />
          <LangSync />
          <PaymentTestModeBanner />
          <CookieConsent />
          <Routes>
            {/* Localized routes — same tree mounted under each language prefix */}
            <Route path="/en/*" element={<AppRoutes />} />
            <Route path="/no/*" element={<AppRoutes />} />
            <Route path="/de/*" element={<AppRoutes />} />
            <Route path="/sv/*" element={<AppRoutes />} />
            <Route path="/fr/*" element={<AppRoutes />} />
            <Route path="/pl/*" element={<AppRoutes />} />
            <Route path="/it/*" element={<AppRoutes />} />
            <Route path="/es/*" element={<AppRoutes />} />
            {/* Default (English) at root */}
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
