import ownerPhoto from '@/assets/raya-portrait.jpg';

const PhotographerBio = () => {
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
          <div className="w-16 h-16 flex-shrink-0">
            <img src={ownerPhoto} alt="Owner" className="w-full h-full object-cover rounded" />
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
        <div className="w-80 h-80 flex-shrink-0">
          <img src={ownerPhoto} alt="Owner" className="w-full h-full object-cover rounded-lg shadow-lg" />
        </div>
      </div>
    </section>
  );
};

export default PhotographerBio;
