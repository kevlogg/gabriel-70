"use client";

import { useEffect, useState } from "react";
import type { TemplateId } from "@/lib/schemas/invitation.schema";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  targetDate: string;
  theme?: TemplateId;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

function padTwo(n: number): string {
  return String(n).padStart(2, "0");
}

export default function Countdown({ targetDate, theme = "classic-gold" }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 0);

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [targetDate]);

  const units: { label: string; key: keyof TimeLeft; toyBg?: string; toyBorder?: string; toyText?: string }[] = [
    { label: "Días", key: "days", toyBg: "bg-amber-400", toyBorder: "border-amber-500", toyText: "text-amber-950" },
    { label: "Horas", key: "hours", toyBg: "bg-red-500", toyBorder: "border-red-600", toyText: "text-white" },
    { label: "Min", key: "minutes", toyBg: "bg-emerald-500", toyBorder: "border-emerald-600", toyText: "text-white" },
    { label: "Seg", key: "seconds", toyBg: "bg-blue-600", toyBorder: "border-blue-700", toyText: "text-white" },
  ];

  const isToyStory = theme === "toy-story";
  const isKpop = theme === "k-pop";
  const isPrincess = theme === "princesas";
  const isFootball = theme === "futbol-infantil";

  return (
    <div className="flex flex-col items-center gap-6 py-2 w-full">
      <p
        className={`text-center font-bold tracking-widest uppercase text-xs sm:text-sm ${
          isToyStory
            ? "text-blue-900 font-black"
            : isKpop
            ? "text-pink-300 font-extrabold"
            : isPrincess
            ? "text-pink-900 font-bold"
            : isFootball
            ? "text-emerald-950 font-black"
            : "font-cormorant text-[var(--dark-brown-70)] text-base"
        }`}
      >
        — Faltan solo —
      </p>

      <div
        className="flex gap-2 sm:gap-4 md:gap-5 w-full max-w-2xl justify-center px-1 sm:px-4 box-border"
        role="timer"
        aria-label="Cuenta regresiva para el evento"
        aria-live="off"
      >
        {units.map(({ label, key, toyBg, toyBorder, toyText }) => {
          if (isToyStory) {
            return (
              <div
                key={key}
                className={`flex-1 min-w-0 flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl sm:rounded-3xl border-3 sm:border-4 shadow-lg ${toyBg} ${toyBorder}`}
              >
                <span className={`font-black text-2xl sm:text-4xl md:text-5xl leading-none ${toyText}`}>
                  {timeLeft ? padTwo(timeLeft[key]) : "00"}
                </span>
                <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider mt-1.5 ${toyText}`}>
                  {label}
                </span>
              </div>
            );
          }

          if (isKpop) {
            return (
              <div
                key={key}
                className="flex-1 min-w-0 flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-black/70 border border-pink-500/60 shadow-[0_0_15px_rgba(236,72,153,0.35)]"
              >
                <span className="font-black text-2xl sm:text-4xl md:text-5xl leading-none text-pink-300 font-mono">
                  {timeLeft ? padTwo(timeLeft[key]) : "00"}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-cyan-300 mt-1.5">
                  {label}
                </span>
              </div>
            );
          }

          if (isPrincess) {
            return (
              <div
                key={key}
                className="flex-1 min-w-0 flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-white border-2 border-pink-300 shadow-md"
              >
                <span className="font-bold text-2xl sm:text-4xl md:text-5xl leading-none text-pink-900">
                  {timeLeft ? padTwo(timeLeft[key]) : "00"}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-600 mt-1.5">
                  {label}
                </span>
              </div>
            );
          }

          if (isFootball) {
            return (
              <div
                key={key}
                className="flex-1 min-w-0 flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-emerald-950 border-3 border-amber-400 shadow-lg"
              >
                <span className="font-black text-2xl sm:text-4xl md:text-5xl leading-none text-amber-300 font-mono">
                  {timeLeft ? padTwo(timeLeft[key]) : "00"}
                </span>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-white mt-1.5">
                  {label}
                </span>
              </div>
            );
          }

          // Classic Gold Default
          return (
            <div key={key} className="countdown-unit flex-1 min-w-0">
              <span
                className="countdown-number"
                aria-label={`${timeLeft ? timeLeft[key] : 0} ${label}`}
              >
                {timeLeft ? padTwo(timeLeft[key]) : "00"}
              </span>
              <span className="countdown-label" aria-hidden="true">
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {timeLeft &&
        timeLeft.days === 0 &&
        timeLeft.hours === 0 &&
        timeLeft.minutes === 0 &&
        timeLeft.seconds === 0 && (
          <p className="font-extrabold text-2xl sm:text-3xl text-center animate-scale-in text-amber-500">
            ¡Es hoy! 🎉
          </p>
        )}
    </div>
  );
}
