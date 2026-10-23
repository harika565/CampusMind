import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Upload, 
  Users, 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  MessageSquare,
  Sparkles,
  Loader2
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { documentService } from '../../services/documentService';
import { DashboardMetrics, CampusDocument } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Button } from '../../components/ui/Button';
import { DocumentUploadModal } from '../../components/documents/DocumentUploadModal';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentDocs, setRecentDocs] = useState<CampusDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [m, docs] = await Promise.all([
        adminService.getDashboardMetrics(),
        documentService.getDocuments(),
      ]);
      setMetrics(m);
      setRecentDocs(docs.slice(0, 5));
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Admin Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-campus-primary-light text-campus-primary text-xs font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Campus Institutional Governance</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-campus-text tracking-tight">
            Administrative Control Center
          </h1>
          <p className="text-xs text-campus-text-secondary mt-0.5">
            Manage institutional document indexing, RAG ingestion pipelines, and user access privileges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setIsUploadOpen(true)}>
            <Upload className="w-3.5 h-3.5 mr-1" /> Upload Document
          </Button>
          <Button variant="secondary" size="sm" onClick={() => navigate('/admin/documents')}>
            Document Repository
          </Button>
        </div>
      </div>

      {/* Metrics Overview Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white border border-campus-border rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Total Documents */}
          <div className="bg-white border border-campus-border rounded-xl p-4 shadow-subtle space-y-1">
            <div className="flex items-center justify-between text-campus-text-secondary">
              <span className="text-xs font-medium">Total Documents</span>
              <FileText className="w-4 h-4 text-campus-primary" />
            </div>
            <p className="text-2xl font-bold text-campus-text">{metrics?.total_documents ?? 0}</p>
            <p className="text-[11px] text-campus-text-muted">Repository catalog</p>
          </div>

          {/* Indexed Documents */}
          <div className="bg-white border border-campus-border rounded-xl p-4 shadow-subtle space-y-1">
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-xs font-medium text-campus-text-secondary">Indexed in RAG</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-700">{metrics?.indexed_documents ?? 0}</p>
            <p className="text-[11px] text-campus-text-muted">Active in vector search</p>
          </div>

          {/* Processing / Ingesting */}
          <div className="bg-white border border-campus-border rounded-xl p-4 shadow-subtle space-y-1">
            <div className="flex items-center justify-between text-blue-700">
              <span className="text-xs font-medium text-campus-text-secondary">Processing Jobs</span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-700">{metrics?.processing_documents ?? 0}</p>
            <p className="text-[11px] text-campus-text-muted">Chunking & embedding</p>
          </div>

          {/* Failed Documents */}
          <div className="bg-white border border-campus-border rounded-xl p-4 shadow-subtle space-y-1">
            <div className="flex items-center justify-between text-rose-700">
              <span className="text-xs font-medium text-campus-text-secondary">Failed Ingestions</span>
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-2xl font-bold text-rose-700">{metrics?.failed_documents ?? 0}</p>
            <p className="text-[11px] text-campus-text-muted">Requires administrative review</p>
          </div>
        </div>
      )}

      {/* RAG Pipeline Status & Quick Admin Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Ingested Files (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-campus-border rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-campus-primary" />
              <h3 className="text-sm font-semibold text-campus-text">Recent Document Ingestions</h3>
            </div>
            <button
              onClick={() => navigate('/admin/documents')}
              className="text-xs font-medium text-campus-primary hover:underline flex items-center gap-1"
            >
              Full Repository <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-campus-border">
            {recentDocs.length === 0 ? (
              <p className="py-6 text-center text-xs text-campus-text-secondary">
                No recent document activity.
              </p>
            ) : (
              recentDocs.map((doc) => (
                <div key={doc.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-lg bg-campus-primary-subtle text-campus-primary shrink-0 mt-0.5">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-campus-text truncate">{doc.title}</p>
                      <p className="text-[11px] text-campus-text-secondary mt-0.5">
                        {doc.category} · {doc.audience.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                        doc.status === 'indexed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : doc.status === 'processing'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : doc.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {doc.status}
                    </span>
                    <span className="text-[10px] text-campus-text-muted hidden sm:inline">
                      {formatDate(doc.uploaded_at)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Administration Actions & System Health (1 Col) */}
        <div className="space-y-4">
          <div className="bg-white border border-campus-border rounded-2xl p-5 shadow-card space-y-3">
            <h3 className="text-sm font-semibold text-campus-text">Quick Admin Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-campus-border hover:bg-campus-primary-subtle/50 transition-colors text-left"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-campus-text">
                  <Upload className="w-4 h-4 text-campus-primary" />
                  <span>Upload Policy / Calendar</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-campus-text-muted" />
              </button>

              <button
                onClick={() => navigate('/admin/users')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-campus-border hover:bg-campus-primary-subtle/50 transition-colors text-left"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-campus-text">
                  <Users className="w-4 h-4 text-campus-primary" />
                  <span>View User Directory</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-campus-text-muted" />
              </button>

              <button
                onClick={() => navigate('/admin/logs')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-campus-border hover:bg-campus-primary-subtle/50 transition-colors text-left"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-campus-text">
                  <Activity className="w-4 h-4 text-campus-primary" />
                  <span>Inspect System Logs</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-campus-text-muted" />
              </button>
            </div>
          </div>

          {/* System Health Card */}
          <div className="bg-white border border-campus-border rounded-2xl p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-campus-text">Vector Pipeline Health</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Healthy
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-campus-text-secondary">
              <div className="flex justify-between py-1 border-b border-campus-border">
                <span>Vector Index Store</span>
                <span className="font-mono text-campus-text">Connected</span>
              </div>
              <div className="flex justify-between py-1 border-b border-campus-border">
                <span>Embedding Model</span>
                <span className="font-mono text-campus-text">Active (dim=1536)</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Document Ingestion Worker</span>
                <span className="font-mono text-campus-text">Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => {
          loadData();
        }}
      />
    </div>
  );
};
