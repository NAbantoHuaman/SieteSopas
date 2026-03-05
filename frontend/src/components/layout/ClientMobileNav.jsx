import { Home, UtensilsCrossed, MapPin } from 'lucide-react';

export const ClientMobileNav = ({ clientView, setClientView }) => {
  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-[#121214]/95 backdrop-blur-md border-t border-gray-800/60 flex justify-around items-center p-3 z-50">
      <button onClick={() => setClientView('home')} className={`flex flex-col items-center p-2 rounded-xl transition-colors ${clientView==='home'?'text-red-400 bg-red-500/10':'text-gray-400 hover:text-gray-200'}`}>
        <Home size={22}/>
        <span className="text-[10px] mt-1 font-medium">Inicio</span>
      </button>
      <button onClick={() => setClientView('menu')} className={`flex flex-col items-center p-2 rounded-xl transition-colors ${clientView==='menu'?'text-red-400 bg-red-500/10':'text-gray-400 hover:text-gray-200'}`}>
        <UtensilsCrossed size={22}/>
        <span className="text-[10px] mt-1 font-medium">Menú</span>
      </button>
      <button onClick={() => setClientView('locations')} className={`flex flex-col items-center p-2 rounded-xl transition-colors ${clientView==='locations'?'text-red-400 bg-red-500/10':'text-gray-400 hover:text-gray-200'}`}>
        <MapPin size={22}/>
        <span className="text-[10px] mt-1 font-medium">Locales</span>
      </button>
    </nav>
  );
};
