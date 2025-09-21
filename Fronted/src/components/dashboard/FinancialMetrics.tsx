import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

interface FinancialMetricProps {
  title: string;
  periods: {
    "24h": {
      value: string;
      change?: string;
      changeType?: "positive" | "negative" | "neutral";
    };
    "7d": {
      value: string;
      change?: string;
      changeType?: "positive" | "negative" | "neutral";
    };
    "30d": {
      value: string;
      change?: string;
      changeType?: "positive" | "negative" | "neutral";
    };
  };
}

function FinancialMetric({ title, periods }: FinancialMetricProps) {
  const getChangeIcon = (changeType?: "positive" | "negative" | "neutral") => {
    switch (changeType) {
      case "positive":
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case "negative":
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return null;
    }
  };

  const getChangeColor = (changeType?: "positive" | "negative" | "neutral") => {
    switch (changeType) {
      case "positive":
        return "text-green-600 bg-green-100";
      case "negative":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Last 24 hours */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {periods["24h"].value}
            </div>
            <div className="text-sm text-gray-600">Last 24 hours</div>
          </div>
          {periods["24h"].change && (
            <div className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
              getChangeColor(periods["24h"].changeType)
            )}>
              {getChangeIcon(periods["24h"].changeType)}
              <span>{periods["24h"].change}</span>
            </div>
          )}
        </div>

        {/* Last 7 Days */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {periods["7d"].value}
            </div>
            <div className="text-sm text-gray-600">Last 7 Days</div>
          </div>
          {periods["7d"].change && (
            <div className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
              getChangeColor(periods["7d"].changeType)
            )}>
              {getChangeIcon(periods["7d"].changeType)}
              <span>{periods["7d"].change}</span>
            </div>
          )}
        </div>

        {/* Last 30 Days */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {periods["30d"].value}
            </div>
            <div className="text-sm text-gray-600">Last 30 Days</div>
          </div>
          {periods["30d"].change && (
            <div className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
              getChangeColor(periods["30d"].changeType)
            )}>
              {getChangeIcon(periods["30d"].changeType)}
              <span>{periods["30d"].change}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardData {
  totalInvoices: {
    "24h": number;
    "7d": number;
    "30d": number;
  };
  totalPurchases: {
    "24h": number;
    "7d": number;
    "30d": number;
  };
  totalPayments: {
    "24h": number;
    "7d": number;
    "30d": number;
  };
}

export function FinancialMetrics() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch invoices data
        const invoicesResponse = await apiClient.getInvoices();
        console.log('Invoices Response:', invoicesResponse);
        const invoices = invoicesResponse.success ? invoicesResponse.data.invoices : [];
        console.log('Invoices:', invoices);
        
        // Fetch P&L transactions for purchases
        const pnlResponse = await apiClient.getProfitLossTransactions();
        console.log('P&L Response:', pnlResponse);
        const transactions = pnlResponse.success ? pnlResponse.data.transactions : [];
        console.log('P&L Transactions:', transactions);
        
        // Calculate metrics for different time periods
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        // Calculate invoice totals
        const totalInvoices = {
          "24h": invoices
            .filter((invoice: any) => new Date(invoice.invoiceDate) >= oneDayAgo)
            .reduce((sum: number, invoice: any) => sum + parseFloat(invoice.grandTotal || 0), 0),
          "7d": invoices
            .filter((invoice: any) => new Date(invoice.invoiceDate) >= sevenDaysAgo)
            .reduce((sum: number, invoice: any) => sum + parseFloat(invoice.grandTotal || 0), 0),
          "30d": invoices
            .filter((invoice: any) => new Date(invoice.invoiceDate) >= thirtyDaysAgo)
            .reduce((sum: number, invoice: any) => sum + parseFloat(invoice.grandTotal || 0), 0),
        };
        
        // Calculate purchase totals from P&L transactions
        const purchaseTransactions = transactions.filter((t: any) => 
          t.transactionType === 'purchase_order' || t.category === 'Expenses'
        );
        
        const totalPurchases = {
          "24h": purchaseTransactions
            .filter((t: any) => new Date(t.transactionDate) >= oneDayAgo)
            .reduce((sum: number, t: any) => sum + parseFloat(t.amount || 0), 0),
          "7d": purchaseTransactions
            .filter((t: any) => new Date(t.transactionDate) >= sevenDaysAgo)
            .reduce((sum: number, t: any) => sum + parseFloat(t.amount || 0), 0),
          "30d": purchaseTransactions
            .filter((t: any) => new Date(t.transactionDate) >= thirtyDaysAgo)
            .reduce((sum: number, t: any) => sum + parseFloat(t.amount || 0), 0),
        };
        
        // Calculate payment totals from P&L transactions
        const paymentTransactions = transactions.filter((t: any) => 
          t.transactionType === 'payment_received' || t.category === 'Revenue'
        );
        
        const totalPayments = {
          "24h": paymentTransactions
            .filter((t: any) => new Date(t.transactionDate) >= oneDayAgo)
            .reduce((sum: number, t: any) => sum + parseFloat(t.amount || 0), 0),
          "7d": paymentTransactions
            .filter((t: any) => new Date(t.transactionDate) >= sevenDaysAgo)
            .reduce((sum: number, t: any) => sum + parseFloat(t.amount || 0), 0),
          "30d": paymentTransactions
            .filter((t: any) => new Date(t.transactionDate) >= thirtyDaysAgo)
            .reduce((sum: number, t: any) => sum + parseFloat(t.amount || 0), 0),
        };
        
        setData({
          totalInvoices,
          totalPurchases,
          totalPayments
        });
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        // Set default values on error
        setData({
          totalInvoices: { "24h": 0, "7d": 0, "30d": 0 },
          totalPurchases: { "24h": 0, "7d": 0, "30d": 0 },
          totalPayments: { "24h": 0, "7d": 0, "30d": 0 }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100 p-8 rounded-2xl shadow-inner">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <span className="ml-2 text-gray-600">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 p-8 rounded-2xl shadow-inner">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: "TOTAL INVOICE",
      periods: {
        "24h": {
          value: `₹${data?.totalInvoices["24h"].toLocaleString() || "0"}`,
          changeType: "neutral" as const,
        },
        "7d": {
          value: `₹${data?.totalInvoices["7d"].toLocaleString() || "0"}`,
          changeType: "neutral" as const,
        },
        "30d": {
          value: `₹${data?.totalInvoices["30d"].toLocaleString() || "0"}`,
          changeType: "neutral" as const,
        },
      },
    },
    {
      title: "TOTAL PURCHASE",
      periods: {
        "24h": {
          value: `₹${data?.totalPurchases["24h"].toLocaleString() || "0"}`,
          changeType: "neutral" as const,
        },
        "7d": {
          value: `₹${data?.totalPurchases["7d"].toLocaleString() || "0"}`,
          changeType: "neutral" as const,
        },
        "30d": {
          value: `₹${data?.totalPurchases["30d"].toLocaleString() || "0"}`,
          changeType: "neutral" as const,
        },
      },
    },
    {
      title: "TOTAL PAYMENT",
      periods: {
        "24h": {
          value: `₹${data?.totalPayments["24h"].toLocaleString() || "0"}`,
          changeType: "neutral" as const,
        },
        "7d": {
          value: `₹${data?.totalPayments["7d"].toLocaleString() || "0"}`,
          changeType: "neutral" as const,
        },
        "30d": {
          value: `₹${data?.totalPayments["30d"].toLocaleString() || "0"}`,
          changeType: "neutral" as const,
        },
      },
    },
  ];

  return (
    <div className="bg-gray-100 p-8 rounded-2xl shadow-inner">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {metrics.map((metric, index) => (
          <FinancialMetric
            key={index}
            title={metric.title}
            periods={metric.periods}
          />
        ))}
      </div>
    </div>
  );
}
