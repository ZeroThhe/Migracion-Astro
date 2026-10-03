import React from 'react';
import { Disc, Sparkles, Flame, ShieldCheck, Truck, Headphones } from 'lucide-react';
import { useFlowStore } from '../store/useFlowStore';

/**
 * BentoHero — Encabezado Principal en Bento Grid (Sección 5.3)
 * Aplica el estilo visual Póster con mezcla de tipografías (Playfair + Syne + Cursiva script),
 * paleta Café/Amarillo/Rosa, efecto Aurora y Bento Grid estructurado.
 */
export default function BentoHero() {
  const { irAlHome } = useFlowStore();

  return (
    <section className="mb-10 grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* 1. Tarjeta Principal del Bento Grid (Póster Hero de Impacto) */}
      <div className="md:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between min-h-[340px] border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-amber-900/20 to-rose-950/30">
        
        {/* Glow animado de fondo */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-rose-500/15 blur-3xl" />

        {/* Header Tag */}
        <div className="relative z-10 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Colección Audiófila 2026</span>
          </span>
        </div>

        {/* Título Estilo Póster con Mezcla de Tipografías (Petición Específica del Usuario) */}
        <div className="relative z-10 my-4 space-y-1">
          <p className="font-script text-3xl sm:text-4xl text-pink-400 font-bold leading-none tracking-wide drop-shadow-sm">
            La experiencia pura del sonido en
          </p>
          <h1 className="font-poster text-4xl sm:text-6xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 leading-none">
            VINILOS & CDS
          </h1>
          <h2 className="font-serif-poster text-2xl sm:text-3xl font-normal italic text-amber-100/90 leading-tight">
            Ediciones Especiales & Remasterizaciones de Colección
          </h2>
        </div>

        {/* Footer del Banner */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-amber-500/15">
          <p className="text-xs text-amber-200/70 max-w-md font-medium">
            Catálogo completo alimentado en tiempo real desde nuestro servidor GraphQL de <span className="text-amber-300 font-bold">FACC Music</span>.
          </p>
          <button 
            onClick={irAlHome}
            className="glass-btn-primary rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <span>Explorar Álbumes</span>
            <Flame className="h-4 w-4 text-amber-950" />
          </button>
        </div>

        {/* Disco de Vinilo Animado Interactivo */}
        <div className="absolute right-4 bottom-4 opacity-25 md:opacity-40 pointer-events-none">
          <Disc className="h-48 w-48 text-amber-400 vinyl-spin" />
        </div>
      </div>

      {/* 2. Tarjeta Lateral Bento: Novedades del Mes */}
      <div className="md:col-span-4 glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between border border-pink-500/25 bg-gradient-to-br from-rose-950/40 to-amber-950/30">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="rounded-full bg-pink-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-pink-300 border border-pink-500/30">
              Hot Release
            </span>
            <Flame className="h-5 w-5 text-rose-400" />
          </div>

          <h3 className="font-serif-poster text-2xl font-bold text-amber-100 leading-snug">
            Pink Floyd — <span className="italic font-normal text-pink-300">The Dark Side</span>
          </h3>
          <p className="mt-2 text-xs text-amber-200/60 leading-relaxed">
            Edición Remasterizada de 180g en acetato transparente. Stock limitado disponible.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="font-poster text-xl font-extrabold text-amber-300">$950.00 MXN</span>
          <span className="text-[11px] font-semibold text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20">
            Envío Gratis
          </span>
        </div>
      </div>

      {/* 3. Fila Inferior Bento: Beneficios (3 Minicajas) */}
      <div className="md:col-span-4 glass-panel rounded-2xl p-4 flex items-center gap-3.5 border border-amber-500/15">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
          <Truck className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-poster text-xs font-bold uppercase tracking-wide text-amber-200">Envío Protegido</h4>
          <p className="text-[11px] text-amber-200/60">Cajas antishock para acetatos</p>
        </div>
      </div>

      <div className="md:col-span-4 glass-panel rounded-2xl p-4 flex items-center gap-3.5 border border-amber-500/15">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/15 text-pink-400">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-poster text-xs font-bold uppercase tracking-wide text-amber-200">100% Originales</h4>
          <p className="text-[11px] text-amber-200/60">Prensados con licencia oficial</p>
        </div>
      </div>

      <div className="md:col-span-4 glass-panel rounded-2xl p-4 flex items-center gap-3.5 border border-amber-500/15">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
          <Headphones className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-poster text-xs font-bold uppercase tracking-wide text-amber-200">Calidad Audiófila</h4>
          <p className="text-[11px] text-amber-200/60">Máxima fidelidad sonora</p>
        </div>
      </div>
    </section>
  );
}
