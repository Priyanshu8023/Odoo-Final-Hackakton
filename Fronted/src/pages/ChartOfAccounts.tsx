import { useState } from "react";
import { Plus, Edit, Trash2, Eye, BarChart3, ChevronRight, ChevronDown, Folder, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ChartOfAccount, ChartOfAccountFormData, ACCOUNT_TYPES } from "@/types/chartOfAccounts";
import { ChartOfAccountsFormDialog } from "@/components/chartOfAccounts/ChartOfAccountsFormDialog";
import Header from "@/components/layout/Header";

// Sample data - in a real app, this would come from an API
const sampleAccounts: ChartOfAccount[] = [
  // Assets
  {
    id: "1",
    accountName: "Assets",
    accountCode: "1000",
    accountType: "Assets",
    description: "All assets of the business",
    isActive: true,
    balance: 0,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    accountName: "Cash",
    accountCode: "1100",
    accountType: "Assets",
    parentId: "1",
    description: "Cash in hand and bank",
    isActive: true,
    balance: 150000,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    accountName: "Bank",
    accountCode: "1200",
    accountType: "Assets",
    parentId: "1",
    description: "Bank accounts",
    isActive: true,
    balance: 500000,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    accountName: "Accounts Receivable",
    accountCode: "1300",
    accountType: "Assets",
    parentId: "1",
    description: "Money owed by customers",
    isActive: true,
    balance: 250000,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "5",
    accountName: "Inventory",
    accountCode: "1400",
    accountType: "Assets",
    parentId: "1",
    description: "Stock and inventory",
    isActive: true,
    balance: 300000,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "6",
    accountName: "Fixed Assets",
    accountCode: "1500",
    accountType: "Assets",
    parentId: "1",
    description: "Property, plant, and equipment",
    isActive: true,
    balance: 1000000,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },

  // Liabilities
  {
    id: "7",
    accountName: "Liabilities",
    accountCode: "2000",
    accountType: "Liabilities",
    description: "All liabilities of the business",
    isActive: true,
    balance: 0,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "8",
    accountName: "Accounts Payable",
    accountCode: "2100",
    accountType: "Liabilities",
    parentId: "7",
    description: "Money owed to suppliers",
    isActive: true,
    balance: 150000,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "9",
    accountName: "Loans",
    accountCode: "2200",
    accountType: "Liabilities",
    parentId: "7",
    description: "Bank loans and borrowings",
    isActive: true,
    balance: 400000,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },

  // Equity
  {
    id: "10",
    accountName: "Equity",
    accountCode: "3000",
    accountType: "Equity",
    description: "Owner's equity in the business",
    isActive: true,
    balance: 0,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "11",
    accountName: "Capital",
    accountCode: "3100",
    accountType: "Equity",
    parentId: "10",
    description: "Owner's capital investment",
    isActive: true,
    balance: 1000000,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },

  // Revenue
  {
    id: "12",
    accountName: "Revenue",
    accountCode: "4000",
    accountType: "Revenue",
    description: "All revenue accounts",
    isActive: true,
    balance: 0,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "13",
    accountName: "Sales",
    accountCode: "4100",
    accountType: "Revenue",
    parentId: "12",
    description: "Sales revenue",
    isActive: true,
    balance: 800000,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "14",
    accountName: "Other Income",
    accountCode: "4200",
    accountType: "Revenue",
    parentId: "12",
    description: "Other sources of income",
    isActive: true,
    balance: 50000,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },

  // Expenses
  {
    id: "15",
    accountName: "Expenses",
    accountCode: "5000",
    accountType: "Expenses",
    description: "All expense accounts",
    isActive: true,
    balance: 0,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "16",
    accountName: "Purchase",
    accountCode: "5100",
    accountType: "Expenses",
    parentId: "15",
    description: "Cost of goods purchased",
    isActive: true,
    balance: 400000,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "17",
    accountName: "Rent",
    accountCode: "5200",
    accountType: "Expenses",
    parentId: "15",
    description: "Rent and lease expenses",
    isActive: true,
    balance: 60000,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "18",
    accountName: "Salary",
    accountCode: "5300",
    accountType: "Expenses",
    parentId: "15",
    description: "Employee salaries and wages",
    isActive: true,
    balance: 200000,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "19",
    accountName: "Other Expenses",
    accountCode: "5400",
    accountType: "Expenses",
    parentId: "15",
    description: "Miscellaneous expenses",
    isActive: true,
    balance: 40000,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

const ChartOfAccounts = () => {
  const [accounts, setAccounts] = useState<ChartOfAccount[]>(sampleAccounts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ChartOfAccount | null>(null);
  const [viewingAccount, setViewingAccount] = useState<ChartOfAccount | null>(null);
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set(['1', '7', '10', '12', '15']));

  const handleCreateAccount = () => {
    setEditingAccount(null);
    setIsFormOpen(true);
  };

  const handleEditAccount = (account: ChartOfAccount) => {
    setEditingAccount(account);
    setIsFormOpen(true);
  };

  const handleViewAccount = (account: ChartOfAccount) => {
    setViewingAccount(account);
    setIsFormOpen(true);
  };

  const handleDeleteAccount = (accountId: string) => {
    setAccounts(accounts.filter(account => account.id !== accountId));
  };

  const handleToggleActive = (accountId: string) => {
    setAccounts(accounts.map(account => 
      account.id === accountId 
        ? { ...account, isActive: !account.isActive, updatedAt: new Date() }
        : account
    ));
  };

  const handleSaveAccount = (formData: ChartOfAccountFormData) => {
    if (editingAccount) {
      // Update existing account
      setAccounts(accounts.map(account => 
        account.id === editingAccount.id 
          ? { 
              ...account, 
              ...formData, 
              updatedAt: new Date() 
            }
          : account
      ));
    } else {
      // Create new account
      const newAccount: ChartOfAccount = {
        id: Date.now().toString(),
        ...formData,
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setAccounts([...accounts, newAccount]);
    }
    setIsFormOpen(false);
    setEditingAccount(null);
    setViewingAccount(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAccount(null);
    setViewingAccount(null);
  };

  const toggleExpanded = (accountId: string) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
    } else {
      newExpanded.add(accountId);
    }
    setExpandedAccounts(newExpanded);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getAccountTypeInfo = (type: string) => {
    return ACCOUNT_TYPES.find(t => t.type === type) || ACCOUNT_TYPES[0];
  };

  const getChildAccounts = (parentId: string) => {
    return accounts.filter(account => account.parentId === parentId);
  };

  const getParentAccounts = () => {
    return accounts.filter(account => !account.parentId);
  };

  const renderAccountRow = (account: ChartOfAccount, level: number = 0) => {
    const hasChildren = getChildAccounts(account.id).length > 0;
    const isExpanded = expandedAccounts.has(account.id);
    const typeInfo = getAccountTypeInfo(account.accountType);

    return (
      <TableRow key={account.id} className="hover:bg-gray-50">
        <TableCell style={{ paddingLeft: `${level * 20 + 12}px` }}>
          <div className="flex items-center space-x-2">
            {hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpanded(account.id)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <div className="w-6" />
            )}
            {hasChildren ? (
              <Folder className="h-4 w-4 text-blue-500" />
            ) : (
              <FileText className="h-4 w-4 text-gray-400" />
            )}
            <span className="font-medium">{account.accountName}</span>
          </div>
        </TableCell>
        <TableCell>
          <span className="font-mono text-sm">{account.accountCode}</span>
        </TableCell>
        <TableCell>
          <Badge className={typeInfo.color}>
            {account.accountType}
          </Badge>
        </TableCell>
        <TableCell className="font-mono text-right">
          {formatCurrency(account.balance)}
        </TableCell>
        <TableCell>
          <div className="flex items-center space-x-2">
            <Switch
              checked={account.isActive}
              onCheckedChange={() => handleToggleActive(account.id)}
              className="data-[state=checked]:bg-green-600"
            />
            <span className={`text-sm ${account.isActive ? 'text-green-600' : 'text-gray-500'}`}>
              {account.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewAccount(account)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditAccount(account)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteAccount(account.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const renderAccountHierarchy = (parentAccount: ChartOfAccount, level: number = 0) => {
    const children = getChildAccounts(parentAccount.id);
    
    return (
      <>
        {renderAccountRow(parentAccount, level)}
        {expandedAccounts.has(parentAccount.id) && children.map(child => 
          renderAccountHierarchy(child, level + 1)
        )}
      </>
    );
  };

  const activeAccounts = accounts.filter(account => account.isActive);
  const inactiveAccounts = accounts.filter(account => !account.isActive);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Chart of Accounts" />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Description */}
          <div className="mb-6">
            <p className="text-gray-600">
              Manage your accounting structure with a hierarchical chart of accounts
            </p>
          </div>

          {/* Actions Bar */}
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                Total Accounts: {accounts.length}
              </Badge>
              <Badge variant="default" className="text-sm bg-green-100 text-green-800">
                Active: {activeAccounts.length}
              </Badge>
              <Badge variant="outline" className="text-sm">
                Inactive: {inactiveAccounts.length}
              </Badge>
            </div>
            <Button onClick={handleCreateAccount} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add New Account</span>
            </Button>
          </div>

          {/* Chart of Accounts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Chart of Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No accounts found. Click "Add New Account" to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      getParentAccounts().map(parentAccount => 
                        renderAccountHierarchy(parentAccount)
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Account Form Dialog */}
          <ChartOfAccountsFormDialog
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            onSave={handleSaveAccount}
            account={editingAccount || viewingAccount}
            isViewMode={!!viewingAccount}
            existingAccounts={accounts}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOfAccounts;
