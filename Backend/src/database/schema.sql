-- =================================================================
-- ENUM TYPES: For data integrity and efficiency.
-- =================================================================
CREATE TYPE contact_type AS ENUM ('Customer', 'Vendor', 'Both');
CREATE TYPE product_type AS ENUM ('Goods', 'Service');
CREATE TYPE tax_computation AS ENUM ('Percentage', 'Fixed');
CREATE TYPE tax_applicability AS ENUM ('Sales', 'Purchase', 'Both');
CREATE TYPE coa_type AS ENUM ('Asset', 'Liability', 'Income', 'Expense', 'Equity');
CREATE TYPE transaction_status AS ENUM ('Draft', 'Posted', 'Paid', 'Cancelled');
CREATE TYPE order_status AS ENUM ('Draft', 'Confirmed', 'Completed', 'Cancelled');
CREATE TYPE user_role AS ENUM ('Admin', 'Invoicing User', 'Contact');
CREATE TYPE journal_ref_type AS ENUM ('CustomerInvoice', 'VendorBill', 'Payment');
CREATE TYPE stock_ref_type AS ENUM ('CustomerInvoice', 'VendorBill');

-- =================================================================
-- 1. MASTER DATA TABLES
-- =================================================================

-- Chart of Accounts: The financial backbone of the system.
CREATE TABLE chart_of_accounts (
    id BIGSERIAL PRIMARY KEY,
    account_name VARCHAR(255) NOT NULL UNIQUE,
    account_type coa_type NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contacts: Customers and Vendors.
CREATE TABLE contacts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type contact_type NOT NULL,
    email VARCHAR(255) UNIQUE,
    mobile VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    profile_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users & Roles: System users and their permissions.
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL,
    contact_id BIGINT, -- Links a 'Contact' user to their contact record
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_user_contact FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE SET NULL
);

-- Taxes: Defines tax rates for sales and purchases.
CREATE TABLE taxes (
    id BIGSERIAL PRIMARY KEY,
    tax_name VARCHAR(100) NOT NULL UNIQUE,
    computation_method tax_computation NOT NULL,
    rate NUMERIC(5, 2) NOT NULL,
    applicable_on tax_applicability NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product Categories: To organize products.
CREATE TABLE product_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products: Goods and services offered by the business.
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type product_type NOT NULL,
    sales_price NUMERIC(12, 2) NOT NULL,
    purchase_price NUMERIC(12, 2) NOT NULL,
    hsn_code VARCHAR(50),
    category_id BIGINT,
    sale_tax_id BIGINT,
    purchase_tax_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_product_category FOREIGN KEY(category_id) REFERENCES product_categories(id) ON DELETE SET NULL,
    CONSTRAINT fk_product_sale_tax FOREIGN KEY(sale_tax_id) REFERENCES taxes(id) ON DELETE RESTRICT,
    CONSTRAINT fk_product_purchase_tax FOREIGN KEY(purchase_tax_id) REFERENCES taxes(id) ON DELETE RESTRICT
);

-- =================================================================
-- 2. TRANSACTION TABLES
-- =================================================================

-- Purchase Orders and their line items.
CREATE TABLE purchase_orders (
    id BIGSERIAL PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    order_date DATE NOT NULL,
    status order_status NOT NULL DEFAULT 'Draft',
    total_amount NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_po_vendor FOREIGN KEY(vendor_id) REFERENCES contacts(id) ON DELETE RESTRICT
);

