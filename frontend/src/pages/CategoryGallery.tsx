import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import PortfolioHeader from "@/components/PortfolioHeader";
import PortfolioFooter from "@/components/PortfolioFooter";
import FloatingButtons from "@/components/FloatingButtons";
import MasonryGallery from "@/components/MasonryGallery";
import InvitationsGallery from "@/components/InvitationsGallery";
import Lightbox from "@/components/Lightbox";
import SEO from "@/components/SEO";
import { fetchMixedMedia } from "@/services/pexels";

const validCategories = ['wedding', 'birthday', 'traditional', 'events', 'maternity', 'invitations', 'reels'];

const categoryInfo: Record<string, { title: string; description: string }> = {
  wedding: {
    title: "Best Wedding & Pre Wedding Photographer in Beawar, Ajmer, Jodhpur, Jaipur, Pali, Rajasthan",
    description: "Golden Photography – Best wedding photographer in Beawar, Ajmer, Jodhpur, Jaipur, Pali and across Rajasthan. Best pre wedding photographer in Rajasthan. Candid, traditional & cinematic wedding photography. Book now!",
  },
  birthday: {
    title: "Best Birthday Photographer in Beawar, Ajmer, Jodhpur, Jaipur, Rajasthan",
    description: "Golden Photography – Best birthday photographer in Beawar, Ajmer, Jodhpur, Jaipur, Pali, Rajasthan. Professional birthday party photography for kids and adults. Book now!",
  },
  traditional: {
    title: "Best Traditional & Festival Photographer in Beawar, Ajmer, Rajasthan",
    description: "Golden Photography – Best traditional photographer in Beawar, Ajmer, Jodhpur, Jaipur, Rajasthan. Expert in Rajasthani culture, Diwali, Holi, Teej, Gangaur festival photography.",
  },
  events: {
    title: "Best Event Photographer in Beawar, Ajmer, Jodhpur, Jaipur, Rajasthan",
    description: "Golden Photography – Best event photographer in Beawar, Ajmer, Jodhpur, Jaipur, Pali, Rajasthan. Corporate events, school functions, college events & social gatherings photography.",
  },
  maternity: {
    title: "Best Maternity Photographer in Beawar, Ajmer, Jodhpur, Jaipur, Rajasthan",
    description: "Golden Photography – Best maternity photographer in Beawar, Ajmer, Jodhpur, Jaipur, Pali, Rajasthan. Beautiful pregnancy photoshoot services. Book your maternity shoot today!",
  },
  invitations: {
    title: "Best Wedding Invitation Photographer in Beawar, Ajmer, Rajasthan",
    description: "Golden Photography – Best wedding invitation photography & design in Beawar, Ajmer, Jodhpur, Jaipur, Rajasthan. Creative and elegant invitation card photoshoots.",
  },
  reels: {
    title: "Best Wedding Reels & Videographer in Beawar, Ajmer, Jodhpur, Jaipur, Rajasthan",
    description: "Golden Photography – Best wedding videographer & reels creator in Beawar, Ajmer, Jodhpur, Jaipur, Pali, Rajasthan. Cinematic wedding reels for Instagram & YouTube.",
  },
};

const CategoryGallery = () => {
  const { category } = useParams<{ category: string }>();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const isValid = category && validCategories.includes(category.toLowerCase());
  const info = isValid ? categoryInfo[category.toLowerCase()] : categoryInfo['wedding'];
  const categoryUpper = category?.toUpperCase() || 'WEDDING';

  useEffect(() => {
    if (!isValid) return;
    const loadImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMixedMedia(categoryUpper, 1, 20);
        setImages(data.items);
      } catch (err) {
        setError('Failed to load images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadImages();
  }, [categoryUpper]);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (!isValid) return <Navigate to="/" replace />;

  const weddingJsonLd = category?.toLowerCase() === 'wedding' ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Golden Photography",
    "description": "Best wedding photographer in Beawar, Ajmer, Jodhpur, Jaipur, Pali and across Rajasthan. Best pre wedding photographer in Rajasthan.",
    "url": "https://goldenphotography.vercel.app/category/wedding",
    "telephone": "+91-9983745802",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Beawar",
      "addressRegion": "Rajasthan",
      "postalCode": "305901",
      "addressCountry": "IN"
    },
    "areaServed": ["Beawar", "Ajmer", "Jodhpur", "Jaipur", "Pali", "Kishangarh", "Nagaur", "Marwar", "Rajasthan"],
    "knowsAbout": [
      "best photographer in beawar",
      "best photographer in ajmer",
      "best photographer in jodhpur",
      "best photographer in jaipur",
      "best photographer in pali",
      "best photographer in rajasthan",
      "best wedding photographer in beawar",
      "best wedding photographer in ajmer",
      "best wedding photographer in jodhpur",
      "best wedding photographer in jaipur",
      "best wedding photographer in pali",
      "best wedding photographer in rajasthan",
      "best pre wedding photographer in beawar",
      "best pre wedding photographer in ajmer",
      "best pre wedding photographer in jodhpur",
      "best pre wedding photographer in jaipur",
      "best pre wedding photographer in pali",
      "best pre wedding photographer in rajasthan"
    ]
  } : undefined;

  return (
    <>
      <SEO
        title={`${info.title} - Golden Photography, Beawar`}
        description={info.description}
        canonicalUrl={`/category/${category}`}
        jsonLd={weddingJsonLd}
      />

      <PortfolioHeader activeCategory={categoryUpper} />

      <main>
        <section className="max-w-[1600px] mx-auto px-3 md:px-6 pt-32 pb-6 md:pt-36 md:pb-10">
          <div className="text-center space-y-3">
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-foreground">
              {info.title}
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto font-poppins">
              {info.description}
            </p>
          </div>
        </section>

        {error && (
          <div className="text-center py-20">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {category?.toLowerCase() === 'invitations' ? (
          <InvitationsGallery />
        ) : (
          <>
            {!error && images.length > 0 && (
              <MasonryGallery images={images} onImageClick={handleImageClick} category={categoryUpper} />
            )}
            {!loading && !error && images.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No images found in this category.</p>
              </div>
            )}
          </>
        )}
      </main>

      {lightboxOpen && images.length > 0 && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <PortfolioFooter />
      <FloatingButtons />
    </>
  );
};

export default CategoryGallery;
