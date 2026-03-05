import { useState } from 'react';
import { CheckCircle2, Users, Brush, Plus, Clock, Edit2, Trash2, X, RefreshCw, Check } from 'lucide-react';
import * as api from '../../api';

export const AdminTablesView = ({ tables, fetchAllData, addNotification }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    numero: 1,
    capacidad: 4
  });

  const handleOpenModal = (table = null) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        numero: parseInt(table.name.replace('Mesa ', '')),
        capacidad: table.capacity
      });
    } else {
      setEditingTable(null);
      // Auto-suggest next available table number
      const nextNum = tables.length > 0 ? Math.max(...tables.map(t => parseInt(t.name.replace('Mesa ', '')))) + 1 : 1;
      setFormData({
        numero: nextNum,
        capacidad: 4
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTable(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingTable) {
        await api.updateMesa(editingTable.id, parseInt(formData.numero), parseInt(formData.capacidad));
        if (addNotification) addNotification(`Mesa ${formData.numero} actualizada`, 'success');
      } else {
        await api.createMesa(parseInt(formData.numero), parseInt(formData.capacidad));
        if (addNotification) addNotification(`Mesa ${formData.numero} creada`, 'success');
      }
      fetchAllData();
      handleCloseModal();
    } catch (error) {
      if (addNotification) addNotification(error.message || 'Error al guardar la mesa', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, name, status) => {
    if (status !== 'LIBRE') {
      if (addNotification) addNotification('Solo se pueden eliminar mesas libres', 'warning');
      return;
    }
    if (confirm(`¿Estás seguro de que deseas eliminar la ${name}?`)) {
      try {
        await api.deleteMesa(id);
        if (addNotification) addNotification(`${name} eliminada`, 'success');
        fetchAllData();
      } catch (error) {
        if (addNotification) addNotification(error.message || 'Error al eliminar la mesa', 'error');
      }
    }
  };

  const cycleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'LIBRE' ? 'OCUPADA' : currentStatus === 'OCUPADA' ? 'LIMPIEZA' : 'LIBRE';
    try {
      await api.changeMesaStatus(id, nextStatus);
      if (addNotification) addNotification(`Estado cambiado a ${nextStatus}`, 'success');
      fetchAllData();
    } catch (error) {
      if (addNotification) addNotification(error.message || 'Error al cambiar estado', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center text-xs text-gray-400 bg-[#121214] border border-gray-800 px-3 py-1.5 rounded-full"><CheckCircle2 size={12} className="text-green-500 mr-1.5"/> Libre</span>
          <span className="flex items-center text-xs text-gray-400 bg-[#121214] border border-gray-800 px-3 py-1.5 rounded-full"><Users size={12} className="text-red-500 mr-1.5"/> Ocupada</span>
          <span className="flex items-center text-xs text-gray-400 bg-[#121214] border border-gray-800 px-3 py-1.5 rounded-full"><Brush size={12} className="text-red-500 mr-1.5"/> Limpieza</span>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl flex items-center justify-center transition-colors"
        >
          <Plus size={16} className="mr-2" /> Nueva Mesa
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {tables.map(table => (
          <div 
            key={table.id} 
            className={`relative p-3 md:p-4 rounded-2xl border transition-all group ${
              table.status === 'LIBRE' ? 'bg-[#121214] border-green-500/30' :
              table.status === 'OCUPADA' ? 'bg-[#121214] border-red-500/30' :
              'bg-[#121214] border-red-500/30'
            }`}
          >
            {/* Quick Actions overlay on hover */}
            <div className="absolute -top-3 -right-3 hidden group-hover:flex space-x-1 z-10 bg-[#0A0A0B] p-1 rounded-lg border border-gray-700 shadow-xl">
              <button onClick={() => handleOpenModal(table)} className="p-1.5 text-indigo-400 hover:bg-indigo-500/20 rounded-md transition-colors" title="Editar Mesa">
                <Edit2 size={14} />
              </button>
              {table.status === 'LIBRE' && (
                <button onClick={() => handleDelete(table.id, table.name, table.status)} className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-md transition-colors" title="Eliminar Mesa">
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-gray-200 text-sm md:text-base">{table.name}</span>
              <div className="flex items-center text-xs text-gray-500 bg-gray-800/50 px-1.5 py-0.5 rounded">
                <Users size={10} className="mr-1"/> {table.capacity}
              </div>
            </div>
            
            {/* Clickable status area to force status change */}
            <div 
              onClick={() => cycleStatus(table.id, table.status)}
              className="mt-3 md:mt-4 cursor-pointer hover:brightness-110 active:scale-95 transition-all"
              title="Clic para forzar cambio de estado"
            >
              {table.status === 'OCUPADA' ? (
                <div className="bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                  <p className="text-xs text-red-400 flex items-center font-medium"><Users size={12} className="mr-1 md:mr-1.5"/> Ocupada</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] md:text-xs text-gray-400 flex items-center"><Clock size={10} className="mr-1"/> {table.timeSeated}m</p>
                    <p className="text-[10px] text-indigo-400 truncate max-w-[50px] md:max-w-auto">{table.waiter}</p>
                  </div>
                </div>
              ) : table.status === 'LIMPIEZA' ? (
                <div className="bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                  <p className="text-xs text-red-400 flex items-center font-medium animate-pulse"><Brush size={12} className="mr-1 md:mr-1.5"/> Limpiando</p>
                </div>
              ) : (
                <div className="bg-green-500/10 p-2 rounded-lg border border-green-500/20">
                  <p className="text-xs text-green-400 flex items-center font-medium"><CheckCircle2 size={12} className="mr-1 md:mr-1.5"/> Disponible</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-gray-800 rounded-2xl w-full max-w-sm shadow-2xl relative animate-fade-in-down overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{editingTable ? 'Editar Mesa' : 'Nueva Mesa'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Número</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={formData.numero}
                    onChange={e => setFormData({...formData, numero: e.target.value})}
                    className="w-full bg-[#0A0A0B] border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Capacidad (Aforo)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    max="20"
                    value={formData.capacidad}
                    onChange={e => setFormData({...formData, capacidad: e.target.value})}
                    className="w-full bg-[#0A0A0B] border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-all font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl font-medium text-gray-300 hover:bg-gray-800 transition-colors"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold transition-colors flex items-center shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw size={18} className="animate-spin mr-2"/> : <Check size={18} className="mr-2"/>}
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
