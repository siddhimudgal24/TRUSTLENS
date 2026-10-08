import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="mx-auto flex min-h-[45vh] max-w-lg flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
        Page not found
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">
        That route does not exist
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Use the navigation to return to an available operations page.
      </p>
      <Link
        to="/"
        className="mt-5 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Back to dashboard
      </Link>
    </section>
  );
}

export default NotFound;
