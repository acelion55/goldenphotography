import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/60">

      {/* ── DESKTOP: everything in one line ── */}
      <div className="hidden md:flex items-center max-w-[1600px] mx-auto px-6"
        onMouseLeave={() => setHovered(null)}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mr-6 py-3 flex-shrink-0">
          <span className="font-playfair text-xl font-bold text-primary tracking-tight">Golden</span>
          <span className="font-playfair text-xl font-light text-foreground tracking-tight">Photography</span>
        </Link>

        {/* Divider */}
        <span className="w-px h-5 bg-border/60 mr-4 flex-shrink-0" />

        {/* Nav items */}
        <div className="flex items-center flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onMouseEnter={() => setHovered(item.path)}
              className="relative overflow-hidden px-4 py-3 text-[11px] uppercase tracking-[0.15em] font-poppins font-medium whitespace-nowrap flex-shrink-0"
              style={{
                color: isActive(item.path)
                  ? 'hsl(var(--primary))'
                  : hovered === item.path
                  ? 'hsl(var(--primary-foreground))'
                  : 'hsl(var(--muted-foreground))',
                transition: 'color 0.2s ease',
              }}
            >
              {/* bottom-to-top fill bg */}
              <AnimatePresence>
                {hovered === item.path && (
                  <motion.span
                    key="hover-bg"
                    className="absolute inset-0 bg-primary rounded-sm"
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    style={{ zIndex: -1 }}
                  />
                )}
              </AnimatePresence>

              {/* active underline */}
              {isActive(item.path) && (
                <motion.span
                  layoutId="active-line"
                  className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary rounded-full"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              )}

              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="md:hidden">
        <div className="flex items-center px-3 py-2">
          <Link to="/" className="flex items-center gap-1.5">
            <span className="font-playfair text-lg font-semibold text-primary">Golden</span>
            <span className="font-playfair text-lg font-light text-foreground">Photography</span>
          </Link>
        </div>
        <nav className="border-t border-border/50">
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
      </div>
    </header>
  );
};

export default PortfolioHeader;
