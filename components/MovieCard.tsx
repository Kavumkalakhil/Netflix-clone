"use client";
import { useMovieStore } from "@/store/useMovieStore";
import { useEffect, useRef, useState } from "react";

export default function MovieCard({ movie, isFocused }: { movie: any, isFocused: boolean }) {
  const { setHoveredMovie, setActiveMovie } = useMovieStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Intersection Observer to detect when the card is on screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  // Sync playback with focus/hover
  useEffect(() => {
    if (videoRef.current && isVisible) {
      if (isFocused) {
        // Use a play promise to handle browser autoplay interruptions
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => { /* Silence autoplay errors */ });
        }
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isFocused, isVisible]);

  return (
    <div 
      className={`group relative aspect-video w-full cursor-pointer bg-zinc-900 rounded-lg overflow-hidden transition-all duration-300 
        ${isFocused ? "scale-110 z-40 ring-4 ring-red-600 shadow-2xl" : "hover:scale-105 hover:z-50 ring-1 ring-white/10"}`}
      onMouseEnter={() => { setHoveredMovie(movie); videoRef.current?.play().catch(() => {}); }}
      onMouseLeave={() => { setHoveredMovie(null); videoRef.current?.pause(); }}
      onClick={() => setActiveMovie(movie)}
    >
      {/* 🟢 OPTIMIZED VIDEO THUMBNAIL */}
      <video 
        ref={videoRef}
        src={movie.video} 
        muted
        loop
        playsInline
        // 'metadata' loads just enough to show the first frame (thumbnail)
        // 'auto' only triggers when the user focuses on the card
        preload={isFocused ? "auto" : "metadata"}
        onLoadedData={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700
          ${isLoaded ? "opacity-100" : "opacity-0"}`}
      />

      {/* Loading Spinner for Row 2 and 3 thumbnails */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-0">
          <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Title Overlay - Stays visible for all 9 movies */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-3 bg-gradient-to-t from-black via-black/70 to-transparent">
        <p className="text-white text-xs md:text-sm font-bold truncate">
          {movie.title}
        </p>
      </div>

      {/* Badge Overlay */}
      <div className="absolute top-2 right-2 z-10 px-1 border border-white/40 text-[10px] text-white rounded bg-black/50">
        {movie.id % 2 === 0 ? "4K" : "HD"}
      </div>
    </div>
  );
}