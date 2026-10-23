import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Bot, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  Plus, 
  History, 
  Menu, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { chatService } from '../../services/chatService';
import { historyService } from '../../services/historyService';
import { Message, Conversation, Citation } from '../../types';
import { ChatMessage } from '../../components/chat/ChatMessage';
import { ChatComposer } from '../../components/chat/ChatComposer';
import { SuggestedQuestions } from '../../components/chat/SuggestedQuestions';
import { ConversationDrawer } from '../../components/chat/ConversationDrawer';

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const conversationIdParam = searchParams.get('id');
  const initialQueryParam = searchParams.get('q');

  const [activeConversationId, setActiveConversationId] = useState<string | null>(conversationIdParam);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSentInitialQuery = useRef(false);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load conversation list
  const loadConversations = useCallback(async () => {
    try {
      const list = await historyService.getHistory();
      setConversations(list);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load messages when conversationId changes
  useEffect(() => {
    if (conversationIdParam) {
      setActiveConversationId(conversationIdParam);
      const fetchMsgs = async () => {
        try {
          setIsLoading(true);
          const msgs = await chatService.getConversationMessages(conversationIdParam);
          setMessages(msgs);
        } catch {
          setError('Failed to load conversation history.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchMsgs();
    } else if (!initialQueryParam) {
      setActiveConversationId(null);
      setMessages([]);
    }
  }, [conversationIdParam, initialQueryParam]);

  // Handle sending a message
  const handleSendMessage = async (text: string) => {
    setError(null);
    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await chatService.askQuestion({
        question: text,
        conversation_id: activeConversationId,
      });

      const assistantMsg: Message = {
        id: response.message_id,
        role: 'assistant',
        content: response.answer,
        created_at: new Date().toISOString(),
        citations: response.citations,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setActiveConversationId(response.conversation_id);
      setSearchParams({ id: response.conversation_id });
      loadConversations();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to retrieve response from the campus knowledge base.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle initial query from URL search param
  useEffect(() => {
    if (initialQueryParam && !hasSentInitialQuery.current) {
      hasSentInitialQuery.current = true;
      handleSendMessage(initialQueryParam);
    }
  }, [initialQueryParam]);

  const handleSelectConversation = (id: string) => {
    setSearchParams({ id });
    setMobileHistoryOpen(false);
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
    setMessages([]);
    setError(null);
    setSearchParams({});
    setMobileHistoryOpen(false);
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await historyService.deleteConversation(id);
      if (activeConversationId === id) {
        handleNewConversation();
      }
      loadConversations();
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-campus-bg -m-4 sm:-m-6 lg:-m-8">
      {/* Desktop Conversation History Sidebar */}
      <div className="hidden lg:block h-full">
        <ConversationDrawer
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
        />
      </div>

      {/* Mobile Drawer */}
      <ConversationDrawer
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpen={mobileHistoryOpen}
        onClose={() => setMobileHistoryOpen(false)}
        isMobileDrawer={true}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full bg-campus-bg">
        {/* Chat Header Toolbar */}
        <div className="h-12 bg-white border-b border-campus-border px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileHistoryOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-campus-text-secondary hover:text-campus-text hover:bg-campus-surface-subtle"
              title="View History"
              aria-label="Open conversation history"
            >
              <History className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-campus-text">
                {activeConversationId ? 'Active Campus Inquiry' : 'New Inquiry'}
              </span>
              <span className="text-campus-text-muted">·</span>
              <span className="text-[11px] text-campus-text-secondary flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Grounded in Institutional Documents
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNewConversation}
              className="btn-secondary text-xs py-1 px-2.5 h-8"
              title="Start a new inquiry"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>New Inquiry</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            /* Empty / New Conversation Welcome State */
            <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-campus-primary text-white flex items-center justify-center mx-auto shadow-subtle">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-campus-text tracking-tight">
                How can CampusMind assist you today?
              </h2>
              <p className="text-xs text-campus-text-secondary max-w-md mx-auto leading-relaxed">
                CampusMind synthesizes answers strictly grounded in official academic regulations, calendars, fees, and examination notifications.
              </p>

              {/* Suggested Questions Grid */}
              <div className="pt-4">
                <SuggestedQuestions onSelectQuestion={handleSendMessage} />
              </div>
            </div>
          ) : (
            /* Active Message List */
            <div className="divide-y divide-campus-border/30 pb-6">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  userName={user?.name}
                />
              ))}

              {/* Loading State Skeleton */}
              {isLoading && (
                <div className="py-5 px-4 sm:px-6 bg-white border-y border-campus-border/50">
                  <div className="max-w-3xl mx-auto flex items-start gap-3.5 text-left">
                    <div className="w-8 h-8 rounded-lg bg-campus-primary text-white flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-campus-text">
                          CampusMind Assistant
                        </span>
                        <span className="text-[11px] text-campus-primary flex items-center gap-1 font-medium">
                          <Loader2 className="w-3 h-3 animate-spin" /> Retrieving grounded context...
                        </span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    </div>
                  </div>
                </div>
              )}

              {/* Error Notice */}
              {error && (
                <div className="max-w-3xl mx-auto m-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
                        handleSendMessage(messages[messages.length - 1].content);
                      }
                    }}
                    className="text-xs font-semibold text-rose-800 hover:underline flex items-center gap-1 shrink-0"
                  >
                    <RefreshCw className="w-3 h-3" /> Retry
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Composer Footer */}
        <ChatComposer
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder="Ask anything regarding regulations, fees, calendars, syllabi..."
        />
      </div>
    </div>
  );
};
