import React from 'react';
import Header from '@/components/layout/Header';

const BalanceSheetReport = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Balance Sheet Report" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Balance Sheet Report</h1>
          <p className="text-gray-600 mt-2">Assets, liabilities, and equity overview</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Balance Sheet Report</h2>
          <p className="text-gray-600 mb-4">This is a working Balance Sheet Report component.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Assets</h3>
              <p className="text-2xl font-bold text-blue-600">₹0.00</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Liabilities</h3>
              <p className="text-2xl font-bold text-red-600">₹0.00</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Equity</h3>
              <p className="text-2xl font-bold text-green-600">₹0.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheetReport;