import { defineStore } from 'pinia';
import api from '../services/api';

export const useBookmarksStore = defineStore('bookmarks', {
    state: () => ({
        bookmarks: [],
        currentPage: 1,
        totalPages: 1,
        perPage: 10,
        total: 0,
        loading: false,
    }),
    actions: {
        async fetchBookmarks(page = 1) {
            try {
                this.loading = true;
                const response = await api.get(`/bookmarks?page=${page}`);
                if (response.data.success) {
                    this.bookmarks = response.data.data.data;
                    this.currentPage = response.data.data.current_page;
                    this.totalPages = response.data.data.last_page;
                    this.perPage = response.data.data.per_page;
                    this.total = response.data.data.total;
                }
                return response.data;
            } catch (error) {
                console.error('Failed to fetch bookmarks:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async getBookmark(id) {
            try {
                const response = await api.get(`/bookmarks/${id}`);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch bookmark:', error);
                throw error;
            }
        },
        async addBookmark(bookmarkData) {
            try {
                const response = await api.post('/bookmarks', bookmarkData);
                if (response.data.success) {
                    // Refresh the bookmarks list
                    await this.fetchBookmarks(this.currentPage);
                }
                return response.data;
            } catch (error) {
                console.error('Failed to add bookmark:', error);
                throw error;
            }
        },
        async updateBookmark(id, bookmarkData) {
            try {
                const response = await api.patch(`/bookmarks/${id}`, bookmarkData);
                if (response.data.success) {
                    // Refresh the bookmarks list
                    await this.fetchBookmarks(this.currentPage);
                }
                return response.data;
            } catch (error) {
                console.error('Failed to update bookmark:', error);
                throw error;
            }
        },
        async deleteBookmark(id) {
            try {
                const response = await api.delete(`/bookmarks/${id}`);
                if (response.data.success) {
                    // Refresh the bookmarks list
                    await this.fetchBookmarks(this.currentPage);
                }
                return response.data;
            } catch (error) {
                console.error('Failed to delete bookmark:', error);
                throw error;
            }
        },
    },
});
