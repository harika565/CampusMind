import { apiClient, isMockModeActive } from './apiClient';
import { mockService } from '../mocks/mockService';
import { ChatRequest, ChatResponse, Message } from '../types';

export const chatService = {
  async askQuestion(req: ChatRequest): Promise<ChatResponse> {
    if (isMockModeActive()) {
      return mockService.askQuestion(req);
    }

    const res = await apiClient.post<ChatResponse>('/api/chat/query', req);
    return res.data;
  },

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    if (isMockModeActive()) {
      return mockService.getConversationMessages(conversationId);
    }

    const res = await apiClient.get<Message[]>(`/api/chat/conversations/${conversationId}/messages`);
    return res.data;
  },
};
