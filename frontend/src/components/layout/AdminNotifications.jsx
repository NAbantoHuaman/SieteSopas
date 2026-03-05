import { CheckCircle2, AlertCircle, Bell } from 'lucide-react';

export const AdminNotifications = ({ notifications }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="absolute top-20 right-4 md:right-8 z-50 flex flex-col space-y-2">
      {notifications.map(n => (
        <div key={n.id} className="animate-fade-in-down bg-[#1A1A1E] border border-gray-700/50 text-sm text-gray-200 px-4 py-3 rounded-lg shadow-2xl flex items-center space-x-3 w-64 md:w-72">
          {n.type === 'success' && <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />}
          {n.type === 'warning' && <AlertCircle size={16} className="text-red-400 flex-shrink-0" />}
          {n.type === 'info' && <Bell size={16} className="text-indigo-400 flex-shrink-0" />}
          <span className="truncate">{n.msg}</span>
        </div>
      ))}
    </div>
  );
};
