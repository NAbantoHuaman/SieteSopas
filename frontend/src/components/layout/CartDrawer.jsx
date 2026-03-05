import { ShoppingCart, X, Plus, Minus } from 'lucide-react';

export const CartDrawer = ({ 
  showCart, setShowCart, cart, cartCount, 
  setClientView, updateQty, removeFromCart, 
  cartSubtotal, cartIGV, cartTotal, 
  handleCheckout, isCheckoutLoading, setShowPaymentModal
}) => {
  if (!showCart) return null;

  return (
    <div
      className="fixed inset-0 z-[80] animate-fade-in"
      role="presentation"
      onClick={() => setShowCart(false)}
      onKeyDown={(e) => { if (e.key === 'Escape') setShowCart(false); }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md glass-card border-l border-white/10 shadow-2xl flex flex-col animate-fade-in-down"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        onClick={e => e.stopPropagation()}
        onKeyDown={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h3 className="text-lg font-display font-bold text-white flex items-center"><ShoppingCart size={18} className="mr-2 text-[#EE1D23]" /> Mi Carrito ({cartCount})</h3>
          <button onClick={() => setShowCart(false)} className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in my-auto pb-10">
              <div className="w-24 h-24 mb-6 rounded-full bg-[#1A1A1E] flex items-center justify-center shadow-inner border border-white/5 animate-float">
                <ShoppingCart size={40} className="text-gray-700" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Tu carrito está vacío</h4>
              <p className="text-sm text-gray-500 max-w-[200px] mb-8">Aún no has agregado nada delicioso a tu orden.</p>
              <button 
                onClick={() => { setShowCart(false); setClientView('menu'); }} 
                className="px-6 py-2.5 bg-[#FBAF40]/10 text-[#FBAF40] font-medium rounded-full hover:bg-[#FBAF40]/20 transition-all border border-[#FBAF40]/20"
              > Explorar Menú</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center space-x-3 bg-white/[0.02] border border-white/5 rounded-2xl p-3">
                <img src={item.imagenUrl} alt={item.nombre} className="w-14 h-14 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">{item.nombre}</h4>
                  <p className="text-xs text-[#EE1D23] font-medium">S/ {item.precio?.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"><Minus size={12} /></button>
                  <span className="text-sm font-bold text-white w-5 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"><Plus size={12} /></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-gray-700 hover:text-[#EE1D23] transition-colors"><X size={14} /></button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-white/5 space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs"><span className="text-gray-500">Subtotal</span><span className="text-gray-300">S/ {cartSubtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-xs"><span className="text-gray-500">IGV (18%)</span><span className="text-gray-300">S/ {cartIGV.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/5"><span className="text-white">Total</span><span className="gradient-text">S/ {cartTotal.toFixed(2)}</span></div>
            </div>
            <button onClick={() => setShowPaymentModal(true)} disabled={isCheckoutLoading} className="w-full bg-gradient-to-r from-[#EE1D23] via-[#EE1D23] to-[#EE1D23] hover:from-[#f14a4f] hover:to-[#EE1D23] text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-[#EE1D23]/25 hover:shadow-[#EE1D23]/40 hover:-translate-y-0.5 text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed">
              Confirmar y Pagar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
