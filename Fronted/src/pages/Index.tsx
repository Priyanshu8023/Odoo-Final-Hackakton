import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, BarChart3, Settings, Users, UserPlus, LogIn, ArrowRight, CheckCircle, Zap, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setVisibleSections(prev => new Set([...prev, index]));
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header title="Shiv Accounts" />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="flex items-center justify-center mb-8 animate-fade-in-up">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm animate-float">
              <Factory className="h-16 w-16 text-white drop-shadow-lg" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold ml-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              Shiv Accounts
            </h1>
          </div>
          <p className="text-2xl md:text-3xl mb-12 opacity-0 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            Simple Accounting, Billing & Inventory for Small Businesses. Manage contacts, create invoices, track purchases, and monitor your stock in real time. Get instant Balance Sheet, Profit & Loss, and Inventory reports — all in one powerful platform.
          </p>
          
          {/* Get Started Button */}
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="shadow-2xl bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-semibold group animate-pulse-glow"
            >
              Get Started Today
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl"></div>
      </section>

      {/* What We Do Section */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple Accounting, Billing & Inventory for Small Businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Everything you need to manage your business finances and operations in one powerful platform
            </p>
            
            {/* Auto-Generated Features Highlight */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 max-w-3xl mx-auto border border-blue-200">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">AI-Powered Auto-Generated Features</h3>
                <Zap className="h-6 w-6 text-yellow-500" />
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our intelligent system automatically generates invoices, categorizes expenses, suggests inventory reorders, 
                and creates financial reports based on your business patterns. Save hours of manual work with smart automation.
              </p>
            </div>
          </div>
          
          <div className="space-y-32">
            {/* Contact Management */}
            <div 
              ref={(el) => { sectionRefs.current[0] = el; }}
              className={`group flex flex-col lg:flex-row items-center gap-16 transition-all duration-1000 ${
                visibleSections.has(0) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-20'
              }`}
            >
              <div className="flex-1 flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-all duration-700"></div>
                  <div className="relative p-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-4xl w-fit group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 shadow-2xl">
                    <Users className="h-20 w-20 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-4xl font-bold text-gray-900 mb-6 group-hover:text-blue-600 transition-colors duration-500">Smart Contact Management</h3>
                <p className="text-xl text-gray-700 leading-relaxed mb-4">
                  Organize your customers, vendors, and suppliers with comprehensive contact information, payment terms, and complete transaction history. 
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Keep all your business relationships in one centralized location with advanced search, categorization, and communication tracking features.
                </p>
              </div>
            </div>

            {/* Invoice Creation */}
            <div 
              ref={(el) => { sectionRefs.current[1] = el; }}
              className={`group flex flex-col lg:flex-row-reverse items-center gap-16 transition-all duration-1000 ${
                visibleSections.has(1) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-20'
              }`}
            >
              <div className="flex-1 flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-all duration-700"></div>
                  <div className="relative p-8 bg-gradient-to-br from-green-500 to-green-600 rounded-4xl w-fit group-hover:scale-110 group-hover:-rotate-3 transition-all duration-700 shadow-2xl">
                    <BarChart3 className="h-20 w-20 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-4xl font-bold text-gray-900 mb-6 group-hover:text-green-600 transition-colors duration-500">Professional Invoice & Billing</h3>
                <p className="text-xl text-gray-700 leading-relaxed mb-4">
                  Create stunning, professional invoices with customizable templates, automated calculations, and integrated payment tracking.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Generate recurring invoices, send automated payment reminders, and manage your entire billing cycle to improve cash flow and reduce administrative overhead.
                </p>
              </div>
            </div>

            {/* Purchase Tracking */}
            <div 
              ref={(el) => { sectionRefs.current[2] = el; }}
              className={`group flex flex-col lg:flex-row items-center gap-16 transition-all duration-1000 ${
                visibleSections.has(2) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-20'
              }`}
            >
              <div className="flex-1 flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-all duration-700"></div>
                  <div className="relative p-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-4xl w-fit group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 shadow-2xl">
                    <Settings className="h-20 w-20 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-4xl font-bold text-gray-900 mb-6 group-hover:text-purple-600 transition-colors duration-500">Advanced Purchase Tracking</h3>
                <p className="text-xl text-gray-700 leading-relaxed mb-4">
                  Track every business expense with detailed categorization, vendor management, and automated receipt processing.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Monitor spending patterns, set budget alerts, and optimize your purchasing decisions with comprehensive analytics and reporting tools.
                </p>
              </div>
            </div>

            {/* Inventory Management */}
            <div 
              ref={(el) => { sectionRefs.current[3] = el; }}
              className={`group flex flex-col lg:flex-row-reverse items-center gap-16 transition-all duration-1000 ${
                visibleSections.has(3) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-20'
              }`}
            >
              <div className="flex-1 flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-all duration-700"></div>
                  <div className="relative p-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-4xl w-fit group-hover:scale-110 group-hover:-rotate-3 transition-all duration-700 shadow-2xl">
                    <Factory className="h-20 w-20 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-4xl font-bold text-gray-900 mb-6 group-hover:text-orange-600 transition-colors duration-500">Real-time Inventory Control</h3>
                <p className="text-xl text-gray-700 leading-relaxed mb-4">
                  Monitor your stock levels in real-time with automated tracking, low stock alerts, and intelligent reorder suggestions.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Never run out of essential items or overstock slow-moving products. Track inventory movements, manage multiple warehouses, and optimize your stock levels.
                </p>
              </div>
            </div>

            {/* Financial Reports */}
            <div 
              ref={(el) => { sectionRefs.current[4] = el; }}
              className={`group flex flex-col lg:flex-row items-center gap-16 transition-all duration-1000 ${
                visibleSections.has(4) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-20'
              }`}
            >
              <div className="flex-1 flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-all duration-700"></div>
                  <div className="relative p-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-4xl w-fit group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 shadow-2xl">
                    <CheckCircle className="h-20 w-20 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-4xl font-bold text-gray-900 mb-6 group-hover:text-teal-600 transition-colors duration-500">Instant Financial Intelligence</h3>
                <p className="text-xl text-gray-700 leading-relaxed mb-4">
                  Get instant Balance Sheet, Profit & Loss statements, cash flow reports, and comprehensive financial analytics.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Make informed business decisions with real-time financial insights, trend analysis, and predictive reporting that helps you stay ahead of your competition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section id="auth-section" className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative z-10">
          {user ? (
            // User is logged in - show dashboard access
            <>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Welcome back, {user.name}!
              </h2>
              <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                Ready to manage your business finances? Access your dashboard to continue where you left off.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => navigate("/dashboard")}
                  className="shadow-2xl bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/createid")}
                  className="shadow-2xl bg-white/10 border-white/30 text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Create New User
                </Button>
              </div>
            </>
          ) : (
            // User is not logged in - show auth options
            <>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of small businesses who trust Shiv Accounts to manage their finances and operations
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => navigate("/createid")}
                  className="shadow-2xl bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Create Account
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="shadow-2xl bg-white/10 border-white/30 text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Login
                </Button>
              </div>
            </>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-blue-300/20 rounded-full blur-2xl"></div>
      </section>

    </div>
  );
};

export default Index;
