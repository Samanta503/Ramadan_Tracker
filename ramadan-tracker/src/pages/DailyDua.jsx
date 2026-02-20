import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookOpen, FaSpinner, FaMoon } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/useAuth";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35 },
  }),
};

export default function DailyDua() {
  const { user, loading: authLoading } = useAuth();
  const [duaData, setDuaData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDuas = async () => {
      setLoading(true);
      try {
        const colRef = collection(db, "Dua");
        const snapshot = await getDocs(colRef);
        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            dayNumber: parseInt(doc.id, 10),
            ...doc.data(),
          }))
          .sort((a, b) => a.dayNumber - b.dayNumber);
        setDuaData(data);
      } catch (error) {
        console.error("Error fetching daily duas:", error);
        setDuaData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDuas();
  }, [user]);

  // Wait for auth to resolve
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="text-sky-400 text-3xl animate-spin" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

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
          <motion.div variants={itemVariants} className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-amber-400 text-xs tracking-wider uppercase mb-4">
              <FaBookOpen /> Daily Dua
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
              Ramadan Daily Duas
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto text-sm">
              A special dua for each day of the blessed month — Ramadan 1 to 30.
            </p>
          </motion.div>

          {/* Loading */}
          {loading ? (
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center py-20 gap-3"
            >
              <FaSpinner className="text-sky-400 text-2xl animate-spin" />
              <span className="text-gray-400 text-sm">Loading duas…</span>
            </motion.div>
          ) : duaData.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center py-20 gap-2"
            >
              <span className="text-gray-500 text-sm">
                No daily duas found yet.
              </span>
            </motion.div>
          ) : (
            /* Dua Cards */
            <AnimatePresence mode="wait">
              <motion.div
                key="dua-list"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={containerVariants}
                className="space-y-4"
              >
                {duaData.map((dua, idx) => (
                  <motion.div
                    key={dua.id}
                    custom={idx}
                    variants={cardVariants}
                    className="glass rounded-2xl p-6 card-glow relative overflow-hidden"
                  >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-full translate-x-5 -translate-y-5" />

                    <div className="relative z-10">
                      {/* Day badge */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-300 text-sm font-bold">
                          {dua.dayNumber}
                        </span>
                        <div>
                          <h3 className="text-white font-semibold text-lg">
                            Ramadan — Day {dua.dayNumber}
                          </h3>
                          {dua.title && (
                            <p className="text-sky-400 text-xs">{dua.title}</p>
                          )}
                        </div>
                      </div>

                      {/* Arabic */}
                      {dua.Arabic && (
                        <p
                          className="text-2xl text-amber-300/90 mb-3 leading-relaxed text-right"
                          style={{ fontFamily: "'Amiri', serif" }}
                          dir="rtl"
                        >
                          {dua.Arabic}
                        </p>
                      )}

                      {/* Pronunciation */}
                      {dua.Pronunciation && (
                        <p className="text-teal-300/80 text-sm mb-2">
                          {dua.Pronunciation}
                        </p>
                      )}

                      {/* Translation */}
                      {dua.translation && (
                        <p className="text-gray-300 text-sm italic mb-2">
                          "{dua.translation}"
                        </p>
                      )}

                      {/* Source */}
                      {dua.source && (
                        <p className="text-gray-600 text-xs">
                          Source: {dua.source}
                        </p>
                      )}

                      {/* If document is empty, show placeholder */}
                      {!dua.Arabic &&
                        !dua.Pronunciation &&
                        !dua.translation && (
                          <p className="text-gray-500 text-sm italic flex items-center gap-2">
                            <FaMoon className="text-amber-400/50 text-xs" />
                            Dua coming soon…
                          </p>
                        )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
}
