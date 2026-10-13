import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Lock,
  Key,
  CheckCircle2,
  AlertCircle,
  Calendar,
  BadgeCheck,
  Save,
  ShieldAlert,
} from "lucide-react";
import { getStoredUser, setStoredUser, type AuthUser } from "../utils/auth";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<"details" | "security">("details");
  const stored = getStoredUser();

  // Profile Form State
  const [fullName, setFullName] = useState(stored?.fullName || "");
  const [email, setEmail] = useState(stored?.email || "");
  const [phone, setPhone] = useState(stored?.phone || "");
  const [username, setUsername] = useState(stored?.username || "");
  const [role, setRole] = useState(stored?.role || "Field Officer");
  const [createdAt, setCreatedAt] = useState(stored?.createdAt || "");

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Loading & Feedback
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Fetch freshest data from backend on mount
  useEffect(() => {
    async function loadFreshProfile() {
      if (!stored?.username) return;
      try {
        const res = await fetch(
          `/api/profile?username=${encodeURIComponent(stored.username)}`
        );
        const data = await res.json();
        if (data.success) {
          setFullName(data.fullName || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setUsername(data.username || "");
          setRole(data.role || "Field Officer");
          if (data.createdAt) setCreatedAt(data.createdAt);

          // Update local cache
          const updatedUser: AuthUser = {
            userId: data.userId,
            username: data.username,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            role: data.role,
            roleId: data.roleId,
            createdAt: data.createdAt,
          };
          setStoredUser(updatedUser);
        }
      } catch (e) {
        console.warn("Could not sync profile from server, using local cache", e);
      }
    }
    loadFreshProfile();
  }, [stored?.username]);

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage(null);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setProfileMessage({
          type: "success",
          text: data.message || "Profile details updated successfully!",
        });

        // Update local storage
        const updatedUser: AuthUser = {
          ...stored,
          username: username || stored?.username || "",
          fullName: data.fullName || fullName.trim(),
          email: data.email || email.trim(),
          phone: data.phone || phone.trim(),
          role: data.role || role,
        };
        setStoredUser(updatedUser);
      } else {
        setProfileMessage({
          type: "error",
          text: data.message || "Failed to update profile details.",
        });
      }
    } catch {
      setProfileMessage({
        type: "error",
        text: "Server error occurred. Please check network connection.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Change Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New passwords do not match.",
      });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "New password must be at least 6 characters long.",
      });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setPasswordMessage({
          type: "success",
          text: data.message || "Password changed successfully!",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMessage({
          type: "error",
          text: data.message || "Incorrect current password.",
        });
      }
    } catch {
      setPasswordMessage({
        type: "error",
        text: "Failed to connect to server.",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Shield className="text-blue-500" size={28} />
          <span>My Profile & Account Settings</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Manage your operational credentials, identity details, and account security
        </p>
      </div>

      {/* Hero Profile Banner */}
      <div className="bg-[#0B1220] border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar Badge */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 shrink-0">
            <div className="w-full h-full bg-[#0E1626] rounded-2xl flex items-center justify-center font-bold text-2xl text-blue-400">
              {getInitials(fullName || username)}
            </div>
          </div>

          {/* User Bio */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1.5">
              <h2 className="text-xl font-bold text-white">{fullName || username || "Field Officer"}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400 w-fit mx-auto sm:mx-0">
                <BadgeCheck size={14} />
                {role}
              </span>
            </div>

            <p className="text-xs text-gray-400 mb-3">
              @{username || "user"} · <span className="text-gray-300">{email || "No email linked"}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-400 font-medium">Account Active</span>
              </div>
              {createdAt && (
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Calendar size={14} />
                  <span>Joined {new Date(createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab("details")}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-semibold border-b-2 transition ${
            activeTab === "details"
              ? "border-blue-500 text-blue-400 bg-blue-500/5"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <User size={16} />
          <span>Profile Details</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-semibold border-b-2 transition ${
            activeTab === "security"
              ? "border-blue-500 text-blue-400 bg-blue-500/5"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <Lock size={16} />
          <span>Security & Password</span>
        </button>
      </div>

      {/* TAB 1: PROFILE DETAILS */}
      {activeTab === "details" && (
        <div className="bg-[#0B1220] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-semibold text-white">Personal & Contact Information</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Update your displayed name, contact phone, and verified email address
            </p>
          </div>

          {profileMessage && (
            <div
              className={`p-4 rounded-xl border text-xs flex items-center gap-3 ${
                profileMessage.type === "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              {profileMessage.type === "success" ? (
                <CheckCircle2 size={18} className="shrink-0" />
              ) : (
                <AlertCircle size={18} className="shrink-0" />
              )}
              <span>{profileMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-[#131C2E] border border-gray-700/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                  <input
                    type="text"
                    disabled
                    value={username}
                    className="w-full bg-[#0E1524] border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-400 cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Username is your permanent identifier</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-[#131C2E] border border-gray-700/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#131C2E] border border-gray-700/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                <Save size={16} />
                <span>{isSavingProfile ? "Saving Details..." : "Save Profile Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: SECURITY & PASSWORD */}
      {activeTab === "security" && (
        <div className="bg-[#0B1220] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-semibold text-white">Change Account Password</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Ensure your account is protected with a strong password of at least 6 characters
            </p>
          </div>

          {passwordMessage && (
            <div
              className={`p-4 rounded-xl border text-xs flex items-center gap-3 ${
                passwordMessage.type === "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              {passwordMessage.type === "success" ? (
                <CheckCircle2 size={18} className="shrink-0" />
              ) : (
                <ShieldAlert size={18} className="shrink-0" />
              )}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-[#131C2E] border border-gray-700/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-[#131C2E] border border-gray-700/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-[#131C2E] border border-gray-700/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
              >
                <Lock size={16} />
                <span>{isUpdatingPassword ? "Updating Password..." : "Update Password"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
