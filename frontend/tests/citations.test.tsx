import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CitationCard } from '../src/components/citations/CitationCard';
import { CitationList } from '../src/components/citations/CitationList';
import { Citation } from '../src/types';

const MOCK_CITATION: Citation = {
  id: 'cit_test_1',
  document_id: 'doc_01',
  document_title: 'Academic Regulations Handbook (2026-2027)',
  page_number: 14,
  section_name: 'Section 4.2: Attendance Norms',
  excerpt: 'A student must secure a minimum of 75% attendance in theory courses.',
  relevance_score: 0.95,
};

describe('Citation Components', () => {
  it('renders CitationCard with document title, page number, section, and excerpt', () => {
    render(<CitationCard citation={MOCK_CITATION} index={0} />);

    expect(screen.getByText(/Academic Regulations Handbook/i)).toBeInTheDocument();
    expect(screen.getByText(/Page 14/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 4.2: Attendance Norms/i)).toBeInTheDocument();
    expect(screen.getByText(/95% match/i)).toBeInTheDocument();
    expect(screen.getByText(/A student must secure a minimum of 75%/i)).toBeInTheDocument();
  });

  it('triggers onOpenDrawer when external link button is clicked', () => {
    const handleDrawer = vi.fn();
    render(<CitationCard citation={MOCK_CITATION} index={0} onOpenDrawer={handleDrawer} />);

    const openBtn = screen.getByTitle(/View full context/i);
    fireEvent.click(openBtn);
    expect(handleDrawer).toHaveBeenCalledWith(MOCK_CITATION);
  });

  it('renders CitationList with correct item count', () => {
    const citations: Citation[] = [
      MOCK_CITATION,
      {
        id: 'cit_test_2',
        document_id: 'doc_02',
        document_title: 'Examination Rules Bulletin',
        page_number: 6,
        excerpt: 'Admit cards are distributed 5 days prior to exams.',
      },
    ];

    render(<CitationList citations={citations} />);
    expect(screen.getByText(/Supporting Citations \(2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Academic Regulations Handbook/i)).toBeInTheDocument();
    expect(screen.getByText(/Examination Rules Bulletin/i)).toBeInTheDocument();
  });
});
