import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { useAdmin } from "@/contexts/AdminContext";
import { Pencil } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface GalleryItem {
  type?: "image" | "video";
  src: string;
  videoSrc?: string;
  highResSrc?: string;
  alt: string;
  photographer?: string;
  client?: string;
  location?: string;
  details?: string;
  span?: number;
  width?: number;
  height?: number;
  id?: string;
  isCustom?: boolean;
}

interface MasonryGalleryProps {
  images: GalleryItem[];
  onImageClick: (index: number) => void;
  onImagesLoaded?: (images: GalleryItem[]) => void;
  category?: string;
}

const ScrollReveal = ({ children, index }: { children: React.ReactNode; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.75, originX: 0, originY: 1 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: (index % 6) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: "inline-block", verticalAlign: "top" }}
    >
      {children}
    </motion.div>
  );
};

const MasonryGallery = ({ images, onImageClick, onImagesLoaded, category = 'GALLERY' }: MasonryGalleryProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [displayImages, setDisplayImages] = useState<GalleryItem[]>(images);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const loadCustomImages = async () => {
      const updatedImages = await Promise.all(
        images.map(async (img, idx) => {
          const imageId = img.id || `${category}-img-${idx}`;
          try {
            const docRef = doc(db, 'customImages', imageId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const customData = docSnap.data();
              return { ...img, ...customData, id: imageId };
            }
          } catch (error) {
            // Silent error handling
          }
          return { ...img, id: imageId };
        })
      );
      setDisplayImages(updatedImages);
      if (onImagesLoaded) onImagesLoaded(updatedImages);
    };
    loadCustomImages();
  }, [images, category]);

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  const handleImageHover = (index: number) => {
    setHoveredIndex(index);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setHoveredIndex(null);
    }, 2800);
  };

  const handleImageLeave = () => {
    // Don't reset hoveredIndex on mouse leave, let the timer handle it
  };

  const handleEdit = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const currentImage = displayImages[index];
    const imageId = currentImage.id || `${category}-img-${index}`;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, {
            method: 'POST',
            body: formData,
          });
          
          const data = await response.json();
          
          if (data.success) {
            const fileUrl = data.file.url;
            
            if (data.file.type === 'video') {
              const docRef = doc(db, 'customImages', imageId);
              const dataToSave = {
                type: 'video',
                src: fileUrl,
                videoSrc: fileUrl,
                highResSrc: fileUrl,
                isCustom: true,
                updatedAt: new Date().toISOString()
              };
              
              await setDoc(docRef, dataToSave, { merge: true });
              alert('Upload successful! Reloading page...');
              window.location.reload();
            } else {
              const img = new Image();
              img.onload = async () => {
                try {
                  const docRef = doc(db, 'customImages', imageId);
                  const dataToSave = {
                    type: 'image',
                    src: fileUrl,
                    videoSrc: null,
                    highResSrc: fileUrl,
                    isCustom: true,
                    width: img.width,
                    height: img.height,
                    updatedAt: new Date().toISOString()
                  };
                  
                  await setDoc(docRef, dataToSave, { merge: true });
                  
                  alert('Upload successful! Reloading page...');
                  window.location.reload();
                } catch (error) {
                  alert('Firestore error: ' + error);
                }
              };
              img.src = fileUrl;
            }
          } else {
            alert('Upload failed: ' + data.error);
          }
        } catch (error) {
          alert('Upload failed: ' + error);
        }
      }
    };
    input.click();
  };

  const handleEditDetails = async (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const currentImage = displayImages[index];
    const imageId = currentImage.id || `${category}-img-${index}`;
    
    const photographer = prompt('Enter photographer name:', currentImage.photographer || '');
    if (photographer === null) return;
    
    const client = prompt('Enter client name:', currentImage.client || '');
    if (client === null) return;
    
    const location = prompt('Enter location:', currentImage.location || '');
    if (location === null) return;
    
    const details = prompt('Enter details:', currentImage.details || '');
    if (details === null) return;
    
    const alt = prompt('Enter image alt text:', currentImage.alt || '');
    if (alt === null) return;
    
    try {
      const docRef = doc(db, 'customImages', imageId);
      const dataToSave = {
        photographer,
        client,
        location,
        details,
        alt,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      alert('Details updated! Reloading page...');
      window.location.reload();
    } catch (error) {
      alert('Firestore error: ' + error);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto md:px-5 pb-16 overflow-hidden">
      <div className="gallery-hover-container text-center">
        {displayImages.map((image, index) => (
          <ScrollReveal key={index} index={index}>
          <div
            className="relative inline-block align-top p-[3px] md:p-1 lg:p-1.5 max-w-full"
            style={{ height: "270px" }}
          >
            {isAdmin && (
              <>
                <button
                  onClick={(e) => handleEdit(e, index)}
                  className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                  aria-label="Edit media"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={(e) => handleEditDetails(e, index)}
                  className="absolute top-2 right-14 z-10 bg-secondary text-secondary-foreground p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                  aria-label="Edit details"
                >
                  ✏️
                </button>
              </>
            )}
            <button
              onClick={() => onImageClick(index)}
              onMouseEnter={() => handleImageHover(index)}
              onMouseLeave={handleImageLeave}
              className="relative cursor-zoom-in gallery-image w-full h-full"
            >
            <div className="relative h-full overflow-hidden max-w-full">
              {image.type === "video" ? (
                <div className="relative h-full w-auto inline-block max-w-full">
                  {image.width && image.height && (
                    <svg
                      width={image.width}
                      height={image.height}
                      viewBox={`0 0 ${image.width} ${image.height}`}
                      className="h-full w-auto max-w-full"
                    >
                      <rect
                        width={image.width}
                        height={image.height}
                        fill="white"
                      />
                    </svg>
                  )}
                  <video
                    poster={image.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onLoadedData={() => handleImageLoad(index)}
                    className={`absolute top-0 left-0 h-full w-auto max-w-full object-cover transition-all duration-400 ${
                      hoveredIndex !== null && hoveredIndex !== index
                        ? "grayscale"
                        : ""
                    }`}
                    style={{
                      opacity: loadedImages.has(index) ? 1 : 0,
                      transition: "opacity 0.5s ease-out",
                      maxWidth: "100%",
                    }}
                  >
                    <source src={image.videoSrc} type="video/mp4" />
                  </video>
                </div>
              ) : (
                <picture
                  className={`inline-block h-full w-auto ${
                    loadedImages.has(index) ? "show" : ""
                  }`}
                >
                  {image.width && image.height && (
                    <svg
                      width={image.width}
                      height={image.height}
                      viewBox={`0 0 ${image.width} ${image.height}`}
                      className="h-full w-auto"
                    >
                      <rect
                        width={image.width}
                        height={image.height}
                        fill="white"
                      />
                    </svg>
                  )}
                  <img
                    src={image.src}
                    alt={image.alt}
                    onLoad={() => handleImageLoad(index)}
                    className={`absolute top-0 left-0 h-full w-auto object-contain transition-all duration-400 ${
                      hoveredIndex !== null && hoveredIndex !== index
                        ? "grayscale"
                        : ""
                    }`}
                    style={{
                      opacity: loadedImages.has(index) ? 1 : 0,
                      transition: "opacity 0.5s ease-out",
                    }}
                    loading="lazy"
                  />
                </picture>
              )}
              <ProgressiveBlur
                className="pointer-events-none absolute bottom-0 left-0 h-[80%] w-full"
                blurIntensity={0.6}
                animate={hoveredIndex === index ? "visible" : "hidden"}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
              {image.photographer && image.client && (
                <motion.div
                  className="absolute bottom-0 left-0 w-full pointer-events-none"
                  animate={hoveredIndex === index ? "visible" : "hidden"}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="flex flex-col items-center gap-0 px-4 py-3 text-center">
                    <p className="text-base font-medium text-white">
                      From {image.client}
                    </p>
                    <span className="text-xs text-white/90">
                      Shot in {image.location}. {image.details}.
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
            </button>
          </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

export default MasonryGallery;
