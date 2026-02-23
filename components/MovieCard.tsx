"use client";
import { useMovieStore } from "@/store/useMovieStore";
import { useEffect, useRef, useState } from "react";

export default function MovieCard({ movie, isFocused }: { movie: any, isFocused: boolean }) {
  const { setHoveredMovie, setActiveMovie } = useMovieStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use the #t=0.1 trick to force the browser to seek the first frame only
  const videoThumbnailSource = `${movie.video}#t=0.1`;

  useEffect(() => {
    if (videoRef.current) {
      if (isFocused) {
        // When focused, switch to full playback mode
        videoRef.current.play().catch(() => {});
      } else {
        // When not focused, pause and stay on the first frame
        videoRef.current.pause();
        videoRef.current.currentTime = 0.1; 
      }
    }
  }, [isFocused]);

  return (
    <div 
      className={`group relative aspect-video w-full cursor-pointer bg-zinc-900 rounded-lg overflow-hidden transition-all duration-300 
        ${isFocused ? "scale-110 z-40 ring-4 ring-red-600 shadow-2xl" : "hover:scale-105 hover:z-50 ring-1 ring-white/10"}`}
      onMouseEnter={() => { setHoveredMovie(movie); videoRef.current?.play().catch(() => {}); }}
      onMouseLeave={() => { setHoveredMovie(null); videoRef.current?.pause(); }}
      onClick={() => setActiveMovie(movie)}
    >
      <video 
        ref={videoRef}
        src={videoThumbnailSource} 
        muted
        loop
        playsInline
        preload="metadata" // Instructs browser to only download the header/first frame
        onLoadedData={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700
          ${isLoaded ? "opacity-100" : "opacity-0"}`}
      />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/60 to-transparent">
        <p className="text-white text-xs font-bold truncate">{movie.title}</p>
      </div>
    </div>
  );
}