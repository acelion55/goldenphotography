import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Pencil } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import ownerPhoto from '@/assets/raya-portrait.jpg';

const PhotographerBio = () => {
  const { isAdmin } = useAdmin();
  const [photo, setPhoto] = useState(ownerPhoto);

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        const docRef = doc(db, 'settings', 'ownerPhoto');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().url) {
          setPhoto(docSnap.data().url);
        }
      } catch (error) {
        console.error('Error loading photo:', error);
      }
    };
    loadPhoto();
  }, []);

  const handleEditPhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
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
            const docRef = doc(db, 'settings', 'ownerPhoto');
            await setDoc(docRef, { url: data.file.url }, { merge: true });
            setPhoto(data.file.url);
            alert('Photo updated successfully!');
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

  return (
    <section className="max-w-[1600px] mx-auto px-4 md:px-6 pt-32 pb-10 md:pt-36 md:pb-14">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex gap-3 items-center">
          <div className="flex-1 text-left space-y-1">
            <h1 className="font-playfair text-lg text-foreground leading-tight">
              <span className="text-primary">Golden</span> Photography
            </h1>
            <p className="text-[10px] text-muted-foreground font-poppins leading-relaxed">
              Capturing precious moments with Rajasthani tradition.
            </p>
          </div>
          <div className="w-16 h-16 flex-shrink-0 relative group">
            <img src={photo} alt="Owner" className="w-full h-full object-cover rounded" />
            {isAdmin && (
              <button
                onClick={handleEditPhoto}
                className="absolute inset-0 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Pencil size={16} className="text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex gap-12 items-center">
        <div className="flex-1 text-left space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-poppins font-medium">
            ✦ Beawar, Rajasthan ✦
          </span>
          <h1 className="font-playfair text-4xl lg:text-5xl text-foreground">
            <span className="text-primary">Golden</span> Photography
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed font-poppins">
            Capturing your most precious moments with the warmth and beauty of Rajasthani tradition. 
            From grand weddings to intimate celebrations, we tell your story through our lens.
          </p>
        </div>
        <div className="w-80 h-80 flex-shrink-0 relative group">
          <img src={photo} alt="Owner" className="w-full h-full object-cover rounded-lg shadow-lg" />
          {isAdmin && (
            <button
              onClick={handleEditPhoto}
              className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <Pencil size={24} className="text-white" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default PhotographerBio;
