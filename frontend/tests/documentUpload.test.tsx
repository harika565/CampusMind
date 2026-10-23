import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DocumentUploadModal } from '../src/components/documents/DocumentUploadModal';

describe('DocumentUploadModal Component', () => {
  it('renders modal when isOpen is true', () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();

    render(
      <DocumentUploadModal
        isOpen={true}
        onClose={handleClose}
        onUploadSuccess={handleSuccess}
      />
    );

    expect(screen.getByText(/Upload Institutional Document/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF, DOCX, or TXT up to 25MB/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Document Title/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload & Ingest/i })).toBeDisabled();
  });

  it('rejects unsupported file formats with descriptive error message', () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();

    const { container } = render(
      <DocumentUploadModal
        isOpen={true}
        onClose={handleClose}
        onUploadSuccess={handleSuccess}
      />
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const invalidFile = new File(['executable content'], 'virus.exe', { type: 'application/x-msdownload' });

    fireEvent.change(input, { target: { files: [invalidFile] } });
    expect(screen.getByText(/Unsupported file type/i)).toBeInTheDocument();
  });

  it('accepts valid PDF file and auto-populates title', () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();

    const { container } = render(
      <DocumentUploadModal
        isOpen={true}
        onClose={handleClose}
        onUploadSuccess={handleSuccess}
      />
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const validFile = new File(['dummy pdf content'], 'Campus_Hostel_Policy_2026.pdf', { type: 'application/pdf' });

    fireEvent.change(input, { target: { files: [validFile] } });

    expect(screen.getByText(/Campus_Hostel_Policy_2026.pdf/i)).toBeInTheDocument();
    const titleInput = screen.getByLabelText(/Document Title/i) as HTMLInputElement;
    expect(titleInput.value).toBe('Campus Hostel Policy 2026');
  });
});
