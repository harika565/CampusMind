import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Upload, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  Shield 
} from 'lucide-react';
import { documentService } from '../../services/documentService';
import { CampusDocument } from '../../types';
import { DocumentTable } from '../../components/documents/DocumentTable';
import { DocumentFilter } from '../../components/documents/DocumentFilter';
import { DocumentUploadModal } from '../../components/documents/DocumentUploadModal';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { formatDate, formatFileSize } from '../../utils/formatters';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<CampusDocument[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [audience, setAudience] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<CampusDocument | null>(null);

  const navigate = useNavigate();

  const loadDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const list = await documentService.getDocuments({
        search: search.trim() || undefined,
        category: category !== 'all' ? category : undefined,
        status: status !== 'all' ? status : undefined,
      });

      // Filter audience client-side if needed
      const filtered = audience === 'all' ? list : list.filter(d => d.audience === audience);
      setDocuments(filtered);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [search, category, status, audience]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleDelete = async (id: string) => {
    try {
      await documentService.deleteDocument(id);
      loadDocuments();
    } catch {
      alert('Failed to delete document from index.');
    }
  };

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-campus-text tracking-tight">
            Institutional Document Repository
          </h1>
          <p className="text-xs text-campus-text-secondary mt-0.5">
            Manage official university regulations, calendars, syllabi, and policy files indexed into the RAG vector store.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={loadDocuments}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
          </Button>
          <Button size="sm" onClick={() => setIsUploadOpen(true)}>
            <Upload className="w-3.5 h-3.5 mr-1" /> Ingest New Document
          </Button>
        </div>
      </div>

      {/* Filter Component */}
      <DocumentFilter
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        status={status}
        onStatusChange={setStatus}
        audience={audience}
        onAudienceChange={setAudience}
      />

      {/* Document Table */}
      <DocumentTable
        documents={documents}
        isLoading={isLoading}
        onDeleteDocument={handleDelete}
        onViewDocument={(doc) => setSelectedDoc(doc)}
      />

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => {
          loadDocuments();
        }}
      />

      {/* Document Metadata Inspection Modal */}
      {selectedDoc && (
        <Modal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          title="Document Metadata & Ingestion Status"
          description="Detailed vector indexing and scope metadata for this institutional file."
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs text-left">
            <div className="p-4 rounded-xl bg-campus-surface-subtle border border-campus-border space-y-2">
              <h3 className="text-sm font-semibold text-campus-text">{selectedDoc.title}</h3>
              <p className="font-mono text-campus-text-muted">{selectedDoc.file_name}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-campus-border rounded-lg space-y-1">
                <span className="text-campus-text-muted block text-[11px]">Category</span>
                <span className="font-semibold text-campus-text">{selectedDoc.category}</span>
              </div>
              <div className="p-3 bg-white border border-campus-border rounded-lg space-y-1">
                <span className="text-campus-text-muted block text-[11px]">Target Audience</span>
                <span className="font-semibold text-campus-text capitalize">{selectedDoc.audience}</span>
              </div>
              <div className="p-3 bg-white border border-campus-border rounded-lg space-y-1">
                <span className="text-campus-text-muted block text-[11px]">Processing Status</span>
                <span className="font-semibold text-campus-text capitalize">{selectedDoc.status}</span>
              </div>
              <div className="p-3 bg-white border border-campus-border rounded-lg space-y-1">
                <span className="text-campus-text-muted block text-[11px]">Vector Chunks</span>
                <span className="font-semibold text-campus-text font-mono">
                  {selectedDoc.chunks_count || '0'} chunks
                </span>
              </div>
              <div className="p-3 bg-white border border-campus-border rounded-lg space-y-1">
                <span className="text-campus-text-muted block text-[11px]">File Size</span>
                <span className="font-semibold text-campus-text font-mono">
                  {formatFileSize(selectedDoc.file_size)}
                </span>
              </div>
              <div className="p-3 bg-white border border-campus-border rounded-lg space-y-1">
                <span className="text-campus-text-muted block text-[11px]">Uploaded Timestamp</span>
                <span className="font-semibold text-campus-text">
                  {formatDate(selectedDoc.uploaded_at)}
                </span>
              </div>
            </div>

            {selectedDoc.error_message && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
                <span className="font-bold block mb-1">Ingestion Error Diagnostic:</span>
                {selectedDoc.error_message}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="secondary" onClick={() => setSelectedDoc(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
