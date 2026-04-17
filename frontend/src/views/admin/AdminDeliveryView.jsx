import { PackageSearch, Bike, Home, CheckCircle2, Navigation } from 'lucide-react';

export const AdminDeliveryView = ({ orders, handleOrderAction }) => {
  // Solo mostramos pedidos que sean de Delivery
  const deliveryOrders = orders.filter(o => o.table && o.table.includes('Delivery'));

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex lg:grid lg:grid-cols-3 gap-4 md:gap-6 h-full overflow-x-auto pb-4 snap-x snap-mandatory">
        
        {/* Columna 1: Listos para Despacho */}
        <div className="min-w-[85vw] md:min-w-[350px] lg:min-w-0 bg-[#121214] border border-gray-800/60 rounded-2xl p-4 flex flex-col snap-center">
          <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center justify-between">
            <span>PARA DESPACHO</span>
            <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs">{deliveryOrders.filter(o => o.status === 'ENTREGADO').length}</span>
          </h3>
          <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1 flex flex-col">
            {deliveryOrders.filter(o => o.status === 'ENTREGADO').length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-800 rounded-xl opacity-60 m-auto min-h-[150px] w-full mt-2">
                <PackageSearch size={32} className="text-gray-600 mb-3" />
                <p className="text-sm font-medium text-gray-500">No hay paquetes esperando motorizado</p>
              </div>
            ) : (
              deliveryOrders.filter(o => o.status === 'ENTREGADO').map(order => (
                <div key={order.id} className="bg-[#1A1A1E] border border-gray-700/50 p-4 md:p-5 rounded-xl shadow-lg border-l-4 border-l-yellow-500">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-black text-xl text-white tracking-tight">{order.table}</span>
                    <span className="text-sm font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-lg flex items-center">
                      <PackageSearch size={16} className="mr-2"/> Empaquetado
                    </span>
                  </div>
                  <ul className="text-sm text-gray-400 space-y-1 mb-5">
                    {order.items.map((item, idx) => <li key={`${order.id}-${idx}`} className="flex items-start"><span className="text-yellow-500 mr-2">•</span> {item}</li>)}
                  </ul>
                  <button onClick={() => handleOrderAction(order.id, 'DESPACHAR')} className="w-full py-3 bg-yellow-500/10 text-yellow-500 text-sm font-bold rounded-lg border border-yellow-500/20 hover:bg-yellow-500 hover:text-black transition-colors">
                    ASIGNAR MOTORIZADO
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Columna 2: En Camino */}
        <div className="min-w-[85vw] md:min-w-[350px] lg:min-w-0 bg-[#121214] border border-gray-800/60 rounded-2xl p-4 flex flex-col snap-center">
          <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center justify-between">
            <span>EN CAMINO</span>
            <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs">{deliveryOrders.filter(o => o.status === 'EN_CAMINO').length}</span>
          </h3>
          <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1 flex flex-col">
            {deliveryOrders.filter(o => o.status === 'EN_CAMINO').length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-800 rounded-xl opacity-60 m-auto min-h-[150px] w-full mt-2">
                <Bike size={32} className="text-gray-600 mb-3" />
                <p className="text-sm font-medium text-gray-500">Sin viajes activos</p>
              </div>
            ) : (
              deliveryOrders.filter(o => o.status === 'EN_CAMINO').map(order => (
                <div key={order.id} className="bg-[#1A1A1E] border border-gray-700/50 p-4 md:p-5 rounded-xl shadow-lg border-l-4 border-l-blue-500">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-black text-xl text-white tracking-tight">{order.table}</span>
                    <span className="text-sm font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg flex items-center">
                      <Navigation size={16} className="mr-2"/> Tránsito
                    </span>
                  </div>
                  <ul className="text-sm text-gray-400 space-y-1 mb-5">
                    {order.items.map((item, idx) => <li key={`${order.id}-${idx}`} className="flex items-start"><span className="text-blue-500 mr-2">•</span> {item}</li>)}
                  </ul>
                  <button onClick={() => handleOrderAction(order.id, 'FINALIZAR')} className="w-full py-3 bg-blue-500/10 text-blue-400 text-sm font-bold rounded-lg border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-colors">
                    MARCAR ENTREGADO AL CLIENTE
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Columna 3: Entregados (Historial) */}
        <div className="min-w-[85vw] md:min-w-[350px] lg:min-w-0 bg-[#121214]/50 border border-gray-800/60 rounded-2xl p-4 flex flex-col opacity-70 snap-center">
          <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center justify-between">
            <span>COMPLETADOS</span>
            <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs">{deliveryOrders.filter(o => o.status === 'ENTREGADO_CLIENTE').length}</span>
          </h3>
          <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1 flex flex-col">
            {deliveryOrders.filter(o => o.status === 'ENTREGADO_CLIENTE').length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-600 text-sm font-medium border-2 border-dashed border-gray-800 rounded-xl p-8 text-center min-h-[150px] w-full mt-2">
                No hay entregas completadas recientemente
              </div>
            ) : (
              [...deliveryOrders].filter(o => o.status === 'ENTREGADO_CLIENTE').reverse().slice(0, 30).map(order => (
                <div key={order.id} className="bg-[#1A1A1E]/50 border border-gray-800 p-4 rounded-xl shadow-lg border-l-4 border-l-green-500/50">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-black text-lg text-gray-400 tracking-tight">{order.table}</span>
                    <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg flex items-center">
                      <CheckCircle2 size={12} className="mr-1"/> Recibido
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};
