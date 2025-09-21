import React from 'react';
import Header from '@/components/layout/Header';

const PartnerLedger = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Partner Ledger" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Partner Ledger</h1>
          <p className="text-gray-600 mt-2">View partner transaction history and balances</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Partner Ledger Report</h2>
          <p className="text-gray-600 mb-4">This is a working Partner Ledger component.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Total Debit</h3>
              <p className="text-2xl font-bold text-blue-600">₹0.00</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Total Credit</h3>
              <p className="text-2xl font-bold text-green-600">₹0.00</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">Current Balance</h3>
              <p className="text-2xl font-bold text-purple-600">₹0.00</p>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Reference</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Debit</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Credit</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No ledger entries found. Add some transactions to see them here.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerLedger;