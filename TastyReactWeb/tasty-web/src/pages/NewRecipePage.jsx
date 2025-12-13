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

  // naložimo kategorije/oznake/sestavine
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

  // čiščenje preview URL-ja
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // če ni prijavljen, pokaži prompt za login
  if (!user) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-4 text-slate-900">
          Dodajanje recepta
        </h1>
        <p className="mb-4 text-slate-700">
          Za dodajanje recepta se moraš prijaviti.
        </p>
        <div className="flex gap-2">
          <Link
            to={`/login?next=${nextParam}`}
            className="px-4 py-2 rounded bg-amber-600 text-white hover:bg-amber-700"
          >
            Prijava
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
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

  // --- SESTAVINE ---

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

  // --- KORAKI PRIPRAVE ---

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

  // --- SUBMIT ---

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

      // avtor = trenutno prijavljen user
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

      // 1) ustvari recept
      const created = await createRecept(payload);
      const newId = created.id ?? created.Id ?? null;
      if (!newId) {
        throw new Error("API ni vrnil ID-ja recepta.");
      }

      // 2) če je izbrana slika -> upload
      if (imageFile) {
        try {
          await uploadReceptImage(newId, imageFile, {
            opis: imageOpis,
            jeNaslovna: true,
          });
        } catch (err) {
          console.error("Upload slike ni uspel", err);
          // recept je vseeno ustvarjen, samo brez slike
        }
      }

      // 3) preusmeritev na detail recepta
      navigate(`/recepti/${newId}`);
    } catch (err) {
      console.error(err);
      setError("Napaka pri shranjevanju recepta.");
    } finally {
      setSubmitLoading(false);
    }
  }

  if (loadingInit) return <p>Nalaganje podatkov za obrazec...</p>;
  if (error && !submitLoading)
    return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">
        Dodaj nov recept
      </h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* osnovni podatki */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="naslov">
            Naslov
          </label>
          <input
            id="naslov"
            name="naslov"
            className="w-full border rounded-lg px-3 py-2"
            value={form.naslov}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="opis">
            Opis
          </label>
          <textarea
            id="opis"
            name="opis"
            className="w-full border rounded-lg px-3 py-2 min-h-[80px]"
            value={form.opis}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="casPripraveMin"
            >
              Čas priprave (min)
            </label>
            <input
              id="casPripraveMin"
              name="casPripraveMin"
              type="number"
              className="w-full border rounded-lg px-3 py-2"
              value={form.casPripraveMin}
              onChange={handleChange}
              min={1}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="steviloPorcij"
            >
              Št. porcij
            </label>
            <input
              id="steviloPorcij"
              name="steviloPorcij"
              type="number"
              className="w-full border rounded-lg px-3 py-2"
              value={form.steviloPorcij}
              onChange={handleChange}
              min={1}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="jeJaven"
            name="jeJaven"
            type="checkbox"
            checked={form.jeJaven}
            onChange={handleChange}
          />
          <label htmlFor="jeJaven" className="text-sm">
            Javen recept
          </label>
        </div>

        {/* kategorije */}
        <div>
          <label className="block text-sm font-medium mb-1">Kategorije</label>
          <div className="flex flex-wrap gap-2">
            {kategorije.map((k) => {
              const checked = form.kategorijaIds.includes(k.id);
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => toggleInArray("kategorijaIds", k.id)}
                  className={
                    "px-2 py-1 rounded-full border text-xs " +
                    (checked
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-700 border-slate-300")
                  }
                >
                  {k.ime}
                </button>
              );
            })}
          </div>
        </div>

        {/* oznake */}
        <div>
          <label className="block text-sm font-medium mb-1">Oznake</label>
          <div className="flex flex-wrap gap-2">
            {oznake.map((o) => {
              const checked = form.oznakaIds.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => toggleInArray("oznakaIds", o.id)}
                  className={
                    "px-2 py-1 rounded-full border text-xs " +
                    (checked
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-slate-700 border-slate-300")
                  }
                >
                  {o.ime}
                </button>
              );
            })}
          </div>
        </div>

        {/* sestavine */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium">Sestavine</label>
            <button
              type="button"
              onClick={addSestavinaRow}
              className="text-xs text-amber-700 hover:underline"
            >
              + Dodaj sestavino
            </button>
          </div>
          {form.sestavine.length === 0 && (
            <p className="text-sm text-slate-500">Ni sestavin. Dodaj prvo.</p>
          )}
          <div className="space-y-2">
            {form.sestavine.map((s, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[2fr,2fr,auto] gap-2 items-center"
              >
                <select
                  className="border rounded-lg px-2 py-1 text-sm"
                  value={s.sestavinaId}
                  onChange={(e) =>
                    updateSestavinaRow(idx, "sestavinaId", e.target.value)
                  }
                >
                  <option value="">-- izberi sestavino --</option>
                  {sestavineMaster.map((sm) => (
                    <option key={sm.id} value={sm.id}>
                      {sm.ime}
                    </option>
                  ))}
                </select>
                <input
                  className="border rounded-lg px-2 py-1 text-sm"
                  placeholder="Količina (npr. 200 g)"
                  value={s.kolicina}
                  onChange={(e) =>
                    updateSestavinaRow(idx, "kolicina", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => removeSestavinaRow(idx)}
                  className="text-xs text-red-600"
                >
                  odstrani
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* koraki priprave */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium">
              Koraki priprave
            </label>
            <button
              type="button"
              onClick={addKorakRow}
              className="text-xs text-amber-700 hover:underline"
            >
              + Dodaj korak
            </button>
          </div>
          {form.korakiPriprave.length === 0 && (
            <p className="text-sm text-slate-500">
              Ni korakov. Dodaj prvi korak.
            </p>
          )}
          <div className="space-y-2">
            {form.korakiPriprave.map((k, idx) => (
              <div key={idx} className="space-y-1 border rounded-lg p-2">
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-slate-500">
                    Korak {idx + 1}
                  </span>
                  <input
                    type="number"
                    className="border rounded px-2 py-1 text-xs w-20"
                    value={k.zaporednaStevilka}
                    onChange={(e) =>
                      updateKorakRow(
                        idx,
                        "zaporednaStevilka",
                        e.target.value
                      )
                    }
                    min={1}
                  />
                  <input
                    type="number"
                    className="border rounded px-2 py-1 text-xs w-24"
                    placeholder="Min"
                    value={k.casTrajanjaMin || ""}
                    onChange={(e) =>
                      updateKorakRow(idx, "casTrajanjaMin", e.target.value)
                    }
                    min={0}
                  />
                  <button
                    type="button"
                    onClick={() => removeKorakRow(idx)}
                    className="text-xs text-red-600 ml-auto"
                  >
                    odstrani
                  </button>
                </div>
                <textarea
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="Opis koraka"
                  value={k.opis}
                  onChange={(e) =>
                    updateKorakRow(idx, "opis", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* SLIKA (UPLOAD) */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Slika recepta (upload)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
          />
          <input
            type="text"
            className="mt-2 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Opis slike (opcijsko)"
            value={imageOpis}
            onChange={(e) => setImageOpis(e.target.value)}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Predogled slike"
              className="mt-2 h-32 w-32 object-cover rounded-lg border border-slate-200"
            />
          )}
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitLoading}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
          >
            {submitLoading ? "Shranjevanje..." : "Shrani recept"}
          </button>
        </div>
      </form>
    </div>
  );
}
