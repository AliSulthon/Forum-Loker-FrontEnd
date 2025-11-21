import { defineStore } from "pinia";

export const useCommunityStore = defineStore("communityStore", {
  state: () => ({
    communities: [],
    loaded: false,
  }),

  getters: {
    getById: (state) => (id) => state.communities.find((c) => c.id == id),
  },

  actions: {
    async fetchCommunities() {
      if (!this.loaded) {
        // Simulasi fetch
        this.communities = [
          {
            id: 1,
            user_id: 1,
            name: "Loker PT Handal Sejahtera",
            description: "Komunitas diskusi lowongan dan filsuf handal.",
          },
          {
            id: 2,
            user_id: 2,
            name: "Programmer Indonesia",
            description: "Komunitas coding dan teknologi.",
          },
        ];
        this.loaded = true;
      }
    },

    addCommunity(payload) {
      const newId = this.communities.length + 1;
      this.communities.push({ id: newId, ...payload });
    },
  },
});
