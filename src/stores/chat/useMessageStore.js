import { defineStore } from "pinia";
import axios from "@/services/api";
import { useAuthStore } from '@/stores/auth.js'; 

export const useMessageStore = defineStore("messages", {
    state: () => ({
        messages: [],
        loading: false,
        error: null,
    }),

    actions: {
        
        // =======================================================
        // HELPER FUNCTIONS
        // =======================================================
        
        handleAuthError(err) {
            if (err.response?.status === 401) {
                const authStore = useAuthStore();
                console.error("Token tidak valid/kedaluwarsa. Memaksa logout...");
                authStore.logout(); 
                throw new Error("Sesi berakhir (Token tidak valid)."); 
            }
            throw err;
        },

        // =======================================================
        // ACTIONS
        // =======================================================

        async fetchMessages(chatId, params = {}) {
            this.loading = true;
            this.error = null;
            try {
                const res = await axios.get(`/chats/${chatId}/messages`, { params });
                this.messages = res.data.data.reverse(); 
            } catch (err) {
                this.error = err;
                console.error("fetchMessages error:", err);
                try {
                    this.handleAuthError(err);
                } catch (handledError) {
                    this.error = handledError; 
                }
            } finally {
                this.loading = false;
            }
        },

        async sendMessage(chatId, content) {
            this.loading = true; 
            this.error = null;
          
            try {
                const payload = { 
                    type: 'text', 
                    text: content 
                }; 
                const res = await axios.post(`/chats/${chatId}/messages`, payload);

                if (res.data && res.data.data) {
                    this.appendMessageRealtime(res.data.data);
                }
                return res.data;
            } catch (err) {
                console.error("sendMessage error:", err);
                this.error = err;
                if (err.response && err.response.data) {
                    console.log("Server response error:", err.response.data);
                }
                this.handleAuthError(err);
            } finally {
                this.loading = false;
            }
        },

        async searchMessages(chatId, query) {
            this.error = null;
            if (!query.trim()) return [];
            
            try {
                const res = await axios.get(`/search/messages`, {
                    params: { chat_id: chatId, q: query },
                });
                
                const resultData = res.data.data || res.data;
                return Array.isArray(resultData) ? resultData : [];
            } catch (err) {
                this.error = err;
                console.error("searchMessages error:", err);
                
                try {
                    this.handleAuthError(err);
                } catch {
                    return []; 
                }
                return [];
            }
        },

        async updateMessage(chatId, messageId, payload) {
            this.error = null;
            try {
                // ✅ Menggunakan axios langsung (konsisten dengan action lain)
                const res = await axios.patch(`/chats/${chatId}/messages/${messageId}`, payload);
                
                const updated = res.data.data;
                
                // Update message di state lokal
                this.messages = this.messages.map((m) =>
                    m.id === messageId ? updated : m
                );
                
                return updated;
            } catch (err) {
                this.error = err;
                console.error("updateMessage error:", err);
                this.handleAuthError(err);
                throw err;
            }
        },

        /**
         * Menghapus pesan dengan scope 'me' atau 'all'.
         * Jika scope='all', backend akan mengubah 'type' pesan menjadi 'deleted'.
         */
        async deleteMessage(chatId, messageId, scope = "me") {
            this.error = null;
            try {
                await axios.delete(`/chats/${chatId}/messages/${messageId}`, {
                    params: { scope },
                });

                if (scope === 'me') {
                    // Hapus dari state lokal jika hanya untuk diri sendiri
                    this.messages = this.messages.filter((m) => m.id !== messageId);
                } else if (scope === 'all') {
                    // Jika 'all', update pesan di state lokal menjadi type: 'deleted'
                    this.messages = this.messages.map((m) => {
                        if (m.id === messageId) {
                            return { 
                                ...m, 
                                type: 'deleted', 
                                text: null,
                            };
                        }
                        return m;
                    });
                }

            } catch (err) {
                this.error = err;
                console.error("deleteMessage error:", err);
                this.handleAuthError(err);
            }
        },
        
        appendMessageRealtime(message) {
            if (!this.messages.some((m) => m.id === message.id)) {
                this.messages.push(message);
            }
        },
    },
});