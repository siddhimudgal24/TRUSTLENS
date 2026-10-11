import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, User, Mail, Phone, Lock, ArrowRight, KeyRound, RefreshCw, CheckCircle2, AlertCircle, X } from "lucide-react";

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

    try {
      const res = await fetch(`/api/send-otp?email=${encodeURIComponent(formData.email)}&purpose=REGISTRATION`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setShowOtpModal(true);
        setTimer(60);
        setCanResend(false);
        if (data.demoOtp) {
          setOtpCode(data.demoOtp);
          setMessage({ type: "success", text: `OTP sent! Verification Code: ${data.demoOtp}` });
        } else {
          setMessage({ type: "success", text: `OTP sent to ${formData.email}` });
        }
      } else {
        setMessage({ type: "error", text: data.message || "Failed to send OTP." });
      }
    } catch {
      // Demo simulation mode
      setShowOtpModal(true);
      setTimer(60);
      setCanResend(false);
      setMessage({ type: "success", text: `[Demo] Simulated OTP code (123456) sent to ${formData.email}` });
    } finally {
      setIsOtpSending(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    if (otpCode.length !== 6) {
      setMessage({ type: "error", text: "Please enter a valid 6-digit OTP code." });
      return;
    }

    setIsVerifying(true);
    setMessage(null);

    try {
      // 1. Verify OTP
      const otpRes = await fetch(`/api/verify-otp?email=${encodeURIComponent(formData.email)}&otp=${encodeURIComponent(otpCode)}&purpose=REGISTRATION`, {
        method: "POST",
      });
      const otpData = await otpRes.json();

      if (otpData.success) {
        setOtpVerified(true);
        // 2. Submit Registration to Java backend
        const params = new URLSearchParams();
        params.append("fullName", formData.fullName);
        params.append("username", formData.username);
        params.append("email", formData.email);
        params.append("phone", formData.phone);
        params.append("roleId", formData.roleId);
        params.append("password", formData.password);

        const regRes = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params,
        });
        const regData = await regRes.json();

        if (regData.success) {
          setMessage({ type: "success", text: "Account registered successfully in database! Redirecting to login..." });
          setTimeout(() => navigate("/login"), 2000);
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
    <div className="min-h-screen bg-[#080E1A] text-white flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-500 mb-4 shadow-lg shadow-blue-500/10">
            <ShieldCheck size={36} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">TrustLens Registration</h1>
          <p className="text-sm text-gray-400 mt-1">Module 1 — User Role Onboarding & Email OTP Verification</p>
        </div>

        {/* Card */}
        <div className="bg-[#0B1220] border border-gray-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-white mb-2">Create Account</h2>
          <p className="text-xs text-gray-400 mb-6">Enter details below to receive an email OTP for verification</p>

          {message && !showOtpModal && (
            <div className={`mb-6 p-3 rounded-lg border text-xs flex items-center gap-2 ${
              message.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}>
              {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleStartRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-[#131C2E] border border-gray-700/60 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Username</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="johndoe"
                  className="w-full bg-[#131C2E] border border-gray-700/60 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address (OTP Verification)</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full bg-[#131C2E] border border-gray-700/60 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1234567890"
                    className="w-full bg-[#131C2E] border border-gray-700/60 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Assign Role</label>
                <select
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                  className="w-full bg-[#131C2E] border border-gray-700/60 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="4">Field Officer</option>
                  <option value="3">Shelter Manager</option>
                  <option value="2">Disaster Manager</option>
                  <option value="1">System Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-[#131C2E] border border-gray-700/60 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isOtpSending}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 disabled:opacity-50 mt-4"
            >
              {isOtpSending ? (
                <span>Sending OTP...</span>
              ) : (
                <>
                  <span>Send OTP & Continue</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* OTP Verification Window Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1220] border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 mb-3">
                <KeyRound size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Email OTP Verification</h3>
              <p className="text-xs text-gray-400 mt-1">
                Enter the 6-digit code sent to <span className="text-blue-400 font-medium">{formData.email}</span>
              </p>
            </div>

            {message && (
              <div className={`mb-4 p-3 rounded-lg border text-xs flex items-center gap-2 ${
                message.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}>
                {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{message.text}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-center text-gray-400 mb-2">6-Digit Verification Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-[12px] font-mono text-xl py-3 bg-[#131C2E] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-between items-center text-xs text-gray-400 px-1">
                <span>Time remaining: <strong className="text-white">{timer}s</strong></span>
                <button
                  type="button"
                  disabled={!canResend}
                  onClick={sendOtp}
                  className="text-blue-400 hover:text-blue-300 disabled:opacity-40 flex items-center gap-1"
                >
                  <RefreshCw size={12} />
                  <span>Resend OTP</span>
                </button>
              </div>

              <button
                onClick={handleVerifyAndRegister}
                disabled={isVerifying || otpVerified}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-green-600/25 disabled:opacity-50"
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
