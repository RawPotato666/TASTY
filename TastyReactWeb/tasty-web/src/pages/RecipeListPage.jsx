import { useEffect, useState } from "react";
import {
  fetchRecepti,
  fetchKategorije,
  fetchOznake,
} from "../api";
import RecipeCard from "../components/RecipeCard";
import { useAuth } from "../AuthContext";

export default function RecipeListPage() {
  const [recepti, setRecepti] = useState([]);
  const [kategorije, setKategorije] = useState([]);
  const [oznake, setOznake] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedKategorijaId, setSelectedKategorijaId] = useState("");
  const [selectedOznakaId, setSelectedOznakaId] = useState("");
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [rec, kat, oz] = await Promise.all([
          fetchRecepti(),
          fetchKategorije(),
          fetchOznake(),
        ]);
        setRecepti(rec);
        setKategorije(kat);
        setOznake(oz);
      } catch (err) {
        console.error(err);
        setError("Napaka pri nalaganju receptov.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  let visible = recepti;
  if (!user) {
    visible = visible.filter((r) => r.jeJaven);
  } else {
    visible = visible.filter((r) => r.jeJaven || r.avtorId === user.id);
    if (showOnlyMine) {
      visible = visible.filter((r) => r.avtorId === user.id);
    }
  }

  if (selectedKategorijaId) {
    const kat = kategorije.find((k) => k.id === Number(selectedKategorijaId));
    if (kat) visible = visible.filter((r) => r.kategorije?.includes(kat.ime));
  }

  if (selectedOznakaId) {
    const oz = oznake.find((o) => o.id === Number(selectedOznakaId));
    if (oz) visible = visible.filter((r) => r.oznake?.includes(oz.ime));
  }

  if (query.trim()) {
    const q = query.trim().toLowerCase();
    visible = visible.filter((r) => {
      const naz = (r.naslov || "").toLowerCase();
      const opis = (r.opis || "").toLowerCase();
      const avtor = (r.avtorIme || "").toLowerCase();
      const kat = (r.kategorije || []).join(" ").toLowerCase();
      const oz = (r.oznake || []).join(" ").toLowerCase();
      return naz.includes(q) || opis.includes(q) || avtor.includes(q) || kat.includes(q) || oz.includes(q);
    });
  }

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
          <h1 className="text-3xl font-black text-white tracking-tight">
            Recepti<span className="text-orange-500">.</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            {user ? "Javni in tvoji recepti" : "Samo javni recepti"}
          </p>
        </div>

        {/* Updated dark search bar and filters */}
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl shadow-xl p-4 flex flex-col gap-4 md:flex-row md:items-center backdrop-blur-sm">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Išči po imenu, opisu, kategoriji..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={selectedKategorijaId}
              onChange={(e) => setSelectedKategorijaId(e.target.value)}
              className="bg-zinc-900/50 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-yellow-500 cursor-pointer"
            >
              <option value="">Vse kategorije</option>
              {kategorije.map((k) => (
                <option key={k.id} value={k.id}>{k.ime}</option>
              ))}
            </select>

            <select
              value={selectedOznakaId}
              onChange={(e) => setSelectedOznakaId(e.target.value)}
              className="bg-zinc-900/50 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-yellow-500 cursor-pointer"
            >
              <option value="">Vse oznake</option>
              {oznake.map((o) => (
                <option key={o.id} value={o.id}>{o.ime}</option>
              ))}
            </select>

            {user && (
              <label className="flex items-center gap-2 text-xs font-medium text-slate-400 cursor-pointer hover:text-yellow-500 transition-colors">
                <input
                  type="checkbox"
                  checked={showOnlyMine}
                  onChange={(e) => setShowOnlyMine(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 accent-orange-500"
                />
                samo moji
              </label>
            )}
          </div>
        </div>
      </div>

      {loading && <p className="text-slate-400 italic">Nalaganje...</p>}
      {error && <p className="text-red-500 font-bold">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((r) => (
            <RecipeCard key={r.id} recept={r} />
          ))}
          {visible.length === 0 && (
            <p className="text-sm text-slate-500 italic">
              Ni receptov za izbrane filtre.
            </p>
          )}
        </div>
      )}
    </div>
  );
}