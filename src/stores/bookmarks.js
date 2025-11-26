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
        async fetchBookmarks(page = 1, label = null) {
            try {
                this.loading = true;
                const params = { page };
                if (label) params.label = label;

                const response = await api.get('/bookmarks', { params });
                console.log('Fetch bookmarks response:', response.data);

                if (response.data.success) {
                    // Handle both paginated and non-paginated responses
                    const data = response.data.data;
                    if (data.data) {
                        // Paginated response
                        this.bookmarks = data.data;
                        this.currentPage = data.current_page || 1;
                        this.totalPages = data.last_page || 1;
                        this.perPage = data.per_page || 10;
                        this.total = data.total || 0;
                    } else {
                        // Non-paginated or direct array
                        this.bookmarks = Array.isArray(data) ? data : [];
                        this.currentPage = 1;
                        this.totalPages = 1;
                        this.perPage = this.bookmarks.length;
                        this.total = this.bookmarks.length;
                    }
                }
                return response.data;
            } catch (error) {
                console.error('Failed to fetch bookmarks:', error);
                console.error('Error response:', error.response?.data);
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
                // Convert single IDs to arrays if needed
                const payload = {
                    label: bookmarkData.label,
                    note: bookmarkData.note
                };

                if (bookmarkData.post_id) {
                    payload.post_ids = [bookmarkData.post_id];
                }
                if (bookmarkData.article_id) {
                    payload.article_ids = [bookmarkData.article_id];
                }
                // Support direct array input too
                if (bookmarkData.post_ids) {
                    payload.post_ids = bookmarkData.post_ids;
                }
                if (bookmarkData.article_ids) {
                    payload.article_ids = bookmarkData.article_ids;
                }

                // Validate: at least one of post_ids or article_ids must be provided
                if (!payload.post_ids && !payload.article_ids) {
                    throw new Error('At least one post or article must be provided');
                }

                console.log('Adding bookmark with payload:', payload);
                const response = await api.post('/bookmarks', payload);
                console.log('Add bookmark response:', response.data);

                if (response.data.success) {
                    // Refresh the bookmarks list
                    await this.fetchBookmarks(this.currentPage);
                }
                return response.data;
            } catch (error) {
                console.error('Failed to add bookmark:', error);
                console.error('Error response:', error.response?.data);
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

        async addItemToBookmark(bookmarkId, type, itemId) {
            try {
                const response = await api.post(`/bookmarks/${bookmarkId}/items`, {
                    type,
                    item_id: itemId
                });
                if (response.data.success) {
                    // Refresh the bookmarks list
                    await this.fetchBookmarks(this.currentPage);
                }
                return response.data;
            } catch (error) {
                console.error('Failed to add item to bookmark:', error);
                throw error;
            }
        },

        async removeItemFromBookmark(bookmarkId, type, itemId) {
            try {
                const response = await api.delete(`/bookmarks/${bookmarkId}/items/${type}/${itemId}`);
                if (response.data.success) {
                    // Refresh the bookmarks list
                    await this.fetchBookmarks(this.currentPage);
                }
                return response.data;
            } catch (error) {
                console.error('Failed to remove item from bookmark:', error);
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
