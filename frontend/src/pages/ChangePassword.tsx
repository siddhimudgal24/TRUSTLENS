import React, { useState } from "react";
import { Lock, CheckCircle2, AlertCircle, Shield, Key } from "lucide-react";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Simulate/Trigger API password update
      setTimeout(() => {
        setMessage({ type: "success", text: "Your password has been changed successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setLoading(false);
      }, 800);
    } catch {
      setMessage({ type: "error", text: "Failed to update password." });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Shield className="text-blue-600" size={28} />
          <span>Security & Change Password</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">Manage your account security and password preferences</p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        {message && (
          <div className={`mb-6 p-4 rounded-xl border text-xs flex items-center gap-3 ${
            message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"
          }`}>
            {message.type === "success" ? <CheckCircle2 size={18} className="text-emerald-600" /> : <AlertCircle size={18} className="text-rose-600" />}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Password</label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white font-semibold px-6 py-3.5 rounded-xl transition flex items-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-50 text-sm"
            >
              {loading ? (
                <span>Updating Password...</span>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
