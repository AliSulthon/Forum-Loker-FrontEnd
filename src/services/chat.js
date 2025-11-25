// services/chatService.js
import api from "../services/api";

export const chatService = {
  getChats(params = {}) {
    return api.get("/chats", { params });
  },

  createChat(payload) {
    return api.post("/chats", payload);
  },

  getChatById(chatId) {
    return api.get(`/chats/${chatId}`);
  },

  updateChat(chatId, payload) {
    return api.patch(`/chats/${chatId}`, payload);
  },

  deleteChat(chatId, scope = "me") {
    return api.delete(`/chats/${chatId}`, { params: { scope } });
  },

  searchChats(q, limit = 20) {
    return api.get("/search/chats", { params: { q, limit } });
  },

  getMessages(chatId, params = {}) {
    return api.get(`/chats/${chatId}/messages`, { params });
  },

  sendMessage(chatId, payload) {
    return api.post(`/chats/${chatId}/messages`, payload);
  },
  
  // 🎯 FUNGSI BARU: MARK AS READ
  markAsRead(chatId) {
    // Menggunakan POST karena ini adalah aksi yang mengubah state di server.
    // Body (payload) di sini kosong karena ID chat sudah ada di URL.
    return api.post(`/chats/${chatId}/mark-as-read`); 
  },
};