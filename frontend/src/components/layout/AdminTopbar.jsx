import { LayoutDashboard, Search, Bell } from 'lucide-react';

export const AdminTopbar = ({ activeTab }) => {
  return (
    <header className="h-20 border-b border-white/5 bg-[#08080A]/90 backdrop-blur-xl flex items-center justify-between px-6 md:px-10 z-[100] sticky top-0">
      <button className="md:hidden p-2 text-gray-400 hover:text-[#EE1D23] transition-colors">
        <LayoutDashboard size={22} />
      </button>

      <div className="hidden md:flex items-center">
        <div className="h-8 w-[2px] bg-[#EE1D23]/30 mr-4 rounded-full"></div>
        <span className="uppercase tracking-[0.15em] font-display font-black text-sm text-white/90">
          {activeTab === 'dashboard' ? 'Métricas en tiempo real' : 
           activeTab === 'tables' ? 'Gestión de Salón' : 
           activeTab === 'queue' ? 'Asignación de Clientes' : 'Kitchen Display System'}
        </span>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative group hidden lg:block">
          <Search size={16} className="text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2 group-focus-within:text-[#EE1D23] transition-colors duration-300" />
          <input 
            type="text" 
            placeholder="BUSCAR MESA O PEDIDO..." 
            className="glass-light border border-white/5 text-[10px] rounded-2xl pl-11 pr-5 py-2.5 focus:outline-none focus:border-[#EE1D23]/40 focus:ring-4 focus:ring-[#EE1D23]/5 transition-all w-64 xl:w-80 placeholder-gray-600 text-white font-bold tracking-widest uppercase"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="relative p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all group">
            <Bell size={18} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#EE1D23] rounded-full border-2 border-[#08080A] shadow-[0_0_10px_rgba(238,29,35,0.5)]"></span>
          </button>
          
          <div className="flex items-center space-x-3 pl-4 border-l border-white/5">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-[10px] font-black text-white uppercase tracking-wider">Admin User</span>
              <span className="text-[8px] text-[#EE1D23] font-bold uppercase tracking-widest">SuperAdmin</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EE1D23] to-[#B01519] flex items-center justify-center text-xs font-black text-white shadow-[0_0_20px_rgba(238,29,35,0.2)] border border-white/10 hover:scale-105 transition-transform cursor-pointer">
              AD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
