import { useEffect, useState } from "react";
import {
  fetchKategorije,
  fetchOznake,
  fetchSestavine,
  createRecept,
  uploadReceptImage,
} from "../api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function NewRecipePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [form, setForm] = useState({
    naslov: "",
    opis: "",
    casPripraveMin: 30,
    steviloPorcij: 2,
    jeJaven: true,
    kategorijaIds: [],
    oznakaIds: [],
    sestavine: [],
    korakiPriprave: [],
  });

  const [kategorije, setKategorije] = useState([]);
  const [oznake, setOznake] = useState([]);
  const [sestavineMaster, setSestavineMaster] = useState([]);

  const [loadingInit, setLoadingInit] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [imageOpis, setImageOpis] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const nextParam = encodeURIComponent(location.pathname);

  useEffect(() => {
    async function load() {
      try {
        setLoadingInit(true);
        const [kat, oz, ses] = await Promise.all([
          fetchKategorije(),
          fetchOznake(),
          fetchSestavine(),
        ]);
        setKategorije(kat);
        setOznake(oz);
        setSestavineMaster(ses);
      } catch (err) {
        console.error(err);
        setError("Napaka pri nalaganju podatkov za obrazec.");
      } finally {
        setLoadingInit(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // Updated unauthorized access view
  if (!user) {
    return (
      <div className="max-w-md mx-auto bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl p-8 text-center mt-10">
        <h1 className="text-3xl font-black mb-4 text-white tracking-tight">
          Dodajanje recepta<span className="text-orange-500">.</span>
        </h1>
        <p className="mb-8 text-slate-400 leading-relaxed">
          Za ustvarjanje novih kulinaričnih mojstrovin se moraš najprej prijaviti v svoj račun.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to={`/login?next=${nextParam}`}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold hover:brightness-110 shadow-lg shadow-orange-900/20 active:scale-[0.98] transition-all"
          >
            Prijava
          </Link>
          <Link
            to="/register"
            className="px-4 py-3 rounded-xl border border-zinc-700 text-slate-300 hover:bg-zinc-700 font-semibold transition-colors"
          >
            Registracija
          </Link>
        </div>
      </div>
    );
  }

  function toggleInArray(field, id) {
    setForm((prev) => {
      const exists = prev[field].includes(id);
      return {
        ...prev,
        [field]: exists
          ? prev[field].filter((x) => x !== id)
          : [...prev[field], id],
      };
    });
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "casPripraveMin" || name === "steviloPorcij"
          ? Number(value)
          : value,
    }));
  }

  function handleImageChange(e) {
    const file = e.target.files && e.target.files[0];
    setImageFile(file || null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  }

  function addSestavinaRow() {
    setForm((prev) => ({
      ...prev,
      sestavine: [
        ...prev.sestavine,
        { sestavinaId: "", kolicina: "", opomba: "" },
      ],
    }));
  }

  function updateSestavinaRow(index, field, value) {
    setForm((prev) => {
      const arr = [...prev.sestavine];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, sestavine: arr };
    });
  }

  function removeSestavinaRow(index) {
    setForm((prev) => {
      const arr = [...prev.sestavine];
      arr.splice(index, 1);
      return { ...prev, sestavine: arr };
    });
  }

  function addKorakRow() {
    setForm((prev) => ({
      ...prev,
      korakiPriprave: [
        ...prev.korakiPriprave,
        {
          zaporednaStevilka: prev.korakiPriprave.length + 1,
          opis: "",
          casTrajanjaMin: null,
        },
      ],
    }));
  }

  function updateKorakRow(index, field, value) {
    setForm((prev) => {
      const arr = [...prev.korakiPriprave];
      arr[index] = {
        ...arr[index],
        [field]:
          field === "zaporednaStevilka" || field === "casTrajanjaMin"
            ? Number(value)
            : value,
      };
      return { ...prev, korakiPriprave: arr };
    });
  }

  function removeKorakRow(index) {
    setForm((prev) => {
      const arr = [...prev.korakiPriprave];
      arr.splice(index, 1);
      return { ...prev, korakiPriprave: arr };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.naslov.trim()) {
      setError("Vnesi naslov recepta.");
      return;
    }

    const payload = {
      naslov: form.naslov,
      opis: form.opis,
      casPripraveMin: form.casPripraveMin,
      steviloPorcij: form.steviloPorcij,
      jeJaven: form.jeJaven,
      avtorId: user.id,
      kategorijaIds: form.kategorijaIds,
      oznakaIds: form.oznakaIds,
      sestavine: form.sestavine
        .filter((s) => s.sestavinaId)
        .map((s) => ({
          sestavinaId: Number(s.sestavinaId),
          kolicina: s.kolicina,
          opomba: s.opomba,
        })),
      korakiPriprave: form.korakiPriprave
        .filter((k) => k.opis.trim())
        .map((k) => ({
          zaporednaStevilka: k.zaporednaStevilka,
          opis: k.opis,
          casTrajanjaMin: k.casTrajanjaMin,
        })),
    };

    try {
      setSubmitLoading(true);
      const created = await createRecept(payload);
      const newId = created.id ?? created.Id ?? null;
      if (!newId) throw new Error("API ni vrnil ID-ja recepta.");

      if (imageFile) {
        try {
          await uploadReceptImage(newId, imageFile, {
            opis: imageOpis,
            jeNaslovna: true,
          });
        } catch (err) {
          console.error("Upload slike ni uspel", err);
        }
      }
      navigate(`/recepti/${newId}`);
    } catch (err) {
      console.error(err);
      setError("Napaka pri shranjevanju recepta.");
    } finally {
      setSubmitLoading(false);
    }
  }

  if (loadingInit) return <p className="text-slate-400 italic">Nalaganje podatkov za obrazec...</p>;
  if (error && !submitLoading) return <p className="text-red-500 font-bold">{error}</p>;

  const inputClasses = "w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all";
  const labelClasses = "block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2";

  return (
    <div className="max-w-3xl mx-auto bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl p-8 mb-10">
      <h1 className="text-3xl font-black text-white mb-8 tracking-tight">
        Dodaj nov recept<span className="text-orange-500">.</span>
      </h1>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label className={labelClasses} htmlFor="naslov">Naslov recepta</label>
            <input
              id="naslov"
              name="naslov"
              className={inputClasses}
              value={form.naslov}
              onChange={handleChange}
              placeholder="Npr. Babičina gobova juha"
            />
          </div>

          <div>
            <label className={labelClasses} htmlFor="opis">Kratek opis</label>
            <textarea
              id="opis"
              name="opis"
              className={`${inputClasses} min-h-[100px] resize-none`}
              value={form.opis}
              onChange={handleChange}
              placeholder="Opiši svoj recept v nekaj stavkih..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClasses} htmlFor="casPripraveMin">Čas priprave (min)</label>
              <input
                id="casPripraveMin"
                name="casPripraveMin"
                type="number"
                className={inputClasses}
                value={form.casPripraveMin}
                onChange={handleChange}
                min={1}
              />
            </div>
            <div>
              <label className={labelClasses} htmlFor="steviloPorcij">Število porcij</label>
              <input
                id="steviloPorcij"
                name="steviloPorcij"
                type="number"
                className={inputClasses}
                value={form.steviloPorcij}
                onChange={handleChange}
                min={1}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-700">
            <input
              id="jeJaven"
              name="jeJaven"
              type="checkbox"
              className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 accent-orange-500"
              checked={form.jeJaven}
              onChange={handleChange}
            />
            <label htmlFor="jeJaven" className="text-sm font-semibold text-slate-200 cursor-pointer">
              Javno viden recept
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className={labelClasses}>Kategorije</label>
            <div className="flex flex-wrap gap-2">
              {kategorije.map((k) => {
                const checked = form.kategorijaIds.includes(k.id);
                return (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => toggleInArray("kategorijaIds", k.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      checked
                        ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-900/20"
                        : "bg-zinc-900 border-zinc-700 text-slate-400 hover:border-orange-500/50"
                    }`}
                  >
                    {k.ime}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelClasses}>Oznake</label>
            <div className="flex flex-wrap gap-2">
              {oznake.map((o) => {
                const checked = form.oznakaIds.includes(o.id);
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => toggleInArray("oznakaIds", o.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      checked
                        ? "bg-yellow-500 border-yellow-500 text-zinc-900 shadow-lg shadow-yellow-900/20"
                        : "bg-zinc-900 border-zinc-700 text-slate-400 hover:border-yellow-500/50"
                    }`}
                  >
                    {o.ime}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-700/50">
          <div className="flex items-center justify-between mb-4">
            <label className={labelClasses}>Sestavine</label>
            <button
              type="button"
              onClick={addSestavinaRow}
              className="text-xs font-bold text-yellow-500 hover:text-yellow-400 transition-colors uppercase tracking-wider"
            >
              + Dodaj sestavino
            </button>
          </div>
          {form.sestavine.length === 0 && (
            <p className="text-sm text-slate-500 italic">Ni dodanih sestavin.</p>
          )}
          <div className="space-y-3">
            {form.sestavine.map((s, idx) => (
              <div key={idx} className="grid grid-cols-[1fr,1fr,auto] gap-3 items-center">
                <select
                  className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:border-yellow-500 outline-none"
                  value={s.sestavinaId}
                  onChange={(e) => updateSestavinaRow(idx, "sestavinaId", e.target.value)}
                >
                  <option value="">Izberi sestavino</option>
                  {sestavineMaster.map((sm) => (
                    <option key={sm.id} value={sm.id}>{sm.ime}</option>
                  ))}
                </select>
                <input
                  className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:border-yellow-500 outline-none"
                  placeholder="Količina (npr. 200g)"
                  value={s.kolicina}
                  onChange={(e) => updateSestavinaRow(idx, "kolicina", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeSestavinaRow(idx)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-700/50">
          <div className="flex items-center justify-between mb-4">
            <label className={labelClasses}>Koraki priprave</label>
            <button
              type="button"
              onClick={addKorakRow}
              className="text-xs font-bold text-yellow-500 hover:text-yellow-400 transition-colors uppercase tracking-wider"
            >
              + Dodaj korak
            </button>
          </div>
          {form.korakiPriprave.length === 0 && (
            <p className="text-sm text-slate-500 italic">Ni dodanih korakov.</p>
          )}
          <div className="space-y-4">
            {form.korakiPriprave.map((k, idx) => (
              <div key={idx} className="space-y-3 border border-zinc-700 p-4 rounded-xl bg-zinc-900/50">
                <div className="flex gap-3 items-center">
                  <span className="text-xs font-black text-orange-500 uppercase">Korak {idx + 1}</span>
                  <input
                    type="number"
                    className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs w-16 text-white"
                    value={k.zaporednaStevilka}
                    onChange={(e) => updateKorakRow(idx, "zaporednaStevilka", e.target.value)}
                    min={1}
                  />
                  <input
                    type="number"
                    className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs w-20 text-white"
                    placeholder="Min"
                    value={k.casTrajanjaMin || ""}
                    onChange={(e) => updateKorakRow(idx, "casTrajanjaMin", e.target.value)}
                    min={0}
                  />
                  <button
                    type="button"
                    onClick={() => removeKorakRow(idx)}
                    className="text-xs font-bold text-red-500 ml-auto hover:underline"
                  >
                    Odstrani
                  </button>
                </div>
                <textarea
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white resize-none outline-none focus:border-yellow-500"
                  placeholder="Podroben opis koraka..."
                  value={k.opis}
                  onChange={(e) => updateKorakRow(idx, "opis", e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-700/50">
          <label className={labelClasses}>Slika recepta</label>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1 w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-zinc-700 file:text-white hover:file:bg-zinc-600 cursor-pointer"
              />
              <input
                type="text"
                className="mt-3 w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-yellow-500"
                placeholder="Kratek opis slike (npr. Končni izgled)"
                value={imageOpis}
                onChange={(e) => imageOpis(e.target.value)}
              />
            </div>
            {imagePreview && (
              <div className="relative group">
                <img
                  src={imagePreview}
                  alt="Predogled"
                  className="h-32 w-32 object-cover rounded-xl border-2 border-orange-500 shadow-lg"
                />
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p>}

        <div className="flex justify-end pt-4 border-t border-zinc-700">
          <button
            type="submit"
            disabled={submitLoading}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black rounded-xl hover:brightness-110 shadow-xl shadow-orange-900/30 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {submitLoading ? "Shranjevanje..." : "Shrani recept"}
          </button>
        </div>
      </form>
    </div>
  );
}