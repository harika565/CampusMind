import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Bot, User as UserIcon, ShieldCheck } from 'lucide-react';
import { Message } from '../../types';
import { CitationList } from '../citations/CitationList';
import { formatRelativeTime } from '../../utils/formatters';

interface ChatMessageProps {
  message: Message;
  userName?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, userName }) => {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div
      className={`py-4 px-4 sm:px-6 transition-colors ${
        isAssistant ? 'bg-white border-y border-campus-border/50' : 'bg-transparent'
      }`}
    >
      <div className="max-w-3xl mx-auto flex items-start gap-3.5">
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-subtle ${
            isAssistant
              ? 'bg-campus-primary text-white'
              : 'bg-slate-200 text-campus-text font-semibold text-xs'
          }`}
        >
          {isAssistant ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0 text-left">
          {/* Header */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-campus-text">
                {isAssistant ? 'CampusMind Assistant' : (userName || 'You')}
              </span>
              {isAssistant && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] bg-campus-primary-subtle text-campus-primary border border-campus-primary/20">
                  <ShieldCheck className="w-2.5 h-2.5 text-campus-primary" /> RAG Grounded
                </span>
              )}
              <span className="text-[11px] text-campus-text-muted">
                {formatRelativeTime(message.created_at)}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 opacity-80 hover:opacity-100">
              <button
                onClick={handleCopy}
                className="p-1 rounded text-campus-text-secondary hover:text-campus-text hover:bg-campus-surface-subtle transition-colors"
                title="Copy response"
                aria-label="Copy message"
              >
                {copied ? (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <Check className="w-3.5 h-3.5" /> Copied
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Text Content */}
          <div className="prose prose-sm max-w-none text-campus-text text-sm leading-relaxed prose-headings:text-campus-text prose-strong:text-campus-text prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>

          {/* Supporting Citations */}
          {isAssistant && message.citations && message.citations.length > 0 && (
            <CitationList citations={message.citations} />
          )}
        </div>
      </div>
    </div>
  );
};
