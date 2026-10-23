import React from 'react';
import { X, FileText, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';
import { Citation } from '../../types';

interface SourceDrawerProps {
  citation: Citation;
  onClose: () => void;
}

export const SourceDrawer: React.FC<SourceDrawerProps> = ({ citation, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white shadow-modal h-full z-10 flex flex-col border-l border-campus-border animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-campus-border bg-campus-surface-subtle">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-campus-primary-subtle text-campus-primary">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-campus-text">Institutional Source</h3>
              <p className="text-[11px] text-campus-text-secondary">RAG Verified Citation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-campus-text-muted hover:text-campus-text hover:bg-gray-100 transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-left">
          {/* Document metadata block */}
          <div className="bg-campus-surface-subtle border border-campus-border rounded-xl p-4 space-y-2">
            <h4 className="text-sm font-semibold text-campus-text">{citation.document_title}</h4>
            <div className="flex flex-wrap gap-2 text-xs text-campus-text-secondary">
              {citation.page_number && (
                <span className="bg-white px-2 py-0.5 rounded border border-campus-border font-medium text-campus-text">
                  Page {citation.page_number}
                </span>
              )}
              {citation.section_name && (
                <span className="bg-white px-2 py-0.5 rounded border border-campus-border">
                  {citation.section_name}
                </span>
              )}
              {citation.relevance_score && (
                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> {Math.round(citation.relevance_score * 100)}% Match
                </span>
              )}
            </div>
          </div>

          {/* Excerpt Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-campus-text uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-campus-primary" />
              <span>Extracted Document Passage</span>
            </div>
            <div className="p-4 bg-gray-50 border border-campus-border rounded-xl font-serif text-sm text-campus-text leading-relaxed">
              {citation.excerpt ? (
                <p>“{citation.excerpt}”</p>
              ) : (
                <p className="text-campus-text-muted italic">
                  Excerpt is available in the indexed primary document.
                </p>
              )}
            </div>
          </div>

          {/* Integrity Note */}
          <div className="p-3 bg-blue-50/60 border border-blue-200/60 rounded-xl text-xs text-blue-900 leading-relaxed">
            <span className="font-semibold block mb-0.5">Grounding Assurance</span>
            This citation was retrieved from the university knowledge base. CampusMind ensures responses strictly adhere to authoritative campus documents.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-campus-border bg-white flex justify-end gap-2">
          {citation.source_url ? (
            <a
              href={citation.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full text-xs"
            >
              Open Full Document <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          ) : (
            <button onClick={onClose} className="btn-secondary w-full text-xs">
              Close Preview
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
