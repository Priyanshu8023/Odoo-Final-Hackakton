import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, ChevronRight, ChevronDown, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ChartOfAccountsFormDialog } from "@/components/chartOfAccounts/ChartOfAccountsFormDialog";
import Header from "@/components/layout/Header";
import { apiClient, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ChartOfAccount {
  id: string;
  account_name: string;
  account_type: string;
  description?: string;
  created_at: string;
  account_code?: string;
  balance?: number;
  is_active?: boolean;
  parent_id?: string;
}

const ChartOfAccounts = () => {
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ChartOfAccount | null>(null);
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Group accounts by type and create hierarchical structure
  const groupedAccounts = accounts.reduce((groups, account) => {
    const type = account.account_type.toLowerCase();
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(account);
    return groups;
  }, {} as Record<string, ChartOfAccount[]>);

  // Account type configuration
  const accountTypes = [
    { key: 'asset', label: 'Assets', color: 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm' },
    { key: 'liability', label: 'Liabilities', color: 'bg-red-100 text-red-800 border-red-300 shadow-sm' },
    { key: 'income', label: 'Revenue', color: 'bg-purple-100 text-purple-800 border-purple-300 shadow-sm' },
    { key: 'expense', label: 'Expenses', color: 'bg-orange-100 text-orange-800 border-orange-300 shadow-sm' },
    { key: 'equity', label: 'Equity', color: 'bg-green-100 text-green-800 border-green-300 shadow-sm' },
  ];

  // Generate account codes based on type
  const generateAccountCode = (type: string, index: number) => {
    const baseCodes = {
      'asset': 1000,
      'liability': 2000,
      'equity': 3000,
      'income': 4000,
      'expense': 5000
    };
    return (baseCodes[type as keyof typeof baseCodes] || 1000) + (index * 100);
  };

  // Calculate summary statistics
  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter(acc => acc.is_active !== false).length;
  const inactiveAccounts = totalAccounts - activeAccounts;

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getChartOfAccounts();
      if (response.success) {
        // Add generated account codes and map backend isArchived to frontend is_active
        const accountsWithCodes = response.data.accounts.map((account: any, index: number) => ({
          ...account,
          account_code: generateAccountCode(account.account_type, index),
          balance: 0,
          is_active: !account.isArchived, // Map backend isArchived to frontend is_active
          parent_id: null
        }));
        setAccounts(accountsWithCodes);
      }
    } catch (error) {
      console.error("Error fetching chart of accounts:", error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to fetch chart of accounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreateAccount = async (accountData: any) => {
    try {
      console.log("ChartOfAccounts: handleCreateAccount called with data:", accountData);
      const response = await apiClient.createChartOfAccount(accountData);
      console.log("ChartOfAccounts: API response:", response);
      if (response.success) {
        toast({
          title: "Success",
          description: "Account created successfully",
        });
        fetchAccounts();
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to create account",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAccount = async (id: string, accountData: any) => {
    try {
      const response = await apiClient.updateChartOfAccount(id, accountData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Account updated successfully",
        });
        fetchAccounts();
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating account:", error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to update account",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        const response = await apiClient.deleteChartOfAccount(id);
        if (response.success) {
          toast({
            title: "Success",
            description: "Account deleted successfully",
          });
          fetchAccounts();
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        toast({
          title: "Error",
          description: error instanceof ApiError ? error.message : "Failed to delete account",
          variant: "destructive",
        });
      }
    }
  };

  const toggleAccountExpansion = (accountId: string) => {
    setExpandedAccounts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(accountId)) {
        newSet.delete(accountId);
      } else {
        newSet.add(accountId);
      }
      return newSet;
    });
  };

  const openCreateDialog = () => {
    console.log("ChartOfAccounts: openCreateDialog called");
    setEditingAccount(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (account: ChartOfAccount) => {
    setEditingAccount(account);
    setIsDialogOpen(true);
  };

  const handleStatusToggle = async (accountId: string, isActive: boolean) => {
    try {
      console.log('Toggling account status:', accountId, isActive);
      const response = await apiClient.updateChartOfAccountStatus(accountId, isActive);
      console.log('Status update response:', response);
      
      if (response.success) {
        toast({
          title: "Success",
          description: `Account ${isActive ? 'activated' : 'deactivated'} successfully`,
        });
        // Update the local state
        setAccounts(prevAccounts => 
          prevAccounts.map(account => 
            account.id === accountId 
              ? { ...account, is_active: isActive }
              : account
          )
        );
      }
    } catch (error) {
      console.error('Error updating account status:', error);
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to update account status",
        variant: "destructive",
      });
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case "asset":
        return "bg-blue-100 text-blue-800 border-blue-300 shadow-sm";
      case "liability":
        return "bg-red-100 text-red-800 border-red-300 shadow-sm";
      case "income":
        return "bg-purple-100 text-purple-800 border-purple-300 shadow-sm";
      case "expense":
        return "bg-orange-100 text-orange-800 border-orange-300 shadow-sm";
      case "equity":
        return "bg-green-100 text-green-800 border-green-300 shadow-sm";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300 shadow-sm";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Chart of Accounts" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Chart of Accounts" />
      
      <main className="p-6">
        {/* Summary Bar */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Manage your accounting structure with a hierarchical chart of accounts.
          </h1>
          <div className="flex items-center space-x-6 bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Total Accounts:</span> {totalAccounts}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-green-600">Active:</span> {activeAccounts}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-red-600">Inactive:</span> {inactiveAccounts}
            </div>
          </div>
        </div>

        {/* Chart of Accounts Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Chart of Accounts</CardTitle>
            <Button onClick={openCreateDialog} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Account</span>
            </Button>
          </CardHeader>
          <CardContent>
            {accounts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No accounts found. Create your first account to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8"></TableHead>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accountTypes.map((type) => {
                      const accountsOfType = groupedAccounts[type.key] || [];
                      if (accountsOfType.length === 0) return null;

                      return (
                        <React.Fragment key={type.key}>
                          {/* Parent Account Type Row */}
                          <TableRow className="bg-gray-50 font-semibold">
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => toggleAccountExpansion(type.key)}
                              >
                                {expandedAccounts.has(type.key) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Folder className="h-4 w-4 text-gray-500" />
                                <span>{type.label}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono">
                              {generateAccountCode(type.key, 0)}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getTypeBadgeVariant(type.label)} border font-medium px-3 py-1 rounded-full`}>
                                {type.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatCurrency(0)}
                            </TableCell>
                            <TableCell>
                              <Switch checked={true} disabled />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>

                          {/* Child Accounts */}
                          {expandedAccounts.has(type.key) && accountsOfType.map((account) => (
                            <TableRow key={account.id} className="hover:bg-gray-50">
                              <TableCell>
                                <div className="w-6"></div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2 ml-4">
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                  <span>{account.account_name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono">
                                {account.account_code}
                              </TableCell>
                              <TableCell>
                                <Badge className={`${getTypeBadgeVariant(account.account_type)} border font-medium px-3 py-1 rounded-full`}>
                                  {account.account_type}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {formatCurrency(account.balance || 0)}
                              </TableCell>
                              <TableCell>
                                <Switch 
                                  checked={account.is_active !== false} 
                                  onCheckedChange={(checked) => {
                                    handleStatusToggle(account.id, checked);
                                  }}
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                                    onClick={() => openEditDialog(account)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                    onClick={() => handleDeleteAccount(account.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <ChartOfAccountsFormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingAccount(null);
        }}
        onSave={editingAccount ? (data) => handleUpdateAccount(editingAccount.id, data) : handleCreateAccount}
        account={editingAccount}
        existingAccounts={accounts}
      />
    </div>
  );
};

export default ChartOfAccounts;