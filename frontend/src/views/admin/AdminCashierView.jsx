import { Receipt, CreditCard, CheckCircle2 } from 'lucide-react';
import * as api from '../../api';

export const AdminCashierView = ({ billingTables, fetchAllData, addNotification }) => {
  const handlePayment = async (mesaId) => {
    try {
      await api.cobrarMesa(mesaId);
      addNotification(`Pago procesado para la mesa exitosamente`, 'success');
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
                            <span className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1 block">Mesa Ocupada</span>
                            <h3 className="text-2xl font-black text-white">Mesa {mesa.mesaNumero}</h3>
                        </div>
                        <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                            <Receipt className="text-red-500" size={24}/>
                        </div>
                    </div>

                    <div className="space-y-2 mb-6 flex-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Total Comandas:</span>
                            <span className="text-white font-medium">{mesa.comandasCount} pendientes</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Capacidad Mesa:</span>
                            <span className="text-white font-medium">{mesa.capacidad} pax</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-800 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-medium">Total a Pagar</span>
                            <span className="text-3xl font-black text-green-400">S/ {mesa.totalAcumulado.toFixed(2)}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => handlePayment(mesa.mesaId)}
                        disabled={mesa.isWalkIn || (mesa.comandasCount === 0 && mesa.totalAcumulado === 0)}
                        className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center transition-all ${
                            mesa.isWalkIn 
                            ? 'bg-green-500/20 text-green-400 cursor-not-allowed border border-green-500/30'
                            : (mesa.comandasCount === 0 && mesa.totalAcumulado === 0) 
                              ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                              : 'bg-red-500 text-black hover:bg-red-400 shadow-lg shadow-red-500/20'}`}>
                        {mesa.isWalkIn ? <CheckCircle2 className="mr-2" size={20}/> : <CreditCard className="mr-2" size={20}/>}
                        {mesa.isWalkIn ? 'Pedido Pagado' : 'Procesar Pago'}
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
    </div>
  );
};
