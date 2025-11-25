import { defineStore } from "pinia";
import api from "../services/api"; // axios instance dengan token interceptor
import { useAuthStore } from "./auth";

export const useCommunityPostStore = defineStore("communityPostStore", {
  state: () => ({
    posts: {}, // posts per community
    loaded: {}, // tracking fetch per community
  }),

  getters: {
    getByCommunity: (state) => (cid) => state.posts[cid] || [],
    getById: (state) => (communityId, postId) => {
      const communityPosts = state.posts[communityId] || [];
      return communityPosts.find((p) => p.id === postId);
    },
  },

  actions: {
    // ================= HELPER =================
    formatPost(rawPost) {
      // Ambil authStore di dalam function
      const authStore = useAuthStore();

      return {
        ...rawPost,
        author:
          rawPost.user_name ||
          (rawPost.user_id === authStore.user?.id
            ? "You"
            : "User " + rawPost.user_id),
        date: rawPost.created_at
          ? new Date(rawPost.created_at).toLocaleString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
      };
    },

    // ================= FETCH ALL POSTS =================
    async fetchPosts(communityId) {
      if (this.loaded[communityId]) return;

      try {
        const res = await api.get(`/communities/${communityId}/posts`);
        // map semua post ke format baru
        this.posts[communityId] = res.data.data.map((p) => this.formatPost(p));
        this.loaded[communityId] = true;
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        this.posts[communityId] = [];
      }
    },

    // ================= FETCH SINGLE POST =================
    async fetchPostById(communityId, postId) {
      try {
        const res = await api.get(
          `/communities/${communityId}/posts/${postId}`
        );
        const formatted = this.formatPost(res.data.data);

        if (!this.posts[communityId]) this.posts[communityId] = [];
        const index = this.posts[communityId].findIndex((p) => p.id === postId);
        if (index !== -1) {
          this.posts[communityId][index] = formatted;
        } else {
          this.posts[communityId].push(formatted);
        }

        return formatted;
      } catch (error) {
        console.error("Failed to fetch post:", error);
        return null;
      }
    },

    // ================= CREATE POST =================
    async addPost(communityId, title, content) {
      try {
        const authStore = useAuthStore();

        const payload = {
          user_id: authStore.user.id,
          title,
          content,
        };

        const res = await api.post(
          `/communities/${communityId}/posts`,
          payload
        );
        const formatted = this.formatPost(res.data.data);

        if (!this.posts[communityId]) this.posts[communityId] = [];
        this.posts[communityId].push(formatted);

        return formatted;
      } catch (error) {
        console.error("Failed to add post:", error);
        throw error;
      }
    },

    // ================= UPDATE POST =================
    async updatePost(communityId, postId, updatedData) {
      try {
        const res = await api.put(
          `/communities/${communityId}/posts/${postId}`,
          updatedData
        );
        const formatted = this.formatPost(res.data.data);

        if (!this.posts[communityId]) return formatted;

        const index = this.posts[communityId].findIndex((p) => p.id === postId);
        if (index !== -1) {
          this.posts[communityId][index] = formatted;
        }

        return formatted;
      } catch (error) {
        console.error("Failed to update post:", error);
        throw error;
      }
    },

    // ================= DELETE POST =================
    async deletePost(communityId, postId) {
      try {
        await api.delete(`/communities/${communityId}/posts/${postId}`);
        if (!this.posts[communityId]) return;
        this.posts[communityId] = this.posts[communityId].filter(
          (p) => p.id !== postId
        );
      } catch (error) {
        console.error("Failed to delete post:", error);
        throw error;
      }
    },
  },
});
