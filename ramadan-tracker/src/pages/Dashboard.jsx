import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaPrayingHands,
  FaUtensils,
  FaBookOpen,
  FaMoon,
  FaSun,
  FaQuran,
  FaHandsHelping,
  FaStar,
  FaArrowRight,
  FaClock,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import MosqueSilhouette from "../components/MosqueSilhouette";

// Ramadan 2026 starts approximately March 18, 2026
const RAMADAN_START = new Date("2026-03-18T00:00:00");
const RAMADAN_END = new Date("2026-04-16T23:59:59");

function getRamadanDay() {
  const now = new Date();
  if (now < RAMADAN_START) return 0;
  if (now > RAMADAN_END) return 30;
  const diff = Math.floor((now - RAMADAN_START) / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(diff, 30);
}

function getCountdown() {
  const now = new Date();
  if (now >= RAMADAN_START) return null;
  const diff = RAMADAN_START - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const quickLinks = [
  {
    title: "Salat Tracker",
    description: "Track your 5 daily prayers and never miss a Salat",
    icon: <FaPrayingHands />,
    path: "/salat",
    gradient: "from-sky-500 to-blue-600",
    glow: "shadow-sky-500/20",
  },
  {
    title: "Suhoor & Iftar",
    description: "Get Suhoor & Iftar timings with meal suggestions",
    icon: <FaUtensils />,
    path: "/suhoor-iftar",
    gradient: "from-teal-500 to-emerald-600",
    glow: "shadow-teal-500/20",
  },
  {
    title: "Dua & Amol",
    description: "Daily duas, azkar, and good deeds to perform",
    icon: <FaBookOpen />,
    path: "/dua-amol",
    gradient: "from-amber-500 to-orange-600",
    glow: "shadow-amber-500/20",
  },
];

const dailyAmol = [
  { icon: <FaQuran />, text: "Read Quran — Juz 1", done: false },
  { icon: <FaPrayingHands />, text: "Pray Tahajjud", done: false },
  { icon: <FaHandsHelping />, text: "Give Sadaqah", done: false },
  { icon: <FaStar />, text: "Make Dua after Iftar", done: false },
];

export default function Dashboard() {
  const [countdown, setCountdown] = useState(getCountdown());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [iftarCountdown, setIftarCountdown] = useState(null);
  const [todayTimes, setTodayTimes] = useState(null); // { sehri24, iftar24, fastingDuration }
  const ramadanDay = getRamadanDay();

  // Fetch today's Sehri & Iftar from Dhaka collection
  useEffect(() => {
    const fetchTodayTimes = async () => {
      try {
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

        const colRef = collection(db, "Dhaka");
        const snapshot = await getDocs(colRef);
        const todayDoc = snapshot.docs.find((doc) => doc.data().Date === todayStr);

        if (todayDoc) {
          const data = todayDoc.data();

          // Parse raw times (e.g. "05:12" for Sehri, "05:58" for Iftar)
          const [sH, sM] = data.SehriEnd.split(":").map(Number);
          const [iH, iM] = data.Iftar.split(":").map(Number);

          // Convert to 24-hr: Sehri is AM, Iftar is PM
          const sehri24 = { h: sH, m: sM };
          const iftar24 = { h: iH < 12 ? iH + 12 : iH, m: iM };

          // Fasting duration = Iftar(24hr) - Sehri(24hr)
          const totalSehriMin = sehri24.h * 60 + sehri24.m;
          const totalIftarMin = iftar24.h * 60 + iftar24.m;
          const durationMin = totalIftarMin - totalSehriMin;
          const fastingDuration = {
            hours: Math.floor(durationMin / 60),
            minutes: durationMin % 60,
          };

          setTodayTimes({ sehri24, iftar24, fastingDuration });
        }
      } catch (err) {
        console.error("Error fetching today's schedule:", err);
      }
    };

    fetchTodayTimes();
  }, []);

  // Live countdown to Iftar
  useEffect(() => {
    if (!todayTimes) return;

    const tick = () => {
      const now = new Date();
      const iftarTime = new Date();
      iftarTime.setHours(todayTimes.iftar24.h, todayTimes.iftar24.m, 0, 0);

      const diff = iftarTime - now;
      if (diff <= 0) {
        setIftarCountdown(null);
        return;
      }

      setIftarCountdown({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [todayTimes]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown());
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 5) return "Assalamu Alaikum";
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 20) return "Good Evening";
    return "Assalamu Alaikum";
  };

  return (
    <div className="relative min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.p
              className="text-sky-400/80 text-sm tracking-widest uppercase mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {greeting()}
            </motion.p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="gradient-text">Ramadan Mubarak</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Track your daily ibadah, maintain your routine, and make this Ramadan the most blessed one.
            </p>
          </motion.div>

          {/* Countdown / Day Counter */}
          <motion.div variants={itemVariants}>
            <div className="glass rounded-2xl p-6 sm:p-8 card-glow overflow-hidden relative">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-500/5 to-transparent rounded-full translate-x-20 -translate-y-20" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-500/5 to-transparent rounded-full -translate-x-10 translate-y-10" />

              <div className="relative z-10">
                {/* Iftar Countdown */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <FaSun className="text-amber-400 text-xl" />
                    <h2 className="text-xl font-semibold text-white">
                      Time Left for Iftar
                    </h2>
                    <span className="text-xs text-gray-500 ml-1">(Dhaka)</span>
                  </div>

                  {iftarCountdown ? (
                    <>
                      <div className="flex justify-center gap-4 sm:gap-6 mb-6">
                        {[
                          { label: "Hours", value: iftarCountdown.hours },
                          { label: "Minutes", value: iftarCountdown.minutes },
                          { label: "Seconds", value: iftarCountdown.seconds },
                        ].map((unit) => (
                          <motion.div
                            key={unit.label}
                            className="glass-light rounded-xl p-4 min-w-[80px]"
                            whileHover={{ scale: 1.05 }}
                          >
                            <motion.div
                              key={unit.value}
                              initial={{ scale: 1.2, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="text-3xl sm:text-4xl font-bold"
                              style={{
                                background: "linear-gradient(135deg, #f59e0b, #f97316, #ef4444)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                            >
                              {String(unit.value).padStart(2, "0")}
                            </motion.div>
                            <div className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider">
                              {unit.label}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-gray-400 text-sm">
                        May Allah accept your fast
                      </p>
                    </>
                  ) : todayTimes ? (
                    <p className="text-amber-400/80 text-sm py-4">
                      Iftar time has passed for today
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm py-4">
                      No schedule found for today
                    </p>
                  )}
                </div>
              </div>

              {/* Mosque Silhouette */}
              <div className="mt-4 opacity-40">
                <MosqueSilhouette />
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaStar className="text-amber-400 text-sm" />
              Quick Access
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickLinks.map((link) => (
                <Link key={link.title} to={link.path}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`glass rounded-2xl p-6 card-glow cursor-pointer group relative overflow-hidden h-full`}
                  >
                    {/* Background glow */}
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${link.gradient} opacity-5 rounded-full translate-x-10 -translate-y-10 group-hover:opacity-10 transition-opacity duration-500`}
                    />

                    <div className="relative z-10">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center text-white text-xl mb-4 shadow-lg ${link.glow}`}
                      >
                        {link.icon}
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-sky-300 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {link.description}
                      </p>
                      <div className="flex items-center gap-1 text-sky-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Explore <FaArrowRight className="text-xs" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Daily Amol Checklist & Current Time */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Daily Amol */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 glass rounded-2xl p-6 card-glow"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaBookOpen className="text-teal-400 text-sm" />
                Today's Amol
              </h2>
              <div className="space-y-3">
                {dailyAmol.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-sky-500/40 group-hover:border-sky-400 transition-colors flex items-center justify-center flex-shrink-0">
                      {item.done && (
                        <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                      )}
                    </div>
                    <span className="text-teal-400 text-lg">{item.icon}</span>
                    <span className="text-gray-300 text-sm">{item.text}</span>
                  </motion.div>
                ))}
              </div>
              <p className="text-gray-600 text-xs mt-4 text-center">
                Login to save and track your daily progress
              </p>
            </motion.div>

            {/* Date & Time Card */}
            <motion.div
              variants={itemVariants}
              className="glass rounded-2xl p-6 card-glow flex flex-col items-center justify-center text-center"
            >
              <FaClock className="text-3xl text-sky-400 mb-3" />
              <div className="text-3xl font-bold gradient-text mb-1">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-gray-500 text-sm mb-4">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent my-3" />
              <div className="text-gray-400 text-xs">
                {countdown
                  ? `${countdown.days} days until Ramadan`
                  : `Day ${ramadanDay} of Ramadan`}
              </div>
            </motion.div>
          </div>

          {/* Inspirational Quote */}
          <motion.div
            variants={itemVariants}
            className="glass rounded-2xl p-8 card-glow text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-teal-500/5 to-amber-500/5 animate-gradient" />
            <div className="relative z-10">
              <FaMoon className="text-amber-400 text-2xl mx-auto mb-4 animate-float" />
              <blockquote className="text-gray-300 text-lg italic max-w-2xl mx-auto leading-relaxed">
                "Whoever fasts during Ramadan out of sincere faith and hoping to attain
                Allah's rewards, then all his past sins will be forgiven."
              </blockquote>
              <p className="text-sky-400/60 text-sm mt-3">
                — Sahih Bukhari
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
