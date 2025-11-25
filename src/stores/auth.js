import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user_info")) || null,
    token: localStorage.getItem("auth_token") || null,
  }),
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem("auth_token", token);
    },
    setUser(user) {
      this.user = user;
      localStorage.setItem("user_info", JSON.stringify(user));
    },
    async login(email, password) {
      try {
        const response = await api.post("/login", { email, password });
        if (response.data.access_token) {
          this.setToken(response.data.access_token);
          this.setUser(response.data.user);
        }
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async fetchProfile() {
      try {
        const response = await api.get("/profile");
        if (response.data.success) {
          this.setUser(response.data.data);
        }
        return response.data;
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        throw error;
      }
    },
    async updateProfile(profileData) {
      try {
        const response = await api.patch("/profile", profileData);
        if (response.data.success) {
          // Merge updates into current user state
          const updatedUser = { ...this.user, ...response.data.data };
          this.setUser(updatedUser);
        }
        return response.data;
      } catch (error) {
        console.error("Failed to update profile:", error);
        throw error;
      }
    },
    async updatePhoto(formData) {
      try {
        const response = await api.post("/profile/photo", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.data.success) {
          if (this.user) {
            const updatedUser = {
              ...this.user,
              photo: response.data.data.photo,
              photo_url: response.data.data.photo_url,
            };
            this.setUser(updatedUser);
          }
          if (response.data.user) {
            this.setUser(response.data.user);
          }
        }
        return response.data;
      } catch (error) {
        console.error("Failed to update photo:", error);
        throw error;
      }
    },
    async deletePhoto() {
      try {
        const response = await api.delete("/profile/photo");
        if (response.data.success) {
          await this.fetchProfile();
        }
        return response.data;
      } catch (error) {
        console.error("Failed to delete photo:", error);
        throw error;
      }
    },
    async updatePassword(passwordData) {
      try {
        const response = await api.put("/profile/password", passwordData);
        return response.data;
      } catch (error) {
        console.error("Failed to update password:", error);
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_info");
    },
  },
});
