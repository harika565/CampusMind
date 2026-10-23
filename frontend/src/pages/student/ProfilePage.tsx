import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Shield, 
  Building, 
  Key, 
  Database, 
  LogOut, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export const ProfilePage: React.FC = () => {
  const { user, logout, isMockMode, toggleMockMode } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-campus-text tracking-tight">
          Account & Institutional Profile
        </h1>
        <p className="text-xs text-campus-text-secondary mt-0.5">
          Review your verified university role, institutional credentials, and system environment.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white border border-campus-border rounded-2xl p-6 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-campus-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-campus-primary text-white flex items-center justify-center font-bold text-xl shadow-subtle overflow-hidden">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.slice(0, 2).toUpperCase() || 'CM'
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-campus-text">{user?.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold uppercase bg-campus-primary-light text-campus-primary border border-campus-primary/20">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-campus-text-secondary mt-0.5">{user?.email}</p>
            </div>
          </div>

          <Button variant="danger" size="sm" onClick={handleLogout}>
            <LogOut className="w-3.5 h-3.5 mr-1" /> Sign Out
          </Button>
        </div>

        {/* Profile Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-campus-surface-subtle border border-campus-border space-y-1">
            <div className="flex items-center gap-1.5 text-campus-text-muted">
              <Mail className="w-3.5 h-3.5" />
              <span>Email Address</span>
            </div>
            <p className="font-semibold text-campus-text">{user?.email}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-campus-surface-subtle border border-campus-border space-y-1">
            <div className="flex items-center gap-1.5 text-campus-text-muted">
              <Shield className="w-3.5 h-3.5" />
              <span>Institutional Role</span>
            </div>
            <p className="font-semibold text-campus-text capitalize">{user?.role} Scope</p>
          </div>

          <div className="p-3.5 rounded-xl bg-campus-surface-subtle border border-campus-border space-y-1">
            <div className="flex items-center gap-1.5 text-campus-text-muted">
              <Building className="w-3.5 h-3.5" />
              <span>Department / Division</span>
            </div>
            <p className="font-semibold text-campus-text">{user?.department || 'General Academic'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-campus-surface-subtle border border-campus-border space-y-1">
            <div className="flex items-center gap-1.5 text-campus-text-muted">
              <Key className="w-3.5 h-3.5" />
              <span>Institutional Identifier</span>
            </div>
            <p className="font-semibold text-campus-text font-mono">
              {user?.studentId || user?.facultyId || user?.id || '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Environment & Security Preferences */}
      <div className="bg-white border border-campus-border rounded-2xl p-6 shadow-card space-y-4">
        <h3 className="text-sm font-semibold text-campus-text">Developer & Environment Settings</h3>

        <div className="p-4 rounded-xl border border-campus-border flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-campus-text flex items-center gap-1.5">
              <Database className="w-4 h-4 text-campus-primary" />
              Development Mock Mode
            </p>
            <p className="text-[11px] text-campus-text-secondary">
              Toggle between in-memory demonstration service and the live backend API.
            </p>
          </div>
          <button
            onClick={() => toggleMockMode(!isMockMode)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isMockMode ? 'bg-amber-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isMockMode ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/60 text-xs text-blue-900 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-campus-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Security & Session Privacy</p>
            <p className="text-[11px] leading-relaxed">
              Your session utilizes stateless Bearer JWT authorization. Passwords and institutional secrets are never saved in local storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
