import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaEdit,
  FaSave,
  FaMoon,
  FaInfoCircle,
} from "react-icons/fa";
import { Navigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/useAuth";

/* ── activity columns matching the reference image ── */
const activities = [
  { key: "roza", label: "R", fullName: "Roza", bg: "bg-red-400/80",   text: "text-red-300" },
  { key: "namaz", label: "N", fullName: "Namaz", bg: "bg-pink-400/80", text: "text-pink-300" },
  { key: "quran", label: "Q", fullName: "Qur'an", bg: "bg-emerald-400/80", text: "text-emerald-300" },
  { key: "tarawe", label: "T", fullName: "Tarawe", bg: "bg-orange-400/80", text: "text-orange-300" },
  { key: "tahajjud", label: "T", fullName: "Tahajjud", bg: "bg-blue-400/80", text: "text-blue-300" },
  { key: "istighfar", label: "I", fullName: "Istighfar × 1000", bg: "bg-yellow-300/80", text: "text-yellow-300" },
  { key: "darood", label: "D", fullName: "Darood e Sharif × 100", bg: "bg-fuchsia-300/80", text: "text-fuchsia-300" },
  { key: "hasbunallah", label: "H", fullName: "Hasbunallah Wanimal Wakeel × 100", bg: "bg-cyan-300/80", text: "text-cyan-300" },
  { key: "subhanallah", label: "S", fullName: "Subhanallahi wa bihamdihi × 100", bg: "bg-rose-400/80", text: "text-rose-300" },
  { key: "lailaha", label: "L", fullName: "La ilaha illa anta subhanaka inni kuntu minaz zalimin × 100", bg: "bg-lime-300/80", text: "text-lime-300" },
  { key: "lahawla", label: "L", fullName: "La hawla wala quwwata illa billah × 100", bg: "bg-violet-400/80", text: "text-violet-300" },
  { key: "tawheed", label: "L", fullName: "Laa ilaaha ill-Allaah wahdahu laa shareeka lah lahu'l-mulk wa lahu'l-hamd yuhyi wa yumeet wa huwa 'ala kulli shay'in qadeer × 100", bg: "bg-sky-300/80", text: "text-sky-300" },
];

const DAYS = Array.from({ length: 30 }, (_, i) => i + 1);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.012, delayChildren: 0.15 } },
};
const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

