import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    /* Main container using the charcoal palette */
    <div className="min-h-screen bg-zinc-900 text-slate-200">
      <header className="bg-zinc-900/50 border-b border-zinc-800 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-black tracking-tighter text-orange-500 hover:text-orange-400 transition-colors">
            TASTY<span className="text-red-600">.</span>
          </Link>

          <nav className="flex items-center gap-3 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                "px-3 py-1.5 rounded-lg transition-all " +
                (isActive
                  ? "bg-zinc-800 text-yellow-400 shadow-lg shadow-yellow-400/10"
                  : "text-slate-400 hover:text-slate-100 hover:bg-zinc-800")
              }
            >
              Recepti
            </NavLink>

            <NavLink
              to="/recepti/nov"
              className={({ isActive }) =>
                "px-3 py-1.5 rounded-lg transition-all font-bold " +
                (isActive
                  ? "bg-orange-600 text-white"
                  : "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:brightness-110")
              }
            >
              + Nov recept
            </NavLink>
          </nav>

          <div className="flex items-center gap-4 text-sm">
            {user ? (
              <>
                <span className="hidden sm:inline text-slate-400">
                  Chef: <span className="text-yellow-500 font-semibold">{user.ime}</span>
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg border border-zinc-700 text-slate-300 hover:bg-zinc-800 hover:border-zinc-600 transition-colors"
                >
                  Odjava
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
                  Prijava
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-lg bg-zinc-100 text-zinc-900 font-bold hover:bg-white transition-colors"
                >
                  Registracija
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}