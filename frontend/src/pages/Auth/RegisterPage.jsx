import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import authService from "../../services/authService";
import { BrainCircuit, Mail, Lock, ArrowRight, User } from "lucide-react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authService.register(username, email, password);
      toast.success('Registration  successfull! Please login.')
      navigate("/login");
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
      toast.error(err.message || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f6f3ea]">

      <div className="absolute inset-0 bg-[radial-gradient(#111_1px,transparent_1px)] bg-[size:18px_18px] opacity-15" />

      <div className="relative w-full max-w-md px-6">
        <div className="bg-[#f7f2e8] border-2 border-black rounded-sm shadow-[6px_6px_0px_#000] p-10">
          {/*Header*/}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-sm bg-[#ffd400] border-2 border-black shadow-[4px_4px_0px_#000] mb-6">
              <BrainCircuit className="w-7 h-7 text-black" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-medium text-black tracking-tight mb-2">
              Create an account
            </h1>
            <p className="text-sm text-neutral-700">
              Start your AI-powered learning experience
            </p>
          </div>

          {/*Form*/}
          <div className="space-y-5">
            {/*Username field*/}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-black uppercase tracking-wide">
                Username
              </label>
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200
               ${focusedField === "username" ? "text-black" : "text-neutral-500"}`}>
                  <User className="h-5 w-5" strokeWidth={2} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-12 pl-12 pr-4 border-2 border-black rounded-sm bg-white text-black placeholder-neutral-500 text-sm font-medium transition-all duration-150 focus:outline-none focus:border-black"
                  placeholder="yourusername"
                />
              </div>
            </div>

            {/*Email field*/}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-black uppercase tracking-wide">
                Email
              </label>
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200
               ${focusedField === "email" ? "text-black" : "text-neutral-500"}`}>
                  <Mail className="h-5 w-5" strokeWidth={2} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-12 pl-12 pr-4 border-2 border-black rounded-sm bg-white text-black placeholder-neutral-500 text-sm font-medium transition-all duration-150 focus:outline-none focus:border-black"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            {/* Password field*/}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-black uppercase tracking-wide">
                Password
              </label>
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200
               ${focusedField === "password" ? "text-black" : "text-neutral-500"}`}>
                  <Lock className="h-5 w-5" strokeWidth={2} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-12 pl-12 pr-4 border-2 border-black rounded-sm bg-white text-black placeholder-neutral-500 text-sm font-medium transition-all duration-150 focus:outline-none focus:border-black"
                  placeholder="Password"
                />
              </div>
            </div>
            {/*Error message*/}
            {error && (
              <div className="rounded-sm bg-[#ff5c5c] border-2 border-black p-3">
                <p className="text-xs text-black font-medium text-center">{error}</p>
              </div>
            )}

            {/*Submit button*/}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="group relative w-full h-12 bg-black text-[#f6f3ea] text-sm font-semibold rounded-sm border-2 border-black shadow-[4px_4px_0px_#000] transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={2.5} />
                  </>
                )}
              </span>
            </button>
          </div>

          {/*Footer*/}
          <div className="mt-8 pt-6 border-t-2 border-black">
            <p className="text-center text-sm text-neutral-700">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-black underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/*Subtitle footer text*/}
        <p className="text-center text-xs text-neutral-700 mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default RegisterPage