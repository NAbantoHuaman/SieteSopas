import { ChefHat, Clock, UtensilsCrossed, CheckCircle2 } from 'lucide-react';

export const AdminKitchenView = ({ orders, handleOrderAction }) => {
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex lg:grid lg:grid-cols-3 gap-4 md:gap-6 h-full overflow-x-auto pb-4 snap-x snap-mandatory">
        
        <div className="min-w-[85vw] md:min-w-[350px] lg:min-w-0 bg-[#121214] border border-gray-800/60 rounded-2xl p-4 flex flex-col snap-center">
          <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center justify-between">
            <span>NUEVOS PEDIDOS</span>
            <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs">{orders.filter(o=>o.status==='PENDIENTE').length}</span>
          </h3>
          <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1 flex flex-col">
            {orders.filter(o => o.status === 'PENDIENTE').length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-800 rounded-xl opacity-60 m-auto min-h-[150px] w-full mt-2">
                <ChefHat size={32} className="text-gray-600 mb-3" />
                <p className="text-sm font-medium text-gray-500">Sin pedidos nuevos</p>
              </div>
            ) : (
              orders.filter(o => o.status === 'PENDIENTE').map(order => (
                <div key={order.id} className="bg-[#1A1A1E] border border-gray-700/50 p-4 md:p-5 rounded-xl shadow-lg border-l-4 border-l-red-500">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-black text-2xl text-white tracking-tight">{order.table}</span>
                    <span className="text-xl font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-lg flex items-center">
                      <Clock size={20} className="mr-2"/> {order.time}m
                    </span>
                  </div>
                  <ul className="text-base text-gray-300 space-y-2 mb-5 font-medium">
                    {order.items.map((item) => <li key={`${order.id}-${item}`} className="flex items-start"><span className="text-red-500 mr-2 mt-0.5">•</span> {item}</li>)}
                  </ul>
                  <button onClick={() => handleOrderAction(order.id, 'PREPARANDO')} className="w-full py-3 bg-red-500/10 text-red-400 text-sm font-bold rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-black transition-colors">
                    INICIAR PREPARACIÓN
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="min-w-[85vw] md:min-w-[350px] lg:min-w-0 bg-[#121214] border border-gray-800/60 rounded-2xl p-4 flex flex-col snap-center">
          <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center justify-between">
            <span>EN COCINA</span>
            <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs">{orders.filter(o=>o.status==='PREPARANDO').length}</span>
          </h3>
          <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1 flex flex-col">
            {orders.filter(o => o.status === 'PREPARANDO').length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-800 rounded-xl opacity-60 m-auto min-h-[150px] w-full mt-2">
                <UtensilsCrossed size={32} className="text-gray-600 mb-3" />
                <p className="text-sm font-medium text-gray-500">No hay platos en cocina</p>
              </div>
            ) : (
              orders.filter(o => o.status === 'PREPARANDO').map(order => (
                <div key={order.id} className={`bg-[#1A1A1E] border border-gray-700/50 p-4 md:p-5 rounded-xl shadow-lg border-l-4 ${order.time > 15 ? 'border-l-red-500 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'border-l-indigo-500'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-black text-2xl text-white tracking-tight">{order.table}</span>
                    <span className={`text-xl font-bold px-3 py-1 rounded-lg flex items-center ${
                      order.time > 15 
                        ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                        : 'bg-indigo-500/10 text-indigo-400'
                    }`}>
                      <Clock size={20} className="mr-2"/> {order.time}m
                    </span>
                  </div>
                  <ul className="text-base text-gray-300 space-y-2 mb-5 font-medium">
                    {order.items.map((item) => <li key={`${order.id}-${item}`} className="flex items-start"><span className="text-indigo-500 mr-2 mt-0.5">•</span> {item}</li>)}
                  </ul>
                  <button onClick={() => handleOrderAction(order.id, 'LISTO')} className="w-full py-3 bg-indigo-500/10 text-indigo-400 text-sm font-bold rounded-lg border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-colors">
                    MARCAR LISTO
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="min-w-[85vw] md:min-w-[350px] lg:min-w-0 bg-[#121214] border border-gray-800/60 rounded-2xl p-4 flex flex-col opacity-70 snap-center">
          <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center justify-between">
            <span>PARA ENTREGAR</span>
            <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs">{orders.filter(o=>o.status==='LISTO').length}</span>
          </h3>
          <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1 flex flex-col">
            {orders.filter(o => o.status === 'LISTO').length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-600 text-sm font-medium border-2 border-dashed border-gray-800 rounded-xl p-8 text-center min-h-[150px] w-full mt-2">
                No hay pedidos esperando entrega a mozos
              </div>
            ) : (
              orders.filter(o => o.status === 'LISTO').map(order => (
                <div key={order.id} className="bg-[#1A1A1E] border border-gray-700/50 p-4 md:p-5 rounded-xl shadow-lg border-l-4 border-l-green-500">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-black text-2xl text-white tracking-tight">{order.table}</span>
                    <span className="text-xl font-bold text-green-400 bg-green-500/10 px-3 py-1 rounded-lg flex items-center">
                      <CheckCircle2 size={20} className="mr-2"/> Listo
                    </span>
                  </div>
                  <ul className="text-base text-gray-300 space-y-2 mb-5 font-medium">
                    {order.items.map((item) => <li key={`${order.id}-${item}`} className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">•</span> {item}</li>)}
                  </ul>
                  <button onClick={() => handleOrderAction(order.id, 'ENTREGAR')} className="w-full py-3 bg-green-500/10 text-green-400 text-sm font-bold rounded-lg border border-green-500/20 hover:bg-green-500 hover:text-black transition-colors">
                    ENTREGAR A MESA
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
