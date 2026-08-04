import React from "react";
import { PlayIcon, PauseIcon, ArrowLeftIcon, ArrowRightIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function PlaybackControls({
  isPlaying,
  play,
  pause,
  stepForward,
  stepBackward,
  reset,
  speed,
  setSpeed,
  currentStep,
  totalSteps,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-brand-board border-2 border-dashed border-white/10 shadow-md">
      {/* Step Counters */}
      <div className="text-sm font-handwritten text-chalk-white/60">
        Step: <span className="text-chalk-yellow chalk-shadow-yellow font-bold text-base">{currentStep + 1}</span> / <span className="text-chalk-white/80">{totalSteps}</span>
      </div>

      {/* Button Controls Group */}
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          title="Reset"
          className="p-2 rounded border border-dashed border-chalk-white/20 hover:border-chalk-pink text-chalk-white/80 hover:text-chalk-pink hover:scale-105 transition-all duration-300 flex items-center justify-center"
        >
          <ArrowPathIcon className="w-4 h-4" />
        </button>
        <button
          onClick={stepBackward}
          disabled={currentStep === 0}
          title="Step Backward"
          className="p-2 rounded border border-dashed border-chalk-white/20 hover:border-chalk-yellow text-chalk-white/80 hover:text-chalk-yellow disabled:opacity-40 disabled:pointer-events-none hover:scale-105 transition-all duration-300 flex items-center justify-center"
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </button>

        {isPlaying ? (
          <button
            onClick={pause}
            title="Pause"
            className="px-4 py-2 rounded-lg border-2 border-dashed border-chalk-pink/60 hover:border-chalk-pink text-chalk-pink chalk-shadow-pink hover:scale-105 transition-all duration-300 flex items-center gap-1.5 font-bold font-handwritten"
          >
            <PauseIcon className="w-4 h-4" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            onClick={play}
            title="Play"
            className="px-4 py-2 rounded-lg border-2 border-dashed border-chalk-green/60 hover:border-chalk-green text-chalk-green chalk-shadow-green hover:scale-105 transition-all duration-300 flex items-center gap-1.5 font-bold font-handwritten"
          >
            <PlayIcon className="w-4 h-4" />
            <span>Play</span>
          </button>
        )}

        <button
          onClick={stepForward}
          disabled={currentStep === totalSteps - 1}
          title="Step Forward"
          className="p-2 rounded border border-dashed border-chalk-white/20 hover:border-chalk-yellow text-chalk-white/80 hover:text-chalk-yellow disabled:opacity-40 disabled:pointer-events-none hover:scale-105 transition-all duration-300 flex items-center justify-center"
        >
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Speed Slider */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-handwritten text-chalk-white/60">Speed:</span>
        <input
          type="range"
          min="0.25"
          max="4.0"
          step="0.25"
          value={Number((1000 / speed).toFixed(2))}
          onChange={(e) => {
            const mult = Number(e.target.value);
            if (mult > 0) setSpeed(Math.round(1000 / mult));
          }}
          className="w-28 accent-chalk-yellow bg-slate-800 rounded-lg appearance-none h-1 cursor-pointer"
        />
        <span className="text-xs font-mono text-chalk-yellow font-bold w-12 text-right">
          {(1000 / speed).toFixed(1)}x
        </span>
      </div>
    </div>
  );
}
