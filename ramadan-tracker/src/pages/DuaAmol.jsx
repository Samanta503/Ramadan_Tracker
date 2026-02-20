import { motion } from "framer-motion";
import { FaBookOpen, FaQuran, FaHandsHelping, FaStar, FaHeart, FaArrowRight, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

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
    title: "Dua of Forgiveness",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    transliteration:
      "Allahumma innaka 'afuwwun tuhibbu al-'afwa fa'fu 'anni",
    translation:
      "O Allah, You are the Most Forgiving, and You love forgiveness, so forgive me.",
    source: "Tirmidhi",
  },
  {
    title: "Niyot of Roja",
    arabic:
      "نَوَيْتُ أَنْ أَصُومَ غَدًا مِنْ شَهْرِ رَمَضَانَ الْمُبَارَكِ فَرْضًا لَكَ يَا اللَّهُ فَتَقَبَّلْ مِنِّي إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ",
    transliteration:
      "Nawaitu an asuma ghadan, min shahri ramadanal mubarak; fardal laka ya Allahu, fatakabbal minni innika antas samiul alim.",
    translation:
      "I intend to fast tomorrow for the month of Ramadan, as an obligation for You, O Allah, so accept it from me. Indeed, You are the All-Hearing, All-Knowing.",
    source: "Hadith",
  },
  {
    title: "Dua for Iftar",
    arabic:
      "اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ",
    transliteration:
      "Allahumma inni laka sumtu wa bika aamantu [wa alayka tawakkaltu] wa 'ala rizqika aftartu.",
    translation:
      "O Allah, I fasted for You, believed in You, placed my trust in You, and I break my fast with Your provision.",
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
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDailyDua = () => {
    if (user) {
      navigate("/daily-dua");
    } else {
      navigate("/auth");
    }
  };

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

          {/* Daily Dua Button */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <motion.button
              onClick={handleDailyDua}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="glass rounded-2xl px-8 py-5 card-glow cursor-pointer flex items-center gap-4 group w-full sm:w-auto sm:min-w-[320px] justify-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-teal-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xl shadow-lg shadow-amber-500/20">
                <FaBookOpen />
              </div>
              <div className="text-left relative z-10">
                <h3 className="text-white font-semibold text-lg group-hover:text-amber-300 transition-colors">
                  Daily Dua
                </h3>
                <p className="text-gray-400 text-xs flex items-center gap-1">
                  {user ? (
                    <>View Ramadan 1–30 Duas <FaArrowRight className="text-[10px] text-amber-400" /></>
                  ) : (
                    <><FaLock className="text-[10px] text-amber-400" /> Login to access daily duas</>
                  )}
                </p>
              </div>
            </motion.button>
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
                  <p className="text-teal-300/80 text-sm mb-2">
                    {dua.transliteration}
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
