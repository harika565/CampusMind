import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Loader2 
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { SystemLog } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Button } from '../../components/ui/Button';

export const SystemLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const items = await adminService.getSystemLogs();
      setLogs(items);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter((log) => {
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    const matchesSearch =
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.service.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const getLevelBadge = (level: 'INFO' | 'WARN' | 'ERROR') => {
    switch (level) {
      case 'INFO':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
            INFO
          </span>
        );
      case 'WARN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
            WARN
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
            ERROR
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-campus-text tracking-tight">
            System & RAG Pipeline Logs
          </h1>
          <p className="text-xs text-campus-text-secondary mt-0.5">
            Diagnostic events, vector indexing jobs, and semantic query routing telemetry.
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={fetchLogs}>
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh Telemetry
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-xl border border-campus-border shadow-subtle">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-campus-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs by keyword, service name, or event..."
            className="w-full pl-9 pr-3 py-1.5 bg-campus-surface-subtle border border-campus-border rounded-lg text-xs text-campus-text placeholder:text-campus-text-muted focus:outline-none focus:border-campus-primary"
          />
        </div>

        <div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as 'ALL' | 'INFO' | 'WARN' | 'ERROR')}
            className="w-full sm:w-auto px-3 py-1.5 bg-campus-surface-subtle border border-campus-border rounded-lg text-xs text-campus-text focus:outline-none focus:border-campus-primary"
          >
            <option value="ALL">All Levels</option>
            <option value="INFO">INFO Only</option>
            <option value="WARN">WARN Only</option>
            <option value="ERROR">ERROR Only</option>
          </select>
        </div>
      </div>

      {/* Logs Terminal View */}
      {isLoading ? (
        <div className="bg-white border border-campus-border rounded-xl p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-campus-primary mx-auto mb-3" />
          <p className="text-xs text-campus-text-secondary">Retrieving telemetry streams...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-campus-border rounded-xl p-12 text-center space-y-2">
          <Terminal className="w-8 h-8 text-campus-text-muted mx-auto" />
          <h3 className="text-sm font-semibold text-campus-text">No logs found</h3>
          <p className="text-xs text-campus-text-secondary">No log events match your current filter.</p>
        </div>
      ) : (
        <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 p-4 font-mono text-xs overflow-x-auto shadow-card space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
            <span>TIMESTAMP</span>
            <span>SERVICE / EVENT LOG</span>
          </div>
          {filtered.map((log) => (
            <div key={log.id} className="flex flex-col sm:flex-row sm:items-start gap-2 py-1 hover:bg-slate-800/50 rounded px-1.5 transition-colors">
              <span className="text-[11px] text-slate-400 shrink-0 sm:w-44">
                {formatDate(log.timestamp)}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                {getLevelBadge(log.level)}
                <span className="text-campus-accent font-semibold text-[11px]">
                  [{log.service}]
                </span>
              </div>
              <p className="text-slate-200 leading-relaxed break-words flex-1">
                {log.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
