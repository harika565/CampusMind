import { 
  User, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  ChatRequest, 
  ChatResponse, 
  Conversation, 
  Message, 
  CampusDocument, 
  DocumentUploadRequest, 
  DashboardMetrics, 
  SystemLog, 
  SystemNotification,
  Citation
} from '../types';
import { 
  DEMO_USERS, 
  MOCK_DOCUMENTS, 
  MOCK_CONVERSATIONS, 
  MOCK_MESSAGES_MAP, 
  MOCK_NOTIFICATIONS, 
  MOCK_SYSTEM_LOGS, 
  MOCK_DASHBOARD_METRICS 
} from './mockData';

// Simulated latency helper
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory state for mock mode session
let activeDocuments = [...MOCK_DOCUMENTS];
let activeConversations = [...MOCK_CONVERSATIONS];
const activeMessages: Record<string, Message[]> = { ...MOCK_MESSAGES_MAP };

export const mockService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    await delay(500);
    const email = credentials.email.toLowerCase().trim();

    // Check student
    if (email === DEMO_USERS.student.user.email || email.includes('student')) {
      return {
        access_token: 'mock-jwt-token-student-session',
        token_type: 'Bearer',
        user: DEMO_USERS.student.user,
      };
    }

    // Check faculty
    if (email === DEMO_USERS.faculty.user.email || email.includes('faculty') || email.includes('prof')) {
      return {
        access_token: 'mock-jwt-token-faculty-session',
        token_type: 'Bearer',
        user: DEMO_USERS.faculty.user,
      };
    }

    // Check admin
    if (email === DEMO_USERS.admin.user.email || email.includes('admin')) {
      return {
        access_token: 'mock-jwt-token-admin-session',
        token_type: 'Bearer',
        user: DEMO_USERS.admin.user,
      };
    }

    // Fallback: create mock student session
    return {
      access_token: 'mock-jwt-token-custom-session',
      token_type: 'Bearer',
      user: {
        id: 'usr_' + Date.now(),
        name: credentials.email.split('@')[0].replace('.', ' '),
        email: credentials.email,
        role: 'student',
        department: 'General Studies',
      },
    };
  },

  async register(data: RegisterRequest): Promise<LoginResponse> {
    await delay(600);
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department || 'Academic Department',
      studentId: data.role === 'student' ? (data.identifier || 'STU-2026-9001') : undefined,
      facultyId: data.role === 'faculty' ? (data.identifier || 'FAC-2026-4001') : undefined,
      created_at: new Date().toISOString(),
    };

    return {
      access_token: `mock-jwt-token-${data.role}-${Date.now()}`,
      token_type: 'Bearer',
      user: newUser,
    };
  },

  async getCurrentUser(token: string): Promise<User> {
    await delay(200);
    if (token.includes('admin')) return DEMO_USERS.admin.user;
    if (token.includes('faculty')) return DEMO_USERS.faculty.user;
    return DEMO_USERS.student.user;
  },

  async askQuestion(req: ChatRequest): Promise<ChatResponse> {
    await delay(900); // Simulate realistic RAG processing latency

    const conversationId = req.conversation_id || `conv_${Date.now()}`;
    const questionLower = req.question.toLowerCase();

    let answer = '';
    const citations: Citation[] = [];

    if (questionLower.includes('exam') || questionLower.includes('examination')) {
      answer = `Based on the **Undergraduate Examination Rules & Evaluation Policy**:

- **Examination Schedule:** End-semester theory examinations are conducted in two sessions daily: Morning (09:30 - 12:30) and Afternoon (14:00 - 17:00).
- **Hall Ticket Release:** Digital admit cards are downloadable from the student portal 5 working days before examinations commence.
- **Passing Criteria:** A minimum of **40% in the end-semester examination** and **50% in aggregate (internal + external)** is mandatory to pass each course credit.
- **Revaluation:** Candidates may apply for paper re-evaluation within **10 days** from the declaration of provisional results.`;

      citations.push({
        id: 'cit_exam_1',
        document_id: 'doc_03',
        document_title: 'Undergraduate Examination Rules & Evaluation Policy',
        page_number: 8,
        section_name: 'Section 5.1: Grading and Passing Standards',
        excerpt: 'Candidates must achieve at least 40% in end-semester summative evaluation and 50% composite marks to earn course credits.',
        relevance_score: 0.96,
      });
      citations.push({
        id: 'cit_exam_2',
        document_id: 'doc_03',
        document_title: 'Undergraduate Examination Rules & Evaluation Policy',
        page_number: 19,
        section_name: 'Section 9.4: Revaluation Procedure',
        excerpt: 'Applications for answer script photocopying and revaluation must be submitted through the student portal with prescribed fees within 10 days.',
        relevance_score: 0.89,
      });
    } else if (questionLower.includes('calendar') || questionLower.includes('semester start') || questionLower.includes('holiday')) {
      answer = `According to the **Academic Calendar 2026-2027**:

- **Odd Semester Commencement:** Instruction begins on **August 17, 2026**.
- **Mid-Term Evaluations:** Scheduled from **October 12 to October 17, 2026**.
- **Last Instructional Day:** Classes conclude on **November 27, 2026**.
- **Winter Break:** Vacation spans **December 21, 2026 through January 10, 2027**.`;

      citations.push({
        id: 'cit_cal_1',
        document_id: 'doc_02',
        document_title: 'Academic Calendar 2026-2027 (Odd & Even Semesters)',
        page_number: 2,
        section_name: 'Key Semester Milestones: Odd Semester 2026',
        excerpt: 'First instructional day: Aug 17, 2026. Practical examinations commence: Nov 28, 2026. Theory examinations: Dec 3 to Dec 19, 2026.',
        relevance_score: 0.98,
      });
    } else if (questionLower.includes('fee') || questionLower.includes('tuition') || questionLower.includes('installment')) {
      answer = `Per the **Institutional Tuition Fee Schedule & Payment Deadlines**:

- **Payment Schedule:** Tuition fees are divided into two equal installments per academic year.
- **First Installment:** Due before registration for the Odd Semester (August 10).
- **Second Installment:** Due on or before **November 15, 2026**.
- **Late Fee Penalty:** A fine of $25/week applies up to 14 days post deadline, beyond which portal access may be restricted until dues are cleared.`;

      citations.push({
        id: 'cit_fee_1',
        document_id: 'doc_05',
        document_title: 'Institutional Tuition Fee Schedule & Payment Deadlines',
        page_number: 4,
        section_name: 'Policy on Installments and Penalties',
        excerpt: 'All outstanding dues must be settled by the prescribed due date. A late penalty is levied weekly for delayed payments up to two weeks...',
        relevance_score: 0.93,
      });
    } else if (questionLower.includes('placement') || questionLower.includes('internship') || questionLower.includes('cgpa')) {
      answer = `According to the **Campus Placement & Internship Code of Conduct**:

- **Eligibility:** Students must possess a minimum **CGPA of 7.00** with no standing backlogs at the time of recruitment drives.
- **One Student, One Job Policy:** Once an offer with compensation $\\ge$ tier-1 benchmark is accepted, the candidate is marked placed and is ineligible for subsequent standard drives.
- **Internship Approvals:** Summer internships of 8-12 weeks require prior approval and NOC from the Departmental Placement Cell.`;

      citations.push({
        id: 'cit_place_1',
        document_id: 'doc_06',
        document_title: 'Campus Placement & Internship Code of Conduct',
        page_number: 7,
        section_name: 'Section 2.1: Drive Participation Eligibility',
        excerpt: 'Students with active disciplinary warnings or more than zero standing arrears are disbarred from campus recruitment activities.',
        relevance_score: 0.91,
      });
    } else {
      answer = `Based on institutional documentation indexed in CampusMind:

Your query **"${req.question}"** relates to university campus guidelines and operational procedures. 

1. Official policies are reviewed and ratified by the **Academic Council** annually.
2. For specific departmental variations, please consult your **Head of Department** or designated academic advisor.
3. Detailed course guidelines and laboratory norms are available in the respective departmental handbooks.

Please refer to the source citations below for full institutional text.`;

      citations.push({
        id: 'cit_general_1',
        document_id: 'doc_01',
        document_title: 'University Academic Regulations Handbook (2026-2027)',
        page_number: 1,
        section_name: 'Preamble and General Provisions',
        excerpt: 'These regulations govern all undergraduate and postgraduate academic programs conducted across university faculties.',
        relevance_score: 0.85,
      });
    }

    const messageId = `msg_${Date.now()}`;

    // Update in-memory conversation list
    const existingConv = activeConversations.find(c => c.id === conversationId);
    if (existingConv) {
      existingConv.updated_at = new Date().toISOString();
      existingConv.message_count += 2;
      existingConv.last_message = answer.slice(0, 80) + '...';
    } else {
      activeConversations.unshift({
        id: conversationId,
        title: req.question.slice(0, 45) + (req.question.length > 45 ? '...' : ''),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        message_count: 2,
        last_message: answer.slice(0, 80) + '...',
      });
    }

    // Add to active messages
    const userMsg: Message = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      content: req.question,
      created_at: new Date().toISOString(),
    };
    const assistantMsg: Message = {
      id: messageId,
      role: 'assistant',
      content: answer,
      created_at: new Date().toISOString(),
      citations,
    };

    if (!activeMessages[conversationId]) {
      activeMessages[conversationId] = [];
    }
    activeMessages[conversationId].push(userMsg, assistantMsg);

    return {
      answer,
      conversation_id: conversationId,
      message_id: messageId,
      citations,
      retrieval_metadata: {
        retrieved_chunks: citations.length * 3,
        latency_ms: 320,
        sources_consulted: citations.map(c => c.document_title),
      },
    };
  },

  async getConversations(): Promise<Conversation[]> {
    await delay(300);
    return [...activeConversations];
  },

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    await delay(300);
    return activeMessages[conversationId] || [];
  },

  async deleteConversation(conversationId: string): Promise<void> {
    await delay(300);
    activeConversations = activeConversations.filter(c => c.id !== conversationId);
    delete activeMessages[conversationId];
  },

  async getDocuments(params?: { search?: string; category?: string; status?: string }): Promise<CampusDocument[]> {
    await delay(350);
    let results = [...activeDocuments];

    if (params?.search) {
      const q = params.search.toLowerCase();
      results = results.filter(
        d => d.title.toLowerCase().includes(q) || d.file_name.toLowerCase().includes(q)
      );
    }
    if (params?.category && params.category !== 'all') {
      results = results.filter(d => d.category === params.category);
    }
    if (params?.status && params.status !== 'all') {
      results = results.filter(d => d.status === params.status);
    }

    return results;
  },

  async uploadDocument(data: DocumentUploadRequest): Promise<CampusDocument> {
    await delay(800);
    const newDoc: CampusDocument = {
      id: `doc_${Date.now()}`,
      title: data.title,
      file_name: data.file.name,
      file_type: data.file.name.endsWith('.pdf') ? 'PDF' : data.file.name.endsWith('.docx') ? 'DOCX' : 'TXT',
      file_size: data.file.size,
      category: data.category,
      audience: data.audience,
      status: 'processing',
      uploaded_at: new Date().toISOString(),
      indexed_at: null,
      chunks_count: 0,
    };

    activeDocuments.unshift(newDoc);

    // Simulate background indexing completion after 4 seconds
    setTimeout(() => {
      newDoc.status = 'indexed';
      newDoc.indexed_at = new Date().toISOString();
      newDoc.chunks_count = Math.floor(Math.random() * 80) + 20;
    }, 4000);

    return newDoc;
  },

  async deleteDocument(id: string): Promise<void> {
    await delay(400);
    activeDocuments = activeDocuments.filter(d => d.id !== id);
  },

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    await delay(300);
    return {
      ...MOCK_DASHBOARD_METRICS,
      total_documents: activeDocuments.length,
      indexed_documents: activeDocuments.filter(d => d.status === 'indexed').length,
      processing_documents: activeDocuments.filter(d => d.status === 'processing').length,
      failed_documents: activeDocuments.filter(d => d.status === 'failed').length,
      recent_uploads: activeDocuments.slice(0, 5),
    };
  },

  async getSystemLogs(): Promise<SystemLog[]> {
    await delay(300);
    return [...MOCK_SYSTEM_LOGS];
  },

  async getNotifications(): Promise<SystemNotification[]> {
    await delay(200);
    return [...MOCK_NOTIFICATIONS];
  },
};
