import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function FakeIntro({ onContinue }: { onContinue: () => void }) {
  const [step, setStep] = useState(0);
  const [showPressKey, setShowPressKey] = useState(false);

  const logs = [
    "Initializing Virtual Shift Matrix [VSM-13]...",
    "Loading biometric compliance modules...",
    "Establishing connection to ☁️ Time Continuum Server...",
    "Syncing neural fatigue logs... ✅",
    "Decrypting last known work trauma...",
    "Loading coffee.exe... ☕ OK",
    "> Warning: Mood Level Critical",
    "> Estimated Productivity: 12.3%",
    "Applying Anti-Burnout Protocol...",
    "Fetching motivational quote...",
    "  >> 'Try again tomorrow.'",
    "Calibrating sarcasm detector...",
    "Downloading updates for invisible workload...",
    "Bootstrapping procrastination framework...",
    "Patching emotional stability... 🩹",
    "Running self-doubt diagnostics... ❓",
    "Locating remaining motivation... Not found.",
    "Activating minimum viable enthusiasm... ✅",
    "🔒 Authorizing work identity...",
    "👀 Facial Recognition Skipped (too tired to verify)",
    "✅ SYSTEM STATUS: Functioning, barely.",
  ];

  useEffect(() => {
    if (step < logs.length) {
      const timeout = setTimeout(() => setStep(step + 1), 200);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => setShowPressKey(true), 1000);
    }
  }, [step]);

  useEffect(() => {
    const handleContinue = () => {
      if (showPressKey) {
        onContinue();
      }
    };

    if (showPressKey) {
      window.addEventListener("keydown", handleContinue);
      window.addEventListener("click", handleContinue);
    }

    return () => {
      window.removeEventListener("keydown", handleContinue);
      window.removeEventListener("click", handleContinue);
    };
  }, [showPressKey, onContinue]);

  return (
    <div className="bg-black text-green-500 font-mono flex flex-col items-start p-6 text-sm">
      {logs.slice(0, step).map((line, index) => (
        <div key={index}>{line}</div>
      ))}

      {showPressKey && (
        <motion.div
          className="mt-6 text-center text-lg w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          [ PRESS ANY KEY GENERATE MAGIC LINK ]
        </motion.div>
      )}
    </div>
  );
}
