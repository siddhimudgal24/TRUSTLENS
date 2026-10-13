import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, User, Mail, Phone, Lock, ArrowRight, KeyRound, RefreshCw, CheckCircle2, AlertCircle, X } from "lucide-react";
import { setStoredUser, type AuthUser } from "../utils/auth";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    roleId: "4", // Default to Field Officer
    password: "",
  });

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (showOtpModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, timer]);

  const handleStartRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setMessage({ type: "error", text: "Please complete all required fields." });
      return;
    }
    sendOtp();
  };

  const sendOtp = async () => {
    setIsOtpSending(true);
    setMessage(null);

    const cleanEmail = formData.email.trim();

    try {
      const res = await fetch(`/api/send-otp?email=${encodeURIComponent(cleanEmail)}&purpose=REGISTRATION`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setShowOtpModal(true);
        setTimer(60);
        setCanResend(false);
        setOtpCode("");
        setMessage({ type: "success", text: `Verification code sent to ${cleanEmail}. Please check your email inbox.` });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to send OTP." });
      }
    } catch {
      // Demo simulation mode
      setShowOtpModal(true);
      setTimer(60);
      setCanResend(false);
      setMessage({ type: "success", text: `[Demo] Simulated OTP code (123456) sent to ${cleanEmail}` });
    } finally {
      setIsOtpSending(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    const cleanOtp = otpCode.trim();
    const cleanEmail = formData.email.trim();

    if (cleanOtp.length !== 6) {
      setMessage({ type: "error", text: "Please enter a valid 6-digit OTP code." });
      return;
    }

    setIsVerifying(true);
    setMessage(null);

    try {
      // 1. Verify OTP
      const otpRes = await fetch(`/api/verify-otp?email=${encodeURIComponent(cleanEmail)}&otp=${encodeURIComponent(cleanOtp)}&purpose=REGISTRATION`, {
        method: "POST",
      });
      const otpData = await otpRes.json();

      if (otpData.success) {
        setOtpVerified(true);
        // 2. Submit Registration to Java backend
        const params = new URLSearchParams();
        params.append("fullName", formData.fullName.trim());
        params.append("username", formData.username.trim());
        params.append("email", cleanEmail);
        params.append("phone", formData.phone.trim());
        params.append("roleId", formData.roleId);
        params.append("password", formData.password);

        const regRes = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params,
        });
        const regData = await regRes.json();

        if (regData.success) {
          const userSession: AuthUser = {
            userId: regData.userId,
            username: regData.username || formData.username.trim(),
            fullName: regData.fullName || formData.fullName.trim(),
            email: regData.email || cleanEmail,
            phone: regData.phone || formData.phone.trim(),
            role: regData.role || (formData.roleId === "2" ? "Disaster Manager" : formData.roleId === "3" ? "Shelter Manager" : "Field Officer"),
            roleId: regData.roleId || formData.roleId,
          };
          setStoredUser(userSession);
          setMessage({ type: "success", text: "Registration successful! Loading Command Center..." });
          setTimeout(() => navigate("/"), 1200);
        } else {
          setOtpVerified(false);
          setMessage({ type: "error", text: regData.message || "Registration failed." });
        }
      } else {
        setMessage({ type: "error", text: otpData.message || "Invalid or expired OTP code." });
      }
    } catch {
      setMessage({ type: "error", text: "Server connection failed. Ensure backend server is running." });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-800 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white mb-4 shadow-xl shadow-blue-500/25">
            <ShieldCheck size={36} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">TrustLens</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
            Emergency Operations Platform · Role-Based Onboarding
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/60 backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your details below to receive an email OTP for identity verification
            </p>
          </div>

          {message && !showOtpModal && (
            <div
              className={`mb-6 p-4 rounded-xl border text-xs flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle size={18} className="shrink-0 text-rose-600" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleStartRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="johndoe"
                  className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address (For OTP Verification)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Assign Operational Role
                </label>
                <select
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                  className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none transition shadow-sm"
                >
                  <option value="4">Field Officer</option>
                  <option value="3">Shelter Manager</option>
                  <option value="2">Disaster Manager</option>
                  <option value="1">System Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition shadow-sm"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Must be at least 6 characters long</p>
            </div>

            <button
              type="submit"
              disabled={isOtpSending}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 disabled:opacity-50 mt-6"
            >
              {isOtpSending ? (
                <span>Sending Verification OTP...</span>
              ) : (
                <>
                  <span>Send OTP & Continue</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* OTP Verification Window Modal (Light Theme) */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 mb-3 shadow-sm">
                <KeyRound size={26} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Email OTP Verification</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter the 6-digit verification code sent to <br />
                <span className="text-blue-600 font-semibold">{formData.email}</span>
              </p>
            </div>

            {message && (
              <div
                className={`mb-5 p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                  message.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle size={16} className="shrink-0 text-rose-600" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-center text-slate-600 mb-2">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="••••••"
                  className="w-full text-center tracking-[12px] font-mono text-2xl font-bold py-3.5 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border-2 border-slate-200 focus:border-blue-600 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition shadow-inner"
                />
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500 px-1 pt-1">
                <span>
                  Expires in: <strong className="text-slate-800">{timer}s</strong>
                </span>
                <button
                  type="button"
                  disabled={!canResend}
                  onClick={sendOtp}
                  className="text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-40 disabled:hover:text-blue-600 flex items-center gap-1.5 transition"
                >
                  <RefreshCw size={13} />
                  <span>Resend Code</span>
                </button>
              </div>

              <button
                onClick={handleVerifyAndRegister}
                disabled={isVerifying || otpVerified}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 mt-2"
              >
                {isVerifying ? (
                  <span>Verifying Code...</span>
                ) : otpVerified ? (
                  <span>Verified! Redirecting...</span>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Verify & Complete Registration</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
