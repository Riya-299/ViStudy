import React from "react";
import { Link } from "react-router-dom";
import * as Icons from "@heroicons/react/24/outline";

export default function SubjectCard({ subject }) {
  const IconComponent = Icons[subject.iconName] || Icons.CommandLineIcon;

  // Resolve chalk styling variables based on subject ID
  const getChalkStyles = (id) => {
    switch (id) {
      case "dsa":
        return {
          border: "border-chalk-yellow/30 hover:border-chalk-yellow/80",
          text: "text-chalk-yellow",
          shadow: "chalk-shadow-yellow",
          glow: "hover:shadow-[0_0_15px_rgba(254,240,138,0.1)]",
        };
      case "os":
        return {
          border: "border-chalk-pink/30 hover:border-chalk-pink/80",
          text: "text-chalk-pink",
          shadow: "chalk-shadow-pink",
          glow: "hover:shadow-[0_0_15px_rgba(251,207,232,0.1)]",
        };
      case "dbms":
        return {
          border: "border-chalk-blue/30 hover:border-chalk-blue/80",
          text: "text-chalk-blue",
          shadow: "chalk-shadow-blue",
          glow: "hover:shadow-[0_0_15px_rgba(186,230,253,0.1)]",
        };
      case "cn":
        return {
          border: "border-chalk-green/30 hover:border-chalk-green/80",
          text: "text-chalk-green",
          shadow: "chalk-shadow-green",
          glow: "hover:shadow-[0_0_15px_rgba(187,247,208,0.1)]",
        };
      case "ml":
        return {
          border: "border-chalk-yellow/35 hover:border-chalk-yellow/80",
          text: "text-chalk-yellow/90",
          shadow: "chalk-shadow-yellow",
          glow: "hover:shadow-[0_0_15px_rgba(254,240,138,0.08)]",
        };
      default:
        return {
          border: "border-chalk-white/30 hover:border-chalk-white/80",
          text: "text-chalk-white/90",
          shadow: "chalk-shadow-white",
          glow: "hover:shadow-[0_0_15px_rgba(248,250,252,0.08)]",
        };
    }
  };

  const chalk = getChalkStyles(subject.id);

  return (
    <Link
      to={`/subject/${subject.id}`}
      className={`group relative flex flex-col p-6 rounded-xl bg-brand-board border-2 border-dashed ${chalk.border} ${chalk.glow} shadow-md -translate-y-0 hover:-translate-y-1.5 transition-all duration-300`}
    >
      {/* Decorative hand-drawn bracket in corner */}
      <div className="absolute top-2 right-3 text-[10px] text-chalk-white/10 select-none font-mono">
        [ {subject.shortTitle} ]
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-lg border border-dashed border-chalk-white/20 text-chalk-white/80 group-hover:${chalk.text} transition-colors duration-300`}>
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      <h3 className={`font-handwritten font-bold text-lg ${chalk.text} ${chalk.shadow} mb-2 transition-all duration-300`}>
        {subject.title}
      </h3>

      <p className="text-sm leading-relaxed text-chalk-white/70 group-hover:text-chalk-white/90 transition-colors duration-300">
        {subject.desc}
      </p>

      {/* Sketched pointer indicator */}
      <div className={`mt-6 flex items-center text-xs font-semibold text-chalk-white/50 group-hover:${chalk.text} gap-2 transition-colors duration-300 self-start`}>
        <span>View Details</span>
        <span className="transform group-hover:translate-x-1 transition-transform duration-300">
          --&gt;
        </span>
      </div>
    </Link>
  );
}
