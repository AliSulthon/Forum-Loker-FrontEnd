import { defineStore } from "pinia";

export const useCommunityPostStore = defineStore("communityPostStore", {
  state: () => ({
    posts: {}, // objek per community_id
    loaded: {}, // tracking fetch per community
  }),

  getters: {
    // Mengembalikan posts khusus community tertentu
    getByCommunity: (state) => (cid) => state.posts[cid] || [],

    // FIX: Ambil post by ID dari community tertentu
    getById: (state) => (communityId, postId) => {
      const communityPosts = state.posts[communityId] || [];
      return communityPosts.find((p) => p.id === postId);
    },
  },

  actions: {
    async fetchPosts(communityId) {
      if (!this.loaded[communityId]) {
        const dummy = [
          {
            id: 1,
            community_id: communityId,
            user_id: 1,
            title: "Salah masuk kantor",
            content: "Ini adalah konten dari post yaa",
            author: "Dimas",
            date: "18 November 2025, 09:30",
          },
          {
            id: 2,
            community_id: communityId,
            user_id: 7,
            title: "Aut aut quaerat tempore",
            content: "Minus et quo voluptas delectus quia.",
            author: "You",
            date: "18 November 2025, 14:45",
          },
        ];
        this.posts[communityId] = dummy;
        this.loaded[communityId] = true;
      }
    },

    addPost(payload) {
      const cid = payload.community_id;
      if (!this.posts[cid]) this.posts[cid] = [];

      const newId = this.posts[cid].length + 1;
      const now = new Date();
      const formattedDate = this.formatDateTime(now);

      this.posts[cid].push({
        id: newId,
        ...payload,
        date: formattedDate,
      });
    },

    updatePost(communityId, postId, updatedData) {
      if (!this.posts[communityId]) return;

      const index = this.posts[communityId].findIndex((p) => p.id === postId);
      if (index !== -1) {
        this.posts[communityId][index] = {
          ...this.posts[communityId][index],
          ...updatedData,
        };
      }
    },

    deletePost(communityId, postId) {
      if (!this.posts[communityId]) return;
      this.posts[communityId] = this.posts[communityId].filter(
        (p) => p.id !== postId
      );
    },

    formatDateTime(date) {
      const d = new Date(date);
      const day = d.getDate();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const month = monthNames[d.getMonth()];
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${day} ${month} ${year}, ${hours}:${minutes}`;
    },
  },
});
