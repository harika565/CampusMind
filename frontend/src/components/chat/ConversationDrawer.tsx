import React, { useState } from 'react';
import { MessageSquare, Plus, Search, Trash2, X } from 'lucide-react';
import { Conversation } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';

interface ConversationDrawerProps {
  conversations: Conversation[];
  activeConversationId?: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation?: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  isMobileDrawer?: boolean;
}

export const ConversationDrawer: React.FC<ConversationDrawerProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen = true,
  onClose,
  isMobileDrawer = false,
}) => {
  const [search, setSearch] = useState('');

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-campus-border text-left">
      {/* Header */}
      <div className="p-3.5 border-b border-campus-border flex items-center justify-between gap-2">
        <button
          onClick={onNewConversation}
          className="btn-primary w-full text-xs py-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Inquiry</span>
        </button>
        {isMobileDrawer && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-campus-text-muted hover:text-campus-text hover:bg-campus-surface-subtle"
            aria-label="Close conversation drawer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Filter */}
      <div className="px-3.5 py-2.5 border-b border-campus-border">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-campus-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-8 pr-3 py-1.5 bg-campus-surface-subtle border border-campus-border rounded-lg text-xs text-campus-text placeholder:text-campus-text-muted focus:outline-none focus:border-campus-primary"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.length === 0 ? (
          <div className="p-4 text-center text-xs text-campus-text-secondary">
            {search ? 'No matching inquiries found' : 'No previous conversations'}
          </div>
        ) : (
          filtered.map((conv) => {
            const isActive = conv.id === activeConversationId;
            return (
              <div
                key={conv.id}
                className={`group relative flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-campus-primary-light text-campus-primary font-medium'
                    : 'hover:bg-campus-surface-subtle text-campus-text'
                }`}
                onClick={() => {
                  onSelectConversation(conv.id);
                  if (isMobileDrawer && onClose) onClose();
                }}
              >
                <div className="flex items-start gap-2 min-w-0 pr-6">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isActive ? 'text-campus-primary' : 'text-campus-text-muted'}`} />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{conv.title}</p>
                    <p className="text-[10px] text-campus-text-muted mt-0.5">
                      {formatRelativeTime(conv.updated_at)}
                    </p>
                  </div>
                </div>

                {onDeleteConversation && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to delete this conversation?')) {
                        onDeleteConversation(conv.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-campus-text-muted hover:text-campus-danger hover:bg-red-50 rounded transition-all"
                    title="Delete conversation"
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  if (isMobileDrawer) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex">
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          onClick={onClose}
          aria-hidden="true"
        />
        <div className="relative w-72 max-w-[80vw] h-full z-10 animate-in slide-in-from-left duration-200">
          {content}
        </div>
      </div>
    );
  }

  return <div className="w-72 h-full shrink-0">{content}</div>;
};