CREATE TABLE purchase_order_items (
    id BIGSERIAL PRIMARY KEY,
    po_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL,
    tax_id BIGINT,
    subtotal NUMERIC(12, 2) NOT NULL,
    CONSTRAINT fk_poi_po FOREIGN KEY(po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_poi_product FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE RESTRICT,
    CONSTRAINT fk_poi_tax FOREIGN KEY(tax_id) REFERENCES taxes(id) ON DELETE RESTRICT
);

-- Vendor Bills and their line items.
CREATE TABLE vendor_bills (
    id BIGSERIAL PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    purchase_order_id BIGINT,
    bill_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    amount_paid NUMERIC(12, 2) DEFAULT 0.00,
    status transaction_status NOT NULL DEFAULT 'Draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_bill_vendor FOREIGN KEY(vendor_id) REFERENCES contacts(id) ON DELETE RESTRICT,
    CONSTRAINT fk_bill_po FOREIGN KEY(purchase_order_id) REFERENCES purchase_orders(id) ON DELETE SET NULL
);

CREATE TABLE vendor_bill_items (
    id BIGSERIAL PRIMARY KEY,
    bill_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL,
    tax_id BIGINT,
    subtotal NUMERIC(12, 2) NOT NULL,
    CONSTRAINT fk_billi_bill FOREIGN KEY(bill_id) REFERENCES vendor_bills(id) ON DELETE CASCADE,
    CONSTRAINT fk_billi_product FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE RESTRICT,
    CONSTRAINT fk_billi_tax FOREIGN KEY(tax_id) REFERENCES taxes(id) ON DELETE RESTRICT
);

-- Sales Orders and their line items.
CREATE TABLE sales_orders (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    order_date DATE NOT NULL,
    status order_status NOT NULL DEFAULT 'Draft',
    total_amount NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_so_customer FOREIGN KEY(customer_id) REFERENCES contacts(id) ON DELETE RESTRICT
);

CREATE TABLE sales_order_items (
    id BIGSERIAL PRIMARY KEY,
    so_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL,
    tax_id BIGINT,
    subtotal NUMERIC(12, 2) NOT NULL,
    CONSTRAINT fk_soi_so FOREIGN KEY(so_id) REFERENCES sales_orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_soi_product FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE RESTRICT,
    CONSTRAINT fk_soi_tax FOREIGN KEY(tax_id) REFERENCES taxes(id) ON DELETE RESTRICT
);

-- Customer Invoices and their line items.
CREATE TABLE customer_invoices (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    sales_order_id BIGINT,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    amount_paid NUMERIC(12, 2) DEFAULT 0.00,
    status transaction_status NOT NULL DEFAULT 'Draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_inv_customer FOREIGN KEY(customer_id) REFERENCES contacts(id) ON DELETE RESTRICT,
    CONSTRAINT fk_inv_so FOREIGN KEY(sales_order_id) REFERENCES sales_orders(id) ON DELETE SET NULL
);

CREATE TABLE customer_invoice_items (
    id BIGSERIAL PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL,
    tax_id BIGINT,
    subtotal NUMERIC(12, 2) NOT NULL,
    CONSTRAINT fk_invi_invoice FOREIGN KEY(invoice_id) REFERENCES customer_invoices(id) ON DELETE CASCADE,
    CONSTRAINT fk_invi_product FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE RESTRICT,
    CONSTRAINT fk_invi_tax FOREIGN KEY(tax_id) REFERENCES taxes(id) ON DELETE RESTRICT
);

-- =================================================================
-- 3. SYSTEM & REPORTING BACKEND TABLES
-- =================================================================

-- Payments made or received.
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    payment_date DATE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    payment_account_id BIGINT NOT NULL, -- FK to CoA (e.g., Cash, Bank account)
    reference_type journal_ref_type NOT NULL, -- 'CustomerInvoice' or 'VendorBill'
    reference_id BIGINT NOT NULL, -- ID of the invoice or bill being paid
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_payment_account FOREIGN KEY(payment_account_id) REFERENCES chart_of_accounts(id) ON DELETE RESTRICT
);

-- Journal Entries: Header for each financial transaction.
CREATE TABLE journal_entries (
    id BIGSERIAL PRIMARY KEY,
    entry_date DATE NOT NULL,
    description TEXT,
    reference_type journal_ref_type NOT NULL,
    reference_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ledger Postings: The debit/credit lines for double-entry accounting.
CREATE TABLE ledger_postings (
    id BIGSERIAL PRIMARY KEY,
    journal_entry_id BIGINT NOT NULL,
    account_id BIGINT NOT NULL,
    debit_amount NUMERIC(12, 2) DEFAULT 0.00,
    credit_amount NUMERIC(12, 2) DEFAULT 0.00,
    CONSTRAINT fk_posting_journal FOREIGN KEY(journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
    CONSTRAINT fk_posting_account FOREIGN KEY(account_id) REFERENCES chart_of_accounts(id) ON DELETE RESTRICT,
    CHECK (debit_amount >= 0 AND credit_amount >= 0),
    CHECK (debit_amount + credit_amount > 0)
);

-- Stock Movements: For inventory tracking.
CREATE TABLE stock_movements (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    movement_date DATE NOT NULL,
    quantity_in NUMERIC(10, 2) DEFAULT 0.00,
    quantity_out NUMERIC(10, 2) DEFAULT 0.00,
    reference_type stock_ref_type NOT NULL, -- 'VendorBill' for IN, 'CustomerInvoice' for OUT
    reference_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_stock_product FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE,
    CHECK (quantity_in >= 0 AND quantity_out >= 0),
    CHECK (quantity_in + quantity_out > 0)
);

-- =================================================================
-- INDEXES: For performance optimization.
-- =================================================================
CREATE INDEX ON users (email);
CREATE INDEX ON contacts (name);
CREATE INDEX ON products (name);
CREATE INDEX ON vendor_bills (vendor_id, bill_date);
CREATE INDEX ON customer_invoices (customer_id, invoice_date);
CREATE INDEX ON ledger_postings (account_id);
CREATE INDEX ON stock_movements (product_id);
