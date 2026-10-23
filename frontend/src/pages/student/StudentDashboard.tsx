import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  MessageSquare, 
  ArrowRight, 
  Clock, 
  BookOpen, 
  Calendar, 
  FileText, 
  DollarSign, 
  Briefcase, 
  ShieldCheck, 
  ExternalLink,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { historyService } from '../../services/historyService';
import { Conversation } from '../../types';
import { SuggestedQuestions } from '../../components/chat/SuggestedQuestions';
import { formatRelativeTime } from '../../utils/formatters';
import { Button } from '../../components/ui/Button';

export const StudentDashboard: React.FC = () => {
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

  const handleSuggestedSelect = (prompt: string) => {
    navigate(`/app/chat?q=${encodeURIComponent(prompt)}`);
  };

  const CATEGORY_CARDS = [
    { title: 'Academic Regulations', icon: BookOpen, query: 'What are the examination rules and attendance norms?' },
    { title: 'Academic Calendar', icon: Calendar, query: 'Show me important academic calendar dates' },
    { title: 'Examination Rules', icon: FileText, query: 'What are the passing criteria and revaluation procedures?' },
    { title: 'Fee Structures', icon: DollarSign, query: 'What are the tuition fee payment deadlines and installments?' },
    { title: 'Placement Guidelines', icon: Briefcase, query: 'What is the placement eligibility criteria and CGPA requirement?' },
  ];

  return (
    <div className="space-y-6 text-left pb-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-campus-primary to-campus-primary-hover text-white rounded-2xl p-6 sm:p-8 shadow-card relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>CampusMind Intelligence Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            What would you like to know about your campus today? Search across verified academic regulations, calendars, fees, and examination notifications.
          </p>
        </div>
      </div>

      {/* Main AI Assistant Card */}
      <div className="bg-white border border-campus-border rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-campus-primary-subtle text-campus-primary flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-campus-text">Direct Ingestion Query</h2>
              <p className="text-[11px] text-campus-text-secondary">
                Responses are synthesized directly from official university documentation
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/app/chat')}
            className="text-xs font-medium text-campus-primary hover:underline flex items-center gap-1"
          >
            Open Dedicated Chat <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What is the attendance requirement and condonation rule for exams?"
            className="input-field text-xs py-2.5"
          />
          <Button type="submit" size="md" disabled={!question.trim()}>
            Ask Assistant <Send className="w-3.5 h-3.5 ml-1" />
          </Button>
        </form>

        {/* Suggested Prompts */}
        <div className="pt-2">
          <SuggestedQuestions onSelectQuestion={handleSuggestedSelect} />
        </div>
      </div>

      {/* Grid: Recent Conversations & Quick Category Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inquiries (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-campus-border rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-campus-primary" />
              <h3 className="text-sm font-semibold text-campus-text">Recent Campus Inquiries</h3>
            </div>
            <button
              onClick={() => navigate('/app/history')}
              className="text-xs font-medium text-campus-primary hover:underline"
            >
              View All History
            </button>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <div className="py-8 text-center text-xs text-campus-text-secondary">
                Loading inquiries...
              </div>
            ) : conversations.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs text-campus-text-secondary">
                  You haven't initiated any campus inquiries yet.
                </p>
                <Button size="sm" onClick={() => navigate('/app/chat')}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Start First Inquiry
                </Button>
              </div>
            ) : (
              conversations.slice(0, 4).map((c) => (
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
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-campus-text-muted">
                      {formatRelativeTime(c.updated_at)}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-campus-text-muted group-hover:text-campus-primary group-hover:translate-x-0.5 transition-all ml-auto mt-1" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Scope Categories (1 Col) */}
        <div className="bg-white border border-campus-border rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-campus-primary" />
            <h3 className="text-sm font-semibold text-campus-text">Document Categories</h3>
          </div>
          <div className="space-y-2">
            {CATEGORY_CARDS.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSuggestedSelect(cat.query)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-campus-border hover:bg-campus-primary-subtle/50 hover:border-campus-primary/30 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-gray-50 text-campus-text-secondary group-hover:bg-campus-primary group-hover:text-white transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-campus-text group-hover:text-campus-primary transition-colors">
                      {cat.title}
                    </span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-campus-text-muted group-hover:text-campus-primary transition-colors" />
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-campus-border">
            <div className="flex items-center gap-1.5 text-[11px] text-campus-text-secondary">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Grounded in current academic session</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
