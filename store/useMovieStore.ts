import { create } from 'zustand';

interface MovieStore {
  hoveredMovie: any;
  activeMovie: any;
  focusedIndex: number;
  setHoveredMovie: (movie: any) => void;
  setActiveMovie: (movie: any) => void;
  setFocusedIndex: (index: number) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
  hoveredMovie: null,
  activeMovie: null,
  focusedIndex: 0,
  isDarkMode: true,
  setHoveredMovie: (movie) => set({ hoveredMovie: movie }),
  setActiveMovie: (movie) => set({ activeMovie: movie }),
  setFocusedIndex: (index: number) => set({ focusedIndex: index }), // Added this missing property
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
})); // Ensure all curly braces are correctly closed