import { useEffect, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

const LETTERS_GOLDEN = "GOLDEN".split("");
const LETTERS_PHOTO = "PHOTOGRAPHY".split("");

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"intro" | "pulse" | "exit">("intro");
  const lineControls = useAnimation();
  const orbControls = useAnimation();

  useEffect(() => {
    const run = async () => {
      // Phase 1: letters stagger in (0.8s)
      await new Promise(r => setTimeout(r, 900));
      // Phase 2: golden line expands + orb pulses
      setPhase("pulse");
      await lineControls.start({ scaleX: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } });
      await orbControls.start({
        scale: [1, 1.4, 0.9, 1.15, 1],
        transition: { duration: 0.7, ease: "easeInOut" }
      });
      await new Promise(r => setTimeout(r, 400));
      // Phase 3: exit
      setPhase("exit");
      await new Promise(r => setTimeout(r, 700));
      onComplete();
    };
    run();
  }, []);

  // Particles
  const particles = Array.from({ length: 16 }, (_, i) => ({
    angle: (i / 16) * 360,
    distance: 60 + Math.random() * 60,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 0.2,
  }));

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {/* Background radial glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(35 70% 45% / 0.08) 0%, transparent 70%)"
            }}
          />

          {/* Decorative corner lines */}
          {[
            "top-8 left-8 border-t border-l",
            "top-8 right-8 border-t border-r",
            "bottom-8 left-8 border-b border-l",
            "bottom-8 right-8 border-b border-r",
          ].map((cls, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute w-8 h-8 border-primary/40 ${cls}`}
            />
          ))}

          {/* Center content */}
          <div className="relative flex flex-col items-center gap-3">

            {/* Particle burst — only in pulse phase */}
            {phase === "pulse" && particles.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                  y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                  scale: [0, 1, 0],
                }}
                transition={{ duration: 0.8, delay: p.delay, ease: "easeOut" }}
                className="absolute rounded-full bg-primary"
                style={{ width: p.size, height: p.size }}
              />
            ))}

            {/* GOLDEN — letters stagger scale up */}
            <div className="flex items-end gap-[2px] md:gap-1">
              {LETTERS_GOLDEN.map((l, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40, scale: 0.4 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-playfair font-bold text-primary italic"
                  style={{ fontSize: "clamp(42px, 10vw, 96px)", lineHeight: 1 }}
                >
                  {l}
                </motion.span>
              ))}
            </div>

            {/* Animated golden line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={lineControls}
              className="w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent origin-center"
            />

            {/* PHOTOGRAPHY — letters stagger scale up with delay */}
            <div className="flex items-center gap-[1px] md:gap-[3px]">
              {LETTERS_PHOTO.map((l, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: -30, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.35 + i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-poppins font-light text-foreground/80 uppercase tracking-[0.35em]"
                  style={{ fontSize: "clamp(10px, 2vw, 18px)" }}
                >
                  {l}
                </motion.span>
              ))}
            </div>

            {/* Location tag */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.0 }}
              className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-poppins mt-1"
            >
              Beawar · Rajasthan
            </motion.p>
          </div>

          {/* Bottom progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary/60 via-primary to-primary/60"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.2, ease: "linear" }}
          />

          {/* Rotating ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
            animate={{ opacity: [0, 0.3, 0.3, 0], scale: [0.5, 1, 1, 1.3], rotate: 180 }}
            transition={{ duration: 2.2, ease: "easeInOut", times: [0, 0.3, 0.7, 1] }}
            className="absolute w-32 h-32 md:w-48 md:h-48 rounded-full border border-primary/20"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.3, rotate: 0 }}
            animate={{ opacity: [0, 0.15, 0.15, 0], scale: [0.3, 1.2, 1.2, 1.6], rotate: -120 }}
            transition={{ duration: 2.2, delay: 0.2, ease: "easeInOut", times: [0, 0.3, 0.7, 1] }}
            className="absolute w-48 h-48 md:w-72 md:h-72 rounded-full border border-primary/10"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default LoadingScreen;
