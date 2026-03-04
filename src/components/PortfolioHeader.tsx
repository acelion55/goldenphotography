import { Link, useLocation } from "react-router-dom";

interface PortfolioHeaderProps {
  activeCategory?: string;
}

const navItems = [
  { label: "Home", path: "/" },
  { label: "Wedding", path: "/category/wedding" },
  { label: "Birthday", path: "/category/birthday" },
  { label: "Traditional", path: "/category/traditional" },
  { label: "Events", path: "/category/events" },
  { label: "Maternity", path: "/category/maternity" },
  { label: "Invitations", path: "/category/invitations" },
  { label: "Reels", path: "/category/reels" },
  { label: "Contact", path: "/contact" },
];

const PortfolioHeader = ({ activeCategory }: PortfolioHeaderProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border overflow-hidden">
      {/* Logo bar */}
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-3 py-2">
        <Link to="/" className="flex items-center gap-1.5">
          <span className="font-playfair text-lg md:text-xl font-semibold text-primary">
            Golden
          </span>
          <span className="font-playfair text-lg md:text-xl font-light text-foreground">
            Photography
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline text-[10px] text-muted-foreground font-poppins">
            Beawar, Rajasthan
          </span>
        </div>
      </div>

      {/* Horizontal Navigation - desktop only */}
      <nav className="hidden md:block border-t border-border/50 overflow-x-auto scrollbar-hide">
        <div className="max-w-[1600px] mx-auto flex items-center gap-0.5 px-2 py-1.5 min-w-max">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-xs uppercase tracking-wider font-poppins px-3 py-1 rounded-sm transition-colors whitespace-nowrap ${
                isActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation - grid layout */}
      <nav className="md:hidden border-t border-border/50 overflow-hidden">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-[10px] uppercase tracking-wider font-poppins px-2 py-1 rounded-sm transition-colors text-center ${
                isActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default PortfolioHeader;
