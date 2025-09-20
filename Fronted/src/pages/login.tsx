import { useState } from "react";
import { Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

interface LoginFormData {
  loginId: string;
  password: string;
}

interface ValidationErrors {
  loginId?: string;
  password?: string;
}

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    loginId: "",
    password: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Login ID validation
    if (!formData.loginId.trim()) {
      newErrors.loginId = "Login ID is required";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // On successful login, redirect to dashboard
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Invalid login credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    // Implement forgot password functionality
    alert("Forgot password functionality will be implemented soon!");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home Button */}
        <div className="flex justify-start">
          <Button
            variant="ghost"
            onClick={handleBackToHome}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </div>

        {/* Login Form Card */}
        <Card className="border-2 border-blue-200 shadow-lg bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-center space-x-2 text-xl">
              <LogIn className="h-6 w-6" />
              <span>Login</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Login ID Field */}
              <div className="space-y-2">
                <Label htmlFor="loginId" className="text-sm font-medium text-gray-700">
                  Login ID *
                </Label>
                <Input
                  id="loginId"
                  value={formData.loginId}
                  onChange={(e) => handleInputChange("loginId", e.target.value)}
                  placeholder="Enter your login ID"
                  className={`${errors.loginId ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.loginId && (
                  <p className="text-sm text-red-600">{errors.loginId}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter your password"
                    className={`pr-10 ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleForgotPassword}
                  className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                >
                  Forgot Password?
                </Button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>

              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  New user?{" "}
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleSignUp}
                    className="text-blue-600 hover:text-blue-800 p-0 h-auto font-medium"
                  >
                    Sign up now
                  </Button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
