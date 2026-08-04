import React from "react";
import { subjects } from "../data/subjects";
import SubjectCard from "../components/SubjectCard";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      {/* Hero Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-dashed border-chalk-yellow/30 text-xs font-semibold bg-brand-board text-chalk-yellow chalk-shadow-yellow mb-4">
          ✏️ Classroom Blackboard Mode
        </span>
        <h1 className="font-handwritten text-4xl md:text-5xl font-bold tracking-wide text-chalk-white mb-6">
          Visualize Your Studies,{" "}
          <span className="text-chalk-green chalk-shadow-green block md:inline mt-2 md:mt-0">
            Master Computer Science
          </span>
        </h1>
        <p className="text-lg leading-relaxed text-chalk-white/70">
          Step up to the blackboard. Explore core CSE concepts through interactive, sketched visualizations, ask questions to a contextual AI tutor at any paused moment, and test custom input algorithms on a virtual canvas.
        </p>
      </div>

      {/* Grid listing of all subject cards */}
      <div>
        <h2 className="font-handwritten text-xl font-bold text-chalk-white/80 mb-6 flex items-center gap-2">
          <span>Available Subjects</span>
          <span className="border-t border-dashed border-white/10 flex-1 h-0" />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </div>
    </div>
  );
}
