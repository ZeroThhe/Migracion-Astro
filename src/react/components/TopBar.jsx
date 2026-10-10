import React from 'react';
import { ShoppingBag, Disc, Search, Home, LogIn, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useFlowStore } from '../store/useFlowStore';
import { useAuthStore } from '../store/useAuthStore';

/**
 * TopBar — Encabezado principal del Layout (Sección 5.3)
 * Integra logo FACC Music, buscador controlado (Tema 4), badge del carrito (Tema 11)
 * y estado de sesión (login/logout).
 */
export default function TopBar({ searchQuery, onSearchChange }) {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { irAlHome, irAlCarrito, irALogin, currentView } = useFlowStore();
  const { usuario, logout } = useAuthStore();

  const cerrarSesion = () => {
    logout();
    irAlHome();
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-amber-500/20 px-4 py-3 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Brand Logo con Tipografía Poster */}
        <div 
          onClick={irAlHome}
          className="flex cursor-pointer items-center gap-3 group select-none"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#180D09]">
              <Disc className="h-6 w-6 text-amber-400 vinyl-spin" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-poster text-xl font-extrabold tracking-wider text-amber-400">FACC</span>
              <span className="font-script text-2xl text-pink-400 font-bold tracking-tight">Music</span>
            </div>
            <p className="text-[10px] tracking-widest text-amber-200/60 uppercase font-semibold">Vinyl & Audio Boutique</p>
          </div>
        </div>

        {/* Buscador de Discos Controlado (Tema 4: Eventos HTML) */}
        <div className="relative hidden md:block max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por álbum o artista (ej: Beatles, Daft Punk)..."
            className="w-full rounded-full glass-input py-2 pl-10 pr-4 text-sm placeholder:text-amber-200/40"
          />
        </div>

        {/* Acciones, Sesión & Contador del Carrito */}
        <div className="flex items-center gap-3">
          <button
            onClick={irAlHome}
            className={`hidden sm:flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              currentView === 'HOME'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                : 'text-amber-200/80 hover:bg-white/5'
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>Inicio</span>
          </button>

          {/* Acceso al panel solo para administradores */}
          {usuario?.rol === 'ADMIN' && (
            <a
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-pink-300 border border-pink-400/30 hover:bg-pink-500/10"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Admin</span>
            </a>
          )}

          {/* Estado de sesión */}
          {usuario ? (
            <div className="hidden sm:flex items-center gap-2 text-xs text-amber-200">
              <User className="h-4 w-4 text-amber-400" />
              <span className="font-semibold">{usuario.nombre.split(' ')[0]}</span>
              <button onClick={cerrarSesion} title="Cerrar sesión" className="rounded-full p-1.5 hover:bg-white/10">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => irALogin()}
              className="hidden sm:flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-amber-200/80 hover:bg-white/5"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Ingresar</span>
            </button>
          )}

          {/* Botón Carrito */}
          <button
            onClick={irAlCarrito}
            className="relative flex items-center gap-2 rounded-full glass-btn-primary px-4 py-2 text-xs font-bold uppercase tracking-wider"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Mi Carrito</span>
            {totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-black text-white shadow-md animate-bounce">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}