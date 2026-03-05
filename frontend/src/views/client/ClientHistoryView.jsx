import { Package, ChevronDown } from 'lucide-react';

export const ClientHistoryView = ({ clientOrderHistory, setClientView }) => {
  return (
    <div className="w-full py-4 md:py-8 animate-fade-in flex flex-col items-center">
      <div className="text-center mb-10 w-full max-w-2xl">
        <span className="inline-block text-[11px] uppercase tracking-[0.25em] text-red-400/80 font-semibold mb-3 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5">Historial</span>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">Mis Pedidos</h2>
        <p className="text-sm md:text-base text-gray-500 mx-auto">Revisa tus compras anteriores.</p>
      </div>
      
      <div className="w-full max-w-2xl space-y-4">
        {clientOrderHistory.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl text-center border-dashed border-white/10">
            <Package size={48} className="text-gray-700 mx-auto mb-4 animate-float opacity-30" />
            <h4 className="text-lg font-bold text-white mb-2">No tienes pedidos aún</h4>
            <p className="text-sm text-gray-500 mb-6">Tus compras confirmadas aparecerán aquí.</p>
            <button onClick={() => setClientView('menu')} className="px-6 py-2.5 bg-red-500/10 text-red-400 font-medium rounded-full hover:bg-red-500/20 transition-all border border-red-500/20 text-sm">Explorar Menú</button>
          </div>
        ) : (
          clientOrderHistory.map(order => (
            <div key={order.id} className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-red-500/30 transition-colors">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-red-400 font-bold">Orden {order.id}</span>
                  <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">{order.status || 'PREPARANDO'}</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{order.date} • {order.time}</p>
                <div className="text-sm text-gray-300 space-y-1">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center"><ChevronDown size={14} className="text-red-500/50 mr-2 -rotate-90"/> {item.qty}x {item.name}</div>
                  ))}
                </div>
              </div>
              <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 text-center min-w-[120px]">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total</div>
                <div className="text-xl font-black gradient-text">S/ {order.total.toFixed(2)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
