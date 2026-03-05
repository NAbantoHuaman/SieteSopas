import { useState, useEffect } from 'react';
import { CreditCard, Wallet, CheckCircle2, X, RefreshCw } from 'lucide-react';

export const PaymentModal = ({ show, onClose, total, onPaymentSuccess }) => {
  const [method, setMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (show) {
      setMethod('card');
      setIsProcessing(false);
      setIsSuccess(false);
    }
  }, [show]);

  if (!show) return null;

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate payment processing time
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      // Wait a moment so the user sees the success state
      setTimeout(() => {
        onPaymentSuccess();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={!isProcessing && !isSuccess ? onClose : undefined}></div>
      <div className="relative bg-[#0A0A0B] border border-gray-800 rounded-3xl w-full max-w-md shadow-2xl animate-scale-in overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#121214]">
          <h3 className="text-xl font-bold text-white flex items-center">
            <span className="bg-[#EE1D23]/10 text-[#EE1D23] p-2 rounded-xl mr-3 font-display">
              <CreditCard size={20} />
            </span>
            Pago de Pedido
          </h3>
          {!isProcessing && !isSuccess && (
             <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10">
               <X size={18} />
             </button>
          )}
        </div>

        {isSuccess ? (
          <div className="p-10 flex flex-col items-center justify-center space-y-4 animate-fade-in my-8 text-center">
            <div className="w-20 h-20 bg-[#008248]/10 rounded-full flex items-center justify-center border border-[#008248]/30 animate-pulse">
              <CheckCircle2 size={40} className="text-[#008248]" />
            </div>
            <h4 className="text-2xl font-brand font-black text-white">¡Pago Exitoso!</h4>
            <p className="text-gray-400 text-sm">Estamos preparando tu orden con el sabor de siempre.</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Total Display */}
            <div className="bg-gradient-to-br from-[#1A1A1E] to-[#121214] p-5 rounded-2xl border border-white/5 flex justify-between items-center shadow-inner">
              <span className="text-gray-400 font-medium">Total a Pagar</span>
              <span className="text-3xl font-black gradient-text">S/ {total.toFixed(2)}</span>
            </div>

            {/* Methods */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Método de Pago</p>
              
              <button 
                onClick={() => setMethod('card')}
                className={`w-full p-4 rounded-2xl border flex items-center space-x-4 transition-all ${
                  method === 'card' 
                    ? 'bg-[#EE1D23]/10 border-[#EE1D23]/40' 
                    : 'bg-[#121214] border-white/5 hover:border-white/10 text-gray-400'
                }`}
              >
                <div className={`p-2 rounded-full ${method === 'card' ? 'bg-[#EE1D23]/20 text-[#EE1D23]' : 'bg-white/5'}`}>
                  <CreditCard size={20} />
                </div>
                <div className="text-left">
                  <h4 className={`font-bold ${method === 'card' ? 'text-white' : ''}`}>Tarjeta Crédito/Débito</h4>
                  <p className="text-xs opacity-70">Visa, Mastercard, Amex</p>
                </div>
                <div className="ml-auto">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'card' ? 'border-[#EE1D23]' : 'border-gray-600'}`}>
                        {method === 'card' && <div className="w-2.5 h-2.5 bg-[#EE1D23] rounded-full"></div>}
                    </div>
                </div>
              </button>

              <button 
                onClick={() => setMethod('yape')}
                className={`w-full p-4 rounded-2xl border flex items-center space-x-4 transition-all ${
                  method === 'yape' 
                    ? 'bg-purple-500/10 border-purple-500/40' 
                    : 'bg-[#121214] border-white/5 hover:border-white/10 text-gray-400'
                }`}
              >
                <div className={`p-2 rounded-full ${method === 'yape' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5'}`}>
                  <Wallet size={20} />
                </div>
                <div className="text-left">
                  <h4 className={`font-bold ${method === 'yape' ? 'text-white' : ''}`}>Yape / Plin</h4>
                  <p className="text-xs opacity-70">Pago rápido con QR</p>
                </div>
                <div className="ml-auto">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'yape' ? 'border-purple-500' : 'border-gray-600'}`}>
                        {method === 'yape' && <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>}
                    </div>
                </div>
              </button>
            </div>

            {/* Action */}
            <button 
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-[#008248] to-[#00a85d] hover:from-[#00a85d] hover:to-[#008248] text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-[#008248]/20 mt-4 flex justify-center items-center uppercase tracking-widest text-xs"
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={18} className="animate-spin mr-2" />
                  Procesando...
                </>
              ) : (
                <>Pagar S/ {total.toFixed(2)}</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
