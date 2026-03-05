import { Users, EyeOff, Eye } from 'lucide-react';

export const ClientLoginView = ({ authMode, setAuthMode, handleAuth, isAuthLoading, showPassword, setShowPassword }) => {
  return (
    <div className="w-full animate-fade-in py-8 flex justify-center">
      <div className="glass-card p-8 rounded-3xl shadow-2xl max-w-md w-full animate-scale-in">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EE1D23] to-[#A68B67] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#EE1D23]/20">
            <Users size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-display font-black text-white">{authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
          <p className="text-xs text-gray-500 mt-1">{authMode === 'login' ? 'Accede a tu cuenta para ordenar' : 'Regístrate para hacer tus pedidos'}</p>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-4">
          {authMode === 'register' && (
            <div>
              <label htmlFor="login-name" className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Nombre completo</label>
              <input id="login-name" name="name" type="text" required placeholder="Ej. María García" className="w-full bg-white/[0.03] border border-white/10 text-gray-100 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[#EE1D23]/40 focus:ring-2 focus:ring-[#EE1D23]/10 transition-all placeholder-gray-600 text-sm" />
            </div>
          )}
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Correo electrónico</label>
            <input id="login-email" name="email" type="email" required placeholder="tu@correo.com" className="w-full bg-white/[0.03] border border-white/10 text-gray-100 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[#EE1D23]/40 focus:ring-2 focus:ring-[#EE1D23]/10 transition-all placeholder-gray-600 text-sm" />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Contraseña</label>
            <div className="relative">
              <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} required placeholder="••••••••" minLength="6" className="w-full bg-white/[0.03] border border-white/10 text-gray-100 rounded-2xl px-5 py-3.5 pr-12 focus:outline-none focus:border-[#EE1D23]/40 focus:ring-2 focus:ring-[#EE1D23]/10 transition-all placeholder-gray-600 text-sm" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={isAuthLoading} className="w-full bg-gradient-to-r from-[#EE1D23] via-[#EE1D23] to-[#EE1D23] hover:from-[#f14a4f] hover:to-[#EE1D23] text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-[#EE1D23]/25 hover:shadow-[#EE1D23]/40 hover:-translate-y-0.5 text-sm uppercase tracking-wider mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {isAuthLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Procesando...
              </div>
            ) : (
              authMode === 'login' ? 'Ingresar' : 'Crear Cuenta'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-xs text-gray-500 hover:text-[#EE1D23] transition-colors">
            {authMode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};
