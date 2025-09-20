import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, BarChart3, Settings, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Header title="ManufactureOps" />
      
      {/* Hero Section */}
      <section className="bg-gradient-primary text-primary-foreground py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <Factory className="h-12 w-12 mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold">ManufactureOps</h1>
          </div>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Streamline your manufacturing operations with real-time monitoring, 
            analytics, and intelligent automation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => navigate("/dashboard")}
              className="shadow-custom-lg"
            >
              Access Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate("/createid")}
              className="shadow-custom-lg bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
            >
              Create User Account
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Manufacturing Excellence Made Simple
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center bg-metric-card border-metric-border">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Real-time Analytics</CardTitle>
                <CardDescription>
                  Monitor production metrics, efficiency rates, and equipment performance in real-time
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center bg-metric-card border-metric-border">
              <CardHeader>
                <Settings className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Smart Automation</CardTitle>
                <CardDescription>
                  Automate workflows, schedule maintenance, and optimize resource allocation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center bg-metric-card border-metric-border">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Connect teams across shifts with shared dashboards and instant notifications
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-card py-16 px-6 border-t border-metric-border">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Transform Your Operations?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join leading manufacturers who trust ManufactureOps to optimize their production processes
          </p>
          <Button 
            variant="gradient" 
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="shadow-custom-lg"
          >
            Get Started Today
          </Button>
        </div>
      </section>

    </div>
  );
};

export default Index;
