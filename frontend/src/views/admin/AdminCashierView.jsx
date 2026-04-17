import { useState } from 'react';
import { Receipt, CreditCard, CheckCircle2, X } from 'lucide-react';
import * as api from '../../api';

export const AdminCashierView = ({ billingTables, fetchAllData, addNotification }) => {
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const handlePayment = async (mesaId) => {
    try {
      const response = await api.cobrarMesa(mesaId);
      addNotification(`Pago procesado para la mesa exitosamente`, 'success');
      
      // Mostrar modal si hay detalles auto-generados o detalle de pago normal
      if (response && response.detalleItems && response.detalleItems.length > 0) {
        setReceiptData(response);
        setShowReceipt(true);
      }
      
      fetchAllData();
    } catch (err) {
      addNotification(err.message || 'Error al procesar pago', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center"><Receipt className="text-red-500 mr-3" size={28}/> Facturación y Caja</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {billingTables.map(mesa => (
                <div key={mesa.mesaId} className="bg-[#121214] border border-gray-800 rounded-2xl p-6 flex flex-col relative overflow-hidden group hover:border-red-500/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1 block">
                              {mesa.isWalkIn ? (mesa.items?.includes('[Delivery:') ? 'DELIVERY' : 'Boleta Histórica') : 'Mesa Ocupada'}
                            </span>
                            <h3 className="text-2xl font-black text-white">
                              {mesa.items?.includes('[Delivery:') ? 'Pedido Delivery' : `Mesa ${mesa.mesaNumero}`}
                            </h3>
                            {mesa.isWalkIn && mesa.mesaId.startsWith('HIST_') && (
                              <span className="text-xs text-gray-500 mt-1 block">Ref: {mesa.mesaId.replace('HIST_', '#')}</span>
                            )}
                        </div>
                        <div className={`p-3 rounded-xl border ${mesa.isWalkIn ? 'bg-gray-800/50 border-gray-700' : 'bg-red-500/10 border-red-500/20'}`}>
                            {mesa.isWalkIn ? <CheckCircle2 className="text-gray-400" size={24}/> : <Receipt className="text-red-500" size={24}/>}
                        </div>
                    </div>

                    <div className="space-y-2 mb-6 flex-1">
                        {mesa.isWalkIn && mesa.items ? (
                           <div className="text-sm text-gray-400 mb-2">
                             <p className="font-bold text-gray-300 mb-1">Items Consumidos:</p>
                             <ul className="list-disc pl-4 space-y-1 opacity-80 text-xs">
                               {mesa.items.split(',').map((it, i) => <li key={i}>{it}</li>)}
                             </ul>
                           </div>
                        ) : (
                          <>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Total Comandas:</span>
                                <span className="text-white font-medium">{mesa.comandasCount} pendientes</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Capacidad Mesa:</span>
                                <span className="text-white font-medium">{mesa.capacidad} pax</span>
                            </div>
                          </>
                        )}
                    </div>

                    <div className="pt-4 border-t border-gray-800 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-medium">Total a Pagar</span>
                            <span className="text-3xl font-black text-green-400">S/ {mesa.totalAcumulado.toFixed(2)}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => handlePayment(mesa.mesaId)}
                        disabled={mesa.isWalkIn}
                        className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center transition-all ${
                            mesa.isWalkIn 
                            ? 'bg-green-500/20 text-green-400 cursor-not-allowed border border-green-500/30'
                            : 'bg-red-500 text-black hover:bg-red-400 shadow-lg shadow-red-500/20'}`}>
                        {mesa.isWalkIn ? <CheckCircle2 className="mr-2" size={20}/> : <CreditCard className="mr-2" size={20}/>}
                        {mesa.isWalkIn ? 'Pedido Pagado' : (mesa.comandasCount === 0 && mesa.totalAcumulado === 0 ? 'Generar Consumo & Pagar' : 'Procesar Pago')}
                    </button>
                </div>
            ))}

            {billingTables.length === 0 && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 text-center bg-[#121214]/50 border border-gray-800/50 rounded-2xl border-dashed">
                    <CheckCircle2 className="mx-auto text-green-500/50 mb-4" size={48}/>
                    <h3 className="text-xl font-medium text-gray-400 mb-2">No hay cuentas por cobrar</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">Todas las mesas han sido facturadas o no hay mesas ocupadas actualmente.</p>
                </div>
            )}
        </div>

        {/* Modal de Ticket (Recibo) */}
        {showReceipt && receiptData && (
          <div className="fixed inset-0 z-[100] flex justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 overflow-y-auto animate-fade-in">
            <div className="bg-white text-gray-900 rounded-lg shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] my-auto">
              
              {/* Header Ticket */}
              <div className="bg-[#1a1a1a] p-4 text-center relative border-b-4 border-dashed border-gray-300 flex-shrink-0">
                <button 
                  onClick={() => setShowReceipt(false)}
                  className="absolute top-4 right-4 text-white hover:text-red-400 bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors flex items-center justify-center shadow-lg border border-gray-600"
                  aria-label="Cerrar ticket"
                  title="Cerrar factura"
                >
                  <X size={24} strokeWidth={3} />
                </button>
                <img src="/images/logo.png" alt="Siete Sopas" className="h-12 mx-auto mb-2 opacity-90 brightness-200" />
                <h3 className="text-xl font-black text-white tracking-widest uppercase">FACTURA ELECTRÓNICA</h3>
                <p className="text-xs text-gray-400 font-mono mt-1">MESA #{receiptData.mesa} • {new Date().toLocaleDateString()}</p>
              </div>

              {/* Body Ticket */}
              <div className="p-6 overflow-y-auto bg-gray-50 flex-1 min-h-0 relative custom-scrollbar">
                <div className="space-y-4 font-mono text-sm">
                  {receiptData.detalleItems?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start border-b border-gray-200 pb-3 h-auto">
                      <div className="flex-1 pr-4 whitespace-normal break-words">
                        <span className="font-bold">{item.cantidad}x</span> {item.nombre}
                      </div>
                      <div className="font-bold whitespace-nowrap">
                        S/ {Number(item.subtotal).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Ticket */}
              <div className="p-6 bg-gray-100 border-t-2 border-dashed border-gray-300 flex-shrink-0">
                <div className="space-y-2 font-mono mb-4 text-gray-600">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>S/ {(receiptData.total / 1.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IGV (18%)</span>
                    <span>S/ {(receiptData.total - (receiptData.total / 1.18)).toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-[#1a1a1a] text-white p-4 rounded-xl">
                  <span className="font-black text-lg">TOTAL PAGADO</span>
                  <span className="font-black text-2xl text-green-400">S/ {Number(receiptData.total).toFixed(2)}</span>
                </div>
                
                <div className="text-center mt-6 flex flex-col items-center">
                  <CheckCircle2 className="text-green-500 mb-2" size={32} />
                  <p className="text-xs font-bold text-gray-500">¡GRACIAS POR SU VISITA!</p>
                  <p className="text-[10px] text-gray-400 uppercase mt-1 mb-6">Siete Sopas - Tradición Peruana</p>
                </div>

                <button 
                  onClick={() => setShowReceipt(false)}
                  className="w-full bg-[#1a1a1a] text-white hover:bg-gray-800 text-sm font-bold tracking-widest uppercase py-4 rounded-xl transition-all shadow-lg border border-gray-700 flex items-center justify-center"
                >
                  <X size={18} className="mr-2" />
                  CERRAR BOLETA
                </button>
              </div>

            </div>
          </div>
        )}
    </div>
  );
};
