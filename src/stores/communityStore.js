import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";

const BASE_URL = "http://127.0.0.1:8000/api"; // sesuaikan

export const useCommunityStore = defineStore("communityStore", {
  state: () => ({
    communities: [],
    loaded: false,
    searchQuery: "", // <--- STATE BARU UNTUK SEARCH QUERY
  }),

  getters: {
    getById: (state) => (id) => state.communities.find((c) => c.id == id),

    // <--- GETTER BARU UNTUK FILTERING
    filteredCommunities: (state) => {
      // Jika query kosong, kembalikan semua komunitas
      if (!state.searchQuery) {
        return state.communities;
      }

      const query = state.searchQuery.toLowerCase();

      // Filter komunitas berdasarkan nama atau deskripsi
      return state.communities.filter(
        (community) =>
          community.name.toLowerCase().includes(query) ||
          community.description.toLowerCase().includes(query)
      );
    },
  },

  actions: {
    authHeader() {
      // ... (tetap sama)
      const auth = useAuthStore();
      const token = auth.token || localStorage.getItem("auth_token");
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    },

    // GET ALL (tetap sama)
    async fetchCommunities() {
      const auth = useAuthStore();
      const res = await axios.get(`${BASE_URL}/communities`, this.authHeader());

      // Tambahkan properti isOwner untuk setiap komunitas
      this.communities = res.data.data.map((c) => ({
        ...c,
        isOwner: c.user_id === auth.user.id, // jika user_id sama dengan user login
      }));

      this.loaded = true;
    },
    // Aksi untuk memperbarui search query
    setSearchQuery(query) {
      this.searchQuery = query;
    },

    // ... (action lain tetap sama: fetchCommunityById, addCommunity, updateCommunity, deleteCommunity) ...
    async fetchCommunityById(id) {
      const res = await axios.get(
        `${BASE_URL}/communities/${id}`,
        this.authHeader()
      );
      return res.data.data;
    },

    async addCommunity(payload) {
      const auth = useAuthStore();
      const body = {
        user_id: auth.user.id,
        name: payload.name,
        description: payload.description,
      };

      const res = await axios.post(
        `${BASE_URL}/communities`,
        body,
        this.authHeader()
      );

      this.communities.push(res.data.data);
    },

    async updateCommunity(id, data) {
      const res = await axios.put(
        `${BASE_URL}/communities/${id}`,
        data,
        this.authHeader()
      );

      const index = this.communities.findIndex((c) => c.id == id);
      if (index !== -1) {
        this.communities[index] = res.data.data;
      }
    },

    async deleteCommunity(id) {
      await axios.delete(`${BASE_URL}/communities/${id}`, this.authHeader());
      this.communities = this.communities.filter((c) => c.id != id);
    },
  },
});
