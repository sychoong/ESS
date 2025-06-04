"use client";
import { useEffect, useState } from "react";

export default function Countdown({ targetDate }: { targetDate: Date }) {
  // State for time left in seconds
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = Math.floor(
      (targetDate.getTime() - new Date().getTime()) / 1000
    );
    return diff > 0 ? diff : 0;
  });

  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  // Format time with leading zeros
  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center bg-black text-cyan-400 font-mono select-none text-4xl p-6 rounded-lg shadow-lg">
      <div>
        {formatNumber(hours)}:{formatNumber(minutes)}:{formatNumber(seconds)}
      </div>
      {timeLeft === 0 && (
        <p className="mt-10 text-2xl font-bold text-red-500">Time&apos;s up!</p>
      )}
    </div>
  );
}
