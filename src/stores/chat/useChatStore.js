// src/stores/chat/useChatStore.js

import { defineStore } from "pinia";
import axios from "@/services/api"; 
import { useAuthStore } from '@/stores/auth.js'; 
import { chatService } from '@/services/chat.js'; 

export const useChatStore = defineStore("chat", {
    state: () => ({
        chats: [],
        activeChat: null,
        loading: false,
        error: null,
    }),

    getters: {
        currentUserId() {
            return useAuthStore().user?.id;
        },
    },

    actions: {
        
        handleAuthError(err) {
            if (err.response?.status === 401) {
                const authStore = useAuthStore();
                console.error("Token tidak valid/kedaluwarsa. Memaksa logout...");
                authStore.logout(); 
                throw new Error("Sesi berakhir. Silakan login kembali."); 
            }
            throw err;
        },

        async fetchChats() {
            this.loading = true;
            this.error = null;
            try {
                const res = await axios.get("/chats"); 
                this.chats = res.data.data;
                this.sortChats(); 
            } catch (err) {
                console.error("fetchChats error:", err);
                this.error = err;
                this.handleAuthError(err);
            } finally {
                this.loading = false;
            }
        },

        async fetchChatById(chatId) {
            this.loading = true;
            this.error = null;
            try {
                const res = await axios.get(`/chats/${chatId}`);
                this.activeChat = res.data.data;
                return this.activeChat; 
            } catch (err) {
                this.error = err;
                console.error("fetchChatById error:", err);
                // 🚨 PENTING: Melempar error agar ChatDetailPage bisa menangkap 404/Akses Ditolak
                this.handleAuthError(err);
            } finally {
                this.loading = false;
            }
        },

        async createChat(payload) {
            this.error = null;
            try {
                const res = await axios.post("/chats", payload);
                
                this.chats.push(res.data.data); 
                this.sortChats(); 
                
                return res.data.data;
            } catch (err) {
                this.error = err;
                console.error("createChat error:", err);
                this.handleAuthError(err);
            }
        },
        
        async searchChats(query) {
            this.error = null;
            if (!query.trim()) return [];
            
            try {
                const res = await axios.get(`/search/chats`, { params: { q: query } });
                return res.data.data;
            } catch (err) {
                this.handleAuthError(err); 
                return [];
            }
        },
        
        async markAsRead(chatId) {
            this.error = null;
            try {
                await axios.post(`/chats/${chatId}/mark-as-read`); 
                
                const chatToUpdate = this.chats.find(c => c.id === chatId);
                if (chatToUpdate) {
                    chatToUpdate.unread_count = 0; 
                }
                
                if (this.activeChat?.id === chatId) {
                    this.activeChat.unread_count = 0;
                }
                
            } catch (err) {
                console.error(`markAsRead for chat ${chatId} failed:`, err);
                this.handleAuthError(err);
            }
        },

        resetActiveChat() {
            this.activeChat = null;
        },

        async updateChatStatus(chatId, payload) {
            this.error = null;
            try {
                const res = await chatService.updateChat(chatId, payload); 

                const updatedChat = res.data.data;
                const index = this.chats.findIndex(chat => chat.id === chatId);

                if (index !== -1) {
                    Object.assign(this.chats[index], updatedChat); 
                    
                    if ('pinned' in payload) {
                        this.sortChats(); 
                    }
                }  

                if (this.activeChat?.id === chatId) {
                    Object.assign(this.activeChat, updatedChat);
                }
                
                return res.data;
            } catch (err) {
                this.handleAuthError(err);
            }
        },

        // 🚨 METHOD DELETE CHAT (FINAL)
        async deleteChat(chatId, scope = 'me') {
            this.error = null;
            try {
                await chatService.deleteChat(chatId, scope);

                this.chats = this.chats.filter(chat => String(chat.id) !== String(chatId));
                
                if (String(this.activeChat?.id) === String(chatId)) {
                    this.resetActiveChat();
                }
                
            } catch (err) {
                this.handleAuthError(err);
            }
        },
        
        // 🚨 LOGIKA SORTING (FINAL FIX)
        sortChats() {
            const currentUserId = this.currentUserId; 

            this.chats.sort((a, b) => {
                
                // 1. Ambil status Pinning
                // ✅ KOREKSI: Menggunakan p.id, BUKAN p.user_id
                const participantA = a.participants.find(p => String(p.id) === String(currentUserId));
                const participantB = b.participants.find(p => String(p.id) === String(currentUserId));
                
                const pinA = participantA?.pinned || false;
                const pinB = participantB?.pinned || false;
                
                // Pinning: Pin HARUS di atas.
                if (pinA && !pinB) return -1; // A (pinned) naik ke atas
                if (!pinA && pinB) return 1;  // B (pinned) naik ke atas
                if (pinA && pinB) {
                // Jika keduanya pinned, urutkan berdasarkan updated_at
                const timeA = new Date(a.updated_at);
                const timeB = new Date(b.updated_at);
                return timeB - timeA;
                }

                // 2. Jika status Pin sama (keduanya tidak Pin), urutkan berdasarkan waktu
                const timeA = new Date(a.updated_at);
                const timeB = new Date(b.updated_at);
                // Paling baru di atas
                return timeB - timeA;
            });
        },
    },
});