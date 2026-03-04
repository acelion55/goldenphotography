import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { isAdmin, login, logout } = useAdmin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(username, password)) {
      toast({
        title: "Login Successful",
        description: "You can now edit photos and videos",
      });
      navigate("/");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  if (isAdmin) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-playfair text-primary">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-2">Golden Photography</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        
        <Button 
          variant="ghost" 
          className="w-full" 
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default Admin;
