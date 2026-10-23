import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  Calendar, 
  FileText, 
  Award, 
  ArrowRight, 
  Clock, 
  MessageSquare, 
  ShieldCheck, 
  Plus, 
  GraduationCap 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { historyService } from '../../services/historyService';
import { Conversation } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';
import { Button } from '../../components/ui/Button';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const list = await historyService.getHistory();
        setConversations(list);
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleAsk = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim()) return;
    navigate(`/app/chat?q=${encodeURIComponent(question.trim())}`);
  };

  const FACULTY_TOPICS = [
    { title: 'Research Grant Guidelines', icon: Award, prompt: 'What are the application deadlines and eligibility for faculty research grants?' },
    { title: 'Syllabus & Prerequisites', icon: GraduationCap, prompt: 'What are the course modules and prerequisite rules for CS curriculum?' },
    { title: 'Examination & Grading Norms', icon: FileText, prompt: 'What are the grade submission deadlines and relative grading scales?' },
    { title: 'Academic Calendar', icon: Calendar, prompt: 'Show instructional days and mid-semester assessment windows' },
    { title: 'Academic Regulations', icon: BookOpen, prompt: 'What are the attendance condonation procedures for department heads?' },
  ];

  return (
    <div className="space-y-6 text-left pb-10">
      {/* Faculty Welcome Header */}
      <div className="bg-gradient-to-r from-campus-primary to-[#1e3448] text-white rounded-2xl p-6 sm:p-8 shadow-card space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-blue-200" />
          <span>Faculty & Academic Leadership Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Welcome, {user?.name || 'Professor'}!
        </h1>
        <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
          Access faculty research manuals, academic guidelines, curriculum structures, and departmental directives grounded in authoritative campus files.
        </p>
      </div>

      {/* Main Q&A Card */}
      <div className="bg-white border border-campus-border rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-campus-primary-subtle text-campus-primary flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-campus-text">Faculty Knowledge Inquiry</h2>
              <p className="text-[11px] text-campus-text-secondary">
                Search departmental directives, committee regulations, and evaluation manuals
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/app/chat')}
            className="text-xs font-medium text-campus-primary hover:underline flex items-center gap-1"
          >
            Open Chat Interface <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What are the sabbatical guidelines and research grant funding caps?"
            className="input-field text-xs py-2.5"
          />
          <Button type="submit" size="md" disabled={!question.trim()}>
            Query Knowledge Base <Send className="w-3.5 h-3.5 ml-1" />
          </Button>
        </form>

        {/* Faculty Prompt Chips */}
        <div className="pt-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-campus-text-muted mb-2">
            Suggested Faculty Inquiries:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {FACULTY_TOPICS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(`/app/chat?q=${encodeURIComponent(item.prompt)}`)}
                  className="flex items-start gap-2.5 p-3 rounded-xl border border-campus-border hover:border-campus-primary/30 hover:bg-campus-surface-subtle transition-all text-left group"
                >
                  <div className="p-1.5 rounded-lg bg-campus-primary-light text-campus-primary group-hover:bg-campus-primary group-hover:text-white transition-colors shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-campus-text group-hover:text-campus-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-campus-text-secondary truncate mt-0.5">
                      {item.prompt}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Recent Inquiries & Faculty Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-campus-border rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-campus-primary" />
              <h3 className="text-sm font-semibold text-campus-text">Recent Faculty Inquiries</h3>
            </div>
            <button
              onClick={() => navigate('/app/history')}
              className="text-xs font-medium text-campus-primary hover:underline"
            >
              All Inquiries
            </button>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <div className="py-6 text-center text-xs text-campus-text-secondary">Loading history...</div>
            ) : conversations.length === 0 ? (
              <div className="py-6 text-center space-y-2">
                <p className="text-xs text-campus-text-secondary">No recorded faculty inquiries.</p>
                <Button size="sm" onClick={() => navigate('/app/chat')}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> New Inquiry
                </Button>
              </div>
            ) : (
              conversations.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/app/chat?id=${c.id}`)}
                  className="p-3 rounded-xl border border-campus-border hover:border-campus-primary/30 hover:bg-campus-surface-subtle transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-start gap-2.5 min-w-0 pr-4">
                    <div className="p-1.5 rounded-lg bg-campus-primary-subtle text-campus-primary shrink-0 mt-0.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-campus-text group-hover:text-campus-primary transition-colors truncate">
                        {c.title}
                      </p>
                      {c.last_message && (
                        <p className="text-[11px] text-campus-text-secondary truncate mt-0.5">
                          {c.last_message}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-campus-text-muted shrink-0">
                    {formatRelativeTime(c.updated_at)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-campus-border rounded-2xl p-5 shadow-card space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-campus-primary" />
            <h3 className="text-sm font-semibold text-campus-text">Academic Governance</h3>
          </div>
          <p className="text-xs text-campus-text-secondary leading-relaxed">
            Faculty access privileges permit querying institutional handbooks, research policies, and departmental curriculum files.
          </p>
          <div className="p-3 rounded-xl bg-campus-surface-subtle border border-campus-border text-xs space-y-1">
            <p className="font-semibold text-campus-text">Department Scope</p>
            <p className="text-campus-text-secondary">{user?.department || 'Engineering & Computing'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
