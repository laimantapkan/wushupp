import React, { useState } from 'react';
import { UserRole, AppNotification } from '../types';
import { Bell, Wifi, WifiOff, Menu, ChevronDown, CheckCircle } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onToggleMobileMenu: () => void;
  isConnected: boolean;
  contingentName: string;
  faviconUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  notifications,
  onOpenNotifications,
  onToggleMobileMenu,
  isConnected,
  contingentName,
  faviconUrl = '/wushu_logo.svg',
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleLabels: Record<UserRole, { label: string; bg: string; icon: string }> = {
    admin: { label: 'ADMIN / MANAGER', bg: 'bg-red-600 text-white', icon: '👑' },
    pelatih: { label: 'PELATIH (COACH)', bg: 'bg-amber-600 text-white', icon: '📋' },
    official: { label: 'OFFICIAL / LOGISTIK', bg: 'bg-blue-600 text-white', icon: '💼' },
    atlet: { label: 'ATLET PORPROV', bg: 'bg-emerald-600 text-white', icon: '🥊' },
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Mobile Menu Trigger + Brand with PB Wushu Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white p-0.5 flex items-center justify-center shadow-lg glow-red overflow-hidden shrink-0">
              <img
                src={faviconUrl}
                alt="Logo PB Wushu Indonesia"
                className="w-full h-full object-contain rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/wushu_logo.svg';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white uppercase">
                  WUSHU PORPROV SUMBAR XVI 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[220px] sm:max-w-md">
                {contingentName}
              </p>
            </div>
          </div>
        </div>

        {/* Right Actions: Realtime Badge, Notifications, Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Connection Status Badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
            title={isConnected ? 'Sinkronisasi Real-time Aktif' : 'Menghubungkan ke Server...'}
          >
            {isConnected ? (
              <>
                <Wifi className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span>Live Sync</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Offline Sync</span>
              </>
            )}
          </div>

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Notifikasi Kontingen"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow ${roleLabels[currentRole].bg}`}
            >
              <span>{roleLabels[currentRole].icon}</span>
              <span className="hidden md:inline">{roleLabels[currentRole].label}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                <div className="px-3 py-2 border-b border-slate-700 text-xs text-slate-400 font-semibold uppercase">
                  Pilih Peran Pengguna
                </div>
                {(['admin', 'pelatih', 'official', 'atlet'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left transition ${
                      currentRole === r
                        ? 'bg-slate-700/80 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-700/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{roleLabels[r].icon}</span>
                      <span>{roleLabels[r].label}</span>
                    </div>
                    {currentRole === r && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
