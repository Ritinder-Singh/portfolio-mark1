import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as apiLogin, getMe, type User } from "./api";

type AuthState = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: true,

      login: async (email: string, password: string) => {
        const { access_token } = await apiLogin(email, password);
        localStorage.setItem("token", access_token);
        set({ token: access_token });

        const user = await getMe();
        set({ user });
      },

      logout: () => {
        localStorage.removeItem("token");
        set({ token: null, user: null });
      },

      checkAuth: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          set({ isLoading: false });
          return;
        }

        try {
          set({ token });
          const user = await getMe();
          set({ user, isLoading: false });
        } catch {
          localStorage.removeItem("token");
          set({ token: null, user: null, isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token }),
    }
  )
);
