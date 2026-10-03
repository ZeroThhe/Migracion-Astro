import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * ErrorBanner — Manejo de Errores con Botón de Reintento (Sección 7.3)
 */
export default function ErrorBanner({ mensaje, onRetry }) {
  return (
    <div className="glass-panel rounded-2xl p-6 text-center border border-rose-500/30 bg-rose-950/20 max-w-lg mx-auto my-8">
      <AlertTriangle className="h-10 w-10 text-rose-400 mx-auto mb-3" />
      <h3 className="font-serif-poster text-lg font-bold text-rose-200">
        No se pudieron cargar los datos
      </h3>
      <p className="mt-1 text-xs text-amber-200/70 leading-relaxed mb-4">
        {mensaje || "Verifica que el servidor GraphQL esté ejecutándose en http://localhost:8000/graphql"}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="glass-btn-pink rounded-full px-5 py-2 text-xs font-bold inline-flex items-center gap-2"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reintentar Conexión</span>
        </button>
      )}
    </div>
  );
}
