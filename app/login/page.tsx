'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: any) {
      console.error('Error signing in:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No existe una cuenta con este correo.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Credenciales inválidas. Verifica tu correo y contraseña.');
      } else {
        setError('Error al iniciar sesión. Inténtelo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: any) {
      console.error('Error creating account:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Ya existe una cuenta con este correo.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña es muy débil. Usa al menos 6 caracteres.');
      } else if (err.code === 'auth/invalid-email') {
        setError('El correo electrónico no es válido.');
      } else {
        setError('Error al crear la cuenta. Inténtelo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (err: any) {
      console.error('Error signing in with Google:', err);
      setError('Error al iniciar sesión con Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex flex-col justify-center px-4 py-8">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <span className="text-white text-3xl font-black tracking-tighter">POS</span>
          </div>
        </div>
        <h2 className="text-center text-3xl font-black text-white mb-1">
          {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h2>
        <p className="text-center text-sm text-blue-200/60 mb-8">
          {isRegistering ? 'Registra tu negocio en el sistema POS' : 'Accede al sistema de punto de venta'}
        </p>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl py-8 px-6 rounded-3xl shadow-2xl border border-white/10">
          <form className="space-y-5" onSubmit={isRegistering ? handleRegister : handleEmailLogin}>
            <div>
              <label className="block text-sm font-semibold text-blue-100 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-blue-300/50" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 text-base bg-white/10 border border-white/10 rounded-2xl text-white placeholder-blue-300/40 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white/15 transition-all duration-200"
                  placeholder="usuario@ejemplo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-100 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-300/50" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 text-base bg-white/10 border border-white/10 rounded-2xl text-white placeholder-blue-300/40 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white/15 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isRegistering && (
              <div>
                <label className="block text-sm font-semibold text-blue-100 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-300/50" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 text-base bg-white/10 border border-white/10 rounded-2xl text-white placeholder-blue-300/40 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white/15 transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-300 text-sm text-center bg-red-500/20 py-3 px-4 rounded-2xl border border-red-400/20">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-300 text-sm text-center bg-green-500/20 py-3 px-4 rounded-2xl border border-green-400/20">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-4 px-6 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-blue-500/25 active:scale-[0.98] min-h-[56px]"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isRegistering ? (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Crear Cuenta
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Ingresar
                </>
              )}
            </button>
          </form>

          {/* Toggle between login and register */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setSuccess('');
                setConfirmPassword('');
              }}
              className="text-blue-300/80 hover:text-blue-200 text-sm font-medium transition-colors min-h-[44px] px-4 py-2"
            >
              {isRegistering
                ? '¿Ya tienes cuenta? Inicia sesión'
                : '¿No tienes cuenta? Crear una cuenta'}
            </button>
          </div>

          {/* Divider */}
          <div className="mt-5 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-transparent text-blue-300/40 text-xs uppercase tracking-wider">
                O continuar con
              </span>
            </div>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex justify-center items-center py-4 px-6 border border-white/10 rounded-2xl bg-white/5 text-sm font-semibold text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 active:scale-[0.98] min-h-[56px]"
            >
              <img className="h-5 w-5 mr-3" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" />
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
