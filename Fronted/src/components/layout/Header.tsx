import { useState } from "react";
import { Menu, User, UserPlus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";

interface HeaderProps {
  title?: string;
  showMenu?: boolean;
}

const Header = ({ title = "Shiv Accounts", showMenu = true }: HeaderProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Menu button and title */}
            <div className="flex items-center space-x-4">
              {showMenu && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="h-10 w-10 p-0 hover:bg-gray-100"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            </div>

            {/* Right side - User info and actions */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{user.email}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {user.role}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/login")}
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => navigate("/signup")}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
};

export default Header;
