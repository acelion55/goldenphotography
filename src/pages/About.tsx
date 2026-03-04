import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PortfolioHeader from "@/components/PortfolioHeader";
import PortfolioFooter from "@/components/PortfolioFooter";
import SEO from "@/components/SEO";
import { fetchPexelsPhotos } from "@/services/pexels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

const contactSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100, { message: "Name must be less than 100 characters" }),
  email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  message: z.string().trim().min(1, { message: "Message is required" }).max(1000, { message: "Message must be less than 1000 characters" }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const About = () => {
  const [portrait, setPortrait] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ownerName, setOwnerName] = useState("Morgan Blake");
  const [ownerSubtitle, setOwnerSubtitle] = useState("PRODUCTION & PHOTOGRAPHY");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editName, setEditName] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { isAdmin } = useAdmin();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "Thank you for your inquiry. I'll get back to you soon.",
      });
      form.reset();
      setIsSubmitting(false);
    }, 1000);
  };

  useEffect(() => {
    const loadOwnerData = async () => {
      try {
        const ownerDoc = await getDoc(doc(db, "ownerData", "profile"));
        if (ownerDoc.exists()) {
          const data = ownerDoc.data();
          if (data.name) setOwnerName(data.name);
          if (data.subtitle) setOwnerSubtitle(data.subtitle);
          if (data.photoUrl) {
            setPortrait({
              src: data.photoUrl,
              alt: data.name || 'Portrait',
              width: data.width || 800,
              height: data.height || 1000,
            });
            setLoading(false);
            return;
          }
        }
        
        const data = await fetchPexelsPhotos('PERSONAL', 1, 1);
        if (data.photos.length > 0) {
          const photo = data.photos[0];
          setPortrait({
            src: photo.src.large2x,
            alt: photo.alt || 'Portrait',
            width: photo.width,
            height: photo.height,
          });
        }
      } catch (err) {
        console.error('Error loading owner data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOwnerData();
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const newPortrait = {
        src: data.url,
        alt: ownerName,
        width: 800,
        height: 1000,
      };

      setPortrait(newPortrait);
      await setDoc(doc(db, "ownerData", "profile"), {
        photoUrl: data.url,
        name: ownerName,
        subtitle: ownerSubtitle,
        width: 800,
        height: 1000,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      toast({ title: "Photo updated successfully" });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleEditText = () => {
    setEditName(ownerName);
    setEditSubtitle(ownerSubtitle);
    setShowEditDialog(true);
  };

  const handleSaveText = async () => {
    try {
      setOwnerName(editName);
      setOwnerSubtitle(editSubtitle);
      
      await setDoc(doc(db, "ownerData", "profile"), {
        name: editName,
        subtitle: editSubtitle,
        photoUrl: portrait?.src,
        width: portrait?.width || 800,
        height: portrait?.height || 1000,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setShowEditDialog(false);
      toast({ title: "Text updated successfully" });
    } catch (error) {
      console.error('Save error:', error);
      toast({ title: "Save failed", variant: "destructive" });
    }
  };

  return (
    <>
      <SEO
        title="About - Morgan Blake"
        description="Learn about Morgan Blake, a production photographer specializing in fashion, editorial, and commercial photography."
        canonicalUrl="/about"
      />

      <PortfolioHeader
        activeCategory=""
      />
      
      <main className="min-h-screen">
        <section className="max-w-[1600px] mx-auto pt-20 pb-12 md:pt-24 md:pb-16">
          <div className="text-center space-y-8 mb-16 px-3 md:px-5 max-w-2xl mx-auto">
            <div className="space-y-4 relative">
              <h1 className="font-playfair text-4xl md:text-5xl text-foreground">
                {ownerName}
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-inter">
                {ownerSubtitle}
              </p>
              {isAdmin && (
                <button
                  onClick={handleEditText}
                  className="absolute top-0 right-0 p-2 bg-black/80 text-white rounded-full hover:bg-black transition-colors"
                  title="Edit text"
                >
                  ✏️
                </button>
              )}
            </div>

            {/* Portrait */}
            {!loading && portrait && (
              <div className="max-w-xs mx-auto border border-foreground/10 overflow-hidden relative group">
                <picture className="relative block">
                  {portrait.width && portrait.height && (
                    <svg
                      width={portrait.width}
                      height={portrait.height}
                      viewBox={`0 0 ${portrait.width} ${portrait.height}`}
                      className="w-full h-auto"
                    >
                      <rect
                        width={portrait.width}
                        height={portrait.height}
                        fill="white"
                      />
                    </svg>
                  )}
                  <img
                    src={portrait.src}
                    alt={portrait.alt}
                    className="absolute top-0 left-0 w-full h-auto grayscale"
                    style={{
                      opacity: loading ? 0 : 1,
                      transition: 'opacity 0.5s ease-out'
                    }}
                  />
                </picture>
                {isAdmin && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="absolute top-2 right-2 p-2 bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                      title="Change photo"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Owner Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Owner name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Subtitle</label>
                  <Input
                    value={editSubtitle}
                    onChange={(e) => setEditSubtitle(e.target.value)}
                    placeholder="Subtitle text"
                  />
                </div>
                <Button onClick={handleSaveText} className="w-full">
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Bio Section */}
          <div className="max-w-2xl mx-auto px-3 md:px-5 space-y-8 text-center text-foreground/80 text-sm leading-relaxed mb-16">
            <p>
              Production photographer specializing in fashion, editorial, and commercial photography.
              Creating compelling imagery with technical precision and creative vision for global brands
              and publications.
            </p>

            <p>
              Full production services including art buying, location scouting, casting, and on-set
              management. Collaborative approach ensuring seamless execution from concept to delivery.
            </p>

            <div className="pt-8">
              <h2 className="font-playfair text-xl text-foreground mb-4">Services</h2>
              <p className="text-foreground/70 text-xs uppercase tracking-wider leading-loose">
                Fashion & Editorial Photography / Commercial Production / Art Buying & Creative Direction /
                Location Scouting / Casting & Talent Coordination
              </p>
            </div>

            <div className="pt-4">
              <h2 className="font-playfair text-xl text-foreground mb-4">Select Clients</h2>
              <p className="text-foreground/70 text-xs uppercase tracking-wider leading-loose">
                Various fashion brands and editorial publications
              </p>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="max-w-xl mx-auto px-3 md:px-5 pt-16">
            <div className="text-center space-y-4 mb-12">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-inter">
                INQUIRIES
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl text-foreground">
                Contact
              </h2>
              <p className="text-foreground/80 text-sm leading-relaxed">
                For project inquiries and collaborations.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm uppercase tracking-wider text-foreground/70 font-inter">
                        Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your name"
                          className="border-0 border-b border-foreground/20 rounded-none bg-transparent text-foreground px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm uppercase tracking-wider text-foreground/70 font-inter">
                        Email *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          className="border-0 border-b border-foreground/20 rounded-none bg-transparent text-foreground px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm uppercase tracking-wider text-foreground/70 font-inter">
                        Message *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell me about your project..."
                          className="border-0 border-b border-foreground/20 rounded-none bg-transparent text-foreground min-h-[150px] px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 text-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="outline"
                    className="w-full md:w-auto px-12 py-6 text-sm uppercase tracking-widest font-inter border-foreground/40 hover:bg-foreground hover:text-background transition-all"
                  >
                    {isSubmitting ? "Sending..." : "Send"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </section>
      </main>

      <PortfolioFooter />
    </>
  );
};

export default About;
