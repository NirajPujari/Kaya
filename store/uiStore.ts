"use client";
import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  mobileNavOpen: boolean;
  addSetModalOpen: boolean;
  addSetModalExerciseIndex: number | null;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
  openAddSetModal: (exerciseIndex: number) => void;
  closeAddSetModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  mobileNavOpen: false,
  addSetModalOpen: false,
  addSetModalExerciseIndex: null,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleMobileNav: () => set((s) => ({ mobileNavOpen: !s.mobileNavOpen })),
  openAddSetModal: (exerciseIndex) =>
    set({ addSetModalOpen: true, addSetModalExerciseIndex: exerciseIndex }),
  closeAddSetModal: () =>
    set({ addSetModalOpen: false, addSetModalExerciseIndex: null }),
}));
