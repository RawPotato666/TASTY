import { useState } from "react";
import { useAuth } from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [ime, setIme] = useState("");
  const [email, setEmail] = useState("");
  const [geslo, setGeslo] = useState("");
  const [geslo2, setGeslo2] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!ime.trim() || !email.trim() || !geslo.trim()) {
      setError("Vsa polja so obvezna.");
      return;
    }
    if (geslo !== geslo2) {
      setError("Gesli se ne ujemata.");
      return;
    }

    try {
      setLoading(true);
      await register(ime.trim(), email.trim(), geslo);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Registracija ni uspela.");
    } finally {
      setLoading(false);
    }
  }

  return (
    /* Register container updated to dark zinc palette */
    <div className="max-w-md mx-auto bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl p-8 mt-10">
      <h1 className="text-3xl font-black mb-6 text-white tracking-tight">
        Registracija<span className="text-yellow-500">.</span>
      </h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5" htmlFor="ime">
            Ime in priimek
          </label>
          <input
            id="ime"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 transition-all"
            value={ime}
            onChange={(e) => setIme(e.target.value)}
            placeholder="Janez Novak"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="janez@tasty.si"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5" htmlFor="geslo">
              Geslo
            </label>
            <input
              id="geslo"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 transition-all"
              value={geslo}
              onChange={(e) => setGeslo(e.target.value)}
              type="password"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5" htmlFor="geslo2">
              Ponovi
            </label>
            <input
              id="geslo2"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 transition-all"
              value={geslo2}
              onChange={(e) => setGeslo2(e.target.value)}
              type="password"
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-xl hover:brightness-110 shadow-lg shadow-yellow-900/20 transition-all disabled:opacity-50"
        >
          {loading ? "Registriram..." : "Ustvari račun"}
        </button>
      </form>

      <p className="text-sm text-slate-400 mt-6 text-center">
        Že imaš račun?{" "}
        <Link to="/login" className="text-orange-500 hover:text-orange-400 font-semibold transition-colors">
          Prijavi se
        </Link>
      </p>
    </div>
  );
}