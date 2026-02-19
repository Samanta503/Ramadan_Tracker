import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaMoon,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import { useAuth } from "../contexts/useAuth";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function getFirebaseErrorMessage(code) {
  const messages = {
    "auth/email-already-in-use": "This email is already registered. Try logging in.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/network-request-failed": "Network error. Check your connection.",
  };
  return messages[code] || "Something went wrong. Please try again.";
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, signup, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  if (user) {
    navigate("/", { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        setSuccess("Logged in successfully! Redirecting...");
      } else {
        if (!name.trim()) {
          setError("Please enter your name.");
          setLoading(false);
          return;
        }
        await signup(email, password, name.trim());
        setSuccess("Account created successfully! Redirecting...");
      }
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await loginWithGoogle();
      setSuccess("Signed in with Google! Redirecting...");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  function switchTab(tab) {
    setIsLogin(tab === "Login");
    setError("");
    setSuccess("");
  }

  return (
    <div className="relative min-h-screen pt-24 pb-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-md w-full relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-500/25"
              whileHover={{ rotate: 10, scale: 1.05 }}
              transition={{ type: "spring" }}
            >
              <FaMoon className="text-white text-2xl" />
            </motion.div>
            <h1 className="text-2xl font-bold gradient-text mb-1">
              {isLogin ? "Welcome Back" : "Join Ramadan Tracker"}
            </h1>
            <p className="text-gray-400 text-sm">
              {isLogin
                ? "Sign in to continue your Ramadan journey"
                : "Create an account to track your ibadah"}
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            variants={itemVariants}
            className="glass rounded-2xl p-6 sm:p-8 card-glow"
          >
            {/* Toggle */}
            <div className="flex rounded-xl glass-light p-1 mb-6">
              {["Login", "Register"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => switchTab(tab)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    (tab === "Login") === isLogin
                      ? "bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Error / Success Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2"
                >
                  <FaExclamationTriangle className="text-red-400 text-sm mt-0.5 flex-shrink-0" />
                  <span className="text-red-300 text-sm">{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2"
                >
                  <FaCheckCircle className="text-emerald-400 text-sm mt-0.5 flex-shrink-0" />
                  <span className="text-emerald-300 text-sm">{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? "login" : "register"}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
                onSubmit={handleSubmit}
              >
                {/* Name (Register only) */}
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="text-gray-400 text-xs uppercase tracking-wider mb-1 block">
                      Full Name
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-sky-500/50 focus:bg-white/8 transition-all duration-300"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Email */}
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1 block">
                    Email
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-sky-500/50 focus:bg-white/8 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1 block">
                    Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-sky-500/50 focus:bg-white/8 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password (Login only) */}
                {isLogin && (
                  <div className="text-right">
                    <a
                      href="#"
                      className="text-sky-400 text-xs hover:text-sky-300 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                )}

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <FaSpinner className="animate-spin" />}
                  {isLogin ? "Sign In" : "Create Account"}
                </motion.button>
              </motion.form>
            </AnimatePresence>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-500 text-xs">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Google Sign in */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 rounded-xl glass-light text-gray-300 text-sm font-medium hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
