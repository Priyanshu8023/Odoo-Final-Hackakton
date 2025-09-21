import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Users, Package, Receipt, Home, BarChart3, ShoppingCart, FileText as InvoiceIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/dashboard",
      description: "Overview and analytics"
    },
    {
      title: "Contact",
      icon: Users,
      path: "/contact-master",
      description: "Manage contacts, vendors, and customers"
    },
    {
      title: "Product",
      icon: Package,
      path: "/product-master",
      description: "Manage products and inventory"
    },
    {
      title: "Taxes",
      icon: Receipt,
      path: "/taxes-master",
      description: "Configure tax rates and rules"
    },
    {
      title: "Chart of Accounts",
      icon: BarChart3,
      path: "/chart-of-accounts",
      description: "Manage accounting structure"
    },
    {
      title: "Purchase Order",
      icon: ShoppingCart,
      path: "/purchase-order",
      description: "Create and manage purchase orders"
    },
    {
      title: "Invoices",
      icon: InvoiceIcon,
      path: "/invoices",
      description: "View and manage all invoices"
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-r border-gray-200",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 flex-shrink-0 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">SA</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Shiv Accounts</h2>
              <p className="text-xs text-gray-500">Accounting System</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500 bg-white">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start h-auto px-4 py-3 text-left hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200"
              onClick={() => handleNavigation(item.path)}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="h-5 w-5 flex-shrink-0 text-gray-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-medium">
              © 2024 Shiv Accounts
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Simple Accounting & Billing
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
