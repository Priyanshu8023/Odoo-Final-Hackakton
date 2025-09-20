import { useState } from "react";
import { Menu, User, UserPlus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

interface HeaderProps {
  title?: string;
  showMenu?: boolean;
}

const Header = ({ title = "Shiv Accounts", showMenu = true }: HeaderProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from auth context in real app
  const [userInfo, setUserInfo] = useState({
    loginId: "admin_user",
    profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  });
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
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

            {/* Right side - User profile or Login/Signup buttons */}
            <div className="flex items-center space-x-3">
              {isLoggedIn ? (
                // User is logged in - show profile
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-full border border-blue-200">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userInfo.profilePic} alt={userInfo.loginId} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700">{userInfo.loginId}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                // User is not logged in - show login/signup button only
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Login/Signup</span>
                </Button>
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
