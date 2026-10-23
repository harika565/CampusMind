// CampusMind TypeScript Data Models

export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  studentId?: string;
  facultyId?: string;
  avatarUrl?: string;
  created_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'faculty';
  department?: string;
  identifier?: string; // studentId or facultyId
}

export interface Citation {
  id: string;
  document_id: string;
  document_title: string;
  page_number?: number | string;
  section_name?: string;
  excerpt?: string;
  source_url?: string;
  relevance_score?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  citations?: Citation[];
  status?: 'sending' | 'delivered' | 'error';
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  last_message?: string;
}

export interface ChatRequest {
  question: string;
  conversation_id?: string | null;
}

export interface ChatResponse {
  answer: string;
  conversation_id: string;
  message_id: string;
  citations?: Citation[];
  retrieval_metadata?: {
    retrieved_chunks?: number;
    latency_ms?: number;
    sources_consulted?: string[];
  };
}

export type DocumentProcessingStatus = 'pending' | 'processing' | 'indexed' | 'failed';

export type DocumentAudience = 'all' | 'student' | 'faculty' | 'admin';

export type DocumentCategory = 
  | 'Regulations'
  | 'Academic Calendar'
  | 'Exam Notifications'
  | 'Syllabi'
  | 'Timetables'
  | 'Fee Structures'
  | 'Placement Guidelines'
  | 'Campus Policies'
  | 'General';

export interface CampusDocument {
  id: string;
  title: string;
  file_name: string;
  file_type: string;
  file_size: number;
  category: DocumentCategory;
  audience: DocumentAudience;
  status: DocumentProcessingStatus;
  uploaded_at: string;
  indexed_at?: string | null;
  error_message?: string | null;
  chunks_count?: number;
}

export interface DocumentUploadRequest {
  file: File;
  title: string;
  category: DocumentCategory;
  audience: DocumentAudience;
  description?: string;
}

export interface DashboardMetrics {
  total_documents: number;
  indexed_documents: number;
  processing_documents: number;
  failed_documents: number;
  total_conversations?: number;
  total_queries_served?: number;
  system_health: 'healthy' | 'degraded' | 'error';
  recent_uploads?: CampusDocument[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  service: string;
  message: string;
  details?: Record<string, unknown> | string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
  read: boolean;
  link?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ApiError {
  message: string;
  status_code?: number;
  detail?: string;
}
