"use client";
import { useState, useEffect } from "react";
import { useMovieStore } from "@/store/useMovieStore";

export default function FullScreenPlayer() {
  const { activeMovie, setActiveMovie } = useMovieStore();
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };
    if (activeMovie) window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [activeMovie]);

  if (!activeMovie) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <button 
        onClick={() => setActiveMovie(null)}
        className={`absolute top-10 left-10 z-[110] px-6 py-2 bg-white/10 backdrop-blur-md text-white rounded-full border border-white/20 transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        ← Back
      </button>
      <video src={activeMovie.video} autoPlay controls className="w-full h-full" />
    </div>
  );
}