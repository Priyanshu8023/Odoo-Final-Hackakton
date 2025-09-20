export interface ChartOfAccount {
  id: string;
  accountName: string;
  accountCode: string;
  accountType: AccountType;
  parentId?: string;
  description?: string;
  isActive: boolean;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChartOfAccountFormData {
  accountName: string;
  accountCode: string;
  accountType: AccountType;
  parentId?: string;
  description?: string;
  isActive: boolean;
}

export type AccountType = 
  | 'Assets'
  | 'Liabilities' 
  | 'Equity'
  | 'Revenue'
  | 'Expenses';

export interface AccountTypeInfo {
  type: AccountType;
  label: string;
  description: string;
  normalBalance: 'Debit' | 'Credit';
  color: string;
}

export const ACCOUNT_TYPES: AccountTypeInfo[] = [
  {
    type: 'Assets',
    label: 'Assets',
    description: 'Resources owned by the business',
    normalBalance: 'Debit',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    type: 'Liabilities',
    label: 'Liabilities',
    description: 'Debts and obligations',
    normalBalance: 'Credit',
    color: 'bg-red-100 text-red-800'
  },
  {
    type: 'Equity',
    label: 'Equity',
    description: 'Owner\'s interest in the business',
    normalBalance: 'Credit',
    color: 'bg-green-100 text-green-800'
  },
  {
    type: 'Revenue',
    label: 'Revenue',
    description: 'Income from business operations',
    normalBalance: 'Credit',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    type: 'Expenses',
    label: 'Expenses',
    description: 'Costs incurred in business operations',
    normalBalance: 'Debit',
    color: 'bg-orange-100 text-orange-800'
  }
];
