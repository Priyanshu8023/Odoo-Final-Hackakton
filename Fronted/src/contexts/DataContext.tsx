import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { apiClient, ApiError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { Contact } from '@/types/contact';

interface Product {
  id: string;
  name: string;
  type: string;
  sales_price: number;
  purchase_price: number;
  hsn_code?: string;
  category_id?: string;
  sale_tax_id?: string;
  purchase_tax_id?: string;
  category_name?: string;
  sale_tax_name?: string;
  sale_tax_rate?: number;
  purchase_tax_name?: string;
  purchase_tax_rate?: number;
  created_at: string;
}

interface Tax {
  id: string;
  tax_name: string;
  computation_method: string;
  rate: number;
  applicable_on: string;
  created_at: string;
}

interface DataContextType {
  // Data
  contacts: Contact[];
  products: Product[];
  taxes: Tax[];
  
  // Loading states
  contactsLoading: boolean;
  productsLoading: boolean;
  taxesLoading: boolean;
  
  // Actions
  refreshContacts: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshTaxes: () => Promise<void>;
  refreshAll: () => Promise<void>;
  
  // Create actions
  createContact: (contactData: any) => Promise<boolean>;
  createProduct: (productData: any) => Promise<boolean>;
  createTax: (taxData: any) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [taxes, setTaxes] = useState<Tax[]>([]);
  
  const [contactsLoading, setContactsLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [taxesLoading, setTaxesLoading] = useState(false);
  
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const refreshContacts = useCallback(async () => {
    try {
      setContactsLoading(true);
      console.log('Fetching contacts...');
      const response = await apiClient.getContacts();
      console.log('Contacts response:', response);
      if (response.success) {
        setContacts(response.data.contacts);
        console.log('Contacts loaded:', response.data.contacts.length);
      } else {
        console.error('Failed to fetch contacts:', response);
        toast({
          title: "Error",
          description: response.message || "Failed to fetch contacts",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to fetch contacts",
        variant: "destructive",
      });
    } finally {
      setContactsLoading(false);
    }
  }, [toast]);

  const refreshProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      const response = await apiClient.getProducts();
      if (response.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setProductsLoading(false);
    }
  }, [toast]);

  const refreshTaxes = useCallback(async () => {
    try {
      setTaxesLoading(true);
      const response = await apiClient.getTaxes();
      if (response.success) {
        setTaxes(response.data.taxes);
      }
    } catch (error) {
      console.error('Error fetching taxes:', error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to fetch taxes",
        variant: "destructive",
      });
    } finally {
      setTaxesLoading(false);
    }
  }, [toast]);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshContacts(),
      refreshProducts(),
      refreshTaxes()
    ]);
  }, [refreshContacts, refreshProducts, refreshTaxes]);

  // Wait for authentication to complete before making API calls
  useEffect(() => {
    if (!authLoading && user) {
      console.log('Authentication complete, refreshing data...');
      refreshAll();
    }
  }, [authLoading, user, refreshAll]);

  const createContact = useCallback(async (contactData: any): Promise<boolean> => {
    try {
      console.log('Creating contact with data:', contactData);
      const response = await apiClient.createContact(contactData);
      console.log('Create contact response:', response);
      if (response.success) {
        toast({
          title: "Success",
          description: "Contact created successfully",
        });
        // Refresh all data to ensure consistency
        await refreshAll();
        return true;
      } else {
        console.error('Failed to create contact:', response);
        toast({
          title: "Error",
          description: response.message || "Failed to create contact",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error creating contact:', error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to create contact",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, refreshAll]);

  const createProduct = useCallback(async (productData: any): Promise<boolean> => {
    try {
      const response = await apiClient.createProduct(productData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Product created successfully",
        });
        await refreshProducts();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to create product",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, refreshProducts]);

  const createTax = useCallback(async (taxData: any): Promise<boolean> => {
    try {
      const response = await apiClient.createTax(taxData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Tax created successfully",
        });
        await refreshTaxes();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating tax:', error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to create tax",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, refreshTaxes]);

  const value: DataContextType = {
    contacts,
    products,
    taxes,
    contactsLoading,
    productsLoading,
    taxesLoading,
    refreshContacts,
    refreshProducts,
    refreshTaxes,
    refreshAll,
    createContact,
    createProduct,
    createTax,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

