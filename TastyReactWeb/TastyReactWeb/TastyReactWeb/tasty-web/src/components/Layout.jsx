import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="text-xl font-bold text-amber-700">
            Tasty
          </Link>

          <nav className="flex items-center gap-3 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                "px-2 py-1 rounded " +
                (isActive
                  ? "bg-amber-100 text-amber-800"
                  : "text-slate-700 hover:bg-slate-100")
              }
            >
              Recepti
            </NavLink>

            <NavLink
              to="/recepti/nov"
              className={({ isActive }) =>
                "px-2 py-1 rounded " +
                (isActive
                  ? "bg-amber-600 text-white"
                  : "bg-amber-500 text-white hover:bg-amber-600")
              }
            >
              + Nov recept
            </NavLink>
          </nav>

          <div className="flex items-center gap-2 text-sm">
            {user ? (
              <>
                <span className="text-slate-700">
                  Prijavljen: <span className="font-semibold">{user.ime}</span>
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="px-2 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Odjava
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-2 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Prijava
                </Link>
                <Link
                  to="/register"
                  className="px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Registracija
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
