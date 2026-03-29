import { Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

const PortfolioFooter = () => {
  const { isAdmin, logout } = useAdmin();

  return (
    <footer className="max-w-[1600px] mx-auto px-4 md:px-6 pb-20">
      <div className="border-t border-border pt-8">
        <div className="text-center space-y-3">
          <h3 className="font-playfair text-lg text-primary">Golden Photography</h3>
          <p className="text-xs text-muted-foreground font-poppins">
            Beawar, Rajasthan · Capturing moments that last forever
          </p>
          <div className="text-xs uppercase tracking-widest font-poppins text-muted-foreground flex flex-wrap justify-center gap-3">
            <a href="tel:+917737772377" className="hover:text-primary transition-colors">
              +91 77377 72377
            </a>
            <span className="hidden md:inline">·</span>
            <a href="tel:+919983745802" className="hover:text-primary transition-colors">
              +91 99837 45802
            </a>
          </div>
          <p className="text-[10px] text-muted-foreground/60 pt-4">
            © {new Date().getFullYear()} All rights reserved.
          </p>
          <div className="pt-2">
            {isAdmin ? (
              <button
                onClick={logout}
                className="text-[9px] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                Logout
              </button>
            ) : (
              <a 
                href="/admin" 
                className="text-[9px] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                Admin
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PortfolioFooter;
