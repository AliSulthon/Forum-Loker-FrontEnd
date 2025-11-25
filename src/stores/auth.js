import { defineStore } from "pinia";
import { ref } from "vue";
import { login, logout } from "../service/auth";

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref(localStorage.getItem("access_token") || "");
  const isLoggedIn = ref(!!accessToken.value);

  const loginUser = async (credentials) => {
    try {
      const res = await login(credentials);
      const token = res.data?.data?.access_token;

      accessToken.value = token;
      localStorage.setItem("access_token", token);
      isLoggedIn.value = true;
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
    } catch (e) {}

    accessToken.value = "";
    localStorage.removeItem("access_token");
    isLoggedIn.value = false;
  };

  return { accessToken, isLoggedIn, loginUser, logoutUser };

});

