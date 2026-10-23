import React from 'react';
import { 
  FileText, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Shield, 
  Layers
} from 'lucide-react';
import { CampusDocument, DocumentProcessingStatus } from '../../types';
import { formatDate, formatFileSize } from '../../utils/formatters';

interface DocumentTableProps {
  documents: CampusDocument[];
  isLoading?: boolean;
  onDeleteDocument?: (id: string) => void;
  onViewDocument?: (doc: CampusDocument) => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  isLoading = false,
  onDeleteDocument,
  onViewDocument,
}) => {
  const renderStatusBadge = (status: DocumentProcessingStatus, error?: string | null) => {
    switch (status) {
      case 'indexed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Indexed
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Loader2 className="w-3 h-3 animate-spin text-blue-600" /> Processing
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> Pending
          </span>
        );
      case 'failed':
        return (
          <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 cursor-help"
            title={error || 'Document processing failure'}
          >
            <AlertCircle className="w-3 h-3 text-rose-600" /> Failed
          </span>
        );
    }
  };

  const renderAudienceBadge = (audience: string) => {
    switch (audience) {
      case 'student':
        return <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Students</span>;
      case 'faculty':
        return <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">Faculty</span>;
      case 'admin':
        return <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Admin Only</span>;
      default:
        return <span className="text-[11px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">All Campus</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-campus-border rounded-xl p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-campus-primary mx-auto mb-3" />
        <p className="text-sm text-campus-text-secondary">Retrieving institutional document repository...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white border border-campus-border rounded-xl p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-campus-primary-subtle text-campus-primary flex items-center justify-center mx-auto mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-campus-text mb-1">No documents matched your filter</h4>
        <p className="text-xs text-campus-text-secondary max-w-sm mx-auto">
          Try adjusting your search criteria, category selection, or upload a new institutional policy document.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-campus-border rounded-xl shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-campus-surface-subtle border-b border-campus-border text-campus-text-secondary font-semibold">
              <th className="py-3 px-4">Document Title</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Scope</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Chunks</th>
              <th className="py-3 px-3">File Size</th>
              <th className="py-3 px-3">Uploaded</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-campus-border">
            {documents.map((doc) => (
              <tr
                key={doc.id}
                className="hover:bg-campus-surface-subtle/70 transition-colors group"
              >
                {/* Title */}
                <td className="py-3.5 px-4 font-medium text-campus-text max-w-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-campus-primary-subtle text-campus-primary shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p
                        className="truncate font-semibold cursor-pointer hover:text-campus-primary transition-colors"
                        onClick={() => onViewDocument && onViewDocument(doc)}
                        title={doc.title}
                      >
                        {doc.title}
                      </p>
                      <p className="text-[11px] text-campus-text-muted truncate font-mono mt-0.5">
                        {doc.file_name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3.5 px-3 text-campus-text-secondary whitespace-nowrap">
                  {doc.category}
                </td>

                {/* Audience */}
                <td className="py-3.5 px-3 whitespace-nowrap">
                  {renderAudienceBadge(doc.audience)}
                </td>

                {/* Status */}
                <td className="py-3.5 px-3 whitespace-nowrap">
                  {renderStatusBadge(doc.status, doc.error_message)}
                </td>

                {/* Chunks */}
                <td className="py-3.5 px-3 text-campus-text-secondary whitespace-nowrap">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Layers className="w-3 h-3 text-campus-text-muted" />
                    {doc.chunks_count ? doc.chunks_count : '—'}
                  </span>
                </td>

                {/* Size */}
                <td className="py-3.5 px-3 text-campus-text-secondary whitespace-nowrap font-mono text-[11px]">
                  {formatFileSize(doc.file_size)}
                </td>

                {/* Uploaded */}
                <td className="py-3.5 px-3 text-campus-text-muted whitespace-nowrap">
                  {formatDate(doc.uploaded_at)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    {onDeleteDocument && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete document "${doc.title}" from index?`)) {
                            onDeleteDocument(doc.id);
                          }
                        }}
                        className="p-1.5 rounded text-campus-text-muted hover:text-campus-danger hover:bg-red-50 transition-colors"
                        title="Delete Document"
                        aria-label={`Delete ${doc.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
