// services/messageService.js
import api from "./api";

export const messageService = {
  getMessage(chatId, messageId) {
    return api.get(`/chats/${chatId}/messages/${messageId}`);
  },

  updateMessage(chatId, messageId, payload) {
    // ✅ PATCH sesuai Laravel resource route
    return api.patch(`/chats/${chatId}/messages/${messageId}`, payload);
  },

  deleteMessage(chatId, messageId, scope = "me") {
    return api.delete(`/chats/${chatId}/messages/${messageId}`, {
      params: { scope },
    });
  },

  searchMessages(params = {}) {
    return api.get("/search/messages", { params });
  },
};
