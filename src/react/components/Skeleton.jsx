import React from 'react';

/**
 * Skeleton — Esqueleto de Carga (Tema 14)
 * Muestra marcadores de posición animados mientras se cargan los datos desde GraphQL.
 */
export default function Skeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className="glass-panel rounded-2xl p-4 space-y-4 animate-pulse border border-amber-500/10"
        >
          {/* Imagen esqueleto */}
          <div className="aspect-square w-full rounded-xl bg-amber-500/10" />

          {/* Líneas de texto esqueleto */}
          <div className="space-y-2">
            <div className="h-3 w-1/3 rounded bg-pink-500/15" />
            <div className="h-4 w-3/4 rounded bg-amber-500/20" />
            <div className="h-3 w-1/2 rounded bg-amber-500/10" />
          </div>

          {/* Fila precio esqueleto */}
          <div className="pt-2 flex items-center justify-between">
            <div className="h-5 w-16 rounded bg-amber-400/20" />
            <div className="h-8 w-24 rounded-full bg-amber-500/15" />
          </div>
        </div>
      ))}
    </div>
  );
}
