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

  // search state
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

  // ---------- filtriranje ----------

  // 1) osnovni filter glede na prijavo
  let visible = recepti;
  if (!user) {
    visible = visible.filter((r) => r.jeJaven);
  } else {
    visible = visible.filter(
      (r) => r.jeJaven || r.avtorId === user.id
    );
    if (showOnlyMine) {
      visible = visible.filter((r) => r.avtorId === user.id);
    }
  }

  // 2) filter po kategoriji
  if (selectedKategorijaId) {
    const kat = kategorije.find(
      (k) => k.id === Number(selectedKategorijaId)
    );
    if (kat) {
      visible = visible.filter((r) =>
        r.kategorije?.includes(kat.ime)
      );
    }
  }

  // 3) filter po oznaki
  if (selectedOznakaId) {
    const oz = oznake.find(
      (o) => o.id === Number(selectedOznakaId)
    );
    if (oz) {
      visible = visible.filter((r) =>
        r.oznake?.includes(oz.ime)
      );
    }
  }

  // 4) text search (ime, opis, kategorije, oznake, avtor)
  if (query.trim()) {
    const q = query.trim().toLowerCase();
    visible = visible.filter((r) => {
      const naz = (r.naslov || "").toLowerCase();
      const opis = (r.opis || "").toLowerCase();
      const avtor = (r.avtorIme || "").toLowerCase();
      const kat = (r.kategorije || []).join(" ").toLowerCase();
      const oz = (r.oznake || []).join(" ").toLowerCase();

      return (
        naz.includes(q) ||
        opis.includes(q) ||
        avtor.includes(q) ||
        kat.includes(q) ||
        oz.includes(q)
      );
    });
  }

  return (
    <div>
      {/* header + search bar */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Recepti
          </h1>
          <p className="text-xs text-slate-500">
            {user
              ? "Prikazani so javni recepti in tvoji. Uporabi filtre za zožanje."
              : "Prikazani so samo javni recepti. Za svoje se prijavi."}
          </p>
        </div>

        {/* search + filtri */}
        <div className="bg-white rounded-xl shadow-sm p-3 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Išči po imenu, opisu, kategoriji, oznaki..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={selectedKategorijaId}
              onChange={(e) => setSelectedKategorijaId(e.target.value)}
              className="border rounded-lg px-2 py-1 text-xs"
            >
              <option value="">Vse kategorije</option>
              {kategorije.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.ime}
                </option>
              ))}
            </select>

            <select
              value={selectedOznakaId}
              onChange={(e) => setSelectedOznakaId(e.target.value)}
              className="border rounded-lg px-2 py-1 text-xs"
            >
              <option value="">Vse oznake</option>
              {oznake.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.ime}
                </option>
              ))}
            </select>

            {user && (
              <label className="flex items-center gap-1 text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={showOnlyMine}
                  onChange={(e) => setShowOnlyMine(e.target.checked)}
                />
                samo moji recepti
              </label>
            )}
          </div>
        </div>
      </div>

      {/* lista */}
      {loading && <p>Nalaganje...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((r) => (
            <RecipeCard key={r.id} recept={r} />
          ))}
          {visible.length === 0 && (
            <p className="text-sm text-slate-500">
              Ni receptov za izbrane filtre / iskalni niz.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
