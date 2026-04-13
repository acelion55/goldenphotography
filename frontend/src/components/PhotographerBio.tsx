import { useState, useEffect, useRef } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Pencil, Camera, Award, Star, MapPin } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {
  motion,
  useInView,
  useAnimation,
  useScroll,
  useTransform,
} from 'framer-motion';
import ownerPhoto from '@/assets/raya-portrait.jpg';

/* ── Counting number hook ── */
function useCountUp(target: number, duration = 1.6, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / (duration * 1000), 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ── Single animated stat ── */
const StatItem = ({
  icon: Icon,
  target,
  suffix,
  label,
  started,
  delay,
}: {
  icon: React.ElementType;
  target: number;
  suffix: string;
  label: string;
  started: boolean;
  delay: number;
}) => {
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => setGo(true), delay * 1000);
    return () => clearTimeout(t);
  }, [started, delay]);
  const count = useCountUp(target, 1.4, go);

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="flex flex-col items-center gap-1 bg-secondary/60 rounded-xl py-3 px-1 border border-border/50"
    >
      <Icon size={14} className="text-primary" />
      <span className="font-playfair text-lg text-foreground leading-none">
        {count}{suffix}
      </span>
      <span className="text-[9px] text-muted-foreground font-poppins uppercase tracking-wider">
        {label}
      </span>
    </motion.div>
  );
};

const statsConfig = [
  { icon: Camera, target: 21, suffix: '+', label: 'Years Exp.' },
  { icon: Award, target: 500, suffix: '+', label: 'Weddings' },
  { icon: Star, target: 1000, suffix: '+', label: 'Happy Clients' },
];

/* ── Parallax collage image ── */
const ParallaxPhoto = ({
  src,
  style,
  rotate,
  delay,
  isInView: inView,
  parallaxStrength = 30,
  onEdit,
}: {
  src: string | null;
  style: React.CSSProperties;
  rotate: string;
  delay: number;
  isInView: boolean;
  parallaxStrength?: number;
  onEdit?: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-parallaxStrength, parallaxStrength]);

  return (
    <motion.div
      ref={ref}
      style={{ ...style, y }}
      initial={{ opacity: 0, scale: 0.85, rotate: '0deg' }}
      animate={
        inView
          ? { opacity: 1, scale: 1, rotate, transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] } }
          : {}
      }
      whileHover={{ scale: 1.06, zIndex: 10, transition: { duration: 0.2 } }}
      className="absolute shadow-xl border-2 border-border/40 rounded-lg overflow-hidden"
    >
      {src ? (
        <>
          <img src={src} alt="Portfolio" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          {onEdit && (
            <button onClick={onEdit} className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Pencil size={16} className="text-white" />
            </button>
          )}
        </>
      ) : (
        <div className="w-full h-full bg-secondary/60 flex flex-col items-center justify-center gap-1" onClick={onEdit}>
          <div className="w-6 h-6 rounded-full border-2 border-dashed border-border/60" />
          <span className="text-[8px] text-muted-foreground/50 font-poppins uppercase tracking-wider">{onEdit ? 'Click to upload' : 'Photo'}</span>
        </div>
      )}
    </motion.div>
  );
};

