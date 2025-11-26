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
            // Memastikan ID user tersedia
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

        /**
         * Action untuk memperbarui status Chat Participant (pinned, mute_until, archived).
         * @param {number} chatId ID chat yang akan diperbarui
         * @param {object} payload Data status yang akan dikirim ke backend (misalnya { pinned: true })
         */
        async updateChatStatus(chatId, payload) {
            this.error = null;
            try {
                // Panggil API untuk update status. Response akan mengembalikan objek Chat terbaru 
                // yang sudah diperbarui, termasuk relasi participants.
                const res = await chatService.updateChat(chatId, payload); 

                const updatedChat = res.data.data;
                const index = this.chats.findIndex(chat => chat.id === chatId);

                // --- SINKRONISASI DATA UTAMA ---
                
                // 1. Perbarui list chats
                if (index !== -1) {
                    // Gunakan Object.assign untuk memperbarui objek chat di list secara reaktif 
                    // (ini termasuk pembaruan array participants di dalamnya)
                    Object.assign(this.chats[index], updatedChat); 
                    
                    if ('pinned' in payload) {
                        this.sortChats(); 
                    }
                }  

                // 2. Perbarui activeChat (jika sedang dibuka)
                if (this.activeChat?.id === chatId) {
                    // Gunakan Object.assign untuk memperbarui activeChat secara reaktif
                    Object.assign(this.activeChat, updatedChat);
                }
                
                // --- Selesai SINKRONISASI DATA UTAMA ---

                return res.data;
            } catch (err) {
                this.handleAuthError(err);
            }
        },

        
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

        getParticipantForChat(chatId) {
            const chat = this.chats.find(c => c.id === chatId);
            if (!chat) return null;
            
            return chat.participants?.find(
                p => String(p.user_id) === String(this.currentUserId)
            );
        },
        
        sortChats() {
            const currentUserId = this.currentUserId; 

            this.chats.sort((a, b) => {
                
                // 1. Ambil status Pinning
                // NOTE: Koreksi sebelumnya adalah mencari berdasarkan p.id, tetapi 
                // jika chat object dari API menggunakan p.user_id, gunakan itu. 
                // Berdasarkan kode Anda yang dikirim, chat object yang diterima dari API 
                // memiliki participants, dan untuk `currentParticipant` di komponen Vue, 
                // Anda mencari berdasarkan `user_id` di ChatAction, jadi kita samakan di sini.
                
                const participantA = a.participants.find(p => String(p.user_id) === String(currentUserId));
                const participantB = b.participants.find(p => String(p.user_id) === String(currentUserId));
                
                const pinA = participantA?.pinned || false;
                const pinB = participantB?.pinned || false;
                
                // Pinning: Pin HARUS di atas.
                if (pinA && !pinB) return -1; 
                if (!pinA && pinB) return 1; 
                
                if (pinA && pinB) {
                    // Jika keduanya pinned, urutkan berdasarkan updated_at
                    const timeA = new Date(a.updated_at);
                    const timeB = new Date(b.updated_at);
                    return timeB - timeA;
                }

                // 2. Jika status Pin sama, urutkan berdasarkan waktu updated_at (paling baru di atas)
                const timeA = new Date(a.updated_at);
                const timeB = new Date(b.updated_at);
                return timeB - timeA;
            });
        },
    },
});