import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Users, 
  ChefHat, 
  Settings, 
  LogOut,
  Package,
  Receipt,
  BarChart2
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, id, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
      activeTab === id 
        ? 'bg-[#EE1D23]/10 text-[#EE1D23] border border-[#EE1D23]/20 shadow-[0_0_15px_rgba(238,29,35,0.1)]' 
        : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200 border border-transparent'
    }`}
  >
    <Icon size={18} className={`transition-colors duration-300 ${activeTab === id ? 'text-[#EE1D23]' : 'group-hover:text-gray-300'}`} />
    <span className={`font-medium text-sm tracking-wide ${activeTab === id ? 'font-bold' : ''}`}>{label}</span>
  </button>
);

export const AdminSidebar = ({ activeTab, setActiveTab, handleLogout, currentUser }) => {
  const role = currentUser?.rol || 'CLIENTE';
  
  return (
    <aside className="w-68 border-r border-white/5 bg-[#0A0A0B] flex flex-col hidden md:flex relative z-20">
      <div className="p-8 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#EE1D23]/30 shadow-[0_0_20px_rgba(238,29,35,0.15)] bg-[#121214] p-1.5 transition-transform hover:scale-105 duration-500">
          <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-display font-black tracking-tighter text-white leading-none">SIGEPAM</span>
          <span className="text-[10px] text-[#EE1D23] font-black uppercase tracking-[0.2em] mt-1">Admin Panel</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1.5 mt-6 overflow-y-auto custom-scrollbar">
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
      </nav>

      <div className="p-6 border-t border-white/5 bg-white/[0.01]">
        <SidebarItem icon={Settings} label="CONFIGURACIÓN" id="settings" activeTab={activeTab} setActiveTab={setActiveTab} />
        <button 
          onClick={handleLogout}
          className="w-full mt-3 flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-[#EE1D23]/10 hover:text-[#EE1D23] border border-transparent hover:border-[#EE1D23]/20 transition-all duration-300 group"
        >
          <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
          <span className="font-bold text-xs uppercase tracking-widest">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
