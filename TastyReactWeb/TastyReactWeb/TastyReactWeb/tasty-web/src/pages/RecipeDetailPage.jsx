import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRecept, resolveImageUrl } from "../api";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [recept, setRecept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchRecept(id);
        setRecept(data);
      } catch (err) {
        console.error(err);
        setError("Napaka pri nalaganju recepta.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p>Nalaganje...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!recept) return <p>Recept ni najden.</p>;

  // ---------- AVTOR ----------

  const authorName =
    recept.avtorIme ??
    recept.avtor?.ime ??
    (recept.avtorId ? `Uporabnik #${recept.avtorId}` : null);

  // ---------- NASLOVNA SLIKA ----------

  const naslovnaSlika =
    (recept.slike || []).find((s) => s.jeNaslovna) ||
    (recept.slike || [])[0];

  // ---------- KATEGORIJE ----------

  let kategorije = [];

  if (Array.isArray(recept.kategorije)) {
    if (recept.kategorije.length > 0) {
      if (typeof recept.kategorije[0] === "string") {
        // DTO: ["Glavna jed", "Desert"]
        kategorije = recept.kategorije;
      } else {
        // EF entity: [{ kategorija: { ime: "Glavna jed" }, ... }]
        kategorije = recept.kategorije
          .map((k) => k.ime ?? k.kategorija?.ime ?? k.naziv ?? k.name)
          .filter(Boolean);
      }
    }
  }

  // ---------- OZNake ----------

  let oznake = [];

  if (Array.isArray(recept.oznake)) {
    if (recept.oznake.length > 0) {
      if (typeof recept.oznake[0] === "string") {
        // DTO: ["Vegansko", "Hitro"]
        oznake = recept.oznake;
      } else {
        // EF entity: [{ oznaka: { ime: "Vegansko" }, ... }]
        oznake = recept.oznake
          .map((o) => o.ime ?? o.oznaka?.ime ?? o.naziv ?? o.name)
          .filter(Boolean);
      }
    }
  }

  // ---------- SESTAVINE ----------

  const sestavineRaw = Array.isArray(recept.sestavine) ? recept.sestavine : [];
  const sestavineView = sestavineRaw
    .map((s) => {
      const ime =
        s.sestavinaIme ??
        s.sestavina?.ime ??
        s.ime ??
        s.naziv ??
        null;

      if (!ime) return null;

      return {
        id: s.sestavinaId ?? s.id ?? s.sestavina?.id ?? ime,
        ime,
        kolicina: s.kolicina ?? s.količina ?? null,
        opomba: s.opomba ?? null,
      };
    })
    .filter(Boolean);

  // ---------- KORAKI ----------

  const korakiRaw = Array.isArray(recept.korakiPriprave)
    ? recept.korakiPriprave
    : Array.isArray(recept.koraki)
    ? recept.koraki
    : [];

  const korakiView = korakiRaw
    .map((k) => ({
      id: k.id ?? k.korakId ?? k.zaporednaStevilka ?? Math.random(),
      zaporednaStevilka:
        k.zaporednaStevilka ?? k.zaporedje ?? k.step ?? 0,
      opis: k.opis ?? k.description ?? "",
      casTrajanjaMin:
        k.casTrajanjaMin ?? k.trajanjeMin ?? k.timeMin ?? null,
    }))
    .sort(
      (a, b) => (a.zaporednaStevilka ?? 0) - (b.zaporednaStevilka ?? 0)
    );

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-4 md:p-6">
      {/* NASLOVNA SLIKA */}
      {naslovnaSlika && (
        <div className="mb-4">
          <img
            src={resolveImageUrl(naslovnaSlika.url)}
            alt={naslovnaSlika.opis || recept.naslov}
            className="w-full max-h-80 object-cover rounded-xl shadow-sm"
          />
          {naslovnaSlika.opis && (
            <p className="text-xs text-slate-500 mt-1">
              {naslovnaSlika.opis}
            </p>
          )}
        </div>
      )}

      {/* OSNOVNE INFO */}
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        {recept.naslov}
      </h1>
      <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
        {authorName && <span>Avtor: {authorName}</span>}
        <span>⏱ {recept.casPripraveMin} min</span>
        <span>🍽 {recept.steviloPorcij} porcij</span>
        {recept.jeJaven && (
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
            Javen
          </span>
        )}
      </div>

      {recept.opis && (
        <p className="mb-4 text-slate-700 whitespace-pre-wrap">
          {recept.opis}
        </p>
      )}

      {/* GALERIJA */}
      {recept.slike && recept.slike.length > 1 && (
        <div className="mb-4">
          <h2 className="font-semibold mb-1 text-sm">Galerija</h2>
          <div className="flex gap-2 overflow-x-auto">
            {recept.slike.map((s) => (
              <img
                key={s.id}
                src={resolveImageUrl(s.url)}
                alt={s.opis || ""}
                className={
                  "h-20 w-20 object-cover rounded-lg border " +
                  (s.jeNaslovna ? "border-amber-500" : "border-slate-200")
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* KATEGORIJE */}
      {kategorije.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold mb-1">Kategorije</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {kategorije.map((k) => (
              <span
                key={k}
                className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* OZNake */}
      {oznake.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold mb-1">Oznake</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {oznake.map((o) => (
              <span
                key={o}
                className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-100"
              >
                {o}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* SESTAVINE */}
      {sestavineView.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold mb-1">Sestavine</h2>
          <ul className="list-disc list-inside text-slate-700">
            {sestavineView.map((s) => (
              <li key={s.id}>
                <span className="font-medium">{s.ime}</span>
                {s.kolicina && <> – {s.kolicina}</>}
                {s.opomba && <> ({s.opomba})</>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* KORAKI */}
      {korakiView.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold mb-1">Koraki priprave</h2>
          <ol className="list-decimal list-inside space-y-1 text-slate-700">
            {korakiView.map((k) => (
              <li key={k.id}>
                <span className="font-medium">
                  Korak {k.zaporednaStevilka}:
                </span>{" "}
                {k.opis}
                {k.casTrajanjaMin != null && (
                  <span className="text-xs text-slate-500">
                    {" "}
                    ({k.casTrajanjaMin} min)
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
