import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { DocumentCategory, DocumentAudience, DocumentUploadRequest, CampusDocument } from '../../types';
import { formatFileSize } from '../../utils/formatters';
import { documentService } from '../../services/documentService';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (doc: CampusDocument) => void;
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

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Regulations');
  const [audience, setAudience] = useState<DocumentAudience>('all');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<'idle' | 'uploading' | 'queued' | 'success'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setSelectedFile(null);
    setTitle('');
    setCategory('Regulations');
    setAudience('all');
    setDescription('');
    setError(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadStage('idle');
  };

  const handleClose = () => {
    if (isUploading) return;
    resetForm();
    onClose();
  };

  const validateFile = (file: File): boolean => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`Unsupported file type. Accepted formats: ${ALLOWED_EXTENSIONS.join(', ')}`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds limit (${formatFileSize(MAX_FILE_SIZE)}).`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      if (!title) {
        // Derive clean title from filename
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an institutional document to upload.');
      return;
    }
    if (!title.trim()) {
      setError('Document title is required.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadStage('uploading');
      setUploadProgress(15);

      const payload: DocumentUploadRequest = {
        file: selectedFile,
        title: title.trim(),
        category,
        audience,
        description: description.trim() || undefined,
      };

      const doc = await documentService.uploadDocument(payload, (percent) => {
        setUploadProgress(percent);
      });

      setUploadStage('queued');

      setTimeout(() => {
        setUploadStage('success');
        onUploadSuccess(doc);
        setTimeout(() => {
          handleClose();
        }, 1200);
      }, 800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setError(msg);
      setUploadStage('idle');
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload Institutional Document"
      description="Add institutional policies, academic handbooks, or schedules into the RAG knowledge index."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Drag and Drop Area */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            selectedFile
              ? 'border-campus-primary bg-campus-primary-subtle/40'
              : 'border-campus-border hover:border-campus-primary/50 hover:bg-campus-surface-subtle'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />

          {selectedFile ? (
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 rounded-lg bg-campus-primary text-white">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-campus-text truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-campus-text-secondary">
                  {formatFileSize(selectedFile.size)} · Ready to ingest
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                className="p-1 rounded-full text-campus-text-muted hover:text-campus-danger hover:bg-red-50 ml-2"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <UploadCloud className="w-8 h-8 text-campus-primary mx-auto mb-2" />
              <p className="text-xs font-semibold text-campus-text">
                Click to upload or drag and drop institutional files
              </p>
              <p className="text-[11px] text-campus-text-secondary">
                PDF, DOCX, or TXT up to 25MB
              </p>
            </div>
          )}
        </div>

        {/* Title Input */}
        <Input
          label="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. University Academic Regulations Handbook (2026-2027)"
          required
        />

        {/* Category & Audience Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-campus-text">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full px-3 py-2 bg-white border border-campus-border rounded-lg text-xs text-campus-text focus:outline-none focus:border-campus-primary"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-campus-text">Access Scope</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value as DocumentAudience)}
              className="w-full px-3 py-2 bg-white border border-campus-border rounded-lg text-xs text-campus-text focus:outline-none focus:border-campus-primary"
            >
              <option value="all">Campus-Wide (Students, Faculty, Staff)</option>
              <option value="student">Student Only</option>
              <option value="faculty">Faculty & Department Chairs</option>
              <option value="admin">Administrative Personnel Only</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-campus-text">
            Description / Institutional Notes (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Key policies covered, effective semester, issuing office..."
            className="w-full px-3 py-2 bg-white border border-campus-border rounded-lg text-xs text-campus-text placeholder:text-campus-text-muted focus:outline-none focus:border-campus-primary resize-none"
          />
        </div>

        {/* Upload & Ingestion Progress */}
        {isUploading && (
          <div className="p-3 rounded-lg bg-campus-primary-subtle border border-campus-primary/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-campus-text">
              <span className="flex items-center gap-1.5">
                {uploadStage === 'uploading' && <Loader2 className="w-3.5 h-3.5 animate-spin text-campus-primary" />}
                {uploadStage === 'queued' && <Loader2 className="w-3.5 h-3.5 animate-spin text-campus-primary" />}
                {uploadStage === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                {uploadStage === 'uploading' && 'Uploading document payload...'}
                {uploadStage === 'queued' && 'Upload complete. Queued for RAG embedding indexing...'}
                {uploadStage === 'success' && 'Document successfully ingested!'}
              </span>
              <span className="font-mono text-campus-primary font-bold">{uploadProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-campus-primary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Notice on RAG processing */}
        <p className="text-[11px] text-campus-text-secondary leading-relaxed">
          <strong>Note:</strong> Uploading initiates background document chunking and vector embedding generation. Documents enter the <em>Processing</em> state before becoming searchable in CampusMind.
        </p>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-campus-border">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isUploading}
            disabled={!selectedFile || isUploading}
          >
            Upload & Ingest
          </Button>
        </div>
      </form>
    </Modal>
  );
};
