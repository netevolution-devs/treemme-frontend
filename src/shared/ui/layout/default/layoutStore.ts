import { create } from "zustand";

interface MenuState {
    isMenuVisible: boolean;
    showMenu: () => void;
    hideMenu: () => void;
    toggleMenu: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
    isMenuVisible: true,

    showMenu: () => set({ isMenuVisible: true }),
    hideMenu: () => set({ isMenuVisible: false }),
    toggleMenu: () => set((state) => ({ isMenuVisible: !state.isMenuVisible })),
}));