import { defineStore } from "pinia";

export const useCommunityPostStore = defineStore("communityPostStore", {
  state: () => ({
    posts: [
      {
        id: 1,
        community_id: 1,
        user_id: 3,
        title: "Salah masuk kantor",
        content: "Ini adalah konten dari post yaa",
      },
      {
        id: 2,
        community_id: 1,
        user_id: 7,
        title: "Aut aut quaerat tempore",
        content: "Minus et quo voluptas delectus quia.",
      },
    ],
  }),

  getters: {
    getByCommunity: (state) => (cid) =>
      state.posts.filter((p) => p.community_id == cid),

    getById: (state) => (id) => state.posts.find((p) => p.id == id),
  },

  actions: {
    addPost(payload) {
      const newId = this.posts.length + 1;
      this.posts.push({ id: newId, ...payload });
    },
  },
});
