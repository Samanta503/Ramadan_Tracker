import { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMosque,
  FaPrayingHands,
  FaUtensils,
  FaBookOpen,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaMoon,
  FaSignOutAlt,
  FaClipboardList,
} from "react-icons/fa";
import { useAuth } from "../contexts/useAuth";

const navItems = [
  { name: "Dashboard", path: "/", icon: <FaMosque /> },
  { name: "Salat", path: "/salat", icon: <FaPrayingHands /> },
  { name: "Suhoor & Iftar", path: "/suhoor-iftar", icon: <FaUtensils /> },
  { name: "Dua & Amol", path: "/dua-amol", icon: <FaBookOpen /> },
];

const authNavItem = { name: "Daily Tracker", path: "/daily-tracker", icon: <FaClipboardList /> };

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setShowUserMenu(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }, [logout, navigate]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    if (!showUserMenu) return;
    const handleClick = () => setShowUserMenu(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showUserMenu]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled
          ? "glass shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 via-teal-400 to-amber-400 flex items-center justify-center shadow-lg shadow-sky-500/20 transition-shadow duration-500 group-hover:shadow-sky-500/40">
                <FaMoon className="text-white text-lg" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-twinkle" />
            </motion.div>
            <div>
              <span className="text-lg font-bold gradient-text tracking-wide">
                Ramadan Tracker
              </span>
              <div className="text-[10px] text-sky-400/60 tracking-widest uppercase">
                Daily Routine & Amol
              </div>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {[...navItems, ...(user ? [authNavItem] : [])].map((item, i) => (
              <NavLink
                key={item.name}
                to={item.path}
                className="relative group"
              >
                {({ isActive }) => (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -2 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive
                        ? "text-white bg-gradient-to-r from-sky-500/20 to-teal-500/20 border border-sky-500/30 shadow-sm shadow-sky-500/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`text-base transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive ? "text-sky-400 scale-110" : "text-gray-500 group-hover:text-sky-400 group-hover:scale-110"
                      }`}
                      style={{ display: "inline-flex", transformOrigin: "center" }}
                    >
                      {item.icon}
                    </span>
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-sky-400 to-teal-400 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.8 }}
                      />
                    )}
                  </motion.div>
                )}
              </NavLink>
            ))}
          </div>

          {/* Auth Button + Mobile Toggle */}
          <div className="flex items-center gap-3">
            {user ? (
              /* Logged-in user avatar & dropdown */
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu((prev) => !prev);
                  }}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl glass-light hover:bg-white/10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="avatar"
                      className="w-8 h-8 rounded-full border-2 border-sky-400/40 transition-all duration-500 hover:border-sky-400/70"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                      {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-gray-300 font-medium max-w-[100px] truncate">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                </motion.button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -12, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 mt-2 w-56 glass rounded-xl border border-sky-500/10 shadow-xl shadow-black/30 overflow-hidden"
                    >
                      <div className="p-3 border-b border-white/5">
                        <p className="text-white text-sm font-medium truncate">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-gray-500 text-xs truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all duration-300"
                      >
                        <FaSignOutAlt className="text-xs" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Login button */
              <NavLink to="/auth">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(14, 165, 233, 0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-white text-sm font-semibold shadow-lg shadow-sky-500/25 transition-all duration-500"
                >
                  <FaUserCircle className="text-base" />
                  Login
                </motion.button>
              </NavLink>
            )}

            {/* Mobile burger */}
            <motion.button
              whileTap={{ scale: 0.9, rotate: 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="block"
                  >
                    <FaTimes size={22} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="block"
                  >
                    <FaBars size={22} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden glass border-t border-sky-500/10"
          >
            <div className="px-4 py-4 space-y-1">
              {[...navItems, ...(user ? [authNavItem] : [])].map((item, i) => (
                <NavLink key={item.name} to={item.path} onClick={closeMenu}>
                  {({ isActive }) => (
                    <motion.div
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive
                          ? "text-white bg-gradient-to-r from-sky-500/20 to-teal-500/20 border border-sky-500/20"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className={`transition-all duration-400 ${isActive ? "text-sky-400" : "text-gray-500"}`}>
                        {item.icon}
                      </span>
                      {item.name}
                    </motion.div>
                  )}
                </NavLink>
              ))}
              {user ? (
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-3 px-4 py-3 mt-1">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full border-2 border-sky-400/40" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                        {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{user.displayName || "User"}</p>
                      <p className="text-gray-500 text-xs truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { handleLogout(); closeMenu(); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 text-sm font-medium w-full transition-colors"
                  >
                    <FaSignOutAlt />
                    Sign Out
                  </button>
                </motion.div>
              ) : (
                <NavLink to="/auth" onClick={closeMenu}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                    className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-white text-sm font-semibold"
                  >
                    <FaUserCircle />
                    Login / Register
                  </motion.div>
                </NavLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
