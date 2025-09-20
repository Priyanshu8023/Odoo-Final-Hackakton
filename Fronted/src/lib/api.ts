const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'An unknown error occurred',
        0
      );
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        user: {
          id: number;
          email: string;
          role: string;
          contact_id?: number;
        };
        token: string;
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    role?: string;
    name: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        user: {
          id: string;
          email: string;
          role: string;
          name: string;
          organizationId: string;
          createdAt: string;
        };
        token: string;
      };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Contact endpoints
  async getContacts() {
    return this.request<{
      success: boolean;
      data: {
        contacts: Array<{
          _id: string;
          name: string;
          type: string[];
          email?: string;
          mobile?: string;
          address?: {
            city?: string;
            state?: string;
            pincode?: string;
          };
          profileImageURL?: string;
          createdAt: string;
        }>;
        pagination: {
          current: number;
          pages: number;
          total: number;
        };
      };
    }>('/customers');
  }

  async createContact(contactData: {
    name: string;
    type: string[];
    email?: string;
    mobile?: string;
    address?: {
      city?: string;
      state?: string;
      pincode?: string;
    };
    profileImageURL?: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        contact: any;
      };
    }>('/customers', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  async updateContact(id: string, contactData: any) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        contact: any;
      };
    }>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contactData),
    });
  }

  async deleteContact(id: string) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        contact: any;
      };
    }>(`/customers/${id}`, {
      method: 'DELETE',
    });
  }

  // Product endpoints
  async getProducts() {
    return this.request<{
      success: boolean;
      data: {
        products: Array<{
          id: number;
          name: string;
          type: string;
          sales_price: number;
          purchase_price: number;
          hsn_code?: string;
          category_id?: number;
          sale_tax_id?: number;
          purchase_tax_id?: number;
          category_name?: string;
          sale_tax_name?: string;
          sale_tax_rate?: number;
          purchase_tax_name?: string;
          purchase_tax_rate?: number;
          created_at: string;
        }>;
      };
    }>('/products');
  }

  async createProduct(productData: {
    name: string;
    type: string;
    salesPrice: number;
    purchasePrice: number;
    hsnCode?: string;
    category?: string;
    saleTaxId?: string;
    purchaseTaxId?: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        product: any;
      };
    }>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        product: any;
      };
    }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        product: any;
      };
    }>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Invoice endpoints
  async getInvoices() {
    return this.request<{
      success: boolean;
      data: {
        invoices: Array<{
          id: number;
          customer_id: number;
          sales_order_id?: number;
          invoice_date: string;
          due_date: string;
          total_amount: number;
          amount_paid: number;
          status: string;
          customer_name?: string;
          customer_email?: string;
          customer_mobile?: string;
          created_at: string;
        }>;
      };
    }>('/invoices');
  }

  async createInvoice(invoiceData: {
    customer_id: number;
    sales_order_id?: number;
    invoice_date: string;
    due_date: string;
    status?: string;
    items: Array<{
      product_id: number;
      quantity: number;
      unit_price: number;
      tax_id?: number;
    }>;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        invoice: any;
      };
    }>('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  }

  async updateInvoice(id: number, invoiceData: any) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        invoice: any;
      };
    }>(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(invoiceData),
    });
  }

  async deleteInvoice(id: number) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        invoice: any;
      };
    }>(`/invoices/${id}`, {
      method: 'DELETE',
    });
  }

  // Tax endpoints
  async getTaxes() {
    return this.request<{
      success: boolean;
      data: {
        taxes: Array<{
          id: number;
          tax_name: string;
          computation_method: string;
          rate: number;
          applicable_on: string;
          created_at: string;
        }>;
      };
    }>('/taxes');
  }

  async createTax(taxData: {
    tax_name: string;
    computation_method: string;
    rate: number;
    applicable_on: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        tax: any;
      };
    }>('/taxes', {
      method: 'POST',
      body: JSON.stringify(taxData),
    });
  }

  async updateTax(id: string, taxData: {
    tax_name: string;
    computation_method: string;
    rate: number;
    applicable_on: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        tax: any;
      };
    }>(`/taxes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taxData),
    });
  }

  async deleteTax(id: string) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        tax: any;
      };
    }>(`/taxes/${id}`, {
      method: 'DELETE',
    });
  }

  // Product Category endpoints
  async getProductCategories() {
    return this.request<{
      success: boolean;
      data: {
        categories: Array<{
          id: number;
          name: string;
          created_at: string;
        }>;
      };
    }>('/product-categories');
  }

  async createProductCategory(categoryData: {
    name: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        category: any;
      };
    }>('/product-categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  // Chart of Accounts endpoints
  async getChartOfAccounts() {
    return this.request<{
      success: boolean;
      data: {
        accounts: Array<{
          id: number;
          account_name: string;
          account_type: string;
          description?: string;
          created_at: string;
        }>;
      };
    }>('/chart-of-accounts');
  }

  async createChartOfAccount(accountData: {
    account_name: string;
    account_type: string;
    description?: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        account: any;
      };
    }>('/chart-of-accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  }

  async updateChartOfAccount(id: string, accountData: {
    account_name: string;
    account_type: string;
    description?: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        account: any;
      };
    }>(`/chart-of-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(accountData),
    });
  }

  async deleteChartOfAccount(id: string) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        account: any;
      };
    }>(`/chart-of-accounts/${id}`, {
      method: 'DELETE',
    });
  }

  async updateChartOfAccountStatus(id: string, isActive: boolean) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        account: any;
      };
    }>(`/chart-of-accounts/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isArchived: !isActive }),
    });
  }

  // Reports endpoints
  async getPartnerLedger(params: {
    partnerId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  } = {}) {
    const queryParams = new URLSearchParams();
    if (params.partnerId) queryParams.append('partner_id', params.partnerId);
    if (params.startDate) queryParams.append('start_date', params.startDate);
    if (params.endDate) queryParams.append('end_date', params.endDate);
    if (params.search) queryParams.append('search', params.search);

    return this.request<{
      success: boolean;
      data: {
        entries: Array<{
          id: string;
          date: string;
          description: string;
          reference: string;
          debit: number;
          credit: number;
          balance: number;
          type: 'invoice' | 'payment' | 'credit_note' | 'debit_note';
          partner_name: string;
        }>;
        summary: {
          total_debit: number;
          total_credit: number;
          current_balance: number;
        };
      };
    }>(`/reports/partner-ledger?${queryParams.toString()}`);
  }

  async getPartners() {
    return this.request<{
      success: boolean;
      data: {
        partners: Array<{
          id: string;
          name: string;
          type: string;
          email?: string;
        }>;
      };
    }>('/customers');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export { ApiError };
