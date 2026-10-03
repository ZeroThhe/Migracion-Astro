import React from 'react';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import ErrorBanner from '../components/ErrorBanner';
import { ArrowLeft, Layers, Disc } from 'lucide-react';
import { useFlowStore } from '../store/useFlowStore';

/**
 * CategoryView — Detalle de Categoría (Sección 5.2)
 */
export default function CategoryView({ categoria, productos, loading, error, onRetry }) {
  const { volver } = useFlowStore();

  return (
    <div className="space-y-6">
      {/* Botón Volver */}
      <button
        onClick={volver}
        className="glass-btn-primary rounded-full px-4 py-1.5 text-xs font-bold inline-flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Volver</span>
      </button>

      {/* Header Banner de la Categoría */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-rose-950/30">
        <div className="flex items-center gap-2 text-pink-400 mb-2">
          <Layers className="h-4 w-4" />
          <span className="font-script text-xl font-bold">Categoría Seleccionada</span>
        </div>
        <h1 className="font-poster text-3xl sm:text-5xl font-black uppercase tracking-wider text-amber-300">
          {categoria?.nombre || "Categoría"}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-amber-200/80 max-w-xl leading-relaxed">
          {categoria?.descripcion || "Discos y lanzamientos seleccionados para esta categoría."}
        </p>
      </div>

      {/* Rejilla de Productos de la Categoría */}
      {loading ? (
        <Skeleton count={4} />
      ) : error ? (
        <ErrorBanner mensaje={error} onRetry={onRetry} />
      ) : productos.length === 0 ? (
        <div className="glass-panel rounded-2xl p-8 text-center border border-amber-500/20">
          <Disc className="h-12 w-12 text-amber-400/40 mx-auto mb-3" />
          <h3 className="font-serif-poster text-lg font-bold text-amber-200">
            No hay productos en esta categoría
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((prod) => (
            <ProductCard key={prod.id} producto={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
