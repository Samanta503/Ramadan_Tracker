import { motion } from "framer-motion";
import { FaUtensils, FaClock, FaMoon, FaSun } from "react-icons/fa";

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

const suhoorSuggestions = [
  "Oatmeal with dates and honey",
  "Whole grain bread with eggs",
  "Yogurt with fruits and nuts",
  "Banana smoothie with milk",
];

const iftarSuggestions = [
  "Dates and water (Sunnah)",
  "Lentil soup",
  "Fresh fruit salad",
  "Grilled chicken with rice",
];

export default function SuhoorIftar() {
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-teal-400 text-xs tracking-wider uppercase mb-4">
              <FaUtensils /> Meal Planning
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
              Suhoor & Iftar
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto">
              Plan your meals wisely to maintain energy and health throughout the blessed month.
            </p>
          </motion.div>

          {/* Time Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Suhoor Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 card-glow relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full translate-x-6 -translate-y-6" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-500/20">
                    <FaMoon />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Suhoor</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <FaClock className="text-xs" /> Ends at 5:00 AM
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sky-400 text-xs uppercase tracking-wider font-medium">
                    Meal Suggestions
                  </h4>
                  {suhoorSuggestions.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-2 text-gray-300 text-sm"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Iftar Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 card-glow relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full translate-x-6 -translate-y-6" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xl shadow-lg shadow-amber-500/20">
                    <FaSun />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Iftar</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <FaClock className="text-xs" /> Starts at 6:10 PM
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-amber-400 text-xs uppercase tracking-wider font-medium">
                    Meal Suggestions
                  </h4>
                  {iftarSuggestions.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-2 text-gray-300 text-sm"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tip Card */}
          <motion.div
            variants={itemVariants}
            className="glass rounded-2xl p-6 card-glow text-center"
          >
            <p className="text-gray-300 text-sm italic">
              "The Prophet ﷺ said: Take Suhoor, for in Suhoor there is blessing."
            </p>
            <p className="text-sky-400/60 text-xs mt-2">— Sahih Bukhari & Muslim</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
