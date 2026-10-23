import { apiClient, isMockModeActive } from './apiClient';
import { mockService } from '../mocks/mockService';
import { CampusDocument, DocumentUploadRequest } from '../types';

export const documentService = {
  async getDocuments(params?: { search?: string; category?: string; status?: string }): Promise<CampusDocument[]> {
    if (isMockModeActive()) {
      return mockService.getDocuments(params);
    }

    const res = await apiClient.get<CampusDocument[]>('/api/documents', { params });
    return res.data;
  },

  async uploadDocument(
    data: DocumentUploadRequest,
    onProgress?: (percentage: number) => void
  ): Promise<CampusDocument> {
    if (isMockModeActive()) {
      if (onProgress) {
        onProgress(30);
        setTimeout(() => onProgress(75), 300);
        setTimeout(() => onProgress(100), 600);
      }
      return mockService.uploadDocument(data);
    }

    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('audience', data.audience);
    if (data.description) {
      formData.append('description', data.description);
    }

    const res = await apiClient.post<CampusDocument>('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    return res.data;
  },

  async deleteDocument(id: string): Promise<void> {
    if (isMockModeActive()) {
      return mockService.deleteDocument(id);
    }

    await apiClient.delete(`/api/documents/${id}`);
  },

  async getDocumentStatus(id: string): Promise<CampusDocument> {
    if (isMockModeActive()) {
      const docs = await mockService.getDocuments();
      const doc = docs.find(d => d.id === id);
      if (!doc) throw new Error('Document not found');
      return doc;
    }

    const res = await apiClient.get<CampusDocument>(`/api/documents/${id}/status`);
    return res.data;
  },
};
