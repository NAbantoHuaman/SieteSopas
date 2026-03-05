import { memo, useState, useMemo, useRef } from 'react';
import { Plus } from 'lucide-react';

export const MenuComponent = memo(({ menu, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState("Todas");
  const bookRef = useRef(null);

  // Extraer categorías únicas
  const categories = useMemo(() => {
    const list = menu.map(m => m.categoria).filter(Boolean);
    return ["Todas", ...new Set(list)];
  }, [menu]);

  // Filtrar el menú
  const filteredMenu = useMemo(() => {
    if (activeCategory === "Todas") return menu;
    return menu.filter(m => m.categoria === activeCategory);
  }, [menu, activeCategory]);

  const scrollToCategory = (cat) => {
    setActiveCategory(cat);
    const element = document.getElementById('order-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full py-4 md:py-8 h-full flex flex-col justify-start">
      <div className="text-center mb-8 md:mb-12">
        <span className="inline-block text-[11px] uppercase tracking-[0.25em] text-[#FBAF40] font-bold mb-3 px-4 py-1.5 rounded-full border border-[#FBAF40]/30 bg-[#FBAF40]/10 backdrop-blur-md shadow-[0_0_15px_rgba(251,176,64,0.15)]">Nuestra Esencia</span>
        <h2 className="text-4xl md:text-7xl font-display font-black text-white mb-4 drop-shadow-2xl">La Carta Oficial</h2>
        <p className="text-sm md:text-base text-gray-400 max-w-lg mx-auto leading-relaxed font-medium">Explora nuestra carta oficial y descubre los sabores que reconfortan el alma.</p>
      </div>

      {/* --- SECCIÓN 1: Carta Oficial (Full Display) --- */}
      <div className="flex flex-col items-center justify-center w-full mb-20 animate-fade-in relative px-2">
        <div className="absolute inset-0 bg-[#EE1D23]/5 blur-[120px] rounded-full w-full mx-auto h-full z-0 pointer-events-none"></div>
        
        <div className="relative z-10 w-full group max-w-6xl">
            <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-[0_80px_160px_-40px_rgba(0,0,0,0.9)] group-hover:border-[#EE1D23]/40 transition-all duration-1000">
                <div className="p-3 md:p-6 lg:p-10">
                    <img 
                      src="/images/siete_sopas/Carta.png" 
                      alt="Carta Oficial Siete Sopas" 
                      className="w-full h-auto rounded-[2rem] shadow-2xl transition-transform duration-[2s] group-hover:scale-[1.01]" 
                    />
                </div>
                
                {/* Overlay Decortivo Premium */}
                <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5 rounded-[3rem]"></div>
                <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black/60 to-transparent"></div>
                
                <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-black/40 backdrop-blur-xl px-8 py-4 rounded-full border border-white/10 shadow-2xl">
                   <div className="w-10 h-10 bg-white rounded-full p-1.5 shadow-xl">
                      <img src="/images/siete_sopas/Logo.png" alt="Logo" className="w-full h-full object-contain" />
                   </div>
                   <span className="font-brand text-xl md:text-2xl text-white font-black drop-shadow-md tracking-widest whitespace-nowrap uppercase">Tradición que reconforta</span>
                </div>
            </div>
            
            {/* Sombras de profundidad decorativas */}
            <div className="absolute -bottom-10 left-20 right-20 h-20 bg-[#EE1D23]/10 blur-3xl -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        </div>
      </div>

      {/* --- SECCIÓN 2: Pedidos Digitales Dinámicos --- */}
      <div id="order-section" className="scroll-mt-20">
        <div className="text-center mb-10 pt-10">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#EE1D23]"></div>
            <h2 className="text-3xl md:text-5xl font-display font-black text-white tracking-wide">Lleva el sabor a tu mesa</h2>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#EE1D23]"></div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Personaliza tu pedido seleccionando tus platos favoritos.</p>
        </div>

        {/* Filtros de Categorías STICKY */}
        <div className="sticky top-[-1px] z-[100] py-4 px-5 glass-light border-b border-white/10 mb-10 -mx-4 md:-mx-8">
          <div className="flex overflow-x-auto pb-1 custom-scrollbar justify-start md:justify-center gap-3 max-w-7xl mx-auto items-center">
            <span className="text-[10px] font-black text-gray-400/60 uppercase tracking-widest mr-3 shrink-0 hidden md:block">Filtrar por:</span>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => scrollToCategory(cat)}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 border ${
                  activeCategory === cat
                    ? 'bg-[#EE1D23] border-[#EE1D23] text-white shadow-[0_5px_15px_rgba(238,29,35,0.3)] scale-105'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 transition-all max-w-7xl mx-auto">
          {filteredMenu.map((item, idx) => (
            <div key={item.id} className={`glass-card rounded-[2.5rem] overflow-hidden shadow-2xl hover:border-[#EE1D23]/40 group animate-fade-in stagger-${(idx % 6) + 1} ${item.stock === 0 ? 'opacity-60 grayscale' : ''}`}>
              <div className="h-64 w-full relative overflow-hidden bg-[#121214]">
                {item.imagenUrl ? (
                  <img src={item.imagenUrl} alt={item.nombre} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700 bg-white/5">Sin imagen</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-transparent to-transparent opacity-80"></div>
                
                {/* Badge Categoría Premium */}
                <div className="absolute top-6 left-6">
                  <span className="text-[10px] font-black text-white bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl uppercase tracking-widest shadow-2xl">{item.categoria}</span>
                </div>

                <div className="absolute top-6 right-6">
                  {item.stock > 0 ? (
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg uppercase tracking-wider mb-1">Disponible</span>
                      <span className="text-[14px] font-black text-white drop-shadow-md">{item.stock}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-black text-white bg-[#EE1D23] border border-white/20 px-4 py-2 rounded-xl shadow-2xl uppercase tracking-widest animate-pulse">Agotado</span>
                  )}
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col relative z-20 -mt-10">
                <div className="mb-4">
                  <div className="flex justify-between items-end gap-4 mb-2">
                    <h3 className="text-2xl font-display font-black text-white leading-none tracking-tight group-hover:text-[#EE1D23] transition-colors">{item.nombre}</h3>
                    <div className="flex flex-col items-end">
                       <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Precio</span>
                       <span className="font-black text-white text-xl flex items-center bg-white/5 px-4 py-1 rounded-2xl border border-white/5 group-hover:border-[#EE1D23]/20 transition-all">
                        <span className="text-[#EE1D23] text-sm mr-1.5 underline decoration-2 underline-offset-4">S/</span>{item.precio?.toFixed(2)}
                       </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed min-h-[3rem] font-medium border-l-2 border-[#EE1D23]/20 pl-4">{item.descripcion}</p>
                
                <button 
                  onClick={() => onAddToCart(item)} 
                  disabled={item.stock === 0}
                  className={`w-full mt-8 py-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center uppercase tracking-[0.2em] relative overflow-hidden group/btn shadow-xl ${
                    item.stock === 0 
                      ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5' 
                      : 'bg-[#EE1D23] hover:bg-[#D4141A] text-white'
                  }`}
                >
                  {item.stock > 0 && (
                    <>
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 z-0"></div>
                      <Plus size={16} className="mr-2 relative z-10" />
                    </>
                  )}
                  <span className="relative z-10">{item.stock === 0 ? 'Agotado' : 'Agregar al carrito'}</span>
                </button>
              </div>
            </div>
          ))}
          {filteredMenu.length === 0 && (
            <div className="col-span-full py-32 text-center animate-fade-in flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-gray-600 border border-white/5">
                 <Plus size={40} className="rotate-45" />
              </div>
              <h3 className="text-2xl font-display font-black text-gray-400 mb-2">Platos en preparación</h3>
              <p className="text-sm text-gray-600 font-medium">No hay productos registrados en esta categoría aún.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
