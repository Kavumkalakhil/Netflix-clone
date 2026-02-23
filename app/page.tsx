"use client";
import { useEffect } from "react";
import { useMovieStore } from "@/store/useMovieStore";
import { movies } from "@/data/movies";
import MovieCard from "@/components/MovieCard";
import FullScreenPlayer from "@/components/FullScreenPlayer";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const { 
    hoveredMovie, 
    setHoveredMovie, 
    setActiveMovie, 
    focusedIndex, 
    setFocusedIndex,
    isDarkMode 
  } = useMovieStore();

  // 1. AUTO-PLAY CAROUSEL LOGIC
  // Cycles through movies every 5 seconds when the user is not hovering
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hoveredMovie) {
        setFocusedIndex((focusedIndex + 1) % movies.length);
      }
    }, 5000); 

    return () => clearInterval(interval);
  }, [focusedIndex, hoveredMovie, setFocusedIndex]);

  // Fallback logic to always show a preview in the Hero section
  const currentPreview = hoveredMovie || movies[focusedIndex];

  // 2. KEYBOARD NAVIGATION (3x3 Grid Matrix)
  // Maps 1D array indices to 2D grid movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let newIndex = focusedIndex;
      const columns = 3; 

      switch (e.key) {
        case "ArrowRight": if (focusedIndex < movies.length - 1) newIndex++; break;
        case "ArrowLeft": if (focusedIndex > 0) newIndex--; break;
        case "ArrowDown": if (focusedIndex + columns < movies.length) newIndex += columns; break;
        case "ArrowUp": if (focusedIndex - columns >= 0) newIndex -= columns; break;
        case "Enter": setActiveMovie(movies[focusedIndex]); return;
      }

      if (newIndex !== focusedIndex) {
        setFocusedIndex(newIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, setFocusedIndex, setActiveMovie]);

  return (
    <main className={`relative min-h-screen transition-colors duration-500 overflow-x-hidden
      ${isDarkMode ? "bg-[#141414] text-white" : "bg-gray-50 text-black"}`}>
      
      {/* UI Elements */}
      <ThemeToggle />
      <FullScreenPlayer />

      {/* SECTION 1: FIXED HERO PREVIEW
          Pinned to top so grid rows 2 & 3 scroll underneath it */}
      <div className={`fixed top-0 left-0 w-full h-[50vh] z-30 border-b transition-colors duration-500
        ${isDarkMode ? "bg-[#141414] border-white/10 shadow-2xl" : "bg-white border-gray-300 shadow-md"}`}>
        
        <div className="relative w-full h-full animate-in fade-in duration-1000">
          <video
            key={currentPreview.id} // Forces re-render on movie change
            src={currentPreview.video}
            autoPlay muted loop playsInline
            className={`w-full h-full object-cover transition-all duration-700
              ${isDarkMode ? "brightness-[0.35]" : "brightness-[0.8]"}`}
          />
          
          {/* Metadata Overlay - Adapts based on Theme */}
          <div className={`absolute inset-0 flex flex-col justify-center px-10 md:px-16 bg-gradient-to-r 
            ${isDarkMode ? "from-black/80 via-black/40 to-transparent" : "from-white/90 via-white/40 to-transparent"}`}>
            
            <h2 className={`text-3xl md:text-5xl font-bold mb-2 uppercase tracking-tighter animate-in slide-in-from-left duration-700
              ${isDarkMode ? "text-white" : "text-black"}`}>
              {currentPreview.title}
            </h2>
            
            <div className={`flex items-center gap-3 text-sm md:text-base font-medium 
              ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              <span className="text-green-500 font-bold">98% Match</span>
              <span>2026</span>
              <span className="border border-current px-1.5 rounded text-xs">18+</span>
              <span>2h 15m</span>
              <span className={`px-1 rounded text-[10px] font-bold border ${isDarkMode ? "border-gray-500" : "border-gray-400"}`}>
                4K ULTRA HD
              </span>
            </div>

            <p className={`mt-4 max-w-md line-clamp-2 text-sm md:text-base hidden sm:block
              ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Experience the cinematic thrill of {currentPreview.title}. Now streaming in high fidelity for your project demo.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: SCROLLABLE MOVIE GRID
          pt-[55vh] creates the gap for the fixed hero above */}
      <div className="relative z-10 pt-[55vh] px-4 md:px-16 pb-20 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          <h1 className={`text-xl md:text-2xl font-semibold mb-8 uppercase tracking-widest opacity-80
            ${isDarkMode ? "text-white" : "text-black"}`}>
            Trending Now
          </h1>
          
          {/* Responsive Grid System */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {movies.map((movie: any, index: number) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                isFocused={focusedIndex === index}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}