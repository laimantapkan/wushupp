import React from 'react';
import { AppNotification } from '../types';
import { Bell, X, AlertCircle, CheckCircle, Info, ShieldAlert } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-500" />
            <h3 className="font-extrabold text-white text-base">Notifikasi & Peringatan System</h3>
          </div>

          <button
            onClick={onClearAll}
            className="text-xs text-slate-400 hover:text-red-400 font-semibold"
          >
            Hapus Semua
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">Tidak ada notifikasi baru.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkAsRead(n.id)}
                className={`p-3.5 rounded-xl border text-xs transition cursor-pointer flex items-start gap-3 ${
                  n.read ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-950 border-red-500/40 text-white font-semibold'
                }`}
              >
                {n.type === 'danger' && <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                {n.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                {n.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                {n.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}

                <div className="flex-1">
                  <p>{n.message}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">{n.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
