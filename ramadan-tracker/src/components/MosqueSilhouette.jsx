import { motion } from "framer-motion";

export default function MosqueSilhouette({ className = "" }) {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      viewBox="0 0 800 300"
      className={`w-full ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stars */}
      {[
        { cx: 50, cy: 30, delay: 0 },
        { cx: 150, cy: 60, delay: 0.5 },
        { cx: 300, cy: 20, delay: 1 },
        { cx: 450, cy: 50, delay: 1.5 },
        { cx: 600, cy: 25, delay: 0.8 },
        { cx: 700, cy: 55, delay: 1.2 },
        { cx: 750, cy: 15, delay: 0.3 },
        { cx: 100, cy: 80, delay: 1.8 },
        { cx: 550, cy: 70, delay: 0.6 },
        { cx: 250, cy: 45, delay: 1.4 },
      ].map((star, i) => (
        <motion.circle
          key={i}
          cx={star.cx}
          cy={star.cy}
          r="1.5"
          fill="#fbbf24"
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}

      {/* Crescent Moon */}
      <motion.g
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <circle cx="400" cy="50" r="25" fill="#fbbf24" opacity="0.9" />
        <circle cx="412" cy="42" r="22" fill="#0a0e1a" />
      </motion.g>

      {/* Central Dome */}
      <motion.path
        d="M340 300 L340 180 Q400 80 460 180 L460 300"
        fill="url(#mosqueGrad)"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />

      {/* Central Minaret */}
      <motion.rect
        x="395"
        y="100"
        width="10"
        height="80"
        fill="url(#mosqueGrad)"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        style={{ transformOrigin: "bottom" }}
      />
      <motion.circle
        cx="400"
        cy="95"
        r="8"
        fill="#fbbf24"
        opacity="0.7"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.8, type: "spring" }}
      />

      {/* Left Minaret */}
      <motion.rect
        x="290"
        y="140"
        width="8"
        height="160"
        fill="url(#mosqueGrad)"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{ transformOrigin: "bottom" }}
      />
      <motion.path
        d="M286 140 Q294 120 302 140"
        fill="url(#mosqueGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      />

      {/* Right Minaret */}
      <motion.rect
        x="502"
        y="140"
        width="8"
        height="160"
        fill="url(#mosqueGrad)"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{ transformOrigin: "bottom" }}
      />
      <motion.path
        d="M498 140 Q506 120 514 140"
        fill="url(#mosqueGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      />

      {/* Left Small Dome */}
      <motion.path
        d="M240 300 L240 220 Q280 170 320 220 L320 300"
        fill="url(#mosqueGrad)"
        opacity="0.7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />

      {/* Right Small Dome */}
      <motion.path
        d="M480 300 L480 220 Q520 170 560 220 L560 300"
        fill="url(#mosqueGrad)"
        opacity="0.7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />

      {/* Base */}
      <motion.rect
        x="200"
        y="280"
        width="400"
        height="20"
        fill="url(#mosqueGrad)"
        rx="2"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />

      {/* Lanterns */}
      {[
        { x: 180, delay: 0.8 },
        { x: 620, delay: 1.0 },
      ].map((lantern, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: lantern.delay, duration: 0.5 }}
          className="animate-lantern"
        >
          <line
            x1={lantern.x}
            y1="120"
            x2={lantern.x}
            y2="150"
            stroke="#fbbf24"
            strokeWidth="1"
            opacity="0.5"
          />
          <rect
            x={lantern.x - 6}
            y="150"
            width="12"
            height="20"
            rx="2"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1"
            opacity="0.6"
          />
          <motion.circle
            cx={lantern.x}
            cy="160"
            r="3"
            fill="#fbbf24"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
          />
        </motion.g>
      ))}

      <defs>
        <linearGradient id="mosqueGrad" x1="400" y1="80" x2="400" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}
