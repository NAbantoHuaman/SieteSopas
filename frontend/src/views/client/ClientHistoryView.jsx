import { Package, ChevronDown, CheckCircle2, Clock, ChefHat, Bike, Home } from 'lucide-react';

export const ClientHistoryView = ({ clientOrderHistory, setClientView }) => {
  const getStatusStep = (status) => {
    switch(status) {
      case 'PENDIENTE': return 0;
      case 'PREPARANDO': return 1;
      case 'LISTO': return 2;
      case 'ENTREGADO': return 2; // Para Delivery, LISTO o ENTREGADO significa esperando repartidor
      case 'EN_CAMINO': return 3;
      case 'ENTREGADO_CLIENTE': return 4;
      default: return 0;
    }
  };

  return (
    <div className="w-full py-4 md:py-8 animate-fade-in flex flex-col items-center">
      <div className="text-center mb-10 w-full max-w-2xl">
        <span className="inline-block text-[11px] uppercase tracking-[0.25em] text-red-500 font-bold mb-3 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/10">Historial</span>
        <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-3 tracking-tight">Mis Pedidos</h2>
        <p className="text-sm md:text-base text-gray-400 mx-auto font-medium">Sigue el estado de tus compras en tiempo real.</p>
      </div>
      
      <div className="w-full max-w-2xl space-y-6">
        {clientOrderHistory.length === 0 ? (
          <div className="bg-[#121214]/60 p-12 rounded-3xl text-center border border-dashed border-gray-800">
            <Package size={48} className="text-gray-700 mx-auto mb-4 animate-float opacity-30" />
            <h4 className="text-lg font-bold text-white mb-2 tracking-tight">No tienes pedidos aún</h4>
            <p className="text-sm text-gray-500 mb-6 font-medium">Tus compras confirmadas aparecerán aquí.</p>
            <button onClick={() => setClientView('menu')} className="px-6 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] text-sm">Explorar Menú</button>
          </div>
        ) : (
          clientOrderHistory.map(order => {
            const step = getStatusStep(order.status || 'PENDIENTE');
            const isCompleted = step === 4;
            
            return (
              <div key={order.id} className={`bg-[#121214] p-6 rounded-3xl border ${isCompleted ? 'border-green-500/20' : 'border-gray-800'} flex flex-col gap-6 hover:border-red-500/30 transition-colors shadow-xl`}>
                
                {/* Header & Total */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-white font-black text-xl tracking-tight">Orden {order.id}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest ${isCompleted ? 'bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {order.status || 'PENDIENTE'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">{order.date} • {order.time}</p>
                  </div>
                  <div className="bg-[#1a1a1e] p-3 rounded-2xl border border-gray-800 text-right min-w-[100px]">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">Total Pagado</div>
                    <div className="text-lg font-black text-white">S/ {order.total.toFixed(2)}</div>
                  </div>
                </div>

                {/* Tracking Progress Bar */}
                <div className="relative pt-4 pb-2 w-full px-2">
                  <div className="absolute top-[68px] left-0 w-full h-[2px] bg-gray-800 rounded-full z-0"></div>
                  <div className="absolute top-[68px] left-0 h-[2px] bg-red-500 rounded-full transition-all duration-500 z-0" style={{ width: `${(step / 4) * 100}%` }}></div>
                  
                  <div className="flex justify-between relative z-10">
                    <div className={`flex flex-col items-center ${step >= 0 ? 'text-red-500' : 'text-gray-600'} transition-colors duration-500`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 0 ? 'bg-red-500/20 border-2 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-gray-800 border-2 border-gray-700'}`}>
                        <Clock size={14} />
                      </div>
                    </div>
                    <div className={`flex flex-col items-center ${step >= 1 ? 'text-orange-500' : 'text-gray-600'} transition-colors duration-500 delay-100`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? 'bg-orange-500/20 border-2 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]' : 'bg-gray-800 border-2 border-gray-700'}`}>
                        <ChefHat size={14} />
                      </div>
                    </div>
                    <div className={`flex flex-col items-center ${step >= 2 ? 'text-yellow-400' : 'text-gray-600'} transition-colors duration-500 delay-200`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? 'bg-yellow-400/20 border-2 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.4)]' : 'bg-gray-800 border-2 border-gray-700'}`}>
                        <Package size={14} />
                      </div>
                    </div>
                    <div className={`flex flex-col items-center ${step >= 3 ? 'text-blue-500' : 'text-gray-600'} transition-colors duration-500 delay-300`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? 'bg-blue-500/20 border-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'bg-gray-800 border-2 border-gray-700'}`}>
                        <Bike size={14} />
                      </div>
                    </div>
                    <div className={`flex flex-col items-center ${step >= 4 ? 'text-green-500' : 'text-gray-600'} transition-colors duration-500 delay-500`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 4 ? 'bg-green-500/20 border-2 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-gray-800 border-2 border-gray-700'}`}>
                        <Home size={14} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between px-2 w-full mt-[-10px] mb-4">
                    <span className="text-[9px] font-black uppercase text-gray-500 w-8 text-center">Cola</span>
                    <span className="text-[9px] font-black uppercase text-gray-500 w-8 text-center">Cocina</span>
                    <span className="text-[9px] font-black uppercase text-gray-500 w-8 text-center">Listo</span>
                    <span className="text-[9px] font-black uppercase text-gray-500 w-8 text-center">Camino</span>
                    <span className="text-[9px] font-black uppercase text-gray-500 w-8 text-center">Casa</span>
                </div>

                {/* Items */}
                <div className="bg-[#1a1a1e]/50 rounded-xl p-4 border border-gray-800/50">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center">
                    <CheckCircle2 size={12} className="mr-2 text-green-500/50" /> Detalle del Pedido
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {order.items.map((item, idx) => (
                      <div key={item.id || idx} className="flex items-start text-sm font-medium text-gray-300">
                        <span className="text-red-500/50 mr-2 mt-0.5 font-bold">{item.qty}x</span> 
                        {item.nombre || item.name}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
