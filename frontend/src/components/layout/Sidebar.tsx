import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  MessageSquare, 
  History, 
  User as UserIcon, 
  FileText, 
  Upload, 
  Users, 
  Activity, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/app/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'faculty') return '/faculty/dashboard';
    return '/app/dashboard';
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
      isActive
        ? 'bg-campus-primary text-white shadow-subtle'
        : 'text-campus-text-secondary hover:text-campus-text hover:bg-campus-surface-subtle'
    }`;

  return (
    <aside className="w-64 h-full bg-white border-r border-campus-border flex flex-col justify-between shrink-0 select-none text-left">
      {/* Top Branding */}
      <div>
        <div className="p-4 border-b border-campus-border flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-campus-primary flex items-center justify-center text-white shadow-subtle">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-campus-text tracking-tight">CampusMind</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-campus-primary-subtle text-campus-primary font-semibold">
                AI
              </span>
            </div>
            <p className="text-[10px] text-campus-text-muted">Intelligent Campus Assistant</p>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-6">
          {/* General Section */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-campus-text-muted mb-1.5">
              Campus AI
            </p>
            <NavLink
              to={getDashboardPath()}
              className={navLinkClass}
              onClick={onCloseMobile}
            >
              <Compass className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </NavLink>

            <NavLink
              to="/app/chat"
              className={navLinkClass}
              onClick={onCloseMobile}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask CampusMind</span>
            </NavLink>

            <NavLink
              to="/app/history"
              className={navLinkClass}
              onClick={onCloseMobile}
            >
              <History className="w-4 h-4" />
              <span>Conversation History</span>
            </NavLink>
          </div>

          {/* Academic Categories shortcut */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-campus-text-muted mb-1.5">
              Knowledge Scope
            </p>
            <NavLink
              to="/app/chat?q=What are the academic regulations?"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-campus-text-secondary hover:text-campus-text hover:bg-campus-surface-subtle transition-colors"
              onClick={onCloseMobile}
            >
              <BookOpen className="w-3.5 h-3.5 text-campus-text-muted" />
              <span>Regulations & Policies</span>
            </NavLink>
            <NavLink
              to="/app/chat?q=Show me the academic calendar dates"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-campus-text-secondary hover:text-campus-text hover:bg-campus-surface-subtle transition-colors"
              onClick={onCloseMobile}
            >
              <BookOpen className="w-3.5 h-3.5 text-campus-text-muted" />
              <span>Academic Calendars</span>
            </NavLink>
          </div>

          {/* Admin Tools (Admin Only) */}
          {user?.role === 'admin' && (
            <div className="space-y-1 pt-2 border-t border-campus-border">
              <div className="px-3 flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-campus-primary">
                  Administration
                </span>
                <ShieldCheck className="w-3 h-3 text-campus-primary" />
              </div>

              <NavLink
                to="/admin/documents"
                className={navLinkClass}
                onClick={onCloseMobile}
              >
                <FileText className="w-4 h-4" />
                <span>Document Repository</span>
              </NavLink>

              <NavLink
                to="/admin/documents/upload"
                className={navLinkClass}
                onClick={onCloseMobile}
              >
                <Upload className="w-4 h-4" />
                <span>Upload Documents</span>
              </NavLink>

              <NavLink
                to="/admin/users"
                className={navLinkClass}
                onClick={onCloseMobile}
              >
                <Users className="w-4 h-4" />
                <span>User Directory</span>
              </NavLink>

              <NavLink
                to="/admin/logs"
                className={navLinkClass}
                onClick={onCloseMobile}
              >
                <Activity className="w-4 h-4" />
                <span>System Logs</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* User Footer Card */}
      <div className="p-3 border-t border-campus-border bg-campus-surface-subtle/60">
        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-campus-border">
          <div
            className="flex items-center gap-2.5 min-w-0 cursor-pointer"
            onClick={() => {
              navigate('/app/profile');
              if (onCloseMobile) onCloseMobile();
            }}
          >
            <div className="w-8 h-8 rounded-full bg-campus-primary-subtle border border-campus-primary/30 flex items-center justify-center text-campus-primary font-semibold text-xs shrink-0">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user?.name?.slice(0, 2).toUpperCase() || 'CM'
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-campus-text truncate leading-tight">
                {user?.name || 'Campus User'}
              </p>
              <p className="text-[10px] text-campus-text-secondary capitalize truncate">
                {user?.role || 'Guest'} · {user?.department || 'General'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 text-campus-text-muted hover:text-campus-danger hover:bg-red-50 rounded-lg transition-colors shrink-0"
            title="Log out of session"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
