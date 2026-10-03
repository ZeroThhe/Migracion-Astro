# FACC Music — migrado a Astro (Opción A)

Este proyecto es tu frontend de FACC Music migrado a **Astro**, manteniendo
el backend **FastAPI + Strawberry GraphQL** tal como estaba (Opción A: no
se tocó la lógica del servidor, solo cómo el frontend lo consume).

## Cómo funciona

- `src/pages/index.astro` es la única página Astro. Ahí se monta tu app de
  React completa como una **isla interactiva** (`<App client:load />`).
- Todo tu código React original (componentes, vistas, stores de Zustand,
  cliente GraphQL) vive sin cambios dentro de `src/react/`.
- Como tu app original navega con una **máquina de estados** (Zustand,
  sin URLs reales por vista), se mantuvo exactamente así dentro de la isla
  — cambiar eso a rutas reales de Astro (`/carrito`, `/checkout`, etc.)
  sería un proyecto de refactor aparte, no una simple migración.

## Cómo correrlo

**1. Backend (sin cambios de lógica, solo CORS actualizado):**
```bash
cd back
pip install -r requirements.txt
python main.py
```
Esto deja el servidor corriendo en `http://localhost:8000`.

**2. Frontend Astro:**
```bash
npm install
npm run dev
```
Esto corre en `http://localhost:4321` (puerto por defecto de Astro).

> Importante: se actualizó `back/main.py` para aceptar peticiones desde
> `http://localhost:4321` (antes solo aceptaba `5173`, el puerto de Vite).
> Si ves errores de CORS en la consola del navegador, confirma que el
> backend esté corriendo la versión actualizada de `main.py`.

**3. Build de producción:**
```bash
npm run build
npm run preview
```

## Qué se conservó igual

- Toda la lógica de negocio: carrito (`useCartStore`), sesión
  (`useAuthStore`, persistida en localStorage), navegación
  (`useFlowStore`), y las queries/mutations GraphQL.
- El diseño visual completo (Tailwind, fuentes de Google, animaciones
  Aurora, Glassmorphism).
- El modal de producto con React Portal (`#modal-portal`).

## Siguiente paso opcional

Si más adelante quieres aprovechar más a Astro (páginas estáticas reales
por categoría/producto, mejor SEO, carga inicial más rápida), el
siguiente paso sería convertir la máquina de estados de `useFlowStore` en
rutas reales de Astro (`src/pages/producto/[id].astro`, etc.) y dejar
solo el carrito/checkout/login como islas pequeñas — pero eso es un
trabajo de refactor más grande, no fue lo que se pidió aquí.
