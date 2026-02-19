import { useMemo } from "react";
import { motion } from "framer-motion";

// Generate star positions outside the component so they are stable
function generateStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (i * 37 + 13) % 100,
    y: (i * 53 + 7) % 100,
    size: (i % 3) * 0.6 + 0.5,
    delay: (i * 0.17) % 3,
    duration: (i % 4) * 0.5 + 2,
  }));
}

const STARS = generateStars(50);

export default function StarsBackground() {
  const stars = useMemo(() => STARS, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#0f1729] to-[#0c1520]" />
      
      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-sky-500/5 via-transparent to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-gradient-radial from-teal-500/5 via-transparent to-transparent rounded-full blur-3xl" />

      {/* Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
