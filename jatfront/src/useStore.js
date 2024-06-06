import { create } from "zustand";

export const useSearchStore = create((set) => ({
  jobSearchQuery: "",
  updateJobSearchQuery: (query) => set(() => ({ jobSearchQuery: query })),
}));
