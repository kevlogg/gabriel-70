"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  targetDate: string;
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

export default function Countdown({ targetDate }: CountdownProps) {
  // Start with null to prevent hydration mismatch
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(targetDate));

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const units: { label: string; key: keyof TimeLeft }[] = [
    { label: "Días", key: "days" },
    { label: "Horas", key: "hours" },
    { label: "Min", key: "minutes" },
    { label: "Seg", key: "seconds" },
  ];

  return (
    <div className="flex flex-col items-center gap-8 py-2">
      <p
        className="font-cormorant text-center font-medium"
        style={{
          fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
          color: "var(--dark-brown-70)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        — Faltan solo —
      </p>

      <div
        className="flex gap-4 sm:gap-6 md:gap-8"
        role="timer"
        aria-label="Cuenta regresiva para el evento"
        aria-live="off"
      >
        {units.map(({ label, key }) => (
          <div key={key} className="countdown-unit">
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
        ))}
      </div>

      {timeLeft && timeLeft.days === 0 &&
        timeLeft.hours === 0 &&
        timeLeft.minutes === 0 &&
        timeLeft.seconds === 0 && (
          <p
            className="font-cormorant text-center animate-scale-in"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              color: "var(--gold)",
              fontWeight: 700,
            }}
          >
            ¡Es hoy! 🎉
          </p>
        )}
    </div>
  );
}
