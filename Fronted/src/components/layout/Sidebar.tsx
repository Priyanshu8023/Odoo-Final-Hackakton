import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Menu, Users, Package, Receipt, BookOpen, Home, BarChart3, FileText } from "lucide-react";
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
      title: "Master Data",
      icon: BookOpen,
      children: [
        {
          title: "Contact Master",
          icon: Users,
          path: "/contact-master",
          description: "Manage contacts, vendors, and customers"
        },
        {
          title: "Product Master",
          icon: Package,
          path: "/product-master",
          description: "Manage products and inventory"
        },
        {
          title: "Taxes Master",
          icon: Receipt,
          path: "/taxes-master",
          description: "Configure tax rates and rules"
        },
        {
          title: "Chart of Accounts",
          icon: BarChart3,
          path: "/chart-of-accounts",
          description: "Manage accounting structure"
        }
      ]
    },
    {
      title: "Reports",
      icon: FileText,
      children: [
        {
          title: "Partner Ledger",
          icon: FileText,
          path: "/reports/partner-ledger",
          description: "View partner transaction history"
        },
        {
          title: "Profit & Loss Report",
          icon: FileText,
          path: "/reports/profit-loss",
          description: "View profit and loss statements"
        },
        {
          title: "Balance Sheet",
          icon: FileText,
          path: "/reports/balance-sheet",
          description: "View company balance sheet"
        }
      ]
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
        "fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MO</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">ManufactureOps</h2>
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

        {/* Navigation */}
        <nav className="p-6 space-y-4">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.children ? (
                // Parent item with children
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-3 py-2 text-gray-700 font-semibold">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </div>
                  <div className="ml-6 space-y-1">
                    {item.children.map((child, childIndex) => (
                      <Button
                        key={childIndex}
                        variant="ghost"
                        className="w-full justify-start h-auto p-3 text-left hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => handleNavigation(child.path)}
                      >
                        <div className="flex items-start space-x-3">
                          <child.icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium">{child.title}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {child.description}
                            </div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                // Single item
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 text-left hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => handleNavigation(item.path)}
                >
                  <div className="flex items-start space-x-3">
                    <item.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </Button>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © 2024 ManufactureOps
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Streamline your operations
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
