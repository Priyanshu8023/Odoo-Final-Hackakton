import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ContactMaster from "./pages/ContactMaster";
import ProductMaster from "./pages/ProductMaster";
import TaxMaster from "./pages/TaxMaster";
import ChartOfAccounts from "./pages/ChartOfAccounts";
import PurchaseOrder from "./pages/PurchaseOrder";
import VendorBill from "./pages/VendorBill";
import BillPayment from "./pages/BillPayment";
import Invoices from "./pages/Invoices";
import CreateId from "./pages/createid";
import Login from "./pages/login";
import Signup from "./pages/signup";
import PartnerLedger from "./pages/PartnerLedger";
import ProfitLossReport from "./pages/ProfitLossReport";
import BalanceSheetReport from "./pages/BalanceSheetReport";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/createid" element={<CreateId />} />
            <Route 
              path="/contact-master" 
              element={
                <ProtectedRoute>
                  <ContactMaster />
                </ProtectedRoute>
              } 
            />
              <Route 
                path="/product-master" 
                element={
                  <ProtectedRoute>
                    <ProductMaster />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/taxes-master" 
                element={
                  <ProtectedRoute>
                    <TaxMaster />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chart-of-accounts" 
                element={
                  <ProtectedRoute>
                    <ChartOfAccounts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/purchase-order" 
                element={
                  <ProtectedRoute>
                    <PurchaseOrder />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vendor-bill" 
                element={
                  <ProtectedRoute>
                    <VendorBill />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/bill-payment" 
                element={
                  <ProtectedRoute>
                    <BillPayment />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/invoices" 
                element={
                  <ProtectedRoute>
                    <Invoices />
                  </ProtectedRoute>
                } 
              />
              {/* Reports Routes */}
              <Route 
                path="/reports/partner-ledger" 
                element={
                  <ProtectedRoute>
                    <PartnerLedger />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports/profit-loss" 
                element={
                  <ProtectedRoute>
                    <ProfitLossReport />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports/balance-sheet" 
                element={
                  <ProtectedRoute>
                    <BalanceSheetReport />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payment-success" 
                element={
                  <ProtectedRoute>
                    <PaymentSuccess />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
