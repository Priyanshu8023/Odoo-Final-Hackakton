import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ContactMaster from "./pages/ContactMaster";
import ProductMaster from "./pages/ProductMaster";
import TaxMaster from "./pages/TaxMaster";
import ChartOfAccounts from "./pages/ChartOfAccounts";
import CreateId from "./pages/createid";
import Login from "./pages/login";
import Signup from "./pages/signup";
import NotFound from "./pages/NotFound";
import PartnerLedgerPage from "./pages/reports/PartnerLedgerPage";
import ProfitLossPage from "./pages/reports/ProfitLossPage";
import BalanceSheetPage from "./pages/reports/BalanceSheetPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/createid" element={<CreateId />} />
          <Route path="/contact-master" element={<ContactMaster />} />
          <Route path="/product-master" element={<ProductMaster />} />
          <Route path="/taxes-master" element={<TaxMaster />} />
          <Route path="/chart-of-accounts" element={<ChartOfAccounts />} />
          <Route path="/reports/partner-ledger" element={<PartnerLedgerPage />} />
          <Route path="/reports/profit-loss" element={<ProfitLossPage />} />
          <Route path="/reports/balance-sheet" element={<BalanceSheetPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
