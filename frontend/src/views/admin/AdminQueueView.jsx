import { Plus, Users, Clock, ChevronDown, AlertCircle } from 'lucide-react';

export const AdminQueueView = ({ queue, assigningQueueId, setAssigningQueueId, tables, handleAssignTable }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#121214] p-4 rounded-2xl border border-gray-800 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-lg font-bold text-gray-100">Cola Virtual</h2>
          <p className="text-sm text-gray-500">Gestión de espera y asignación inteligente</p>
        </div>
        <button className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 text-sm font-medium px-4 py-2 rounded-xl flex items-center justify-center transition-colors">
          <Plus size={16} className="mr-2" /> Nuevo Cliente
        </button>
      </div>

      <div className="space-y-3">
        {queue.map((q, idx) => (
          <div key={q.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#121214] border border-gray-800/60 rounded-xl hover:border-gray-700 transition-colors gap-4">
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                q.status === 'LLAMANDO' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-gray-800 text-gray-400'
              }`}>
                #{idx + 1}
              </div>
              <div>
                <h4 className="font-semibold text-gray-200">{q.name}</h4>
                <div className="flex items-center text-xs text-gray-500 space-x-3 mt-1">
                  <span className="flex items-center"><Users size={12} className="mr-1"/> {q.size} pers.</span>
                  <span className="flex items-center"><Clock size={12} className="mr-1"/> {q.waitTime} min espera</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-3">
              {q.status === 'LLAMANDO' && <span className="text-xs font-bold text-red-500 animate-pulse uppercase tracking-wider hidden sm:block">Llamando...</span>}
              
              <div className="relative w-full sm:w-auto">
                <button 
                  onClick={() => setAssigningQueueId(assigningQueueId === q.id ? null : q.id)} 
                  className="w-full sm:w-auto px-4 py-2 sm:py-1.5 text-xs font-medium bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center"
                >
                  Asignar Mesa <ChevronDown size={14} className={`ml-1 transition-transform ${assigningQueueId === q.id ? 'rotate-180' : ''}`}/>
                </button>
                
                {assigningQueueId === q.id && (
                  <div className="absolute right-0 sm:right-0 left-0 sm:left-auto mt-2 w-full sm:w-56 bg-[#1A1A1E] border border-gray-700 rounded-xl shadow-xl z-20 p-2 animate-fade-in-down">
                    <p className="text-[10px] text-gray-500 uppercase px-2 mb-2 font-bold tracking-wider">Mesas Sugeridas ({q.size} pax)</p>
                    <div className="space-y-1">
                      {tables.filter(t => t.status === 'LIBRE' && t.capacity >= q.size).slice(0, 4).map(t => (
                        <button 
                          key={t.id} 
                          onClick={() => handleAssignTable(q, t.id)} 
                          className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-indigo-500/20 hover:text-indigo-400 rounded-lg transition-colors flex justify-between items-center group"
                        >
                          <span className="font-medium">{t.name}</span>
                          <span className="text-xs text-gray-500 group-hover:text-indigo-400/70">Cap: {t.capacity}</span>
                        </button>
                      ))}
                      {tables.filter(t => t.status === 'LIBRE' && t.capacity >= q.size).length === 0 && (
                        <p className="text-xs text-red-400 px-2 py-2 flex items-center"><AlertCircle size={12} className="mr-1"/> No hay mesas libres para este grupo.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
