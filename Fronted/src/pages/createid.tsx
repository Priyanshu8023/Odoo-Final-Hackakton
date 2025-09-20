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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
      
      <Header title="Create User ID" />
      
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-4">
          {/* Page Description */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New User Account</h2>
            <p className="text-gray-600 text-base">
              Set up a new user account with appropriate role and permissions
            </p>
          </div>

          {/* Create User Form Card */}
          <Card className="border-2 border-blue-300 shadow-2xl bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-4">
              <CardTitle className="flex items-center justify-center space-x-2 text-xl font-bold">
                <div className="p-1.5 bg-white/20 rounded-full">
                  <User className="h-5 w-5" />
                </div>
                <span>Create User Account</span>
              </CardTitle>
              <p className="text-center text-blue-100 mt-1 text-sm">Set up user credentials and permissions</p>
            </CardHeader>
            
            <CardContent className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First Row - Name and Role */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-xs font-medium text-gray-700">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter full name"
                      className={`h-9 text-sm ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-600 flex items-center space-x-1">
                        <XCircle className="h-3 w-3" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="role" className="text-xs font-medium text-gray-700">
                      Role *
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleInputChange("role", value)}
                    >
                      <SelectTrigger className={`h-9 text-sm ${errors.role ? "border-red-500 focus:ring-red-500" : ""}`}>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accountant">Invoicing User (Accountant)</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <p className="text-xs text-red-600 flex items-center space-x-1">
                        <XCircle className="h-3 w-3" />
                        <span>{errors.role}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Second Row - Login ID and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="loginId" className="text-xs font-medium text-gray-700">
                      Login ID *
                    </Label>
                    <Input
                      id="loginId"
                      value={formData.loginId}
                      onChange={(e) => handleInputChange("loginId", e.target.value)}
                      placeholder="Enter login ID (6-12 characters)"
                      className={`h-9 text-sm ${errors.loginId ? "border-red-500 focus:ring-red-500" : ""}`}
                    />
                    {errors.loginId && (
                      <p className="text-xs text-red-600 flex items-center space-x-1">
                        <XCircle className="h-3 w-3" />
                        <span>{errors.loginId}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Must be unique and between 6-12 characters
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs font-medium text-gray-700">
                      Email ID *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter email address"
                      className={`h-9 text-sm ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 flex items-center space-x-1">
                        <XCircle className="h-3 w-3" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Must be unique and valid email format
                    </p>
                  </div>
                </div>

                {/* Third Row - Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-xs font-medium text-gray-700">
                      Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Enter password"
                        className={`h-9 text-sm pr-10 ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-2 py-1 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-3 w-3 text-gray-400" />
                        ) : (
                          <Eye className="h-3 w-3 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-600 flex items-center space-x-1">
                        <XCircle className="h-3 w-3" />
                        <span>{errors.password}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="reEnterPassword" className="text-xs font-medium text-gray-700">
                      Re-enter Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="reEnterPassword"
                        type={showReEnterPassword ? "text" : "password"}
                        value={formData.reEnterPassword}
                        onChange={(e) => handleInputChange("reEnterPassword", e.target.value)}
                        placeholder="Re-enter password"
                        className={`h-9 text-sm pr-10 ${errors.reEnterPassword ? "border-red-500 focus:ring-red-500" : ""}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-2 py-1 hover:bg-transparent"
                        onClick={() => setShowReEnterPassword(!showReEnterPassword)}
                      >
                        {showReEnterPassword ? (
                          <EyeOff className="h-3 w-3 text-gray-400" />
                        ) : (
                          <Eye className="h-3 w-3 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {errors.reEnterPassword && (
                      <p className="text-xs text-red-600 flex items-center space-x-1">
                        <XCircle className="h-3 w-3" />
                        <span>{errors.reEnterPassword}</span>
                      </p>
                    )}
                    {formData.reEnterPassword && formData.password === formData.reEnterPassword && (
                      <p className="text-xs text-green-600 flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Passwords match</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
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

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="px-6 py-2 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700"
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
