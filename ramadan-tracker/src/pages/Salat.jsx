import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPrayingHands,
  FaMosque,
  FaChevronDown,
  FaSpinner,
  FaCalendarAlt,
} from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const divisions = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.02, duration: 0.3 },
  }),
};

export default function Salat() {
  const [selectedDivision, setSelectedDivision] = useState("Dhaka");
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const colRef = collection(db, selectedDivision);
        const snapshot = await getDocs(colRef);
        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            dayNumber: parseInt(doc.id, 10),
            ...doc.data(),
          }))
          .sort((a, b) => a.dayNumber - b.dayNumber);
        setScheduleData(data);
      } catch (error) {
        console.error("Error fetching salat schedule:", error);
        setScheduleData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedDivision]);

  return (
    <div className="relative min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* ── Header ── */}
          <motion.div variants={itemVariants} className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-sky-400 text-xs tracking-wider uppercase mb-4">
              <FaPrayingHands /> Salat Schedule
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
              5 Waqt Salat Times
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto text-sm">
              View the complete 30‑day salat schedule for your division.
            </p>
          </motion.div>

          {/* ── Division Selector ── */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-2"
          >
            <div className="relative w-64">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="w-full glass rounded-xl px-5 py-3 flex items-center justify-between text-white cursor-pointer hover:border-sky-400/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              >
                <span className="font-medium">{selectedDivision}</span>
                <FaChevronDown
                  className={`text-sky-400 text-sm transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-50 mt-2 w-full glass rounded-xl overflow-hidden shadow-2xl shadow-black/40 border border-sky-500/15"
                  >
                    {divisions.map((div) => (
                      <li
                        key={div}
                        onClick={() => {
                          setSelectedDivision(div);
                          setDropdownOpen(false);
                        }}
                        className={`px-5 py-2.5 text-sm cursor-pointer transition-colors duration-200 ${
                          selectedDivision === div
                            ? "bg-sky-500/20 text-sky-300 font-semibold"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {div}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Salat Table ── */}
          <motion.div
            variants={itemVariants}
            className="glass rounded-2xl card-glow overflow-x-auto"
          >
            {/* Table Header */}
            <div className="grid grid-cols-6 text-center min-w-[640px] bg-gradient-to-r from-indigo-600/30 via-sky-600/25 to-teal-600/30">
              <div className="px-3 py-3.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-300 border-r border-white/5 flex items-center justify-center gap-1">
                <FaCalendarAlt className="text-indigo-400 text-[10px]" /> Date
              </div>
              <div className="px-3 py-3.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-sky-300 border-r border-white/5">
                🌅 Fajr
              </div>
              <div className="px-3 py-3.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 border-r border-white/5">
                ☀️ Dhuhr
              </div>
              <div className="px-3 py-3.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-orange-300 border-r border-white/5">
                🌤️ Asr
              </div>
              <div className="px-3 py-3.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-rose-300 border-r border-white/5">
                🌇 Maghrib
              </div>
              <div className="px-3 py-3.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-purple-300">
                🌙 Isha
              </div>
            </div>

            {/* Body */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <FaSpinner className="text-sky-400 text-2xl animate-spin" />
                <span className="text-gray-400 text-sm">
                  Loading schedule…
                </span>
              </div>
            ) : scheduleData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-2">
                <span className="text-gray-500 text-sm">
                  No data found for{" "}
                  <span className="text-sky-400 font-medium">
                    {selectedDivision}
                  </span>
                </span>
              </div>
            ) : (
              <div className="divide-y divide-white/5 min-w-[640px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedDivision}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={containerVariants}
                  >
                    {scheduleData.map((row, idx) => (
                      <motion.div
                        key={row.id}
                        custom={idx}
                        variants={rowVariants}
                        className={`grid grid-cols-6 text-center transition-colors duration-200 hover:bg-white/[0.03] ${
                          idx % 2 === 0 ? "bg-white/[0.01]" : ""
                        }`}
                      >
                        {/* Date */}
                        <div className="px-3 py-3 border-r border-white/5 flex items-center justify-center">
                          <span className="text-indigo-200 font-medium text-xs sm:text-sm tracking-wide">
                            {row.Date
                              ? new Date(row.Date + "T00:00:00").toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                })
                              : row.dayNumber}
                          </span>
                        </div>

                        {/* Fajr */}
                        <div className="px-3 py-3 border-r border-white/5 flex items-center justify-center">
                          <span className="text-sky-200 font-medium text-xs sm:text-sm tracking-wide">
                            {row.Fajr}
                          </span>
                        </div>

                        {/* Dhuhr */}
                        <div className="px-3 py-3 border-r border-white/5 flex items-center justify-center">
                          <span className="text-amber-200 font-medium text-xs sm:text-sm tracking-wide">
                            {row.Dhuhar}
                          </span>
                        </div>

                        {/* Asr */}
                        <div className="px-3 py-3 border-r border-white/5 flex items-center justify-center">
                          <span className="text-orange-200 font-medium text-xs sm:text-sm tracking-wide">
                            {row.Asr}
                          </span>
                        </div>

                        {/* Maghrib */}
                        <div className="px-3 py-3 border-r border-white/5 flex items-center justify-center">
                          <span className="text-rose-200 font-medium text-xs sm:text-sm tracking-wide">
                            {row.Magrib}
                          </span>
                        </div>

                        {/* Isha */}
                        <div className="px-3 py-3 flex items-center justify-center">
                          <span className="text-purple-200 font-medium text-xs sm:text-sm tracking-wide">
                            {row.Isha}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* ── Info Card ── */}
          <motion.div
            variants={itemVariants}
            className="glass rounded-2xl p-6 card-glow text-center"
          >
            <FaMosque className="text-3xl text-sky-400 mx-auto mb-3" />
            <p className="text-gray-300 text-sm italic">
              "Indeed, prayer has been decreed upon the believers a decree of
              specified times."
            </p>
            <p className="text-sky-400/60 text-xs mt-2">
              — Surah An-Nisa 4:103
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
