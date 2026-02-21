"use client";
import { useState } from "react";

interface Props {
  playing?: boolean;
  color?: string;
}

export default function VoiceBars({ playing: initialPlaying = false, color = "#6366f1" }: Props) {
  const [playing, setPlaying] = useState(initialPlaying);

  return (
    <button
      onClick={() => setPlaying(!playing)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-all"
      title={playing ? "Mute voice" : "Play voice"}
    >
      <span className="text-sm">{playing ? "🔊" : "🔇"}</span>
      <div className="voice-bars">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="voice-bar"
            style={{
              height: playing ? `${8 + Math.random() * 12}px` : "4px",
              background: color,
              animationPlayState: playing ? "running" : "paused",
            }}
          />
        ))}
      </div>
    </button>
  );
}
