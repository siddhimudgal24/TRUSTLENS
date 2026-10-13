import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Lock, Eye, Database, FileText } from "lucide-react";

export default function PrivacyPolicy() {
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
            <span className="text-blue-600 font-bold">Privacy</span>
            <span>·</span>
            <Link to="/terms" className="hover:text-blue-600 transition">Terms of Service</Link>
            <span>·</span>
            <Link to="/cookies" className="hover:text-blue-600 transition">Cookie Policy</Link>
          </div>
        </div>

        {/* Card Header */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-sm mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 mb-4 shadow-sm">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Last updated: October 13, 2026 · Effective immediately across all TrustLens operations
          </p>
          <p className="text-sm text-slate-600 mt-4 leading-relaxed">
            TrustLens is an emergency shelter readiness and disaster response coordination platform.
            We are deeply committed to protecting your personal information and adhering to strict
            <strong> data minimization principles</strong>. We only collect the minimal information necessary
            to authenticate personnel and coordinate disaster relief logistics.
          </p>
        </div>

        {/* Content Sections */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-sm space-y-8">
          {/* Section 1: Data Minimization */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <Database className="text-blue-600" size={20} />
              <span>1. Data We Collect (Strict Minimization)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We do not collect unnecessary personal data. Only the following data is processed:
            </p>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-600 list-disc list-inside">
              <li>
                <strong>Operational Account Data:</strong> Username, verified work email address, and hashed password (via BCrypt) for authenticating authorized response staff.
              </li>
              <li>
                <strong>Optional Contact Information:</strong> Phone number is strictly optional and used exclusively for urgent emergency SMS notifications.
              </li>
              <li>
                <strong>Session State:</strong> Minimal authentication tokens and consent cookies stored locally on your device to keep you signed in securely.
              </li>
              <li>
                <strong>Audit Logs:</strong> Operational logging (e.g., shelter status updates, disaster logs) attributed to your officer account for accountability.
              </li>
            </ul>
          </section>

          {/* Section 2: What We Never Do */}
          <section className="pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <Eye className="text-blue-600" size={20} />
              <span>2. What We Never Do</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 list-disc list-inside">
              <li>We never sell, rent, or trade your personal information to third parties or data brokers.</li>
              <li>We do not utilize deceptive dark patterns, hidden opt-ins, or coercive consents.</li>
              <li>We do not use invasive third-party cross-site behavioral tracking scripts or advertising networks.</li>
              <li>We do not collect geolocation in the background without explicit operational intent.</li>
            </ul>
          </section>

          {/* Section 3: Data Security */}
          <section className="pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <Lock className="text-blue-600" size={20} />
              <span>3. Data Security & Encryption</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              All data transmitted between your browser and our servers is secured with TLS 1.3 encryption.
              Sensitive authentication details (passwords) are irreversibly hashed using industry-standard BCrypt.
              One-time verification passwords (OTPs) are delivered over secure transactional protocols and expire within 10 minutes.
            </p>
          </section>

          {/* Section 4: Your Rights */}
          <section className="pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <FileText className="text-blue-600" size={20} />
              <span>4. Your Data Rights</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Under international privacy standards (GDPR, CCPA), you hold full ownership of your data:
            </p>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-600 list-disc list-inside">
              <li><strong>Right of Access & Modification:</strong> You may edit your profile information at any time in My Profile.</li>
              <li><strong>Right to Deletion:</strong> You may request complete deletion of your account and associated credentials.</li>
              <li><strong>Right to Object:</strong> You can opt out of all non-essential cookies via our Cookie Consent manager.</li>
            </ul>
          </section>

          {/* Section 5: Contact */}
          <section className="pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-2">5. Privacy Inquiries</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              For any questions regarding our privacy practices or to exercise your data rights, please contact our
              Data Protection Officer at <span className="text-blue-600 font-semibold">privacy@trustlens.org</span>.
            </p>
          </section>
        </div>

        {/* Bottom Footer Links */}
        <div className="mt-8 text-center text-xs text-slate-500 space-x-4">
          <Link to="/terms" className="hover:text-blue-600 hover:underline">Terms of Service</Link>
          <span>·</span>
          <Link to="/cookies" className="hover:text-blue-600 hover:underline">Cookie Policy</Link>
          <span>·</span>
          <Link to="/login" className="hover:text-blue-600 hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
