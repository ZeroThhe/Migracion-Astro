import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Sesión del usuario. `persist` la guarda en localStorage para que sobreviva al recargar. */
export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      setSession: (token, usuario) => set({ token, usuario }),
      logout: () => set({ token: null, usuario: null }),
    }),
    { name: 'facc-auth' }
  )
);