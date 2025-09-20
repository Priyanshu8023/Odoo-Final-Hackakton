import { useState } from "react";
import { Eye, EyeOff, UserPlus, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  reEnterPassword: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  reEnterPassword?: string;
}

const Signup = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    reEnterPassword: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
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

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character";
    }

    // Re-enter password validation
    if (!formData.reEnterPassword) {
      newErrors.reEnterPassword = "Please re-enter your password";
    } else if (formData.password !== formData.reEnterPassword) {
      newErrors.reEnterPassword = "Passwords do not match";
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
          await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: "invoicing_user", // Default role
          });
      
      // Reset form on success
      setFormData({
        name: "",
        email: "",
        password: "",
        reEnterPassword: "",
      });
      
      toast({
        title: "Account created successfully",
        description: "Welcome! You are now logged in.",
      });
      
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Error creating account:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Error creating account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, text: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) strength++;
    
    const strengthText = ["Very Weak", "Weak", "Fair", "Good", "Strong"][strength];
    return { strength, text: strengthText };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          {/* Back to Home Button - positioned at top left */}
          <div className="absolute -top-16 left-0">
            <Button
              variant="ghost"
              onClick={handleBackToHome}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </div>

        {/* Signup Form Card */}
        <Card className="border-2 border-blue-300 shadow-2xl bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-6">
            <CardTitle className="flex items-center justify-center space-x-3 text-2xl font-bold">
              <div className="p-2 bg-white/20 rounded-full">
                <UserPlus className="h-6 w-6" />
              </div>
              <span>Create Account</span>
            </CardTitle>
            <p className="text-center text-blue-100 mt-2">Join ManufactureOps today</p>
          </CardHeader>
          
<<<<<<< Updated upstream
          <CardContent className="p-6 max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter full name"
                  className={`${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <XCircle className="h-4 w-4" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>
=======
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      className={`${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <XCircle className="h-4 w-4" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Enter your first and last name
                    </p>
                  </div>
>>>>>>> Stashed changes

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email ID *
                    </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  className={`${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <XCircle className="h-4 w-4" />
                    <span>{errors.email}</span>
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Must be unique and valid email format
                </p>
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
                    placeholder="Enter password"
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
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <XCircle className="h-4 w-4" />
                    <span>{errors.password}</span>
                  </p>
                )}
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength.strength <= 1
                              ? "bg-red-500"
                              : passwordStrength.strength <= 2
                              ? "bg-yellow-500"
                              : passwordStrength.strength <= 3
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Must contain: lowercase, uppercase, special character, min 8 characters
                    </div>
                  </div>
                )}
              </div>

              {/* Re-enter Password Field */}
              <div className="space-y-2">
                <Label htmlFor="reEnterPassword" className="text-sm font-medium text-gray-700">
                  Re-enter Password *
                </Label>
                <div className="relative">
                  <Input
                    id="reEnterPassword"
                    type={showReEnterPassword ? "text" : "password"}
                    value={formData.reEnterPassword}
                    onChange={(e) => handleInputChange("reEnterPassword", e.target.value)}
                    placeholder="Re-enter password"
                    className={`pr-10 ${errors.reEnterPassword ? "border-red-500 focus:ring-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowReEnterPassword(!showReEnterPassword)}
                  >
                    {showReEnterPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.reEnterPassword && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <XCircle className="h-4 w-4" />
                    <span>{errors.reEnterPassword}</span>
                  </p>
                )}
                {formData.reEnterPassword && formData.password === formData.reEnterPassword && (
                  <p className="text-sm text-green-600 flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>Passwords match</span>
                  </p>
                )}
              </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </Button>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleLogin}
                    className="text-blue-600 hover:text-blue-800 p-0 h-auto font-medium"
                  >
                    Login here
                  </Button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;
