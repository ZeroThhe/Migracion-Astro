import React, { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { fetchGraphQL, MUTATIONS, QUERIES, loginOAuth2 } from '../graphql/client';
import { useAuthStore } from '../store/useAuthStore';
import { useFlowStore } from '../store/useFlowStore';

export default function AuthView() {
  const [modo, setModo] = useState('login'); // 'login' | 'registro'
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const setSession = useAuthStore((s) => s.setSession);
  const loginExitoso = useFlowStore((s) => s.loginExitoso);

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (modo === 'login') {
        // Flujo OAuth2 Password: el token se pide en /token (REST, no GraphQL)
        const tokenData = await loginOAuth2(form.email, form.password);
        setSession(tokenData.access_token, null);     // guarda el token primero...
        const data = await fetchGraphQL(QUERIES.ME);   // ...para poder pedir el perfil con él
        setSession(tokenData.access_token, data.me);
      } else {
        // El registro de cuentas no es parte del spec OAuth2, sigue siendo GraphQL
        await fetchGraphQL(MUTATIONS.REGISTRO, { datos: form });
        // Tras registrar, inicia sesión automáticamente con las mismas credenciales
        const tokenData = await loginOAuth2(form.email, form.password);
        setSession(tokenData.access_token, null);
        const data = await fetchGraphQL(QUERIES.ME);
        setSession(tokenData.access_token, data.me);
      }
      loginExitoso();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30">
        <h2 className="font-serif-poster text-xl font-bold text-amber-100 mb-6 flex items-center gap-2">
          {modo === 'login' ? <LogIn className="h-5 w-5 text-amber-400" /> : <UserPlus className="h-5 w-5 text-amber-400" />}
          {modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </h2>

        <form onSubmit={enviar} className="space-y-4">
          {modo === 'registro' && (
            <input required placeholder="Nombre completo" value={form.nombre}
              onChange={cambiar('nombre')} className="w-full rounded-full glass-input px-4 py-2 text-xs" />
          )}
          <input required type="email" placeholder="Correo" value={form.email}
            onChange={cambiar('email')} className="w-full rounded-full glass-input px-4 py-2 text-xs" />
          <input required type="password" minLength={6} placeholder="Contraseña (mínimo 6)" value={form.password}
            onChange={cambiar('password')} className="w-full rounded-full glass-input px-4 py-2 text-xs" />

          {error && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">{error}</div>
          )}

          <button type="submit" disabled={loading}
            className="w-full glass-btn-pink rounded-full py-3 text-xs font-bold uppercase tracking-wider">
            {loading ? 'Procesando...' : modo === 'login' ? 'Entrar' : 'Registrarme'}
          </button>
        </form>

        <button onClick={() => { setModo(modo === 'login' ? 'registro' : 'login'); setError(null); }}
          className="mt-4 w-full text-center text-xs text-amber-300 hover:underline">
          {modo === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
}