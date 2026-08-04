import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-brand-bg/90 border-b-2 border-dashed border-white/10 shadow-lg chalk-board-outline">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded border border-dashed border-chalk-white flex items-center justify-center font-bold text-lg text-chalk-yellow chalk-shadow-yellow group-hover:scale-105 transition-transform duration-300">
            V
          </div>
          <span className="font-handwritten font-bold text-xl tracking-wide text-chalk-white group-hover:text-chalk-yellow transition-colors duration-300">
            Vi<span className="text-chalk-green chalk-shadow-green">Study</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="font-medium text-chalk-white/80 hover:text-chalk-yellow hover:underline decoration-dashed decoration-1 transition-all duration-300"
          >
            Dashboard
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-chalk-white/80 hover:text-chalk-green hover:underline decoration-dashed decoration-1 transition-all duration-300"
          >
            Documentation
          </a>
        </div>
      </div>
    </nav>
  );
}
