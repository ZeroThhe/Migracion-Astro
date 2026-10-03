import React from 'react';
import BentoHero from '../components/BentoHero';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import ErrorBanner from '../components/ErrorBanner';
import { Sparkles, Disc } from 'lucide-react';

/**
 * HomeView — Vista Principal del Flujo (Sección 5.2 & 5.3)
 */
export default function HomeView({ productos, loading, error, onRetry }) {
  return (
    <div className="space-y-8">
      {/* Hero Bento Grid */}
      <BentoHero />

      {/* Título de la Sección Catálogo */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h2 className="font-poster text-xl font-extrabold tracking-wider uppercase text-amber-200">
              Catálogo de Álbumes & Vinilos
            </h2>
          </div>
          <p className="text-xs text-amber-200/60 mt-0.5">
            Explora las producciones más aclamadas en formato físico.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-amber-300/80 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
          <Disc className="h-3.5 w-3.5 text-amber-400 vinyl-spin" />
          <span>{productos.length} Productos Disponibles</span>
        </div>
      </div>

      {/* Manejo de Carga, Error y Datos (Sección 7.3) */}
      {loading ? (
        <Skeleton count={6} />
      ) : error ? (
        <ErrorBanner mensaje={error} onRetry={onRetry} />
      ) : productos.length === 0 ? (
        <div className="glass-panel rounded-2xl p-8 text-center border border-amber-500/20">
          <Disc className="h-12 w-12 text-amber-400/40 mx-auto mb-3" />
          <h3 className="font-serif-poster text-lg font-bold text-amber-200">
            No se encontraron álbumes
          </h3>
          <p className="text-xs text-amber-200/60 mt-1">
            Intenta cambiar los términos de búsqueda o seleccionar otra categoría.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((prod) => (
            <ProductCard key={prod.id} producto={prod} /> // Tema 8: Keys
          ))}
        </div>
      )}
    </div>
  );
}
