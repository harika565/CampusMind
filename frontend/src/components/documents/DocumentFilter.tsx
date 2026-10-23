import React from 'react';
import { Search, Filter } from 'lucide-react';
import { DocumentCategory, DocumentProcessingStatus, DocumentAudience } from '../../types';

interface DocumentFilterProps {
  search: string;
  onSearchChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  audience: string;
  onAudienceChange: (val: string) => void;
}

const CATEGORIES: DocumentCategory[] = [
  'Regulations',
  'Academic Calendar',
  'Exam Notifications',
  'Syllabi',
  'Timetables',
  'Fee Structures',
  'Placement Guidelines',
  'Campus Policies',
  'General',
];

const STATUSES: { value: DocumentProcessingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'indexed', label: 'Indexed' },
  { value: 'processing', label: 'Processing' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
];

const AUDIENCES: { value: DocumentAudience | 'all'; label: string }[] = [
  { value: 'all', label: 'All Audiences' },
  { value: 'student', label: 'Student Scope' },
  { value: 'faculty', label: 'Faculty Scope' },
  { value: 'admin', label: 'Admin Only' },
];

export const DocumentFilter: React.FC<DocumentFilterProps> = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  audience,
  onAudienceChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-xl border border-campus-border shadow-subtle mb-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-campus-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title or filename..."
          className="w-full pl-9 pr-3 py-1.5 bg-campus-surface-subtle border border-campus-border rounded-lg text-xs text-campus-text placeholder:text-campus-text-muted focus:outline-none focus:border-campus-primary"
        />
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-campus-text-secondary text-xs">
          <Filter className="w-3.5 h-3.5 text-campus-text-muted" />
          <span className="hidden md:inline">Category:</span>
        </div>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-2.5 py-1.5 bg-campus-surface-subtle border border-campus-border rounded-lg text-xs text-campus-text focus:outline-none focus:border-campus-primary"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full sm:w-auto px-2.5 py-1.5 bg-campus-surface-subtle border border-campus-border rounded-lg text-xs text-campus-text focus:outline-none focus:border-campus-primary"
        >
          {STATUSES.map((st) => (
            <option key={st.value} value={st.value}>
              {st.label}
            </option>
          ))}
        </select>
      </div>

      {/* Audience Filter */}
      <div>
        <select
          value={audience}
          onChange={(e) => onAudienceChange(e.target.value)}
          className="w-full sm:w-auto px-2.5 py-1.5 bg-campus-surface-subtle border border-campus-border rounded-lg text-xs text-campus-text focus:outline-none focus:border-campus-primary"
        >
          {AUDIENCES.map((aud) => (
            <option key={aud.value} value={aud.value}>
              {aud.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
