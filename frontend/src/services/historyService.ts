import { apiClient, isMockModeActive } from './apiClient';
import { mockService } from '../mocks/mockService';
import { Conversation } from '../types';

export const historyService = {
  async getHistory(): Promise<Conversation[]> {
    if (isMockModeActive()) {
      return mockService.getConversations();
    }

    const res = await apiClient.get<Conversation[]>('/api/chat/conversations');
    return res.data;
  },

  async deleteConversation(conversationId: string): Promise<void> {
    if (isMockModeActive()) {
      return mockService.deleteConversation(conversationId);
    }

    await apiClient.delete(`/api/chat/conversations/${conversationId}`);
  },
};
