import { useState, useEffect } from 'react';
import { CheckCircle2, Users } from 'lucide-react';

export const ClientHomeView = ({ myTicket, queue, handleJoinQueue, setShowCancelModal, clearTicket }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (myTicket && myTicket.waitTime) {
// ... (rest of the timer logic)
    }
  }, [myTicket]);

// ... (formatTime function)

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] w-full overflow-hidden relative">
      
      {/* 1. HERO SECTION (Fachada Full Width) */}
      <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden border-b border-white/5 shadow-2xl">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60 transform transition-transform duration-700 ease-out"
          style={{ 
            backgroundImage: "url('/images/siete_sopas/fachada.png')",
            transform: `translateY(${scrollY * 0.3}px) scale(1.1)`
          }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/60 to-transparent"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/60 via-black/20 to-black/60"></div>

        <div className="relative z-10 space-y-6 animate-fade-in text-center px-5 max-w-4xl mx-auto mt-10 md:mt-20">
          <span className="inline-block text-[11px] uppercase tracking-[0.3em] text-[#FBAF40] font-bold mb-2 px-4 py-1.5 rounded-full border border-[#FBAF40]/30 bg-[#FBAF40]/10 backdrop-blur-md shadow-[0_0_15px_rgba(251,176,64,0.15)]">
            Restaurante desde 1995
          </span>
          <h1 className="text-5xl md:text-8xl font-display font-black tracking-tight text-white leading-[1.05] drop-shadow-2xl">
            La tradición <br className="hidden md:block"/>que <span className="gradient-text italic">reconforta.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-md">
            Únete a nuestra cola virtual desde donde estés. Te avisaremos en tiempo real cuando tu mesa esté lista.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm font-medium pt-4">
            <span className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md text-gray-200 shadow-xl"><CheckCircle2 size={18} className="text-[#008248] mr-2"/>Sabor que une familias</span>
            <span className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md text-gray-200 shadow-xl"><CheckCircle2 size={18} className="text-[#EE1D23] mr-2"/>Tradición en cada bocado</span>
          </div>
        </div>
      </div>

      {/* 2. TICKET QUEUE SECTION (Centro) & DECORACIONES LATERAALES */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center px-5 py-12 md:py-20 lg:py-24 max-w-7xl mx-auto">
        
        {/* Tarjeta Central de la Cola (Z-index superior para interacción) */}
        <div className="relative z-20 w-full max-w-md glass-card p-8 md:p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 animate-scale-in">
          
          {/* Luz de acento detrás de la tarjeta */}
          <div className="absolute -inset-0.5 bg-gradient-to-b from-red-500/20 to-transparent rounded-[2rem] blur-xl opacity-50 -z-10 pointer-events-none"></div>

          {!myTicket ? (
            <>
              <div className="flex flex-col items-center text-center space-y-4 mb-8">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#EE1D23] to-[#A68B67] border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(238,29,35,0.3)] animate-glow-pulse">
                  <Users size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-black text-white">Cola Virtual</h3>
                  {queue.length === 0 ? (
                    <p className="text-sm text-green-400 mt-1 font-medium bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 inline-block">¡Pasas directo ahora mismo!</p>
                  ) : (
                    <p className="text-sm text-gray-400 mt-1">Hay <span className="text-red-400 font-bold px-1">{queue.length} grupos</span> en espera</p>
                  )}
                </div>
              </div>
              
              <form onSubmit={handleJoinQueue} className="space-y-5">
                <div>
                  <label htmlFor="customerName" className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-widest pl-1">Nombre para llamarte</label>
                  <input 
                    id="customerName" name="customerName" type="text" required
                    placeholder="Ej. Familia Quispe" 
                    className="w-full bg-black/40 border border-white/10 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10 transition-all placeholder-gray-600 text-sm shadow-inner"
                  />
                </div>
                <div>
                  <label htmlFor="partySize" className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-widest pl-1">Personas en tu grupo</label>
                  <input 
                    id="partySize" name="partySize" type="number" min="1" max="12" required
                    placeholder="¿Cuántos son?" 
                    className="w-full bg-black/40 border border-white/10 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-[#EE1D23]/50 focus:ring-4 focus:ring-[#EE1D23]/10 transition-all placeholder-gray-600 text-sm shadow-inner"
                  />
                </div>
                <button type="submit" className="w-full bg-gradient-to-b from-[#EE1D23] to-[#8B1115] hover:from-[#f14a4f] hover:to-[#EE1D23] text-white font-black py-4 px-4 rounded-2xl transition-all shadow-[0_10px_30px_rgba(238,29,35,0.2)] hover:shadow-[0_15px_40px_rgba(238,29,35,0.4)] hover:-translate-y-1 mt-6 text-sm uppercase tracking-[0.2em] relative overflow-hidden group">
                  <span className="relative z-10">Obtener mi ticket</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                </button>
              </form>
            </>
          ) : myTicket?.status === 'ASIGNADO' ? (
            <div className="text-center space-y-6 animate-fade-in py-4">
              <div className="w-28 h-28 bg-gradient-to-br from-green-500 to-teal-600 p-[3px] rounded-full mx-auto animate-float shadow-[0_0_60px_rgba(16,185,129,0.3)] duration-700">
                <div className="w-full h-full bg-[#08080A] rounded-full flex items-center justify-center">
                    <CheckCircle2 size={56} className="text-green-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                </div>
              </div>
              <h2 className="text-4xl font-display font-black text-white mt-6 mb-2">¡Mesa Lista!</h2>
              <p className="text-lg text-gray-400 mb-10 leading-relaxed px-4">
                Por favor acércate al anfitrión. <br/><span className="font-bold text-white">¡Disfruta Siete Sopas!</span>
              </p>
              <button 
                onClick={clearTicket}
                className="w-full border-2 border-white/10 hover:border-white/30 text-white font-bold py-4 px-4 rounded-2xl transition-all hover:bg-white/5 mt-2 text-sm uppercase tracking-widest"
              >
                Finalizar visita
              </button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-900/40 border border-red-500/30 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(220,38,38,0.2)] animate-glow-pulse">
                <Users size={32} className="text-red-400" />
              </div>
              <h2 className="text-2xl font-display font-black text-white tracking-wide">¡Estás en la cola!</h2>
              
              <div className="bg-black/60 border border-white/10 rounded-2xl p-6 flex justify-around shadow-inner mt-6 mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 pointer-events-none"></div>
                <div className="flex flex-col items-center relative z-10">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2">Tu Turno</span>
                  <span className="text-5xl font-black text-white drop-shadow-md">#{queue.findIndex(q => q.id === myTicket.id) + 1}</span>
                </div>
                <div className="w-px bg-white/10 relative z-10"></div>
                <div className="flex flex-col items-center relative z-10">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2">Espera aprox.</span>
                  <span className={`text-4xl sm:text-5xl font-black drop-shadow-md ${timeLeft === 0 ? 'text-green-400 animate-pulse' : 'text-red-400'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-sm text-gray-400 leading-relaxed">
                  {timeLeft === 0 ? (
                    <span className="text-green-400 font-bold">¡Ya es tu turno! Acércate a la puerta 🙌</span>
                  ) : (
                    <>Al turno de: <span className="font-bold text-white bg-white/10 px-3 py-1 rounded-lg ml-1">{myTicket.name}</span></>
                  )}
                </p>
              </div>
              
              <button 
                onClick={() => setShowCancelModal(true)}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors underline decoration-gray-700 hover:decoration-red-400/50 underline-offset-4 mt-6 inline-block uppercase tracking-wider font-semibold"
              >
                Abandonar la cola
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
