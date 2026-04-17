import { LogOut, ShoppingCart } from 'lucide-react';

export const ClientNavbar = ({ clientView, setClientView, currentUser, cartCount, showCart, setShowCart, handleLogout }) => {
  return (
    <>
      <header className="h-20 glass border-b border-white/5 flex items-center justify-between px-5 md:px-10 sticky top-0 z-50">
      <div
        className="flex items-center space-x-4 cursor-pointer group"
        role="button"
        tabIndex={0}
        onClick={() => setClientView('home')}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setClientView('home'); }}
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-tr from-[#EE1D23] via-[#FBAF40] to-[#008248] rounded-full blur-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 bg-white flex items-center justify-center p-1.5 backdrop-blur-md shadow-2xl">
            <img src="/images/siete_sopas/Logo.png" alt="Logo" className="w-full h-full object-contain rounded-full transform group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl md:text-3xl font-brand font-bold text-white tracking-tight leading-none">Siete Sopas</span>
          <span className="hidden md:block text-[9px] text-[#EE1D23] uppercase tracking-[0.4em] font-black mt-1 ml-0.5">Tradición Peruana</span>
        </div>
      </div>
      <nav className="hidden md:flex items-center space-x-0.5 lg:space-x-1">
        {[
          {id:'home',label:'Inicio'},
          {id:'menu',label:'Menú'},
          {id:'locations',label:'Locales'},
          ...(currentUser && currentUser.rol === 'CLIENTE' ? [{id:'history',label:'Mis Pedidos'}] : [])
        ].map(item => (
          <button key={item.id} onClick={() => setClientView(item.id)} className={`relative px-3 lg:px-6 py-2 lg:py-2.5 rounded-full text-xs lg:text-sm font-semibold transition-all duration-300 ${clientView === item.id ? 'text-[#EE1D23] bg-[#EE1D23]/10 shadow-[inset_0_0_20px_rgba(238,29,35,0.05)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            {item.label}
            {clientView === item.id && <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#EE1D23] rounded-full shadow-[0_0_10px_#EE1D23]"></div>}
          </button>
        ))}
      </nav>
      <div className="flex items-center space-x-3">        {currentUser ? (
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3 pl-1 lg:pl-2">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Bienvenido</span>
              <span className="text-sm text-white font-bold leading-none">{currentUser.name}</span>
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-[#EE1D23] transition-all p-2 rounded-full hover:bg-[#EE1D23]/5 border border-transparent hover:border-[#EE1D23]/20">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button onClick={() => setClientView('login')} className="hidden md:flex text-[10px] lg:text-[11px] font-bold text-white items-center transition-all px-3 lg:px-6 py-2 lg:py-2.5 rounded-full bg-gradient-to-r from-white/5 to-white/10 hover:from-[#EE1D23]/20 hover:to-[#EE1D23]/10 border border-white/10 hover:border-[#EE1D23]/40 uppercase tracking-widest shadow-xl backdrop-blur-md">
            Iniciar Sesión
          </button>
        )}
      </div>
    </header>

      {/* Floating Cart Button Rendered outside the header to avoid backdrop-filter trapping 'fixed' position */}
      {cartCount > 0 && !showCart && (
        <button 
          onClick={() => setShowCart(true)} 
          className="fixed bottom-8 right-8 z-[100] p-4 rounded-full text-white transition-all border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] hover:scale-110 flex items-center justify-center animate-in slide-in-from-bottom-5 fade-in duration-300 glass"
          style={{ backgroundColor: 'rgba(18, 18, 20, 0.9)', backdropFilter: 'blur(10px)' }}
        >
          <ShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#EE1D23] text-white text-xs font-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(238,29,35,0.6)] border-2 border-[#121214]">
            {cartCount}
          </span>
        </button>
      )}
    </>
  );
};
