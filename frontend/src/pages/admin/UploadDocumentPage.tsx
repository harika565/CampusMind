import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowLeft, 
  X, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';
import { DocumentCategory, DocumentAudience, DocumentUploadRequest, CampusDocument } from '../../types';
import { formatFileSize } from '../../utils/formatters';
import { documentService } from '../../services/documentService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

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

export const UploadDocumentPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Regulations');
  const [audience, setAudience] = useState<DocumentAudience>('all');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedDoc, setUploadedDoc] = useState<CampusDocument | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const validateFile = (file: File): boolean => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`Unsupported format. Accepted: ${ALLOWED_EXTENSIONS.join(', ')}`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 25MB limit.`);
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
      setError('Please select an institutional document.');
      return;
    }
    if (!title.trim()) {
      setError('Document title is required.');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(20);

      const payload: DocumentUploadRequest = {
        file: selectedFile,
        title: title.trim(),
        category,
        audience,
        description: description.trim() || undefined,
      };

      const doc = await documentService.uploadDocument(payload, (pct) => {
        setUploadProgress(pct);
      });

      setUploadedDoc(doc);
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to upload document.';
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setTitle('');
    setCategory('Regulations');
    setAudience('all');
    setDescription('');
    setError(null);
    setUploadProgress(0);
    setUploadedDoc(null);
  };

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/documents')}
          className="text-xs font-medium text-campus-primary hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Document Repository
        </button>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-campus-text tracking-tight">
          Upload & Index Institutional Document
        </h1>
        <p className="text-xs text-campus-text-secondary mt-0.5">
          Ingest new academic circulars, handbooks, regulations, or examination schedules into CampusMind.
        </p>
      </div>

      {/* Success State */}
      {uploadedDoc ? (
        <div className="bg-white border border-campus-border rounded-2xl p-8 shadow-card text-center space-y-4 animate-in fade-in">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-campus-text">Upload Request Submitted Successfully</h2>
          <p className="text-xs text-campus-text-secondary max-w-md mx-auto leading-relaxed">
            <strong>"{uploadedDoc.title}"</strong> has been queued for vector chunking and semantic indexing. The document will transition from <em>Processing</em> to <em>Indexed</em> shortly.
          </p>

          <div className="p-4 bg-campus-surface-subtle border border-campus-border rounded-xl max-w-sm mx-auto text-xs text-left space-y-1">
            <div className="flex justify-between">
              <span className="text-campus-text-muted">Document ID:</span>
              <span className="font-mono text-campus-text">{uploadedDoc.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-campus-text-muted">Status:</span>
              <span className="font-semibold text-blue-700 capitalize">{uploadedDoc.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-campus-text-muted">Target Audience:</span>
              <span className="capitalize text-campus-text">{uploadedDoc.audience}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <Button variant="secondary" size="sm" onClick={handleReset}>
              Upload Another Document
            </Button>
            <Button size="sm" onClick={() => navigate('/admin/documents')}>
              View in Repository
            </Button>
          </div>
        </div>
      ) : (
        /* Upload Form */
        <div className="bg-white border border-campus-border rounded-2xl p-6 sm:p-8 shadow-card space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Drag & Drop */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                selectedFile
                  ? 'border-campus-primary bg-campus-primary-subtle/30'
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
                  <div className="p-2.5 rounded-xl bg-campus-primary text-white">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-campus-text truncate max-w-md">
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
                    className="p-1 rounded-full text-campus-text-muted hover:text-campus-danger ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <UploadCloud className="w-10 h-10 text-campus-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-campus-text">
                    Choose an institutional document or drag and drop here
                  </p>
                  <p className="text-xs text-campus-text-secondary">
                    Supports official PDF, DOCX, or TXT (Max 25MB)
                  </p>
                </div>
              )}
            </div>

            <Input
              label="Document Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Undergraduate Academic Regulations Handbook (2026-2027)"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <option value="student">Students Only</option>
                  <option value="faculty">Faculty & Department Chairs</option>
                  <option value="admin">Administrative Personnel Only</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-campus-text">
                Description / Institutional Notes
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Key directives covered, approval body, effective semesters..."
                className="w-full px-3 py-2 bg-white border border-campus-border rounded-lg text-xs text-campus-text placeholder:text-campus-text-muted focus:outline-none focus:border-campus-primary resize-none"
              />
            </div>

            {/* Ingestion Progress */}
            {isUploading && (
              <div className="p-4 rounded-xl bg-campus-primary-subtle border border-campus-primary/20 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-campus-text">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin text-campus-primary" />
                    Uploading file payload to ingestion queue...
                  </span>
                  <span className="font-mono text-campus-primary font-bold">{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-campus-primary transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => navigate('/admin/documents')}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="md"
                isLoading={isUploading}
                disabled={!selectedFile || isUploading}
              >
                Upload & Ingest Document
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
