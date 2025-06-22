
import { defineStore } from "pinia";


export const useUserStore = defineStore("user", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("loggedInUser") || "{}"),
    isLogin: !!localStorage.getItem("loggedInUser"),
  }),
  
  actions: {
    login(userData: { name: string; email: string }) {
      this.user = userData;
      this.isLogin = true;
      localStorage.setItem("loggedInUser", JSON.stringify(userData));
    },

    logout() {
      this.user = {};
      this.isLogin = false;
      localStorage.removeItem("loggedInUser");
    },
  },
});