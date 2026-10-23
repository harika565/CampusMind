import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History, 
  MessageSquare, 
  Search, 
  Trash2, 
  ArrowRight, 
  Clock, 
  Plus, 
  Loader2 
} from 'lucide-react';
import { historyService } from '../../services/historyService';
import { Conversation } from '../../types';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { Button } from '../../components/ui/Button';

export const HistoryPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const list = await historyService.getHistory();
      setConversations(list);
    } catch {
      setError('Unable to load conversation history from the server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete conversation "${title}"?`)) {
      try {
        await historyService.deleteConversation(id);
        setConversations((prev) => prev.filter((c) => c.id !== id));
      } catch {
        alert('Failed to delete conversation.');
      }
    }
  };

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.last_message && c.last_message.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-campus-text tracking-tight">
            Conversation History
          </h1>
          <p className="text-xs text-campus-text-secondary mt-0.5">
            Review prior inquiries, grounding sources, and synthesized institutional answers.
          </p>
        </div>
        <Button size="sm" onClick={() => navigate('/app/chat')}>
          <Plus className="w-3.5 h-3.5 mr-1" /> New Inquiry
        </Button>
      </div>

      {/* Search Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-campus-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search prior conversations by topic or query..."
          className="input-field pl-9 text-xs py-2.5"
        />
      </div>

      {/* Content Stream */}
      {isLoading ? (
        <div className="bg-white border border-campus-border rounded-xl p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-campus-primary mx-auto mb-3" />
          <p className="text-xs text-campus-text-secondary">Retrieving conversation logs...</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-campus-border rounded-xl p-8 text-center space-y-3">
          <p className="text-xs text-rose-600 font-medium">{error}</p>
          <Button variant="secondary" size="sm" onClick={loadHistory}>
            Retry Fetch
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-campus-border rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-campus-primary-subtle text-campus-primary flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-campus-text">
            {search ? 'No matching conversations' : 'No previous inquiries recorded'}
          </h3>
          <p className="text-xs text-campus-text-secondary max-w-sm mx-auto">
            {search
              ? 'Try modifying your search keywords to locate previous answers.'
              : 'Start your first inquiry to ask about academic regulations, syllabus topics, or calendars.'}
          </p>
          {!search && (
            <Button size="sm" onClick={() => navigate('/app/chat')}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Ask First Question
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((conv) => (
            <div
              key={conv.id}
              onClick={() => navigate(`/app/chat?id=${conv.id}`)}
              className="bg-white border border-campus-border rounded-xl p-4 shadow-subtle hover:border-campus-primary/30 hover:shadow-card transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-start gap-3 min-w-0 pr-4">
                <div className="p-2 rounded-lg bg-campus-primary-subtle text-campus-primary shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-campus-text group-hover:text-campus-primary transition-colors truncate">
                    {conv.title}
                  </h3>
                  {conv.last_message && (
                    <p className="text-xs text-campus-text-secondary truncate mt-1">
                      {conv.last_message}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-[11px] text-campus-text-muted mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Updated {formatRelativeTime(conv.updated_at)}
                    </span>
                    <span>·</span>
                    <span>Started {formatDate(conv.created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => handleDelete(conv.id, conv.title, e)}
                  className="p-2 rounded-lg text-campus-text-muted hover:text-campus-danger hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete conversation"
                  aria-label="Delete conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="p-2 rounded-lg text-campus-text-muted group-hover:text-campus-primary group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