/* ══════════════════════════════════════════ */
const PhotographerBio = () => {
  const { isAdmin } = useAdmin();
  const [photo, setPhoto] = useState(ownerPhoto);
  const [collageImgs, setCollageImgs] = useState<string[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-40px' });
  const controls = useAnimation();

  useEffect(() => {
    // Delay start to let loading screen exit animation finish
    const t = setTimeout(() => {
      if (isInView) controls.start('visible');
    }, 100);
    return () => clearTimeout(t);
  }, [isInView, controls]);

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        const docRef = doc(db, 'settings', 'ownerPhoto');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().url) setPhoto(docSnap.data().url);
      } catch (e) {
        console.error('Error loading photo:', e);
      }
    };
    loadPhoto();

    const loadCollage = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'collage'));
        if (snap.exists()) {
          const d = snap.data();
          setCollageImgs([d.img1 || null, d.img2 || null, d.img3 || null].filter(Boolean) as string[]);
        }
      } catch {}
    };
    loadCollage();
  }, []);

  const handleEditPhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          const docRef = doc(db, 'settings', 'ownerPhoto');
          await setDoc(docRef, { url: data.file.url }, { merge: true });
          setPhoto(data.file.url);
          alert('Photo updated!');
        } else alert('Upload failed: ' + data.error);
      } catch (err) {
        alert('Upload failed: ' + err);
      }
    };
    input.click();
  };

  const handleEditCollage = (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
          const updated = [...collageImgs];
          updated[index] = data.file.url;
          setCollageImgs(updated);
          const save: Record<string, string | null> = { img1: updated[0] || null, img2: updated[1] || null, img3: updated[2] || null };
          await setDoc(doc(db, 'settings', 'collage'), save, { merge: true });
          alert('Collage photo updated!');
        }
      } catch (err) { alert('Upload failed: ' + err); }
    };
    input.click();
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay: i * 0.11, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  /* collage layout config */
  const collage = [
    { src: collageImgs[0] || null, rotate: '-7deg', delay: 0.2, strength: 28,
      style: { width: '46%', height: '62%', left: '0%', top: '8%', zIndex: 0 } },
    { src: collageImgs[1] || null, rotate: '5deg', delay: 0.35, strength: 20,
      style: { width: '46%', height: '62%', left: '30%', top: '0%', zIndex: 1 } },
    { src: collageImgs[2] || null, rotate: '-2deg', delay: 0.5, strength: 35,
      style: { width: '52%', height: '68%', left: '16%', top: '30%', zIndex: 2 } },
  ];

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center px-5 pt-[80px] pb-28 bg-background relative"
    >
      {/* bg orbs */}
      <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-primary/6 blur-2xl pointer-events-none" />

      {/* ══ MOBILE ══ */}
      <div className="md:hidden flex flex-col gap-5 max-w-sm mx-auto w-full">

        {/* Location badge */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={controls}>
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-primary font-poppins font-medium border border-primary/30 rounded-full px-3  py-1">
            <MapPin size={9} /> Beawar · Rajasthan
          </span>
        </motion.div>

        {/* ── Title row: text + owner photo side by side ── */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate={controls}
          className="flex items-center justify-between gap-3"
        >
          <div className="flex-1">
            <h1 className="font-playfair text-[2rem] leading-tight text-foreground">
              <span className="text-primary italic">Golden</span>
              <br />Photography
            </h1>
            <p className="mt-1 text-[11px] text-muted-foreground font-poppins tracking-wide">
              Capturing timeless moments
            </p>
          </div>

          {/* Owner photo — tall rectangle, absolute so only image has margin top */}
          <div className="relative flex-shrink-0" style={{ width: '130px', height: '90px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1, transition: { delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] } } : {}}
              className="absolute group"
              style={{ top: '-60px', left: 0, width: '130px', height: '210px' }}
            >
              <div className="w-full h-full rounded-lg overflow-hidden border-2 border-primary shadow-lg">
                <img src={photo} alt="Gopal Das Vaishnav" className="w-full h-full object-cover" />
              </div>
              {isAdmin && (
                <button
                  onClick={handleEditPhoto}
                  className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Pencil size={14} className="text-white" />
                </button>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Photo Collage with parallax */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate={controls}
          className="relative h-52 w-full"
        >
          {collage.map((p, i) => (
            <ParallaxPhoto
              key={i}
              src={p.src}
              style={p.style as React.CSSProperties}
              rotate={p.rotate}
              delay={p.delay}
              isInView={isInView}
              parallaxStrength={p.strength}
              onEdit={isAdmin ? () => handleEditCollage(i) : undefined}
            />
          ))}
        </motion.div>

        {/* Stats — counting animation */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate={controls}>
          <p className="font-playfair text-2xl font-bold text-foreground italic tracking-tight">21+ <span className="not-italic font-light text-xl tracking-widest uppercase font-poppins">Years of Experience</span></p>
        </motion.div>

        {/* Stats — counting animation */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-3 gap-2"
        >
          {statsConfig.map((s, i) => (
            <StatItem
              key={i}
              icon={s.icon}
              target={s.target}
              suffix={s.suffix}
              label={s.label}
              started={isInView}
              delay={0.4 + i * 0.15}
            />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate={controls}>
          <a
            href="/contact"
            className="block w-full text-center bg-primary text-primary-foreground font-poppins text-xs uppercase tracking-[0.2em] py-3 rounded-full shadow-md hover:shadow-primary/30 hover:shadow-lg transition-all duration-300"
          >
            Book a Session
          </a>
        </motion.div>
      </div>

      {/* ══ DESKTOP ══ */}
      <div className="hidden md:flex gap-14 items-center max-w-[1600px] mx-auto w-full">

        {/* Left */}
        <div className="flex-1 space-y-5">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0, transition: { duration: 0.5 } } : {}}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-primary font-poppins font-medium border border-primary/30 rounded-full px-4 py-1.5"
          >
            <MapPin size={11} /> Beawar · Ajmer · Jodhpur · Jaipur · Pali · Rajasthan
          </motion.span>

          {/* Title + owner photo side by side on desktop too */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } } : {}}
            className="flex items-center gap-5"
          >
            <h1 className="font-playfair text-5xl lg:text-6xl text-foreground leading-tight">
              <span className="text-primary italic">Golden</span>
              <br />Photography
            </h1>
            <div className="relative flex-shrink-0" style={{ width: '190px', height: '140px' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1, transition: { delay: 0.2, duration: 0.5 } } : {}}
                className="absolute group"
                style={{ top: '-10px', left: 0, width: '190px', height: '290px' }}
              >
                <div className="w-full h-full rounded-xl overflow-hidden border-[3px] border-primary shadow-xl">
                  <img src={photo} alt="Owner" className="w-full h-full object-cover" />
                </div>
                {isAdmin && (
                  <button onClick={handleEditPhoto} className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Pencil size={18} className="text-white" />
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* CTA button */}
          <motion.a
            href="/contact"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } } : {}}
            whileHover={{ scale: 1.03 }}
            className="inline-block bg-primary text-primary-foreground font-poppins text-xs uppercase tracking-[0.2em] px-8 py-3 rounded-full shadow-md hover:shadow-primary/30 hover:shadow-lg transition-all duration-300"
          >
            Book a Session
          </motion.a>

          {/* Desktop stats — counting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } } : {}}
            className="flex gap-8"
          >
            {statsConfig.map((s, i) => {
              const DesktopStat = () => {
                const [go, setGo] = useState(false);
                useEffect(() => {
                  if (!isInView) return;
                  const t = setTimeout(() => setGo(true), (0.4 + i * 0.15) * 1000);
                  return () => clearTimeout(t);
                }, []);
                const count = useCountUp(s.target, 1.4, go);
                return (
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-end gap-1">
                      <s.icon size={14} className="text-primary mb-1" />
                      <span className="font-playfair text-3xl text-foreground leading-none">
                        {count}{s.suffix}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-poppins uppercase tracking-wider">
                      {s.label}
                    </span>
                  </div>
                );
              };
              return <DesktopStat key={i} />;
            })}
          </motion.div>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4 } } : {}}
            className="text-sm text-muted-foreground max-w-xl leading-relaxed font-poppins"
          >
            With over <span className="text-primary font-medium">21+ years of experience</span>, Golden Photography
            is the most trusted name for weddings, pre-weddings, birthdays, and events across Rajasthan.
            Every frame is crafted with passion, precision, and the warmth of Rajasthani tradition.
          </motion.p>
        </div>

        {/* Right: collage with parallax */}
        <div className="relative w-[400px] h-[400px] flex-shrink-0">
          {collage.map((p, i) => {
            const desktopStyle = {
              width: i === 2 ? '55%' : '48%',
              height: i === 2 ? '55%' : '48%',
              left: i === 0 ? '0%' : i === 1 ? '32%' : '16%',
              top: i === 0 ? '8%' : i === 1 ? '0%' : '42%',
              zIndex: i,
            };
            return (
              <ParallaxPhoto
                key={i}
                src={p.src}
                style={desktopStyle}
                rotate={p.rotate}
                delay={p.delay}
                isInView={isInView}
                parallaxStrength={p.strength}
                onEdit={isAdmin ? () => handleEditCollage(i) : undefined}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PhotographerBio;
