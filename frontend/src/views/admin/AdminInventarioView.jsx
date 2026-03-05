import { useState } from 'react';
import { Package, Plus, Edit2, Check, X, RefreshCw, AlertCircle } from 'lucide-react';
import * as api from '../../api';

export const AdminInventarioView = ({ menu, fetchAllData, addNotification }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagenUrl: '',
    disponible: true
  });

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        stock: product.stock,
        imagenUrl: product.imagenUrl,
        disponible: product.disponible
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        imagenUrl: '',
        disponible: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        await api.updateProducto(editingProduct.id, payload);
        if (addNotification) addNotification('Producto actualizado exitosamente', 'success');
      } else {
        await api.createProducto(payload);
        if (addNotification) addNotification('Producto creado exitosamente', 'success');
      }
      fetchAllData();
      handleCloseModal();
    } catch (error) {
      if (addNotification) addNotification(error.message || 'Error al guardar el producto', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await api.changeProductoStatus(id, !currentStatus);
      if (addNotification) addNotification(`Producto ${!currentStatus ? 'habilitado' : 'deshabilitado'}`, 'success');
      fetchAllData();
    } catch (error) {
      if (addNotification) addNotification(error.message || 'Error al cambiar disponibilidad', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in p-6 relative">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tight leading-none">GESTIÓN DE INVENTARIO</h2>
          <p className="text-[#EE1D23] text-[10px] font-black uppercase tracking-[0.2em] mt-2">Control total de stock y disponibilidad</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-[#EE1D23] hover:bg-[#D4141A] text-white px-6 py-3 rounded-2xl flex items-center transition-all duration-300 shadow-[0_0_20px_rgba(238,29,35,0.2)] active:scale-95 group"
        >
          <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform"/> 
          <span className="text-[10px] font-black uppercase tracking-widest">Añadir Producto</span>
        </button>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 border-white/5">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-gray-500 border-b border-white/5">Producto</th>
                <th className="px-8 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-gray-500 border-b border-white/5">Precio</th>
                <th className="px-8 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-gray-500 border-b border-white/5">Stock</th>
                <th className="px-8 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-gray-500 border-b border-white/5">Estado</th>
                <th className="px-8 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-gray-500 border-b border-white/5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {menu.map((item, idx) => (
                <tr key={item.id} className="group hover:bg-white/[0.01] transition-colors stagger-${idx + 1}">
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                      <div className="h-14 w-14 flex-shrink-0 rounded-2xl overflow-hidden bg-[#121214] border border-white/10 mr-4 shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <img src={item.imagenUrl} alt={item.nombre} className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div>
                        <div className="font-display font-black text-xl text-white uppercase tracking-tight group-hover:text-[#EE1D23] transition-colors leading-none">{item.nombre}</div>
                        <div className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-wider truncate max-w-xs">{item.descripcion}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-white font-display text-lg">S/ {item.precio?.toFixed(2)}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${item.stock > 0 ? 'bg-[#00E676]/10 text-[#00E676] border-[#00E676]/20' : 'bg-[#EE1D23]/10 text-[#EE1D23] border-[#EE1D23]/20'}`}>
                      {item.stock} UNIDADES
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <button 
                      onClick={() => toggleAvailability(item.id, item.disponible)}
                      className={`flex items-center text-[10px] font-black uppercase tracking-[0.15em] px-4 py-2 rounded-xl border transition-all duration-300 ${item.disponible ? 'bg-[#EE1D23]/10 text-[#EE1D23] border-[#EE1D23]/20 hover:bg-[#EE1D23]/20' : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'}`}
                    >
                      {item.disponible ? <><Check size={14} className="mr-2"/> Activo</> : <><X size={14} className="mr-2"/> Inactivo</>}
                    </button>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => handleOpenModal(item)}
                      className="text-gray-400 hover:text-white p-3 bg-white/5 hover:bg-[#EE1D23]/10 border border-white/5 hover:border-[#EE1D23]/30 rounded-2xl transition-all active:scale-90"
                    >
                      <Edit2 size={18}/>
                    </button>
                  </td>
                </tr>
              ))}
              {menu.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-dashed border-white/10">
                      <Package size={32} className="text-gray-700" />
                    </div>
                    <p className="text-gray-500 font-black uppercase text-xs tracking-[0.3em]">Inventario Vacío</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[1000] flex items-center justify-center p-6 sm:p-8 animate-fade-in">
          <div className="glass-card rounded-[3rem] w-full max-w-xl shadow-[0_0_100px_rgba(0,0,0,0.5)] relative animate-scale-in overflow-hidden border-[#EE1D23]/20">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#EE1D23] to-transparent opacity-50"></div>
            
            <div className="p-10 border-b border-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-display font-black text-white uppercase tracking-tight leading-none">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                <p className="text-[#EE1D23] text-[9px] font-black uppercase tracking-[0.2em] mt-2">Detalles técnicos del plato</p>
              </div>
              <button onClick={handleCloseModal} className="w-12 h-12 bg-white/5 hover:bg-[#EE1D23]/10 border border-white/5 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#EE1D23] transition-all group">
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">Nombre del Producto</label>
                  <input 
                    type="text" 
                    required
                    value={formData.nombre}
                    onChange={e => setFormData({...formData, nombre: e.target.value})}
                    className="w-full glass-light border border-white/5 rounded-[1.25rem] px-6 py-4 text-white focus:outline-none focus:border-[#EE1D23]/40 focus:ring-4 focus:ring-[#EE1D23]/5 transition-all font-bold text-sm tracking-wide uppercase placeholder-gray-700"
                    placeholder="Escribir nombre..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">Descripción</label>
                  <textarea 
                    required
                    rows="3"
                    value={formData.descripcion}
                    onChange={e => setFormData({...formData, descripcion: e.target.value})}
                    className="w-full glass-light border border-white/5 rounded-[1.25rem] px-6 py-4 text-white focus:outline-none focus:border-[#EE1D23]/40 focus:ring-4 focus:ring-[#EE1D23]/5 transition-all text-xs font-semibold leading-relaxed resize-none placeholder-gray-700"
                    placeholder="Describir los ingredientes y preparación..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">Precio (PEN)</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#EE1D23]">S/</span>
                      <input 
                        type="number" 
                        required
                        step="0.01"
                        min="0"
                        value={formData.precio}
                        onChange={e => setFormData({...formData, precio: e.target.value})}
                        className="w-full glass-light border border-white/5 rounded-[1.25rem] pl-12 pr-6 py-4 text-white focus:outline-none focus:border-[#EE1D23]/40 transition-all font-display text-2xl tracking-tight"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">Stock Disponible</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: e.target.value})}
                      className="w-full glass-light border border-white/5 rounded-[1.25rem] px-6 py-4 text-white focus:outline-none focus:border-[#EE1D23]/40 transition-all font-display text-2xl tracking-tight"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">URL Imagen Publicitaria</label>
                  <input 
                    type="url" 
                    value={formData.imagenUrl}
                    onChange={e => setFormData({...formData, imagenUrl: e.target.value})}
                    className="w-full glass-light border border-white/5 rounded-[1.25rem] px-6 py-4 text-white focus:outline-none focus:border-[#EE1D23]/40 transition-all text-[10px] font-bold tracking-widest text-[#EE1D23] truncate"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:bg-white/5 transition-all"
                  disabled={isLoading}
                >
                  Descartar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-[#EE1D23] hover:bg-[#D4141A] text-white px-10 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(238,29,35,0.3)] active:scale-95 disabled:opacity-50 flex items-center"
                >
                  {isLoading ? <RefreshCw size={14} className="animate-spin mr-3"/> : <Check size={14} className="mr-3"/>}
                  {editingProduct ? 'ACTUALIZAR PLATO' : 'PUBLICAR PLATO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
