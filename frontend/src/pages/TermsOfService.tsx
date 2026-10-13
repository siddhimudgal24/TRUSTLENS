import { Link } from "react-router-dom";
import { ArrowLeft, Scale, AlertOctagon, CheckCircle2, ShieldCheck, HeartHandshake } from "lucide-react";

export default function TermsOfService() {
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
            <span className="text-blue-600 font-bold">Terms</span>
            <span>·</span>
            <Link to="/cookies" className="hover:text-blue-600 transition">Cookie Policy</Link>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-sm mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-4 shadow-sm">
            <Scale size={28} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Effective Date: October 13, 2026 · Governing use of TrustLens Emergency Operations Platform
          </p>
          <p className="text-sm text-slate-600 mt-4 leading-relaxed">
            By accessing or using the TrustLens platform, you agree to comply with and be bound by these Terms of Service.
            TrustLens is designed to assist emergency response managers and field officers with situational awareness,
            readiness scoring, and shelter allocation assistance.
          </p>
        </div>

        {/* Content Sections */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-sm space-y-8">
          {/* Section 1: Nature of Platform */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <ShieldCheck className="text-blue-600" size={20} />
              <span>1. Operational Nature & Decision Support Disclaimer</span>
            </h2>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed mb-4">
              <strong className="block mb-1 font-semibold flex items-center gap-2">
                <AlertOctagon size={16} className="text-amber-700" />
                Operational Advisory Notice:
              </strong>
              TrustLens readiness calculations, AI inspection previews, and dynamic shelter allocations are
              <strong> decision-support tools</strong>. They are intended to assist qualified response commanders
              and do not substitute for on-the-ground physical inspections, civil protection orders, or emergency directives.
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Human commanders retain final authority and responsibility for evacuation routing, shelter opening,
              and resource distribution.
            </p>
          </section>

          {/* Section 2: Authorized Access */}
          <section className="pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <CheckCircle2 className="text-blue-600" size={20} />
              <span>2. Authorized Personnel & Role Obligations</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Users must be verified emergency personnel or authorized volunteers. You agree to:
            </p>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-600 list-disc list-inside">
              <li>Maintain the confidentiality of your login credentials and one-time verification codes.</li>
              <li>Provide accurate, verified emergency field metrics and incident logs.</li>
              <li>Promptly report any suspected unauthorized access or compromised security credentials.</li>
              <li>Not misuse the system to create false disaster alarms or disrupt humanitarian relief logistics.</li>
            </ul>
          </section>

          {/* Section 3: Honest Disclaimers & No Unsupported Guarantees */}
          <section className="pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <HeartHandshake className="text-blue-600" size={20} />
              <span>3. Transparency & Realistic System Bounds</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              TrustLens does not make misleading or unsupported claims:
            </p>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-600 list-disc list-inside">
              <li>We do not guarantee 100% uninterrupted uptime during severe telecommunications infrastructure destruction.</li>
              <li>Readiness predictions are based on available sensor metrics and verified historical data; environmental variables may fluctuate during live natural disasters.</li>
              <li>We do not present simulated scenario calculations as guaranteed future outcomes.</li>
            </ul>
          </section>

          {/* Section 4: Termination & Contact */}
          <section className="pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-2">4. Support & Legal Inquiries</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              For questions regarding operational governance or compliance, contact our coordination team at
              <span className="text-blue-600 font-semibold"> legal@trustlens.org</span>.
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 text-center text-xs text-slate-500 space-x-4">
          <Link to="/privacy" className="hover:text-blue-600 hover:underline">Privacy Policy</Link>
          <span>·</span>
          <Link to="/cookies" className="hover:text-blue-600 hover:underline">Cookie Policy</Link>
          <span>·</span>
          <Link to="/login" className="hover:text-blue-600 hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
