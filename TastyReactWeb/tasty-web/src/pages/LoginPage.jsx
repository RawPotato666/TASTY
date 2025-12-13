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
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-2xl font-bold mb-4 text-slate-900">Prijava</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
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

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
        >
          {loading ? "Prijavljam..." : "Prijava"}
        </button>
      </form>

      <p className="text-sm text-slate-600 mt-4">
        Nimaš računa?{" "}
        <Link to="/register" className="text-amber-700 hover:underline">
          Registriraj se
        </Link>
      </p>
    </div>
  );
}
