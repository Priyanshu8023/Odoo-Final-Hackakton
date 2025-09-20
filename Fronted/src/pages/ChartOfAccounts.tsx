import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartOfAccountsFormDialog } from "@/components/chartOfAccounts/ChartOfAccountsFormDialog";
import Header from "@/components/layout/Header";
import { apiClient, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ChartOfAccount {
  id: number;
  account_name: string;
  account_type: string;
  description?: string;
  created_at: string;
}

const ChartOfAccounts = () => {
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ChartOfAccount | null>(null);
  const { toast } = useToast();

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getChartOfAccounts();
      if (response.success) {
        setAccounts(response.data.accounts);
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
      const response = await apiClient.createChartOfAccount(accountData);
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

  const openCreateDialog = () => {
    setEditingAccount(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (account: ChartOfAccount) => {
    setEditingAccount(account);
    setIsDialogOpen(true);
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "Asset":
        return "default";
      case "Liability":
        return "destructive";
      case "Income":
        return "secondary";
      case "Expense":
        return "outline";
      case "Equity":
        return "default";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dashboard-bg">
        <Header title="Chart of Accounts" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Header title="Chart of Accounts" />
      
      <main className="p-6">
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.account_name}</TableCell>
                      <TableCell>
                        <Badge variant={getTypeBadgeVariant(account.account_type)}>
                          {account.account_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{account.description || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(account)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
        onSubmit={handleCreateAccount}
        initialData={editingAccount}
      />
    </div>
  );
};

export default ChartOfAccounts;