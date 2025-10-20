import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { GraduationCap, Package, ClipboardCheck, BarChart3 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <div className="mx-auto w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <GraduationCap className="h-12 w-12 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            School Inventory System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline equipment management with our comprehensive tracking and request system
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card rounded-xl p-6 shadow-lg border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Equipment Catalog</h3>
            <p className="text-muted-foreground">
              Browse and search through available equipment with detailed information and photos
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg border">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
              <ClipboardCheck className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Request Management</h3>
            <p className="text-muted-foreground">
              Submit equipment requests and track their approval status in real-time
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg border">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics & Reports</h3>
            <p className="text-muted-foreground">
              Generate comprehensive reports and track equipment usage history
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
