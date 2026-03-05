import { AlertCircle } from 'lucide-react';

export const AdminDashboardView = ({ queue, tables, orders, dashboardStats }) => {
  const stats = [
    { 
      label: 'Ocupación actual', 
      value: dashboardStats ? `${Math.round(dashboardStats.porcentajeOcupacion)}%` : '0%', 
      sub: dashboardStats ? `${dashboardStats.mesasOcupadas} mesas en uso` : 'Cargando...', 
      color: 'text-green-400' 
    },
    { 
      label: 'Personas en cola', 
      value: dashboardStats ? dashboardStats.personasEnCola.toString() : queue.length.toString(), 
      sub: 'Esperando en sistema', 
      color: 'text-red-400' 
    },
    { 
      label: 'Mesas libres', 
      value: dashboardStats ? dashboardStats.mesasLibres.toString() : tables.filter(t => t.status === 'LIBRE').length.toString(), 
      sub: dashboardStats ? `De ${dashboardStats.totalMesas} totales` : 'Cargando...', 
      color: 'text-indigo-400' 
    },
    { 
      label: 'Comandas activas', 
      value: dashboardStats ? dashboardStats.comandasActivas.toString() : orders.length.toString(), 
      sub: 'En preparación o Pdt', 
      color: 'text-purple-400' 
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={stat.label} className={`glass-card p-6 rounded-[2rem] relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 stagger-${idx + 1}`}>
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${stat.color.includes('green') ? 'from-[#00E676]' : stat.color.includes('red') ? 'from-[#EE1D23]' : 'from-indigo-500'} to-transparent opacity-50`}></div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{stat.label}</p>
            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-display font-black text-white tracking-tight drop-shadow-md">{stat.value}</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${stat.color}`}>{stat.sub}</span>
            </div>
            <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full bg-current ${stat.color} opacity-20 w-2/3 rounded-full animate-pulse`}></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-white font-display font-black text-xl uppercase tracking-wider">MAPA DE CALOR - ROTACIÓN</h3>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-gray-400 border border-white/5">HOY</span>
              <span className="px-3 py-1 bg-[#EE1D23]/10 rounded-lg text-[10px] font-bold text-[#EE1D23] border border-[#EE1D23]/20">EN VIVO</span>
            </div>
          </div>
          <div className="w-full h-80 flex items-center justify-center bg-white/[0.02] border border-dashed border-white/10 rounded-3xl group">
            <div className="text-center group-hover:scale-105 transition-transform duration-500">
              <div className="w-16 h-16 bg-[#EE1D23]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#EE1D23]/20">
                <BarChart2 className="text-[#EE1D23]" size={24} />
              </div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Visualización de Datos Recharts</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem]">
          <h3 className="text-white font-display font-black text-xl uppercase tracking-wider mb-8 flex items-center">
            <div className="w-2 h-2 bg-[#EE1D23] rounded-full mr-3 animate-ping"></div>
            ALERTAS CRÍTICAS
          </h3>
          <div className="space-y-6">
            <div className="flex space-x-4 items-start p-5 glass-light border border-[#EE1D23]/20 rounded-[1.5rem] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#EE1D23]/5 to-transparent"></div>
              <AlertCircle size={20} className="text-[#EE1D23] mt-0.5 shrink-0 relative z-10" />
              <div className="relative z-10">
                <p className="text-sm font-black text-white uppercase tracking-tight mb-1">Cuello de botella en cocina</p>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">Sopas criollas con <span className="text-[#EE1D23] font-bold">+15min de retraso</span> detectado por el sistema.</p>
              </div>
            </div>
            
            <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest transition-all">
              VER TODAS LAS NOTIFICACIONES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
