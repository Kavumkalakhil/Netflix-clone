"use client";
import { useMovieStore } from "@/store/useMovieStore";

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useMovieStore();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-5 right-5 z-50 p-2 rounded-full transition-all duration-300 
      bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 shadow-xl"
    >
      {isDarkMode ? (
        <span className="text-xl">☀️</span>
      ) : (
        <span className="text-xl">🌙</span>
      )}
    </button>
  );
}