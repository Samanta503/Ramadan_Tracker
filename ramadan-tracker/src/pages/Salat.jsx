import { motion } from "framer-motion";
import { FaPrayingHands, FaClock, FaMosque } from "react-icons/fa";

const prayers = [
  { name: "Fajr", time: "5:15 AM", icon: "🌅" },
  { name: "Dhuhr", time: "12:30 PM", icon: "☀️" },
  { name: "Asr", time: "3:45 PM", icon: "🌤️" },
  { name: "Maghrib", time: "6:10 PM", icon: "🌇" },
  { name: "Isha", time: "7:30 PM", icon: "🌙" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Salat() {
  return (
    <div className="relative min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-sky-400 text-xs tracking-wider uppercase mb-4">
              <FaPrayingHands /> Daily Prayers
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
              Salat Tracker
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto">
              Keep track of your 5 daily prayers. Never miss a Salat during this blessed month.
            </p>
          </motion.div>

          {/* Prayer Times */}
          <motion.div variants={itemVariants} className="space-y-3">
            {prayers.map((prayer) => (
              <motion.div
                key={prayer.name}
                variants={itemVariants}
                whileHover={{ scale: 1.01, x: 4 }}
                className="glass rounded-2xl p-5 card-glow flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{prayer.icon}</div>
                  <div>
                    <h3 className="text-white font-semibold text-lg group-hover:text-sky-300 transition-colors">
                      {prayer.name}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <FaClock className="text-xs" /> {prayer.time}
                    </div>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-sky-500/30 group-hover:border-sky-400 transition-colors flex items-center justify-center">
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Info Card */}
          <motion.div
            variants={itemVariants}
            className="glass rounded-2xl p-6 card-glow text-center"
          >
            <FaMosque className="text-3xl text-sky-400 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              Login to save your prayer history, get notifications, and track your consistency throughout Ramadan.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
