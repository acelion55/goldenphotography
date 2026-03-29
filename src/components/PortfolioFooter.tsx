import { useAdmin } from "@/contexts/AdminContext";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { Phone, MapPin, Instagram, Facebook } from "lucide-react";

const PortfolioFooter = () => {
  const { isAdmin, logout } = useAdmin();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const brandX = useTransform(scrollYProgress, [0, 1], ["-8%", "0%"]);
  const brandOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  const links = [
    { label: "Wedding", href: "/category/wedding" },
    { label: "Birthday", href: "/category/birthday" },
    { label: "Traditional", href: "/category/traditional" },
    { label: "Events", href: "/category/events" },
    { label: "Maternity", href: "/category/maternity" },
    { label: "Reels", href: "/category/reels" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <footer ref={ref} className="relative overflow-hidden bg-foreground mt-16">

      {/* Big animated brand name in background */}
      <motion.div
        style={{ x: brandX, opacity: brandOpacity }}
        className="absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden"
      >
        <span
          className="font-playfair font-bold whitespace-nowrap leading-none"
          style={{
            fontSize: "clamp(80px, 18vw, 220px)",
            background: "linear-gradient(135deg, hsl(35 70% 45% / 0.12) 0%, hsl(35 70% 65% / 0.06) 50%, hsl(35 70% 45% / 0.14) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Golden Photography
        </span>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-20">

        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold leading-tight">
              <span className="text-primary">Golden</span>
              <br />
              <span className="text-background/90">Photography</span>
            </h2>
            <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-background/40 font-poppins">
              Beawar · Rajasthan
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-background/50 font-poppins text-sm max-w-xs leading-relaxed md:text-right"
          >
            Capturing timeless moments with the warmth and beauty of Rajasthani tradition.
          </motion.p>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-px bg-gradient-to-r from-primary/60 via-background/20 to-transparent origin-left mb-10"
        />

        {/* Middle row */}
        <div className="flex flex-col md:flex-row gap-10 justify-between mb-12">

          {/* Nav links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap gap-x-6 gap-y-2"
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                whileHover={{ color: "hsl(35 70% 55%)", x: 2 }}
                className="text-[11px] uppercase tracking-[0.2em] font-poppins text-background/50 transition-colors"
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col gap-2"
          >
            <a href="tel:+917737772377" className="flex items-center gap-2 text-[11px] font-poppins text-background/50 hover:text-primary transition-colors">
              <Phone size={11} className="text-primary" /> +91 77377 72377
            </a>
            <a href="tel:+919983745802" className="flex items-center gap-2 text-[11px] font-poppins text-background/50 hover:text-primary transition-colors">
              <Phone size={11} className="text-primary" /> +91 99837 45802
            </a>
            <span className="flex items-center gap-2 text-[11px] font-poppins text-background/50">
              <MapPin size={11} className="text-primary" /> Beawar, Rajasthan 305901
            </span>
          </motion.div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-[10px] text-background/30 font-poppins"
          >
            © {new Date().getFullYear()} Golden Photography. All rights reserved.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex items-center gap-4"
          >
            {/* Social icons */}
            <a href="#" className="text-background/30 hover:text-primary transition-colors">
              <Instagram size={14} />
            </a>
            <a href="#" className="text-background/30 hover:text-primary transition-colors">
              <Facebook size={14} />
            </a>

            <span className="w-px h-3 bg-background/20" />

            {isAdmin ? (
              <button onClick={logout} className="text-[9px] text-background/25 hover:text-background/60 transition-colors font-poppins uppercase tracking-wider">
                Logout
              </button>
            ) : (
              <a href="/admin" className="text-[9px] text-background/25 hover:text-background/60 transition-colors font-poppins uppercase tracking-wider">
                Admin
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default PortfolioFooter;
