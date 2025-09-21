import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { apiClient } from '@/lib/api';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PartnerData {
  partnerId: string;
  partnerName: string;
  partnerEmail: string;
  partnerMobile: string;
  vendorRefNo: string;
  totalInvoices: number;
  totalPaid: number;
  totalBalance: number;
  totalPurchases: number;
  invoiceCount: number;
  lastTransactionDate: number | null;
}

interface SummaryData {
  totalPartners: number;
  totalInvoiceAmount: number;
  totalPaidAmount: number;
  totalBalanceAmount: number;
  totalPurchaseAmount: number;
}

const PartnerLedger = () => {
  const [partners, setPartners] = useState<PartnerData[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartnerLedger = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getPartnerLedger();
      console.log('Partner Ledger Response:', response);
      
      if (response.success) {
        setPartners(response.data.partners);
        setSummary(response.data.summary);
      } else {
        throw new Error(response.message || 'Failed to fetch partner ledger data');
      }
    } catch (err) {
      console.error('Error fetching partner ledger:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch partner ledger data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerLedger();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Partner Ledger" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="ml-2 text-gray-600">Loading partner ledger data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Partner Ledger" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <Button onClick={fetchPartnerLedger} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Partner Ledger" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Partner Ledger</h1>
            <p className="text-gray-600 mt-2">View partner transaction history and balances</p>
          </div>
          <Button onClick={fetchPartnerLedger} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Total Partners</h3>
              <p className="text-2xl font-bold text-blue-600">{summary.totalPartners}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Total Invoices</h3>
              <p className="text-2xl font-bold text-green-600">₹{summary.totalInvoiceAmount.toLocaleString()}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">Total Purchases</h3>
              <p className="text-2xl font-bold text-purple-600">₹{summary.totalPurchaseAmount.toLocaleString()}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800">Outstanding Balance</h3>
              <p className="text-2xl font-bold text-orange-600">₹{summary.totalBalanceAmount.toLocaleString()}</p>
            </div>
          </div>
        )}
        
        {/* Partners Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Partner Details</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Partner Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Contact</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Vendor Ref</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Invoices</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Total Amount</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Paid</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Balance</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Purchases</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {partners.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No partners found. Create some purchase orders to see them here.
                    </td>
                  </tr>
                ) : (
                  partners.map((partner) => (
                    <tr key={partner.partnerId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{partner.partnerName}</div>
                          <div className="text-sm text-gray-500">{partner.partnerEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {partner.partnerMobile || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {partner.vendorRefNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {partner.invoiceCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ₹{partner.totalInvoices.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right">
                        ₹{partner.totalPaid.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">
                        ₹{partner.totalBalance.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 text-right font-medium">
                        ₹{partner.totalPurchases.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerLedger;