import React, { useState, useEffect, useTransition, useCallback } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import ContextBar from './components/ContextBar';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import HomeView from './views/HomeView';
import CategoryView from './views/CategoryView';
import ProductDetailView from './views/ProductDetailView';
import CartView from './views/CartView';
import CheckoutView from './views/CheckoutView';
import OrderSuccessView from './views/OrderSuccessView';
import { fetchGraphQL, QUERIES } from './graphql/client';
import { useFlowStore, VIEWS } from './store/useFlowStore';
import AuthView from './views/AuthView';
import { useAuthStore } from './store/useAuthStore';

/**
 * App.jsx — Orquestador de la Máquina de Estados (Sección 5.2)
 * Aplica los 15 temas de React de la guía Vite (Hooks, useTransition, Fetching, Zustand, Portales, etc.)
 */
export default function App() {
  const { currentView, selectedCategory, elegirCategoria } = useFlowStore();

  // Estados Locales (Tema 2: Hooks)
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useTransition para cambios de estado fluidos sin congelar la UI (Tema 13)
  const [isPending, startTransition] = useTransition();

  // Sesión del usuario (OAuth2 / JWT)
  const { token, logout } = useAuthStore();

  // Si hay un token guardado, valida que siga vivo contra el backend
  useEffect(() => {
    if (!token) return;
    fetchGraphQL(QUERIES.ME)
      .then((d) => { if (!d.me) logout(); })
      .catch(() => {}); // si el servidor está caído, no cerramos la sesión local
  }, [token, logout]);

  // Cargar Categorías desde GraphQL (Tema 7: Fetching)
  const cargarCategorias = useCallback(async () => {
    try {
      const data = await fetchGraphQL(QUERIES.GET_CATEGORIAS);
      if (data && data.categorias) {
        setCategorias(data.categorias);
      }
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  }, []);

  // Cargar Productos desde GraphQL (Tema 7: Fetching)
  const cargarProductos = useCallback(async (catId = null, busqueda = '') => {
    setLoading(true);
    setError(null);
    try {
      const variables = {
        limit: 30,
        offset: 0,
        categoriaId: catId ? parseInt(catId) : null,
        busqueda: busqueda || null,
      };
      const data = await fetchGraphQL(QUERIES.GET_PRODUCTOS, variables);
      if (data && data.productos) {
        startTransition(() => {
          setProductos(data.productos.productos);
        });
      }
    } catch (err) {
      console.error("Error cargando productos:", err);
      setError("No se pudo conectar al servidor GraphQL (http://localhost:8000/graphql).");
    } finally {
      setLoading(false);
    }
  }, [startTransition]);

  // Efecto Inicial al Montar Componente (Tema 2: useEffect)
  useEffect(() => {
    cargarCategorias();
    cargarProductos(selectedCategory?.id, searchQuery);
  }, [cargarCategorias, cargarProductos, selectedCategory, searchQuery]);

  // Manejo de Evento Custom al Elegir Categoría (Tema 5)
  const handleSelectCategory = (cat) => {
    elegirCategoria(cat);
  };

  // renderView — Decide qué template mostrar según el estado de la máquina de estados
  const renderView = () => {
    switch (currentView) {
      case VIEWS.HOME:
        return (
          <HomeView
            productos={productos}
            loading={loading || isPending}
            error={error}
            onRetry={() => cargarProductos(selectedCategory?.id, searchQuery)}
          />
        );
      case VIEWS.CATEGORY_DETAIL:
        return (
          <CategoryView
            categoria={selectedCategory}
            productos={productos}
            loading={loading || isPending}
            error={error}
            onRetry={() => cargarProductos(selectedCategory?.id, searchQuery)}
          />
        );
      case VIEWS.PRODUCT_DETAIL:
        return <ProductDetailView />;
      case VIEWS.CART:
        return <CartView />;
      case VIEWS.CHECKOUT:
        return <CheckoutView />;
      case VIEWS.ORDER_SUCCESS:
        return <OrderSuccessView />;
      case VIEWS.LOGIN:
        return <AuthView />;
      default:
        return <HomeView productos={productos} loading={loading} error={error} />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Fondos de Gradientes Animados Aurora UI */}
      <div className="aurora-container" aria-hidden="true">
        <div className="aurora-blob aurora-blob--coffee" />
        <div className="aurora-blob aurora-blob--yellow" />
        <div className="aurora-blob aurora-blob--pink" />
      </div>

      {/* TopBar Header Sticky (Sección 5.3) */}
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)} // Tema 4: Eventos HTML
      />

      {/* Contenido Principal con Layout Atómico (Sidebar + Main) */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 flex-1">
        <ContextBar />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar (visible en vistas de catálogo) */}
          {(currentView === VIEWS.HOME || currentView === VIEWS.CATEGORY_DETAIL) && (
            <Sidebar
              categorias={categorias}
              selectedCategoryId={selectedCategory?.id || null}
              onSelectCategory={handleSelectCategory} // Tema 5: Evento custom
            />
          )}

          {/* ÁREA PRINCIPAL (VISTA DINÁMICA DE LA MÁQUINA DE ESTADOS) */}
          <main className="flex-1 w-full min-w-0">
            {renderView()}
          </main>
        </div>
      </div>

      {/* Modal Portal Rápido de Producto (Tema 15: Portales) */}
      <ProductModal />

      {/* Pie de Página */}
      <Footer />
    </div>
  );
}