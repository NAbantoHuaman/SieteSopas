import { BarChart, LineChart, Activity, TrendingUp, DollarSign, ListOrdered } from 'lucide-react';

export const AdminAnalyticsView = ({ biStats }) => {
  if (!biStats) {
    return (
      <div className="flex items-center justify-center h-full animate-pulse">
        <div className="flex flex-col items-center">
          <Activity size={48} className="text-indigo-500 mb-4 animate-bounce" />
          <p className="text-gray-400 font-medium">Cargando Inteligencia de Negocios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Análisis de Negocio</h2>
          <p className="text-gray-400">Rendimiento general y métricas de facturación.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Ingresos Totales</p>
              <h3 className="text-3xl font-black text-white">S/ {biStats.ingresosTotales?.toFixed(2) || '0.00'}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <DollarSign className="text-indigo-400" size={24} />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm">
            <TrendingUp size={16} className="text-green-400 mr-2"/>
            <span className="text-green-400 font-medium">+15.3%</span>
            <span className="text-gray-500 ml-2">vs mes anterior</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-teal-500/5 border border-green-500/20 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all duration-700"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Tickets Cerrados</p>
              <h3 className="text-3xl font-black text-white">{biStats.totalOrdenes || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
              <ListOrdered className="text-green-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#121214] border border-gray-800 rounded-3xl p-7 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Top Productos</h3>
              <p className="text-sm text-gray-500">Los artículos más vendidos del menú</p>
            </div>
            <BarChart className="text-gray-600" size={28}/>
          </div>
          
          <div className="space-y-5">
            {biStats.topProductos?.map((prod) => (
              <div key={prod.nombre} className="relative">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-medium text-gray-200">{prod.nombre}</span>
                  <span className="text-sm text-gray-400 font-bold">{prod.cantidad} und.</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    style={{ 
                      width: `${Math.max(10, (prod.cantidad / (biStats.topProductos[0]?.cantidad || 1)) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
            
            {(!biStats.topProductos || biStats.topProductos.length === 0) && (
              <div className="py-8 text-center text-gray-500">
                Aún no hay suficientes datos de ventas.
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#121214] border border-gray-800 rounded-3xl p-7 shadow-2xl flex flex-col justify-center items-center opacity-70 border-dashed">
          <LineChart size={64} className="text-gray-700 mb-6"/>
          <h3 className="text-lg font-bold text-gray-400 mb-2">Reporte de Ventas por Hora</h3>
          <p className="text-sm text-gray-500 text-center max-w-xs">Garantiza un día más de actividad para generar suficientes datos horarios.</p>
        </div>
      </div>
    </div>
  );
};
