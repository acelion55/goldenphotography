import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PortfolioHeader from "@/components/PortfolioHeader";
import PortfolioFooter from "@/components/PortfolioFooter";
import FloatingButtons from "@/components/FloatingButtons";
import SEO from "@/components/SEO";
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

const contactSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100),
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  phone: z.string().trim().min(10, { message: "Phone number is required" }).max(15),
  message: z.string().trim().min(1, { message: "Message is required" }).max(1000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    // Format WhatsApp message
    const message = `*New Contact Form Submission*%0A%0A*Name:* ${data.name}%0A*Email:* ${data.email}%0A*Phone:* ${data.phone}%0A*Message:* ${data.message}`;
    
    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/917737772377?text=${message}`, '_blank');
    
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "Thank you for your inquiry. We'll get back to you soon.",
      });
      form.reset();
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <>
      <SEO
        title="Book Best Wedding Photographer in Beawar, Ajmer, Jodhpur, Jaipur, Pali, Rajasthan | Golden Photography"
        description="Contact Golden Photography – Best wedding photographer & best pre wedding photographer in Beawar, Ajmer, Jodhpur, Jaipur, Pali, Rajasthan. Book now for weddings, events, birthday & maternity shoots."
        canonicalUrl="/contact"
      />

      <PortfolioHeader />

      <main className="min-h-screen">
        <section className="max-w-[1600px] mx-auto px-4 md:px-6 pt-32 pb-12 md:pt-36 md:pb-16">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-poppins font-medium">
              ✦ Get In Touch ✦
            </span>
            <h1 className="font-playfair text-4xl md:text-5xl text-foreground">
              Contact Us
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto font-poppins">
              Ready to capture your special moments? Reach out to us for bookings and inquiries.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm uppercase tracking-wider text-foreground/70 font-poppins">Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" className="border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors" {...field} />
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
                      <FormLabel className="text-sm uppercase tracking-wider text-foreground/70 font-poppins">Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" className="border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm uppercase tracking-wider text-foreground/70 font-poppins">Phone *</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+91 98765 43210" className="border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors" {...field} />
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
                      <FormLabel className="text-sm uppercase tracking-wider text-foreground/70 font-poppins">Message *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us about your event..." className="border-0 border-b border-border rounded-none bg-transparent min-h-[120px] px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-4 text-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-12 py-6 text-sm uppercase tracking-widest font-poppins bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Google Map Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-playfair text-center mb-6">Visit Our Studio</h2>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113905.3366034!2d74.26!3d26.10!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396bf0f0b6c3e5e5%3A0x5c4e4e4e4e4e4e4e!2sBeawar%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Golden Photography Location"
              />
            </div>
          </div>
        </section>
      </main>

      <PortfolioFooter />
      <FloatingButtons />
    </>
  );
};

export default Contact;
