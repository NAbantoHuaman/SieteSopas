import { Package, Clock } from 'lucide-react';

export const ClientConfirmationView = ({ confirmedOrder, setConfirmedOrder, setClientView }) => {
  if (!confirmedOrder) return null;

  return (
    <div className="w-full animate-fade-in py-8 flex justify-center">
      <div className="glass-card p-8 rounded-3xl shadow-2xl max-w-md w-full animate-scale-in text-center">
        <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float shadow-[0_0_40px_rgba(16,185,129,0.15)]">
          <Package size={36} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-1">¡Pedido Confirmado!</h2>
        <p className="text-xs text-gray-500 mb-6">Tu orden ha sido registrada exitosamente</p>

        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Nº de Orden</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">{confirmedOrder.time}</span>
          </div>
          <span className="text-3xl font-black gradient-text">{confirmedOrder.id}</span>
          <div className="mt-4 pt-3 border-t border-white/5 text-left space-y-1.5">
            {confirmedOrder.items.map(item => (
              <div key={item.id} className="flex justify-between text-xs">
                <span className="text-gray-400">{item.qty}x {item.name}</span>
                <span className="text-gray-300">S/ {(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 space-y-1">
            <div className="flex justify-between text-xs"><span className="text-gray-500">Subtotal</span><span className="text-gray-400">S/ {confirmedOrder.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-xs"><span className="text-gray-500">IGV (18%)</span><span className="text-gray-400">S/ {confirmedOrder.igv.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm font-bold mt-2"><span className="text-white">Total</span><span className="gradient-text">S/ {confirmedOrder.total.toFixed(2)}</span></div>
          </div>
        </div>

        <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-center text-red-400 text-sm font-medium">
            <Clock size={16} className="mr-2" /> Tiempo estimado: ~{confirmedOrder.estimatedMinutes} min
          </div>
        </div>

        <button onClick={() => { setConfirmedOrder(null); setClientView('home'); }} className="w-full py-3 bg-white/[0.04] border border-white/8 text-gray-300 text-sm font-medium rounded-2xl hover:bg-white/[0.08] transition-all">
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};
