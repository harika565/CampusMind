import React, { useState } from 'react';
import { Database, ShieldCheck, ChevronDown, Check, Server, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from '../../services/apiClient';
import { DEMO_USERS } from '../../mocks/mockData';

export const MockIndicator: React.FC = () => {
  const { isMockMode, toggleMockMode, login, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitchUser = async (roleKey: 'student' | 'faculty' | 'admin') => {
    setIsSwitching(true);
    try {
      const demoAccount = DEMO_USERS[roleKey];
      await login({
        email: demoAccount.user.email,
        password: demoAccount.password,
      });
      setIsOpen(false);
    } catch {
      // ignore
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
          isMockMode
            ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
        }`}
        title="Click to view API & Demo settings"
      >
        <span
          className={`w-1.5 h-1.5 rounded-full animate-pulse ${
            isMockMode ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
        />
        <span>{isMockMode ? 'Mock Demo Mode' : 'Connected to Live API'}</span>
        <ChevronDown className="w-3 h-3 text-current opacity-70" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-dropdown border border-campus-border p-3.5 z-50 text-left text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-campus-border">
              <div className="flex items-center gap-1.5 font-semibold text-campus-text">
                <Database className="w-4 h-4 text-campus-primary" />
                <span>Data Environment</span>
              </div>
              <span className="text-[11px] font-mono text-campus-text-muted">
                {isMockMode ? 'MOCKS: ON' : 'MOCKS: OFF'}
              </span>
            </div>

            <div className="mb-3 space-y-1 text-campus-text-secondary text-[11px]">
              <div className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-campus-text-muted shrink-0" />
                <span className="truncate">Target: <code className="font-mono text-campus-text">{BASE_URL}</code></span>
              </div>
              <p className="text-[11px] leading-relaxed text-campus-text-secondary">
                {isMockMode
                  ? 'Demonstrating offline student, faculty, and admin workflows.'
                  : 'Requests are proxied to the live backend RAG API.'}
              </p>
            </div>

            <div className="pt-2 pb-2 border-t border-campus-border">
              <div className="flex items-center justify-between">
                <span className="font-medium text-campus-text">Toggle Mock Mode</span>
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
            </div>

            {isMockMode && (
              <div className="pt-2 border-t border-campus-border">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-campus-text-muted mb-2">
                  Quick Demo Switch
                </p>
                <div className="space-y-1">
                  {(['student', 'faculty', 'admin'] as const).map((r) => {
                    const isCurrent = user?.role === r;
                    const demo = DEMO_USERS[r];
                    return (
                      <button
                        key={r}
                        onClick={() => handleSwitchUser(r)}
                        disabled={isSwitching}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors ${
                          isCurrent
                            ? 'bg-campus-primary-light/60 text-campus-primary font-medium'
                            : 'hover:bg-campus-surface-subtle text-campus-text'
                        }`}
                      >
                        <div className="truncate">
                          <p className="capitalize text-xs leading-none">{demo.user.name}</p>
                          <p className="text-[10px] text-campus-text-secondary mt-0.5 capitalize">
                            Role: {r}
                          </p>
                        </div>
                        {isCurrent ? (
                          <Check className="w-3.5 h-3.5 text-campus-primary shrink-0" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5 text-campus-text-muted opacity-50 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
