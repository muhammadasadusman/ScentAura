import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [isLoginTab, setIsLoginTab] = useState(true);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    const result = await loginWithGoogle();
    setLoading(false);

    if (result.success) {
      toast.success(`Welcome to ScentAura, ${result.user.name}! ✨`);
      if (result.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      toast.error(result.message || "Google authentication failed.");
    }
  };

  // Handle Email Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      // Authenticate with Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // Authenticate with Backend to get JWT & Role
      const { data } = await API.post("/users/login", { email, password });
      login(data.user, data.token);

      toast.success(`Welcome back, ${data.user.name}! ✨`);
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || error.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regEmail || !regPassword) {
      toast.error("Please fill in all registration fields.");
      return;
    }

    setLoading(true);
    try {
      // Create user in Firebase
      await createUserWithEmailAndPassword(auth, regEmail, regPassword);

      // Create user in Backend MongoDB
      const name = regName.trim() || regEmail.split("@")[0];
      await API.post("/users/register", {
        name,
        email: regEmail,
        password: regPassword,
      });

      // Login immediately with backend
      const loginRes = await API.post("/users/login", {
        email: regEmail,
        password: regPassword,
      });

      login(loginRes.data.user, loginRes.data.token);
      toast.success("Account created successfully! Welcome to ScentAura ✨");
      navigate("/");
    } catch (error) {
      console.error("Register Error:", error);
      toast.error(error.response?.data?.message || error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    const targetEmail = email || prompt("Please enter your registered email address:");
    if (!targetEmail) return;

    try {
      await sendPasswordResetEmail(auth, targetEmail);
      toast.success("Password reset instructions sent to your email! 📩");
    } catch (error) {
      toast.error(error.message || "Failed to send reset email.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center py-16 px-4 sm:px-6">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black text-xl mb-3 shadow-md">
            S
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {isLoginTab ? "Welcome to ScentAura" : "Create Your Account"}
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            Access your order history, saved fragrances, and concierge.
          </p>
        </div>

        {/* Google One-Click Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-neutral-100 text-neutral-900 font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          <FcGoogle size={20} />
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-neutral-800" />
          <span className="px-3 text-xs text-neutral-500 font-semibold uppercase">Or with email</span>
          <div className="flex-1 border-t border-neutral-800" />
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-neutral-950 p-1 rounded-xl mb-6 border border-neutral-800">
          <button
            type="button"
            onClick={() => setIsLoginTab(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              isLoginTab ? "bg-neutral-800 text-amber-400 shadow" : "text-neutral-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLoginTab(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              !isLoginTab ? "bg-neutral-800 text-amber-400 shadow" : "text-neutral-400 hover:text-white"
            }`}
          >
            Register
          </button>
        </div>

        {/* Forms */}
        {isLoginTab ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-neutral-300 uppercase">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Forgot?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-3 pr-11 text-sm text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {showLoginPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-3.5 rounded-xl text-sm transition shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 mt-2"
            >
              {loading ? "Authenticating..." : "Sign In to ScentAura"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Asad Usman"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showRegPassword ? "text" : "password"}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-3 pr-11 text-sm text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {showRegPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-3.5 rounded-xl text-sm transition shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 mt-2"
            >
              {loading ? "Creating Account..." : "Create ScentAura Account"}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
          <p className="text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
            <FaShieldAlt className="text-amber-500" />
            <span>256-Bit SSL Encrypted Connection</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;