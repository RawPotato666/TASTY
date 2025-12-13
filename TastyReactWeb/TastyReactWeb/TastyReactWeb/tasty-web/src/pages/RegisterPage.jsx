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
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-2xl font-bold mb-4 text-slate-900">
        Registracija
      </h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="ime">
            Ime
          </label>
          <input
            id="ime"
            className="w-full border rounded-lg px-3 py-2"
            value={ime}
            onChange={(e) => setIme(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="w-full border rounded-lg px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="geslo">
            Geslo
          </label>
          <input
            id="geslo"
            className="w-full border rounded-lg px-3 py-2"
            value={geslo}
            onChange={(e) => setGeslo(e.target.value)}
            type="password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="geslo2">
            Ponovi geslo
          </label>
          <input
            id="geslo2"
            className="w-full border rounded-lg px-3 py-2"
            value={geslo2}
            onChange={(e) => setGeslo2(e.target.value)}
            type="password"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "Registriram..." : "Registriraj se"}
        </button>
      </form>

      <p className="text-sm text-slate-600 mt-4">
        Že imaš račun?{" "}
        <Link to="/login" className="text-amber-700 hover:underline">
          Prijavi se
        </Link>
      </p>
    </div>
  );
}
