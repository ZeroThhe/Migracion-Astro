import React from 'react';
import { ShoppingBag, Eye, Disc, Sparkles } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useFlowStore } from '../store/useFlowStore';

/**
 * ProductCard — Componente Atómico de Producto (Tema 1)
 * Recibe props (Tema 3) e interactúa con la tienda del carrito (Tema 11) y eventos custom (Tema 5).
 */
export default function ProductCard({ producto }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { verProducto, abrirModalProducto } = useFlowStore();

  return (
    <article className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between group border border-amber-500/20">
      <div>
        {/* Imagen del Álbum con Badge de Formato */}
        <div className="relative aspect-square overflow-hidden bg-black/40">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#180D09] via-transparent to-transparent opacity-80" />

          {/* Badge Formato */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="rounded-full bg-[#180D09]/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-300 border border-amber-500/30">
              {producto.formato}
            </span>
            {producto.destacado && (
              <span className="rounded-full bg-rose-500/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white border border-rose-400/40 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>Top</span>
              </span>
            )}
          </div>

          {/* Botones Flotantes de Acción Rápida (Vista Rápida Modal / Portales) */}
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => abrirModalProducto(producto)} // Tema 15: Portales Modal
              title="Vista Rápida"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/90 text-slate-950 shadow-lg hover:scale-110 transition-transform"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Información del Álbum */}
        <div className="p-4 space-y-1.5">
          <p className="text-[11px] font-bold text-pink-400 uppercase tracking-widest truncate">
            {producto.artista}
          </p>
          <h3 
            onClick={() => verProducto(producto)}
            className="font-serif-poster text-base font-bold text-amber-100 group-hover:text-amber-300 transition-colors cursor-pointer line-clamp-1"
          >
            {producto.nombre}
          </h3>
        </div>
      </div>

      {/* Precio & Botón de Carrito */}
      <div className="p-4 pt-0 flex items-center justify-between border-t border-amber-500/10 mt-3">
        <div>
          <span className="text-[10px] text-amber-200/50 block">Precio</span>
          <span className="font-poster text-lg font-black text-amber-300">
            ${producto.precio.toFixed(2)}
          </span>
        </div>

        <button
          onClick={() => addToCart(producto, 1)}
          className="glass-btn-primary rounded-full px-3.5 py-2 text-xs font-bold flex items-center gap-1.5"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>Agregar</span>
        </button>
      </div>
    </article>
  );
}
