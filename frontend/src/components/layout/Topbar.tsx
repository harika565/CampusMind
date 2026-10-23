import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  User as UserIcon, 
  Check, 
  ExternalLink, 
  Activity, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { MockIndicator } from './MockIndicator';
import { formatRelativeTime } from '../../utils/formatters';

interface TopbarProps {
  onOpenMobileSidebar?: () => void;
  title?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileSidebar, title }) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, systemHealth } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Generate dynamic breadcrumb
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentTitle =
    title ||
    (pathSegments.length > 0
      ? pathSegments[pathSegments.length - 1].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : 'Overview');

  return (
    <header className="h-14 bg-white border-b border-campus-border px-4 sm:px-6 flex items-center justify-between shrink-0 select-none z-20">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {onOpenMobileSidebar && (
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-1.5 rounded-lg text-campus-text-secondary hover:text-campus-text hover:bg-campus-surface-subtle"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-campus-text text-sm sm:text-base tracking-tight">
            {currentTitle}
          </span>
          <span className="hidden sm:inline-flex items-center text-campus-text-muted gap-1">
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="capitalize">{user?.role || 'Guest'} Portal</span>
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* System Health Pill */}
        <div
          className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
          title="RAG Vector Pipeline & Document Ingestion operational"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>RAG Pipeline Ready</span>
        </div>

        {/* Development Mock Indicator */}
        <MockIndicator />

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-campus-text-secondary hover:text-campus-text hover:bg-campus-surface-subtle transition-colors"
            title="Institutional Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-dropdown border border-campus-border p-3 z-50 text-left text-xs animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-campus-border">
                  <div className="flex items-center gap-1.5 font-semibold text-campus-text">
                    <Bell className="w-4 h-4 text-campus-primary" />
                    <span>Campus Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-campus-primary-light text-campus-primary px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-campus-primary hover:underline font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-center py-4 text-campus-text-muted text-xs">
                      No notifications at this time
                    </p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
                          notif.read
                            ? 'bg-white border-campus-border/70 text-campus-text-secondary'
                            : 'bg-campus-primary-subtle/50 border-campus-primary/30 text-campus-text font-medium'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-xs font-semibold">{notif.title}</p>
                          <span className="text-[10px] text-campus-text-muted shrink-0">
                            {formatRelativeTime(notif.created_at)}
                          </span>
                        </div>
                        <p className="text-[11px] text-campus-text-secondary mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Avatar Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-campus-surface-subtle transition-colors"
            aria-label="User profile options"
          >
            <div className="w-7 h-7 rounded-full bg-campus-primary text-white flex items-center justify-center font-semibold text-xs shadow-subtle">
              {user?.name?.slice(0, 2).toUpperCase() || 'CM'}
            </div>
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-dropdown border border-campus-border p-2 z-50 text-left text-xs animate-in fade-in duration-150">
                <div className="p-2 border-b border-campus-border mb-1">
                  <p className="font-semibold text-campus-text truncate">{user?.name}</p>
                  <p className="text-[11px] text-campus-text-secondary truncate">{user?.email}</p>
                  <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-campus-primary-light text-campus-primary text-[10px] font-semibold uppercase">
                    {user?.role}
                  </span>
                </div>

                <button
                  onClick={() => {
                    navigate('/app/profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-campus-text hover:bg-campus-surface-subtle transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5 text-campus-text-muted" />
                  <span>Account & Settings</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-campus-danger hover:bg-rose-50 transition-colors mt-1"
                >
                  <Activity className="w-3.5 h-3.5 text-campus-danger" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
