import React from 'react';
import { Disc, Heart } from 'lucide-react';

/**
 * Footer — Pie del Layout (Sección 5.3)
 */
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-amber-500/20 glass-panel py-8 px-4 text-center">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Disc className="h-5 w-5 text-amber-400 vinyl-spin" />
          <span className="font-poster text-lg font-extrabold text-amber-400 tracking-wider">FACC MUSIC</span>
          <span className="font-script text-xl text-pink-400 font-bold">Boutique</span>
        </div>

        <p className="text-xs text-amber-200/60 max-w-xl mx-auto leading-relaxed">
          E-Commerce completo desarrollado para la materia de <strong className="text-amber-200">Programación Web 2 (PWII)</strong>. Integración de Maquetado React + Servidor GraphQL.
        </p>

        <div className="pt-4 border-t border-amber-500/10 text-[11px] text-amber-200/50 flex flex-wrap items-center justify-between gap-2 max-w-5xl mx-auto">
          <span>Alumna: <strong>Fátima Martín del Campo Castellanos</strong> (Reg: 22300884)</span>
          <span>Profesor: <strong>Kegovc</strong></span>
          <span>© 2026 FACC Music — Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  );
}
