import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, Shield, Check, X, SlidersHorizontal } from "lucide-react";

const CONSENT_STORAGE_KEY = "trustlens_cookie_consent_choice";

export interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: true,
    analytics: false,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!stored) {
        // Small delay so page renders smoothly before banner appears
        const timer = setTimeout(() => setIsVisible(true), 600);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (choice: CookiePreferences) => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(choice));
    } catch {
      // storage unavailable
    }
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ essential: true, functional: true, analytics: true });
  };

  const handleAcceptNecessary = () => {
    saveConsent({ essential: true, functional: false, analytics: false });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Bottom Cookie Consent Banner */}
      <aside
        role="region"
        aria-label="Cookie consent"
        className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xl z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
      >
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-slate-900/10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
              <Cookie size={22} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Your Privacy & Cookie Choices</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Shield size={10} />
                  Zero Ad Trackers
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                We use strictly necessary cookies to keep your session authenticated and operational. No third-party
                advertising trackers or cross-site surveillance cookies are ever deployed. Learn more in our{" "}
                <Link to="/cookies" className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2">
                  Cookie Policy
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2">
                  Privacy Policy
                </Link>.
              </p>

              {/* Action Buttons with Equal Visual Weight (No Deceptive Dark Patterns) */}
              <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleAcceptNecessary}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 border border-slate-200/60"
                >
                  Essential Only
                </button>

                <button
                  type="button"
                  onClick={() => setShowPreferences(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 border border-slate-200/60 inline-flex items-center gap-1.5"
                >
                  <SlidersHorizontal size={13} />
                  <span>Customize</span>
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition active:scale-95 shadow-sm shadow-blue-500/20"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Preferences Modal */}
      {showPreferences && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-preferences-title"
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowPreferences(false);
          }}
        >
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowPreferences(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              aria-label="Close preferences"
            >
              <X size={20} />
            </button>

            <h3 id="cookie-preferences-title" className="text-lg font-bold text-slate-900 mb-1">
              Cookie Preferences
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Customize which cookies you permit TrustLens to store on your device.
            </p>

            <div className="space-y-4">
              {/* Essential */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Strictly Necessary</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Always Active</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Required for user authentication, session security, and basic disaster routing.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="mt-1 h-4 w-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-not-allowed opacity-70"
                />
              </div>

              {/* Functional */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900">Functional & Map Settings</span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Remembers your live map view filters, layers, and operational layout toggles.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="functional-toggle"
                  checked={preferences.functional}
                  onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Analytics */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900">Anonymous Diagnostics</span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Helps us measure system latency and client-side load performance without logging IP addresses.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="analytics-toggle"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm inline-flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Save Preferences</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
