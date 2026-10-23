import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Citation } from '../../types';
import { CitationCard } from './CitationCard';
import { SourceDrawer } from './SourceDrawer';

interface CitationListProps {
  citations?: Citation[];
}

export const CitationList: React.FC<CitationListProps> = ({ citations }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeDrawerCitation, setActiveDrawerCitation] = useState<Citation | null>(null);

  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-campus-border/70">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-xs font-semibold text-campus-primary hover:text-campus-primary-hover transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-campus-primary" />
          <span>Supporting Citations ({citations.length})</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        <span className="text-[10px] text-campus-text-muted">
          Grounded in official institutional records
        </span>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-2 animate-in fade-in duration-200">
          {citations.map((citation, index) => (
            <CitationCard
              key={citation.id || index}
              citation={citation}
              index={index}
              onOpenDrawer={(c) => setActiveDrawerCitation(c)}
            />
          ))}
        </div>
      )}

      {/* Slide-over Drawer for Citation Details */}
      {activeDrawerCitation && (
        <SourceDrawer
          citation={activeDrawerCitation}
          onClose={() => setActiveDrawerCitation(null)}
        />
      )}
    </div>
  );
};