export default function DailyTracker() {
  const { user, loading: authLoading } = useAuth();
  const [trackerData, setTrackerData] = useState({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  /* ── load from Firestore ── */
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const ref = doc(db, "trackers", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) setTrackerData(snap.data());
      } catch (err) {
        console.error("Failed to load tracker:", err);
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, [user]);

  /* ── toggle a cell ── */
  const toggle = useCallback(
    (day, actKey) => {
      if (!editing) return;
      setTrackerData((prev) => {
        const key = `${day}-${actKey}`;
        const copy = { ...prev };
        if (copy[key]) delete copy[key];
        else copy[key] = true;
        return copy;
      });
    },
    [editing],
  );

  /* ── save to Firestore ── */
  const save = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    try {
      const ref = doc(db, "trackers", user.uid);
      await setDoc(ref, trackerData);
      setEditing(false);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }, [user, trackerData]);

  /* ── auth gate ── */
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;

  /* ── helpers ── */
  const completedCount = (day) =>
    activities.filter((a) => trackerData[`${day}-${a.key}`]).length;
  const dayProgress = (day) =>
    Math.round((completedCount(day) / activities.length) * 100);

  return (
    <div className="relative min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaMoon className="text-amber-400 text-xl animate-float" />
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
              Daily Tracker
            </h1>
            <FaMoon className="text-amber-400 text-xl animate-float" />
          </div>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Track your daily Ramadan ibadah — mark each amol you complete and
            watch your progress grow.
          </p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-4 gap-3 flex-wrap"
        >
          <button
            onClick={() => setShowLegend((p) => !p)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-sky-300 transition-colors"
          >
            <FaInfoCircle /> {showLegend ? "Hide" : "Show"} Legend
          </button>

          {editing ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 disabled:opacity-50 transition-all"
            >
              <FaSave /> {saving ? "Saving…" : "Save"}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-white text-sm font-semibold shadow-lg shadow-sky-500/25 transition-all"
            >
              <FaEdit /> Edit
            </motion.button>
          )}
        </motion.div>

        {/* Legend */}
        <AnimatePresence>
          {showLegend && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-5"
            >
              <div className="glass rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {activities.map((a) => (
                  <div key={a.key} className="flex items-start gap-3">
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-lg ${a.bg} flex items-center justify-center text-[#0a0e1a] font-bold text-sm`}
                    >
                      {a.label}
                    </span>
                    <span className="text-gray-300 text-sm leading-snug">
                      {a.fullName}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tracker Grid */}
        {!loaded ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl">
            <motion.table
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full min-w-[720px] border-collapse"
            >
              {/* Header row */}
              <thead>
                <tr>
                  <th className="glass sticky left-0 z-20 px-3 py-3 text-xs text-gray-400 uppercase tracking-wider text-left rounded-tl-2xl font-medium w-16">
                    Day
                  </th>
                  {activities.map((a) => (
                    <th key={a.key} className="px-1 py-3 text-center">
                      <div
                        className={`mx-auto w-9 h-9 rounded-lg ${a.bg} flex items-center justify-center text-[#0a0e1a] font-bold text-sm shadow-md`}
                        title={a.fullName}
                      >
                        {a.label}
                      </div>
                    </th>
                  ))}
                  <th className="px-3 py-3 text-xs text-gray-400 uppercase tracking-wider text-center rounded-tr-2xl font-medium w-16">
                    %
                  </th>
                </tr>
              </thead>

              {/* Body rows */}
              <tbody>
                {DAYS.map((day) => {
                  const pct = dayProgress(day);
                  return (
                    <motion.tr
                      key={day}
                      variants={rowVariants}
                      className="group border-b border-white/5 last:border-none"
                    >
                      {/* Day number */}
                      <td className="glass sticky left-0 z-10 px-3 py-2 text-sm font-semibold text-gray-300 text-center">
                        {String(day).padStart(2, "0")}
                      </td>

                      {/* Activity cells */}
                      {activities.map((a) => {
                        const checked = !!trackerData[`${day}-${a.key}`];
                        return (
                          <td key={a.key} className="px-1 py-2 text-center">
                            <motion.button
                              whileHover={editing ? { scale: 1.2 } : {}}
                              whileTap={editing ? { scale: 0.85 } : {}}
                              onClick={() => toggle(day, a.key)}
                              disabled={!editing}
                              className={`mx-auto w-9 h-9 rounded-lg transition-all duration-200 flex items-center justify-center
                                ${
                                  checked
                                    ? `${a.bg} shadow-md shadow-white/10`
                                    : editing
                                      ? "bg-white/5 border border-white/10 hover:border-sky-400/40 cursor-pointer"
                                      : "bg-white/[0.03] border border-white/5"
                                }
                              `}
                              title={`${a.fullName} — Day ${day}`}
                            >
                              {checked && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="text-[#0a0e1a] text-base"
                                >
                                  <FaCheckCircle />
                                </motion.span>
                              )}
                            </motion.button>
                          </td>
                        );
                      })}

                      {/* Progress */}
                      <td className="px-2 py-2 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`text-xs font-bold ${
                              pct === 100
                                ? "text-emerald-400"
                                : pct > 50
                                  ? "text-sky-400"
                                  : pct > 0
                                    ? "text-amber-400"
                                    : "text-gray-600"
                            }`}
                          >
                            {pct}%
                          </span>
                          <div className="w-8 h-1 rounded-full bg-white/10 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className={`h-full rounded-full ${
                                pct === 100
                                  ? "bg-emerald-400"
                                  : pct > 50
                                    ? "bg-sky-400"
                                    : "bg-amber-400"
                              }`}
                            />
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </motion.table>
          </div>
        )}

        {/* Overall stats */}
        {loaded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 glass rounded-2xl p-5 card-glow flex flex-wrap items-center justify-center gap-6 text-center"
          >
            <div>
              <div className="text-2xl font-bold gradient-text">
                {Object.values(trackerData).filter(Boolean).length}
              </div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mt-1">
                Total Completed
              </div>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div>
              <div className="text-2xl font-bold gradient-text">
                {DAYS.filter((d) => dayProgress(d) === 100).length}
              </div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mt-1">
                Perfect Days
              </div>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div>
              <div className="text-2xl font-bold gradient-text">
                {Math.round(
                  DAYS.reduce((sum, d) => sum + dayProgress(d), 0) / DAYS.length,
                )}
                %
              </div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mt-1">
                Overall Progress
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
