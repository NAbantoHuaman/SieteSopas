import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Users, 
  ChefHat, 
  Settings, 
  LogOut,
  Package,
  Receipt,
  BarChart2,
  Bike
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, id, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(id)}
    title={label}
    className={`w-full flex items-center justify-center lg:justify-start lg:space-x-3 px-2 lg:px-4 py-3 rounded-xl transition-all duration-300 group ${
      activeTab === id 
        ? 'bg-[#EE1D23]/10 text-[#EE1D23] border border-[#EE1D23]/20 shadow-[0_0_15px_rgba(238,29,35,0.1)]' 
        : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200 border border-transparent'
    }`}
  >
    <Icon size={18} className={`transition-colors duration-300 ${activeTab === id ? 'text-[#EE1D23]' : 'group-hover:text-gray-300'}`} />
    <span className={`hidden lg:inline font-medium text-sm tracking-wide ${activeTab === id ? 'font-bold' : ''}`}>{label}</span>
  </button>
);

export const AdminSidebar = ({ activeTab, setActiveTab, handleLogout, currentUser }) => {
  const role = currentUser?.rol || 'CLIENTE';
  
  return (
    <aside className="w-16 lg:w-68 border-r border-white/5 bg-[#0A0A0B] flex-col hidden md:flex relative z-20 transition-all duration-300">
      <div className="p-3 lg:p-8 flex items-center justify-center lg:justify-start lg:space-x-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#EE1D23]/30 shadow-[0_0_20px_rgba(238,29,35,0.15)] bg-[#121214] p-1.5 transition-transform hover:scale-105 duration-500 shrink-0">
          <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="hidden lg:flex flex-col">
          <span className="text-2xl font-display font-black tracking-tighter text-white leading-none">SIGEPAM</span>
          <span className="text-[10px] text-[#EE1D23] font-black uppercase tracking-[0.2em] mt-1">Admin Panel</span>
        </div>
      </div>
      
      <nav className="flex-1 px-2 lg:px-4 space-y-1.5 mt-6 overflow-y-auto custom-scrollbar">
        {(role === 'ADMIN' || role === 'ANFITRION') && (
          <SidebarItem icon={LayoutDashboard} label="DASHBOARD" id="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        {role === 'ADMIN' && (
          <SidebarItem icon={BarChart2} label="ESTADÍSTICAS" id="analytics" activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        {role === 'ADMIN' && (
          <SidebarItem icon={Package} label="INVENTARIO" id="inventory" activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        {(role === 'ADMIN' || role === 'ANFITRION') && (
          <SidebarItem icon={UtensilsCrossed} label="AFORO Y MESAS" id="tables" activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        {(role === 'ADMIN' || role === 'CAJERO') && (
          <SidebarItem icon={Receipt} label="FACTURACIÓN" id="cashier" activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        {(role === 'ADMIN' || role === 'ANFITRION') && (
          <SidebarItem icon={Users} label="COLA VIRTUAL" id="queue" activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        {(role === 'ADMIN' || role === 'COCINERO') && (
          <SidebarItem icon={ChefHat} label="SISTEMA COCINA" id="kitchen" activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        {role === 'ADMIN' && (
          <SidebarItem icon={Bike} label="DELIVERY & DESPACHO" id="delivery" activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </nav>

      <div className="p-3 lg:p-6 border-t border-white/5 bg-white/[0.01]">
        <SidebarItem icon={Settings} label="CONFIGURACIÓN" id="settings" activeTab={activeTab} setActiveTab={setActiveTab} />
        <button 
          onClick={handleLogout}
          title="Cerrar Sesión"
          className="w-full mt-3 flex items-center justify-center lg:justify-start lg:space-x-3 px-2 lg:px-4 py-3 rounded-xl text-gray-400 hover:bg-[#EE1D23]/10 hover:text-[#EE1D23] border border-transparent hover:border-[#EE1D23]/20 transition-all duration-300 group"
        >
          <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
          <span className="hidden lg:inline font-bold text-xs uppercase tracking-widest">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
