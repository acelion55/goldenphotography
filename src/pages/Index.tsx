import { useState, useEffect, useRef } from "react";
import PortfolioHeader from "@/components/PortfolioHeader";
import PhotographerBio from "@/components/PhotographerBio";
import PortfolioFooter from "@/components/PortfolioFooter";
import FloatingButtons from "@/components/FloatingButtons";
import MasonryGallery from "@/components/MasonryGallery";
import Lightbox from "@/components/Lightbox";
import SEO from "@/components/SEO";
import { fetchMixedMedia } from "@/services/pexels";
import { motion, useScroll, useTransform, useAnimationControls } from "framer-motion";
import { ChevronDown, ImageIcon, Plus } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const STRIP_COUNT = 20;
const stripAngles = [-9, 6, -5, 8, -7, 4, -6, 9, -4, 7, -8, 5, -3, 7, -6, 4, -8, 6, -4, 9];

const Index = () => {
  const { isAdmin } = useAdmin();
  const [stripImages, setStripImages] = useState<string[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [displayImages, setDisplayImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const uploadingRef = useRef(false);
  const stripControls = useAnimationControls();

  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 120], [1, 0]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMixedMedia("SELECTED", 1, 20);
        setDisplayImages(data.items);
      } catch (err) {
        console.error("Error fetching media:", err);
        setError("Failed to load images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadImages();

    const loadStrip = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "strip"));
        if (snap.exists()) setStripImages(snap.data().images || []);
      } catch {}
    };
    loadStrip();
  }, []);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStripUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploadingRef.current) { e.target.value = ""; return; }
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    uploadingRef.current = true;
    const newUrls: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) newUrls.push(data.file.url);
    }
    setStripImages(prev => {
      const updated = [...prev, ...newUrls];
      setDoc(doc(db, "settings", "strip"), { images: updated }, { merge: true });
      return updated;
    });
    uploadingRef.current = false;
    e.target.value = "";
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Golden Photography Beawar",
    "alternateName": ["Best Photographer in Beawar","Best Photographer in Ajmer","Best Photographer in Jodhpur","Best Photographer in Jaipur","Best Photographer in Pali","Best Wedding Photographer Rajasthan","Best Pre Wedding Photographer Rajasthan"],
    "description": "Golden Photography – Best photographer in Beawar, Ajmer, Jodhpur, Jaipur, Pali and across Rajasthan.",
    "url": "https://goldenphotography.vercel.app",
    "telephone": "+91-9983745802",
    "priceRange": "₹₹",
    "address": { "@type": "PostalAddress", "streetAddress": "Beawar", "addressLocality": "Beawar", "addressRegion": "Rajasthan", "postalCode": "305901", "addressCountry": "IN" },
    "geo": { "@type": "GeoCoordinates", "latitude": "26.1011", "longitude": "74.3200" },
    "areaServed": ["Beawar","Ajmer","Jodhpur","Jaipur","Pali","Kishangarh","Nasirabad","Masuda","Pushkar","Merta City","Kekri","Sarwar","Nagaur","Sojat","Marwar","Rajasthan"],
    "knowsAbout": ["best photographer in beawar","best photographer in ajmer","best photographer in jodhpur","best photographer in jaipur","best photographer in pali","best photographer in rajasthan","best wedding photographer in beawar","best wedding photographer in ajmer","best wedding photographer in jodhpur","best wedding photographer in jaipur","best wedding photographer in pali","best wedding photographer in rajasthan","best pre wedding photographer in beawar","best pre wedding photographer in ajmer","best pre wedding photographer in jodhpur","best pre wedding photographer in jaipur","best pre wedding photographer in pali","pre wedding shoot rajasthan","candid wedding photographer rajasthan","wedding photography rajasthan","birthday photography beawar","maternity shoot beawar ajmer","event photography rajasthan","photographer near me rajasthan"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog", "name": "Photography Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Best Wedding Photography in Beawar, Ajmer, Jodhpur, Jaipur, Pali & Rajasthan" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Best Pre Wedding Photographer in Beawar, Ajmer, Jodhpur, Jaipur, Pali & Rajasthan" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Birthday Photography" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Maternity Shoot" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "School Function Photography" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Event Photography" } }
      ]
    }
  };

  const stripBase = stripImages.length > 0
    ? stripImages
    : Array.from({ length: STRIP_COUNT }, () => null as string | null);

  return (
    <>
      <SEO
        title="Best Wedding Photographer in Beawar Ajmer Jodhpur Jaipur Pali Rajasthan | Golden Photography"
        description="Golden Photography – Best photographer in Beawar, Ajmer, Jodhpur, Jaipur, Pali, Rajasthan."
        canonicalUrl="/"
        ogType="website"
        jsonLd={jsonLd}
      />

      <PortfolioHeader />

      <main>
        <PhotographerBio />

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity: scrollIndicatorOpacity }}
          className="flex flex-col items-center gap-1 pb-4 cursor-pointer"
          onClick={scrollToGallery}
        >
          <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-poppins">Portfolio</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}>
            <ChevronDown size={16} className="text-primary" />
          </motion.div>
        </motion.div>

        {/* Infinite scrolling tilted strip */}
        <div className="w-full overflow-hidden relative pt-10 pb-20 z-10 -mt-40 -mb-16">
          {isAdmin && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
              <label className="cursor-pointer flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] font-poppins uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-transform">
                <Plus size={12} /> Add Strip Photos
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleStripUpload} />
              </label>
            </div>
          )}
          <div className="flex gap-3 md:gap-5 strip-scroll" style={{ width: "max-content" }}>
            {[...stripBase, ...stripBase].map((src, i) => {
              const isOriginal = i < stripBase.length;
              return (
                <div
                  key={i}
                  className="flex-shrink-0 rounded-md overflow-hidden border-2 border-border/30 bg-secondary/40 flex items-center justify-center relative group"
                  style={{
                    width: "clamp(150px, 7vw, 170px)",
                    height: "clamp(200px, 10vw, 230px)",
                    transform: `rotate(${stripAngles[i % stripAngles.length]}deg)`,
                  }}
                >
                  {src
                    ? <img src={src} alt="" className="w-full h-full object-cover" />
                    : <ImageIcon size={14} className="text-border" />
                  }
                  {isAdmin && isOriginal && (
                    <label className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 bg-black/50 flex items-center justify-center transition-opacity rounded-md">
                      <Plus size={16} className="text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleStripUpload} />
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div ref={galleryRef} className="max-w-[1600px] mx-auto px-4 md:px-6 pt-16">
          <motion.div
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-8 origin-left"
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-[10px] uppercase tracking-[0.3em] text-primary font-poppins mb-6"
          >
            ✦ Selected Work ✦
          </motion.p>
        </div>

        {error && (
          <div className="text-center py-20">
            <p className="text-destructive text-sm font-poppins">{error}</p>
          </div>
        )}

        {!error && displayImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }} className="overflow-hidden"
          >
            <MasonryGallery images={displayImages} onImageClick={handleImageClick} />
          </motion.div>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
            />
          </div>
        )}

        {!loading && !error && displayImages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-sm font-poppins">No images found.</p>
          </div>
        )}
      </main>

      {lightboxOpen && displayImages.length > 0 && (
        <Lightbox images={displayImages} initialIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />
      )}

      <PortfolioFooter />
      <FloatingButtons />
    </>
  );
};

export default Index;
