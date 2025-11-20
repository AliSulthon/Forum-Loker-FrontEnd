import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: { id: 1, name: "Demo User" },
  }),
});
