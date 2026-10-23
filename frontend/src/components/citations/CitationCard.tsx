import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, ExternalLink, BookmarkCheck } from 'lucide-react';
import { Citation } from '../../types';

interface CitationCardProps {
  citation: Citation;
  index: number;
  onOpenDrawer?: (citation: Citation) => void;
}

export const CitationCard: React.FC<CitationCardProps> = ({ citation, index, onOpenDrawer }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-campus-border rounded-lg p-3 text-left transition-all hover:border-campus-primary/40 shadow-subtle text-xs">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <div className="p-1 rounded bg-campus-primary-subtle text-campus-primary shrink-0 mt-0.5">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-campus-text">
                Source [{index + 1}]: {citation.document_title}
              </span>
              {citation.relevance_score && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {Math.round(citation.relevance_score * 100)}% match
                </span>
              )}
            </div>
            {(citation.page_number || citation.section_name) && (
              <p className="text-[11px] text-campus-text-secondary mt-0.5">
                {citation.page_number && <span>Page {citation.page_number}</span>}
                {citation.page_number && citation.section_name && <span> · </span>}
                {citation.section_name && <span className="font-medium text-campus-text">{citation.section_name}</span>}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {citation.excerpt && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded text-campus-text-secondary hover:text-campus-text hover:bg-campus-surface-subtle transition-colors"
              title={isExpanded ? 'Collapse excerpt' : 'Expand excerpt'}
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
          {onOpenDrawer && (
            <button
              onClick={() => onOpenDrawer(citation)}
              className="p-1 rounded text-campus-text-secondary hover:text-campus-primary hover:bg-campus-primary-light transition-colors"
              title="View full context"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Excerpt Body */}
      {citation.excerpt && (
        <div
          className={`mt-2.5 pt-2 border-t border-campus-border/60 text-campus-text-secondary font-serif leading-relaxed ${
            isExpanded ? '' : 'line-clamp-2'
          }`}
        >
          <span className="text-campus-text-muted font-sans mr-1">“</span>
          {citation.excerpt}
          <span className="text-campus-text-muted font-sans ml-1">”</span>
        </div>
      )}

      {/* Footer link if source url is available */}
      {citation.source_url && (
        <div className="mt-2 pt-2 border-t border-dashed border-campus-border flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-campus-text-secondary">
            <BookmarkCheck className="w-3 h-3 text-emerald-600" /> Grounded source verified
          </span>
          <a
            href={citation.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-campus-primary hover:underline flex items-center gap-1 font-medium"
          >
            Open Document <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};
