import { useState } from "react";
import { useAuth } from "../AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [geslo, setGeslo] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !geslo.trim()) {
      setError("Vnesi email in geslo.");
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), geslo);
      navigate(next, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Prijava ni uspela. Preveri email/geslo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    /* Container updated to dark zinc palette */
    <div className="max-w-md mx-auto bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl p-8 mt-10">
      <h1 className="text-3xl font-black mb-6 text-white tracking-tight">
        Prijava<span className="text-orange-500">.</span>
      </h1>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2" htmlFor="email">
            Email Naslov
          </label>
          <input
            id="email"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="vas-email@tasty.si"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2" htmlFor="geslo">
            Geslo
          </label>
          <input
            id="geslo"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            value={geslo}
            onChange={(e) => setGeslo(e.target.value)}
            type="password"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:brightness-110 shadow-lg shadow-orange-900/20 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? "Prijavljam..." : "Prijava"}
        </button>
      </form>

      <p className="text-sm text-slate-400 mt-6 text-center">
        Nimaš računa?{" "}
        <Link to="/register" className="text-yellow-500 hover:text-yellow-400 font-semibold transition-colors">
          Registriraj se
        </Link>
      </p>
    </div>
  );
}