import React from 'react';
import { FileText } from 'lucide-react';
import { Citation } from '../../types';

interface SourceBadgeProps {
  citation: Citation;
  index: number;
  onClick?: () => void;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ citation, index, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-campus-primary-subtle border border-campus-primary/20 text-campus-primary hover:bg-campus-primary-light transition-colors cursor-pointer text-left"
      title={`${citation.document_title}${citation.page_number ? ` (Page ${citation.page_number})` : ''}`}
    >
      <FileText className="w-3 h-3 shrink-0" />
      <span className="font-semibold">[{index + 1}]</span>
      <span className="truncate max-w-[140px]">{citation.document_title}</span>
      {citation.page_number && (
        <span className="text-[10px] text-campus-text-secondary">p.{citation.page_number}</span>
      )}
    </button>
  );
};
