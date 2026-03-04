import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import PortfolioHeader from "@/components/PortfolioHeader";
import PortfolioFooter from "@/components/PortfolioFooter";
import FloatingButtons from "@/components/FloatingButtons";
import MasonryGallery from "@/components/MasonryGallery";
import Lightbox from "@/components/Lightbox";
import SEO from "@/components/SEO";
import { fetchMixedMedia } from "@/services/pexels";

const validCategories = ['wedding', 'birthday', 'traditional', 'events', 'maternity', 'invitations', 'reels'];

const categoryInfo: Record<string, { title: string; description: string }> = {
  wedding: {
    title: "Wedding Photography in Beawar Rajasthan",
    description: "Professional wedding photographer in Beawar. Capturing beautiful Indian weddings, Rajasthani weddings, pre-wedding shoots, and candid moments. Best wedding photography services in Beawar, Ajmer, Jaipur.",
  },
  birthday: {
    title: "Birthday Photography in Beawar",
    description: "Fun and vibrant birthday party photography in Beawar. Professional birthday photoshoot services for kids and adults. Capture your special moments with Golden Photography.",
  },
  traditional: {
    title: "Traditional Indian Festival Photography Beawar",
    description: "Celebrating Rajasthani culture and traditions through beautiful photography. Expert in Diwali, Holi, Teej, Gangaur, and all traditional Indian festival photography in Beawar.",
  },
  events: {
    title: "Event Photography in Beawar Rajasthan",
    description: "Professional event photographer in Beawar for corporate events, school functions, college events, social gatherings, and special occasions. Affordable event photography services.",
  },
  maternity: {
    title: "Maternity Photography in Beawar",
    description: "Beautiful maternity photoshoot services in Beawar. Capturing the joy of expecting mothers with professional maternity photography. Book your pregnancy photoshoot today.",
  },
  invitations: {
    title: "Wedding Invitation Photography Beawar",
    description: "Creative and elegant wedding invitation card photography and design services in Beawar. Professional invitation photoshoot for weddings and events.",
  },
  reels: {
    title: "Wedding Reels & Videos Beawar",
    description: "Cinematic wedding reels and video content for weddings, events, and social media in Beawar. Professional videography services for Instagram reels and YouTube.",
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

  return (
    <>
      <SEO
        title={`${info.title} - Golden Photography, Beawar`}
        description={info.description}
        canonicalUrl={`/category/${category}`}
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

        {!error && images.length > 0 && (
          <MasonryGallery images={images} onImageClick={handleImageClick} category={categoryUpper} />
        )}

        {!loading && !error && images.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No images found in this category.</p>
          </div>
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
