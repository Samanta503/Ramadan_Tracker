import { motion } from "framer-motion";
import { FaBookOpen, FaQuran, FaHandsHelping, FaStar, FaHeart } from "react-icons/fa";

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

const duas = [
  {
    title: "Dua for Breaking Fast",
    arabic: "اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ",
    translation: "O Allah, I fasted for You and I break my fast with Your provision.",
    source: "Abu Dawud",
  },
  {
    title: "Dua for Laylatul Qadr",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    translation: "O Allah, You are the Most Forgiving, and You love forgiveness, so forgive me.",
    source: "Tirmidhi",
  },
  {
    title: "Dua Before Eating",
    arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
    translation: "In the name of Allah and with the blessings of Allah.",
    source: "Abu Dawud",
  },
];

const amolList = [
  { icon: <FaQuran />, title: "Recite Quran", desc: "Read at least 1 Juz daily to complete in Ramadan" },
  { icon: <FaHandsHelping />, title: "Give Sadaqah", desc: "Give charity every day, even a small amount" },
  { icon: <FaStar />, title: "Pray Taraweeh", desc: "Attend Taraweeh prayers at the mosque" },
  { icon: <FaHeart />, title: "Dhikr & Istighfar", desc: "Remember Allah and seek forgiveness frequently" },
];

export default function DuaAmol() {
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-amber-400 text-xs tracking-wider uppercase mb-4">
              <FaBookOpen /> Spiritual Growth
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
              Dua & Amol
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto">
              Essential duas and recommended deeds to maximize the blessings of Ramadan.
            </p>
          </motion.div>

          {/* Duas Section */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaBookOpen className="text-amber-400 text-sm" />
              Important Duas
            </h2>
            <div className="space-y-4">
              {duas.map((dua, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  className="glass rounded-2xl p-6 card-glow relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-full translate-x-5 -translate-y-5" />
                  <h3 className="text-sky-300 font-semibold mb-3">{dua.title}</h3>
                  <p
                    className="text-2xl text-amber-300/90 mb-3 leading-relaxed text-right"
                    style={{ fontFamily: "'Amiri', serif" }}
                    dir="rtl"
                  >
                    {dua.arabic}
                  </p>
                  <p className="text-gray-300 text-sm italic mb-2">
                    "{dua.translation}"
                  </p>
                  <p className="text-gray-600 text-xs">Source: {dua.source}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Amol Section */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaStar className="text-teal-400 text-sm" />
              Recommended Amol
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {amolList.map((amol, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="glass rounded-2xl p-5 card-glow cursor-pointer group"
                >
                  <div className="text-teal-400 text-2xl mb-3 group-hover:scale-110 transition-transform">
                    {amol.icon}
                  </div>
                  <h3 className="text-white font-semibold mb-1 group-hover:text-sky-300 transition-colors">
                    {amol.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{amol.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
