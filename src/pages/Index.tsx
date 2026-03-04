import { useState, useEffect } from "react";
import PortfolioHeader from "@/components/PortfolioHeader";
import PhotographerBio from "@/components/PhotographerBio";
import PortfolioFooter from "@/components/PortfolioFooter";
import FloatingButtons from "@/components/FloatingButtons";
import MasonryGallery from "@/components/MasonryGallery";
import Lightbox from "@/components/Lightbox";
import SEO from "@/components/SEO";
import { fetchMixedMedia } from "@/services/pexels";

const Index = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [displayImages, setDisplayImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMixedMedia("SELECTED", 1, 20);
        setDisplayImages(data.items);
      } catch (err) {
        console.error('Error fetching media:', err);
        setError('Failed to load images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadImages();
  }, []);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Golden Photography Beawar",
    "alternateName": "Beawar me Best Photographer",
    "description": "Beawar me sabse best photographer Golden Photography. Shadi ki photography, birthday photo, maternity shoot, school function photography Beawar, Ajmer, Jaipur, Kishangarh, Nasirabad, Masuda me available hai.",
    "url": "https://goldenphotography.vercel.app",
    "telephone": "+91-9983745802",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Beawar",
      "addressLocality": "Beawar",
      "addressRegion": "Rajasthan",
      "postalCode": "305901",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "26.1011",
      "longitude": "74.3200"
    },
    "areaServed": [
      "Beawar",
      "Ajmer",
      "Jaipur",
      "Kishangarh",
      "Nasirabad",
      "Masuda",
      "Srinagar Ajmer",
      "Pushkar",
      "Merta City",
      "Kekri",
      "Sarwar",
      "Pisangan",
      "Rajasthan"
    ],
    "knowsAbout": [
      "Beawar me best photographer",
      "Ajmer me wedding photographer",
      "Jaipur me photographer",
      "Shadi ki photography",
      "Wedding photography Beawar",
      "Birthday photo Beawar",
      "Maternity shoot Beawar Ajmer",
      "School function photography",
      "Event photography",
      "Pre-wedding shoot",
      "Candid photography",
      "Traditional photography",
      "Photographer near me"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Photography Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Shadi ki Photography",
            "description": "Beawar, Ajmer, Jaipur me best wedding photography. Shadi ki sabse acchi photos."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Birthday Photography",
            "description": "Birthday party ki photography Beawar me. Baccho aur bado ki birthday photos."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Maternity Shoot",
            "description": "Maternity photoshoot Beawar Ajmer me. Pregnancy photos professional photographer se."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "School Function Photography",
            "description": "School function aur event ki photography Beawar me."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Event Photography",
            "description": "Corporate event, party, function ki photography Beawar Ajmer Jaipur me."
          }
        }
      ]
    }
  };

  return (
    <>
      <SEO
        title="Beawar me Best Photographer | Golden Photography | Ajmer Jaipur Wedding Photography"
        description="Beawar me best photographer Golden Photography. Shadi ki photography, birthday photo, maternity shoot, school function photography. Beawar, Ajmer, Jaipur, Kishangarh, Nasirabad, Masuda me sabse accha photographer. Book kare ab!"
        canonicalUrl="/"
        ogType="website"
        jsonLd={jsonLd}
      />

      <PortfolioHeader />

      <main>
        <PhotographerBio />

        {error && (
          <div className="text-center py-20">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {!error && displayImages.length > 0 && (
          <div className="overflow-hidden">
            <MasonryGallery images={displayImages} onImageClick={handleImageClick} />
          </div>
        )}

        {!loading && !error && displayImages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No images found.</p>
          </div>
        )}
      </main>

      {lightboxOpen && displayImages.length > 0 && (
        <Lightbox
          images={displayImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <PortfolioFooter />
      <FloatingButtons />
    </>
  );
};

export default Index;
