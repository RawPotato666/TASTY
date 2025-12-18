import { resolveImageUrl } from "../api";

export default function RecipeCard({ recept }) {
  const imgUrl = resolveImageUrl(recept.naslovnaSlikaUrl);

  return (
    <a
      href={`/recepti/${recept.id}`}
      className="group block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-black/20"
    >
      <div className="relative h-48 overflow-hidden">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={recept.naslov}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">No Image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent opacity-60" />
      </div>
      
      <div className="p-5">
        <h2 className="font-bold text-xl text-white group-hover:text-yellow-400 transition-colors mb-2">
          {recept.naslov}
        </h2>
        {recept.opis && (
          <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {recept.opis}
          </p>
        )}
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1 text-orange-500">
            <span className="text-lg">⏱</span> {recept.casPripraveMin} MIN
          </span>
          <span className="flex items-center gap-1 text-red-500">
            <span className="text-lg">🍽</span> {recept.steviloPorcij} PORCIJ
          </span>
        </div>
      </div>
    </a>
  );
}