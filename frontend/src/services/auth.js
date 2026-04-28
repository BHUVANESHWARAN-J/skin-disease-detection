import api from "./api";

export const authService = {
  register: (username, email, password) =>
    api.post("register/", { username, email, password }),

  login: (username, password) =>
    api.post("login/", { username, password }),

  getProfile: () => api.get("profile/"),

  getHistory: () => api.get("history/"),

  predict: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("predict/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
