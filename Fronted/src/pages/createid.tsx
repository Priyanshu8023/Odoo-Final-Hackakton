import { useState } from "react";
import { User, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";

interface CreateUserFormData {
  name: string;
  role: string;
  loginId: string;
  email: string;
  password: string;
  reEnterPassword: string;
}

interface ValidationErrors {
  name?: string;
  role?: string;
  loginId?: string;
  email?: string;
  password?: string;
  reEnterPassword?: string;
}

const CreateId = () => {
  const [formData, setFormData] = useState<CreateUserFormData>({
    name: "",
    role: "",
    loginId: "",
    email: "",
    password: "",
    reEnterPassword: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof CreateUserFormData, value: string) => {
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
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    // Login ID validation
    if (!formData.loginId.trim()) {
      newErrors.loginId = "Login ID is required";
    } else if (formData.loginId.length < 6 || formData.loginId.length > 12) {
      newErrors.loginId = "Login ID must be between 6-12 characters";
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form on success
      setFormData({
        name: "",
        role: "",
        loginId: "",
        email: "",
        password: "",
        reEnterPassword: "",
      });
      
      // Show success message (you can implement toast notification here)
      alert("User created successfully!");
      
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      role: "",
      loginId: "",
      email: "",
      password: "",
      reEnterPassword: "",
    });
    setErrors({});
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
    <div className="min-h-screen bg-gray-50">
      <Header title="Create User ID" />
      
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {/* Page Description */}
          <div className="mb-6">
            <p className="text-gray-600">
              Create a new user account with appropriate role and permissions
            </p>
          </div>

          {/* Create User Form Card */}
          <Card className="border-2 border-blue-200 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <User className="h-6 w-6" />
                <span>Create User</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-8">
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

                {/* Role Field */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                    Role *
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                  >
                    <SelectTrigger className={`${errors.role ? "border-red-500 focus:ring-red-500" : ""}`}>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accountant">Invoicing User (Accountant)</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <XCircle className="h-4 w-4" />
                      <span>{errors.role}</span>
                    </p>
                  )}
                </div>

                {/* Login ID Field */}
                <div className="space-y-2">
                  <Label htmlFor="loginId" className="text-sm font-medium text-gray-700">
                    Login ID *
                  </Label>
                  <Input
                    id="loginId"
                    value={formData.loginId}
                    onChange={(e) => handleInputChange("loginId", e.target.value)}
                    placeholder="Enter login ID (6-12 characters)"
                    className={`${errors.loginId ? "border-red-500 focus:ring-red-500" : ""}`}
                  />
                  {errors.loginId && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <XCircle className="h-4 w-4" />
                      <span>{errors.loginId}</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Must be unique and between 6-12 characters
                  </p>
                </div>

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

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="px-8"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? "Creating..." : "Create"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateId;
