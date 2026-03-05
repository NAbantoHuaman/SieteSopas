import { Heart, Instagram, Facebook, Clock, Phone, Mail } from 'lucide-react';

export const ClientFooter = ({ setClientView }) => {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#08080A] pt-16 pb-8 hidden md:block overflow-hidden">
      {/* Luz de fondo sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#EE1D23]/30 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto px-8">
        {/* 1. SECCIÓN PORTAL (Logo Centrado) */}
        <div className="flex flex-col items-center mb-16 animate-fade-in">
          <div className="relative group cursor-pointer mb-6">
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#EE1D23] via-[#FBAF40] to-[#008248] rounded-full blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-700"></div>
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 bg-white flex items-center justify-center p-2 backdrop-blur-md shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
              <img src="/images/siete_sopas/Logo.png" alt="Logo" className="w-full h-full object-contain rounded-full" />
            </div>
          </div>
          <h3 className="text-4xl font-brand font-black text-white tracking-widest mb-2">SIETE SOPAS</h3>
          <div className="flex items-center space-x-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-600/50"></div>
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#EE1D23] font-black">Tradición Peruana</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-600/50"></div>
          </div>
        </div>

        {/* 2. GRID DE INFORMACIÓN */}
        <div className="grid grid-cols-4 gap-12 border-t border-white/5 pt-12">
          
          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">La Casa</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">Desde 1995, serviendo las mejores sopas del Perú con el corazón en cada cucharada.</p>
            <div className="flex space-x-3 pt-2">
              <button className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#EE1D23] hover:border-[#EE1D23] transition-all duration-300 shadow-lg">
                <Instagram size={16} />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#344b8a] hover:border-[#344b8a] transition-all duration-300 shadow-lg">
                <Facebook size={16} />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-5">Explora</h4>
            <ul className="space-y-3">
              {[{label:'Inicio',view:'home'},{label:'Nuestra Carta',view:'menu'},{label:'Nuestros Locales',view:'locations'}].map(item => (
                <li key={item.view}>
                  <button 
                    onClick={() => setClientView(item.view)} 
                    className="text-xs text-gray-500 hover:text-[#EE1D23] transition-colors flex items-center group font-medium"
                  >
                    <div className="w-1.5 h-1.5 bg-[#EE1D23] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-5">Atención</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-gray-500">
                <Clock size={16} className="text-[#EE1D23] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Siempre Abierto</p>
                  <p className="text-[11px] mt-1 leading-relaxed">Lunes a Domingo<br/>24 Horas del Día</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-5">Hablemos</h4>
            <ul className="space-y-4">
              <li className="flex items-center text-xs text-gray-500 font-medium">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 border border-white/5">
                  <Phone size={14} className="text-[#EE1D23]" />
                </div>
                (01) 555-0199
              </li>
              <li className="flex items-center text-xs text-gray-500 font-medium">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 border border-white/5">
                  <Mail size={14} className="text-[#EE1D23]" />
                </div>
                hola@sietesopas.pe
              </li>
            </ul>
          </div>

        </div>

        {/* 3. COPYRIGHT */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-600 font-medium tracking-wide">© 2026 SIETE SOPAS EMPRESA LÍDER. TODOS LOS DERECHOS RESERVADOS.</p>
          <div className="flex items-center space-x-6">
             <button className="text-[10px] text-gray-600 hover:text-white transition-colors uppercase tracking-widest font-bold">Privacidad</button>
             <button className="text-[10px] text-gray-600 hover:text-white transition-colors uppercase tracking-widest font-bold">Términos</button>
             <p className="text-[10px] text-gray-600 flex items-center ml-4">
               Hecho con <Heart size={10} className="text-[#EE1D23] mx-1.5 animate-pulse" /> por SIGEPAM
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
