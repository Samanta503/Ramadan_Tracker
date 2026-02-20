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
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
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
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 via-teal-400 to-amber-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
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
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-white bg-gradient-to-r from-sky-500/20 to-teal-500/20 border border-sky-500/30"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`text-base transition-colors duration-300 ${
                        isActive ? "text-sky-400" : "text-gray-500 group-hover:text-sky-400"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-sky-400 to-teal-400 rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
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
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu((prev) => !prev);
                  }}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl glass-light hover:bg-white/10 transition-all duration-300"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="avatar"
                      className="w-8 h-8 rounded-full border-2 border-sky-400/40"
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
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
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
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-white text-sm font-semibold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all duration-300"
                >
                  <FaUserCircle className="text-base" />
                  Login
                </motion.button>
              </NavLink>
            )}

            {/* Mobile burger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden glass border-t border-sky-500/10"
          >
            <div className="px-4 py-4 space-y-1">
              {[...navItems, ...(user ? [authNavItem] : [])].map((item, i) => (
                <NavLink key={item.name} to={item.path} onClick={closeMenu}>
                  {({ isActive }) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "text-white bg-gradient-to-r from-sky-500/20 to-teal-500/20 border border-sky-500/20"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className={isActive ? "text-sky-400" : "text-gray-500"}>
                        {item.icon}
                      </span>
                      {item.name}
                    </motion.div>
                  )}
                </NavLink>
              ))}
              {user ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
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
