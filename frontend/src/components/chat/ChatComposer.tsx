import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';

interface ChatComposerProps {
  onSendMessage: (text: string) => Promise<void> | void;
  isLoading: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  onSendMessage,
  isLoading,
  placeholder = 'Ask anything regarding academic regulations, calendars, fees, or policies...',
  disabled = false,
}) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [content]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || isLoading || disabled) return;

    setContent('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    await onSendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full bg-white border-t border-campus-border p-3 sm:p-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2 bg-white rounded-xl border border-campus-border shadow-subtle p-2 focus-within:border-campus-primary focus-within:ring-2 focus-within:ring-campus-primary/10 transition-all">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isLoading}
            placeholder={placeholder}
            rows={1}
            className="flex-1 max-h-44 min-h-[38px] py-1.5 px-2 bg-transparent text-sm text-campus-text placeholder:text-campus-text-muted resize-none focus:outline-none disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!content.trim() || isLoading || disabled}
            className="h-9 w-9 flex items-center justify-center rounded-lg bg-campus-primary text-white hover:bg-campus-primary-hover focus:outline-none focus:ring-2 focus:ring-campus-primary/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            title="Send message (Enter)"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-campus-text-secondary">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-campus-primary" />
            Answers are grounded in authoritative university documents
          </span>
          <span className="hidden sm:inline text-campus-text-muted">
            Press <kbd className="px-1 py-0.5 rounded bg-gray-100 font-mono text-[10px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-gray-100 font-mono text-[10px]">Shift + Enter</kbd> for new line
          </span>
        </div>
      </form>
    </div>
  );
};
