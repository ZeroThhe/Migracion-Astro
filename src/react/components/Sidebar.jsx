import React from 'react';
import { Disc, Layers, Music, Sparkles, Star } from 'lucide-react';
import { useFlowStore } from '../store/useFlowStore';

/**
 * Sidebar — Navegación por Categorías (Sección 5.3)
 * Dispara el evento custom (Tema 5) al elegir una categoría para cambiar la máquina de estados.
 */
export default function Sidebar({ categorias, selectedCategoryId, onSelectCategory }) {
  const { irAlHome } = useFlowStore();

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      <div className="glass-panel rounded-2xl p-5 border border-amber-500/20">
        <div className="mb-4 flex items-center justify-between border-b border-amber-500/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-amber-400" />
            <h3 className="font-poster text-sm font-extrabold tracking-wider uppercase text-amber-200">
              Categorías
            </h3>
          </div>
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">
            {categorias.length}
          </span>
        </div>

        <nav className="space-y-1.5">
          {/* Opción Todos los Productos */}
          <button
            onClick={() => {
              onSelectCategory(null);
              irAlHome();
            }}
            className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all text-left ${
              selectedCategoryId === null
                ? 'bg-gradient-to-r from-amber-500/25 to-rose-500/15 text-amber-300 border border-amber-400/30'
                : 'text-amber-100/70 hover:bg-white/5 hover:text-amber-200'
            }`}
          >
            <Disc className={`h-4 w-4 ${selectedCategoryId === null ? 'text-amber-400' : 'text-amber-400/50'}`} />
            <span>Catálogo Completo</span>
          </button>

          {/* Lista de Categorías desde GraphQL */}
          {categorias.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id} // Tema 8: Keys
                onClick={() => onSelectCategory(cat)} // Tema 5: Evento custom
                className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all text-left ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/25 to-rose-500/15 text-amber-300 border border-amber-400/30 shadow-sm'
                    : 'text-amber-100/70 hover:bg-white/5 hover:text-amber-200'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Music className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-rose-400' : 'text-amber-400/40'}`} />
                  <span className="truncate">{cat.nombre}</span>
                </div>
                {isSelected && <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Widget de Vinilo Destacado Promo */}
      <div className="hidden lg:block glass-panel rounded-2xl p-5 border border-pink-500/20 bg-gradient-to-br from-rose-950/30 to-amber-950/20">
        <div className="flex items-center gap-1.5 text-pink-400 mb-2">
          <Star className="h-4 w-4 fill-pink-400" />
          <span className="font-script text-lg font-bold">Edición limitada</span>
        </div>
        <h4 className="font-serif-poster text-base font-bold text-amber-100 leading-tight">
          Prensado en Vinilo Transparente
        </h4>
        <p className="mt-2 text-xs text-amber-200/60 leading-relaxed">
          Envíos protegidos con empaque reforzado antishock a toda la República.
        </p>
      </div>
    </aside>
  );
}
