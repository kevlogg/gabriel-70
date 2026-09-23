"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface AudioControllerProps {
  src: string;
  isEnabled: boolean;
}

export default function AudioController({ src, isEnabled }: AudioControllerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isEnabled) return;

    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    const handleError = () => setHasError(true);
    audio.addEventListener("error", handleError);

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setIsVisible(true);
      } catch {
        setIsPlaying(false);
        setIsVisible(true);
      }
    };

    playAudio();

    return () => {
      audio.removeEventListener("error", handleError);
      audio.pause();
      audioRef.current = null;
    };
  }, [isEnabled, src]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setIsMuted(true);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setIsMuted(false);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [isPlaying, hasError]);

  if (!isVisible || hasError) return null;

  return (
    <button
      onClick={toggle}
      aria-label={isPlaying ? "Silenciar música" : "Reproducir música"}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        background: "linear-gradient(135deg, #C59B27 0%, #D4A373 100%)",
        boxShadow: "0 4px 20px rgba(197,155,39,0.5)",
        animation: "pulse-gold 2s ease-in-out infinite",
      }}
    >
      {isPlaying && !isMuted ? (
        <Volume2 size={20} color="#fff" aria-hidden="true" />
      ) : (
        <VolumeX size={20} color="#fff" aria-hidden="true" />
      )}
    </button>
  );
}
