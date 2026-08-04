import React from "react";
import { BookOpenIcon } from "@heroicons/react/24/outline";

export default function TheoryBlock({ theory }) {
  const overviewText = typeof theory === "object" ? (theory?.overview || "") : (theory || "");
  const keyConcepts = typeof theory === "object" ? (theory?.keyConcepts || []) : [];
  const complexity = typeof theory === "object" ? theory?.complexity : null;

  return (
    <div className="relative overflow-hidden p-6 rounded-xl bg-brand-board border-2 border-dashed border-white/10 shadow-md flex flex-col gap-4">
      {/* Decorative vertical colored chalk stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-chalk-yellow" />

      <div className="flex items-start gap-4">
        <div className="p-2 rounded border border-dashed border-chalk-white/20 text-chalk-yellow shrink-0">
          <BookOpenIcon className="w-5 h-5" />
        </div>

        <div className="flex-1">
          <h4 className="font-handwritten text-xs font-bold uppercase tracking-wider text-chalk-white/50 mb-1">
            Concept Overview
          </h4>
          <p className="text-chalk-white/90 text-sm md:text-base leading-relaxed font-normal">
            {overviewText}
          </p>
        </div>
      </div>

      {/* Render Complexity Metrics & Key Concepts if object format */}
      {(keyConcepts.length > 0 || complexity) && (
        <div className="border-t border-dashed border-white/10 pt-4 flex flex-wrap gap-4 items-center justify-between text-xs">
          {keyConcepts.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-chalk-white/40 font-handwritten">Key Concepts:</span>
              {keyConcepts.map((concept, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded bg-slate-800 border border-dashed border-white/15 text-chalk-yellow font-handwritten"
                >
                  {concept}
                </span>
              ))}
            </div>
          )}

          {complexity && (
            <div className="flex items-center gap-3 text-[11px] font-mono text-chalk-white/60">
              {complexity.best && <span>Best: <strong className="text-chalk-green">{complexity.best}</strong></span>}
              {complexity.worst && <span>Worst: <strong className="text-chalk-pink">{complexity.worst}</strong></span>}
              {complexity.space && <span>Space: <strong className="text-chalk-blue">{complexity.space}</strong></span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
