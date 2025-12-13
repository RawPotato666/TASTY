import { resolveImageUrl } from "../api";

export default function RecipeCard({ recept }) {
  const imgUrl = resolveImageUrl(recept.naslovnaSlikaUrl);

  return (
    <a
      href={`/recepti/${recept.id}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {imgUrl && (
        <img
          src={imgUrl}
          alt={recept.naslov}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="font-semibold text-lg text-slate-900 mb-1">
          {recept.naslov}
        </h2>
        {recept.opis && (
          <p className="text-sm text-slate-600 line-clamp-2 mb-2">
            {recept.opis}
          </p>
        )}
        <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
          <span>⏱ {recept.casPripraveMin} min</span>
          <span>🍽 {recept.steviloPorcij} porcij</span>
        </div>
      </div>
    </a>
  );
}
