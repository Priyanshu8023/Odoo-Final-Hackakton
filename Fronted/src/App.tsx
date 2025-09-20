import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
            <Route 
              path="/createid" 
              element={
                <ProtectedRoute>
                  <CreateId />
                </ProtectedRoute>
              } 
            />
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
