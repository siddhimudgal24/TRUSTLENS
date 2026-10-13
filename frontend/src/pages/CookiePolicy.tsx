import { Link } from "react-router-dom";
import { ArrowLeft, Cookie, Check, X, Shield, Settings } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft size={16} />
            <span>Return to Platform</span>
          </Link>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <Link to="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-blue-600 transition">Terms of Service</Link>
            <span>·</span>
            <span className="text-blue-600 font-bold">Cookies</span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-sm mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 mb-4 shadow-sm">
            <Cookie size={28} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cookie & Storage Policy</h1>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Effective: October 13, 2026 · Transparent cookie & local storage practices
          </p>
          <p className="text-sm text-slate-600 mt-4 leading-relaxed">
            This Cookie Policy explains how TrustLens uses cookies, local browser storage, and similar technologies
            to ensure our emergency operations platform functions properly, securely, and reliably.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-sm space-y-8">
          {/* Section 1: What Are Cookies */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">1. What Technologies We Use</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We use strictly necessary browser session cookies and localized client-side key-value storage (HTML5 LocalStorage)
              to maintain your authenticated status and store your operational display preferences.
            </p>
          </section>

          {/* Section 2: Detailed Table of Cookies */}
          <section className="pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4">2. Cookies and Storage in Use</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Key / Cookie Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Lifespan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono text-[11px] font-semibold text-slate-800">trustlens_user</td>
                    <td className="p-3"><span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]">Strictly Necessary</span></td>
                    <td className="p-3">Maintains officer authentication token and role permissions.</td>
                    <td className="p-3">Session / 7 Days</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono text-[11px] font-semibold text-slate-800">trustlens_cookie_consent</td>
                    <td className="p-3"><span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]">Strictly Necessary</span></td>
                    <td className="p-3">Stores your cookie consent preferences so banner does not repeat.</td>
                    <td className="p-3">1 Year</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono text-[11px] font-semibold text-slate-800">shelter_map_preferences</td>
                    <td className="p-3"><span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px]">Functional</span></td>
                    <td className="p-3">Saves layer filters on the live disaster map (roads, flood zones).</td>
                    <td className="p-3">Persistent Local</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: What We DON'T Use */}
          <section className="pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Shield className="text-blue-600" size={20} />
              <span>3. Zero Commercial Tracking</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs mb-1">
                  <Check size={16} />
                  <span>Strictly Essential & Operational</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Only functional data essential to secure login, role permission verification, and disaster maps.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                <div className="flex items-center gap-2 text-rose-800 font-semibold text-xs mb-1">
                  <X size={16} />
                  <span>No Ad Tracking or Cross-Site Spyware</span>
                </div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  Zero Google AdSense, Meta Pixel, cross-site trackers, or third-party marketing beacons.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: How to Manage */}
          <section className="pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Settings className="text-blue-600" size={20} />
              <span>4. Managing Your Preferences</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              You can adjust or revoke your preferences at any time by resetting your browser cookies or clicking the
              Cookie Preferences button in the consent banner. You may also disable cookies in your browser settings,
              though signing in to TrustLens requires session authentication storage.
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 text-center text-xs text-slate-500 space-x-4">
          <Link to="/privacy" className="hover:text-blue-600 hover:underline">Privacy Policy</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-blue-600 hover:underline">Terms of Service</Link>
          <span>·</span>
          <Link to="/login" className="hover:text-blue-600 hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
