import { memo } from 'react';
import { MapPin, Clock, Phone, ExternalLink, Navigation } from 'lucide-react';
import { CLIENT_LOCATIONS } from '../data/mockData';

export const LocationsComponent = memo(() => {
  return (
    <div className="w-full py-4 md:py-8 h-full flex flex-col justify-center">
      <div className="text-center mb-10 md:mb-16">
        <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-[#FBAF40] font-black mb-3 px-5 py-2 rounded-full border border-[#FBAF40]/30 bg-[#FBAF40]/10 backdrop-blur-md shadow-[0_0_20px_rgba(251,176,64,0.1)]">Nuestra Presencia</span>
        <h2 className="text-4xl md:text-7xl font-display font-black text-white mb-4 drop-shadow-2xl uppercase tracking-tight">Nuestros Locales</h2>
        <p className="text-sm md:text-base text-gray-400 max-w-lg mx-auto leading-relaxed font-medium">Encuentra el calor de Siete Sopas en cualquiera de nuestras sedes.</p>
      </div>
      
      <div className="flex flex-col items-center gap-12 max-w-[1400px] mx-auto px-4 w-full">
        {CLIENT_LOCATIONS.map((loc, idx) => (
          <div key={loc.id} className={`glass-card rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row h-auto shadow-2xl hover:border-[#EE1D23]/40 group transition-all duration-700 hover:-translate-y-3 animate-fade-in stagger-${idx + 1} w-full`}>
            
            {/* Imagen del Local */}
            <div className="md:w-[45%] h-72 md:h-auto relative overflow-hidden bg-[#121214] shrink-0 min-h-[400px]">
              <img 
                src={loc.image} 
                alt={loc.name} 
                className="w-full h-full object-cover object-center transition-transform duration-[2s] group-hover:scale-105 opacity-80 group-hover:opacity-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#08080A] via-[#08080A]/30 to-transparent"></div>
              
              {/* Badge Estado */}
              <div className="absolute top-6 left-6 md:left-auto md:right-6">
                <span className="flex items-center text-[10px] font-black text-[#00E676] bg-[#00E676]/10 px-4 py-2 rounded-xl border border-[#00E676]/20 backdrop-blur-md shadow-2xl">
                  <div className="w-2 h-2 rounded-full bg-[#00E676] mr-2 animate-pulse"></div>
                  {loc.status}
                </span>
              </div>
            </div>

            <div className="p-8 md:p-12 md:w-[55%] flex flex-col relative z-20">
              <h3 className="text-4xl font-display font-black text-white uppercase tracking-tight mb-8 group-hover:text-[#EE1D23] transition-colors drop-shadow-lg leading-none">{loc.name}</h3>
              
              <div className="space-y-4 mb-10 flex-1">
                <div className="flex items-center space-x-4 text-gray-300 text-sm xl:text-base glass-light p-4 rounded-2xl border border-white/5 group-hover:border-[#EE1D23]/20 transition-all duration-500">
                  <MapPin size={18} className="text-[#EE1D23] shrink-0" />
                  <span className="truncate font-medium">{loc.address}</span>
                </div>
                
                <div className="flex items-center space-x-4 text-gray-300 text-sm xl:text-base glass-light p-4 rounded-2xl border border-white/5">
                  <Clock size={18} className="text-[#EE1D23] shrink-0" />
                  <span className="truncate font-medium">{loc.hours}</span>
                </div>

                <div className="flex items-center space-x-4 text-gray-300 text-sm xl:text-base glass-light p-4 rounded-2xl border border-white/5">
                  <Phone size={18} className="text-[#EE1D23] shrink-0" />
                  <span className="truncate font-medium">{loc.phone}</span>
                </div>
              </div>

              {/* Acciones Rápidas */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <a 
                  href={loc.googleLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 py-4 rounded-2xl bg-[#EE1D23] hover:bg-[#D4141A] text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                >
                  <Navigation size={14} />
                  <span>Cómo llegar</span>
                </a>
                <a 
                  href={`tel:${loc.phone.replace(/\s/g, '')}`}
                  className="flex items-center justify-center space-x-2 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
                >
                  <Phone size={14} />
                  <span>Llamar</span>
                </a>
              </div>
              
              <div className="w-full h-40 rounded-2xl overflow-hidden border border-white/10 relative mt-auto">
                <iframe 
                  src={loc.mapUrl} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="opacity-40 group-hover:opacity-100 transition-opacity duration-1000 grayscale hover:grayscale-0 scale-110 group-hover:scale-100 transition-transform"
                ></iframe>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
