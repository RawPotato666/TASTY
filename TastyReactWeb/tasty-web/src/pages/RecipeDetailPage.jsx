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

  if (loading) return <p className="text-slate-400 italic">Nalaganje...</p>;
  if (error) return <p className="text-red-500 font-bold">{error}</p>;
  if (!recept) return <p className="text-slate-400">Recept ni najden.</p>;

  // ---------- DATA PARSING ----------

  const authorName =
    recept.avtorIme ??
    recept.avtor?.ime ??
    (recept.avtorId ? `Uporabnik #${recept.avtorId}` : null);

  const naslovnaSlika =
    (recept.slike || []).find((s) => s.jeNaslovna) ||
    (recept.slike || [])[0];

  let kategorije = Array.isArray(recept.kategorije) 
    ? recept.kategorije.map(k => (typeof k === 'string' ? k : k.ime ?? k.kategorija?.ime)).filter(Boolean)
    : [];

  let oznake = Array.isArray(recept.oznake) 
    ? recept.oznake.map(o => (typeof o === 'string' ? o : o.ime ?? o.oznaka?.ime)).filter(Boolean)
    : [];

  const sestavineView = (Array.isArray(recept.sestavine) ? recept.sestavine : [])
    .map((s) => ({
      id: s.sestavinaId ?? s.id ?? s.sestavina?.id,
      ime: s.sestavinaIme ?? s.sestavina?.ime ?? s.ime ?? s.naziv,
      kolicina: s.kolicina ?? s.količina,
      opomba: s.opomba,
    })).filter(s => s.ime);

  const korakiView = (Array.isArray(recept.korakiPriprave) ? recept.korakiPriprave : [])
    .map((k) => ({
      id: k.id ?? k.korakId ?? k.zaporednaStevilka,
      zaporednaStevilka: k.zaporednaStevilka ?? 0,
      opis: k.opis ?? "",
      casTrajanjaMin: k.casTrajanjaMin,
    })).sort((a, b) => a.zaporednaStevilka - b.zaporednaStevilka);

  // ---------- RENDER ----------

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* HEADER SECTION WITH IMAGE */}
      <div className="relative group">
        {naslovnaSlika ? (
          <div className="relative h-[400px] w-full overflow-hidden rounded-3xl shadow-2xl">
            <img
              src={resolveImageUrl(naslovnaSlika.url)}
              alt={naslovnaSlika.opis || recept.naslov}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-md">
                {recept.naslov}<span className="text-orange-500">.</span>
              </h1>
              <div className="flex flex-wrap gap-4 text-sm font-bold uppercase tracking-wider text-slate-200">
                <span className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-orange-500 text-lg">⏱</span> {recept.casPripraveMin} MIN
                </span>
                <span className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-red-500 text-lg">🍽</span> {recept.steviloPorcij} PORCIJ
                </span>
                {recept.jeJaven && (
                  <span className="bg-emerald-500/20 text-emerald-400 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-500/30">
                    JAVNO
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <h1 className="text-4xl font-black text-white tracking-tight">{recept.naslov}<span className="text-orange-500">.</span></h1>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: INFO, SESTAVINE, KATEGORIJE & OZNAKE */}
        <div className="lg:col-span-1 space-y-6">
          {/* AUTHOR & DESCRIPTION */}
          <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-2xl shadow-xl">
            <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-2">Chef</p>
            <p className="text-lg font-bold text-white mb-4">{authorName || "Neznan avtor"}</p>
            <div className="h-px bg-zinc-700 mb-4" />
            <p className="text-slate-400 text-sm leading-relaxed italic">
              "{recept.opis || "Ta recept še nima opisa."}"
            </p>
          </div>

          {/* SESTAVINE */}
          <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Sestavine</h2>
            <ul className="space-y-3">
              {sestavineView.map((s) => (
                <li key={s.id} className="flex justify-between items-start text-sm border-b border-zinc-700/50 pb-2 last:border-0">
                  <span className="text-slate-200 font-medium">{s.ime}</span>
                  <div className="text-right">
                    <span className="text-orange-400 font-bold">{s.kolicina}</span>
                    {s.opomba && <p className="text-[10px] text-slate-500">{s.opomba}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* KATEGORIJE SECTION */}
          {kategorije.length > 0 && (
            <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-2xl shadow-xl">
              <h2 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4">Kategorije</h2>
              <div className="flex flex-wrap gap-2">
                {kategorije.map((k) => (
                  <span key={k} className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase rounded-lg">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* OZNAKE SECTION */}
          {oznake.length > 0 && (
            <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-2xl shadow-xl">
              <h2 className="text-xs font-black text-yellow-500 uppercase tracking-widest mb-4">Oznake</h2>
              <div className="flex flex-wrap gap-2">
                {oznake.map((o) => (
                  <span key={o} className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[10px] font-black uppercase rounded-lg">
                    {o}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: KORAKI */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-800 border border-zinc-700 p-8 rounded-3xl shadow-xl">
            <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-sm">✓</span>
              Postopek priprave
            </h2>
            
            <div className="space-y-8 relative">
              {/* Vertical timeline line */}
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-zinc-700" />
              
              {korakiView.map((k, idx) => (
                <div key={k.id} className="relative pl-12">
                  {/* Step number circle */}
                  <div className="absolute left-0 top-0 w-8 h-8 bg-zinc-900 border-2 border-orange-500 rounded-full flex items-center justify-center z-10">
                    <span className="text-xs font-black text-white">{k.zaporednaStevilka}</span>
                  </div>
                  
                  <div className="bg-zinc-900/50 border border-zinc-700 p-5 rounded-2xl hover:border-zinc-600 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Korak {idx + 1}</span>
                      {k.casTrajanjaMin && (
                        <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">
                          {k.casTrajanjaMin} MIN
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 leading-relaxed text-sm">
                      {k.opis}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GALLERY MINIATURES */}
          {recept.slike && recept.slike.length > 1 && (
            <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-2xl shadow-xl">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Galerija slik</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {recept.slike.map((s) => (
                  <img
                    key={s.id}
                    src={resolveImageUrl(s.url)}
                    alt={s.opis || ""}
                    className={
                      "h-24 w-24 object-cover rounded-xl border-2 transition-all hover:scale-105 " +
                      (s.jeNaslovna ? "border-orange-500" : "border-zinc-700 hover:border-zinc-500")
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}