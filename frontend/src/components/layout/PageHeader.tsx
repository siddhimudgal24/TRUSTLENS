import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  eyebrow?: string;
  status?: ReactNode;
}

function PageHeader({
  title,
  description,
  eyebrow,
  status,
}: PageHeaderProps) {
  return (
    <header className="page-header flex min-w-0 flex-col gap-3 border-b border-slate-200 pb-4 text-slate-900 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-700">
            {eyebrow}
          </p>
        )}
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <h1 className="mt-1 min-w-0 text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
            {title}
          </h1>
          {status && <div className="max-w-full shrink-0">{status}</div>}
        </div>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      </div>
    </header>
  );
}

export default PageHeader;
