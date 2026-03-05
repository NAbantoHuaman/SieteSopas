import { Settings, Save } from 'lucide-react';

export const AdminSettingsView = ({ addNotification }) => {
  const handleSave = (e) => {
    e.preventDefault();
    if (addNotification) addNotification('Configuración guardada exitosamente', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center"><Settings className="text-gray-400 mr-3" size={28}/> Configuración General</h2>
        </div>

        <div className="bg-[#121214] border border-gray-800 rounded-2xl p-6">
            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-800 pb-2">Información del Restaurante</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Nombre del Local</label>
                            <input type="text" defaultValue="Siete Sopas - Lince" className="w-full bg-[#0A0A0B] border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-all font-medium" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Teléfono de Reservas</label>
                            <input type="text" defaultValue="01 234-5678" className="w-full bg-[#0A0A0B] border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-all font-medium" />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-800 pb-2">Opciones de Sistema</h3>
                    <div className="space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-700 text-indigo-500 bg-[#0A0A0B] focus:ring-indigo-500 focus:ring-offset-[#121214]" />
                            <span className="text-gray-300 font-medium">Habilitar Cola Virtual Pública</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-700 text-indigo-500 bg-[#0A0A0B] focus:ring-indigo-500 focus:ring-offset-[#121214]" />
                            <span className="text-gray-300 font-medium">Auto-asignar mesas liberadas</span>
                        </label>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold transition-colors flex items-center shadow-lg shadow-indigo-500/20">
                        <Save size={18} className="mr-2"/> Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};
