import React from "react";
import { useParams, Link } from "react-router-dom";
import { getSubjectById } from "../data/subjects";

export default function SubjectPage() {
  const { subjectId } = useParams();
  const subject = getSubjectById(subjectId);

  if (!subject) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <h2 className="font-handwritten text-2xl font-bold text-chalk-white mb-4">Subject Not Found</h2>
        <p className="text-chalk-white/60 mb-8">
          The requested subject does not exist or may have been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 border border-dashed border-white/20 text-slate-200 font-semibold transition-all duration-300"
        >
          &lt;-- Back to Dashboard
        </Link>
      </div>
    );
  }

  // Resolve chalk styling variables based on subject ID
  const getSubjectChalkColor = (id) => {
    switch (id) {
      case "dsa":
        return {
          title: "text-chalk-yellow chalk-shadow-yellow",
          border: "border-chalk-yellow/20 hover:border-chalk-yellow/80",
          text: "text-chalk-yellow",
        };
      case "os":
        return {
          title: "text-chalk-pink chalk-shadow-pink",
          border: "border-chalk-pink/20 hover:border-chalk-pink/80",
          text: "text-chalk-pink",
        };
      case "dbms":
        return {
          title: "text-chalk-blue chalk-shadow-blue",
          border: "border-chalk-blue/20 hover:border-chalk-blue/80",
          text: "text-chalk-blue",
        };
      case "cn":
        return {
          title: "text-chalk-green chalk-shadow-green",
          border: "border-chalk-green/20 hover:border-chalk-green/80",
          text: "text-chalk-green",
        };
      case "ml":
        return {
          title: "text-chalk-yellow/90 chalk-shadow-yellow",
          border: "border-chalk-yellow/25 hover:border-chalk-yellow/80",
          text: "text-chalk-yellow/90",
        };
      default:
        return {
          title: "text-chalk-white chalk-shadow-white",
          border: "border-chalk-white/20 hover:border-chalk-white/80",
          text: "text-chalk-white/90",
        };
    }
  };

  const chalk = getSubjectChalkColor(subject.id);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
      {/* Navigation Breadcrumbs / Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-chalk-white/60 hover:text-chalk-yellow transition-colors duration-300 mb-8 self-start group"
      >
        <span>&lt;-- Back to Subjects</span>
      </Link>

      {/* Header Info */}
      <div className="border-b-2 border-dashed border-white/10 pb-8 mb-10">
        <h1 className={`font-handwritten text-3xl font-bold mb-3 ${chalk.title}`}>
          {subject.title}
        </h1>
        <p className="text-base text-chalk-white/70 leading-relaxed max-w-2xl">
          {subject.desc}
        </p>
      </div>

      {/* Topics list */}
      <div>
        <h2 className="font-handwritten text-lg font-bold text-chalk-white/80 mb-6">Available Topics</h2>

        <div className="space-y-4">
          {subject.topics.map((topic) => (
            <Link
              key={topic.id}
              to={`/subject/${subject.id}/${topic.id}`}
              className={`group flex items-center justify-between p-5 rounded-xl bg-brand-board border-2 border-dashed ${chalk.border} transition-all duration-300`}
            >
              <div className="max-w-2xl">
                <h3 className="font-handwritten text-base font-bold text-chalk-white group-hover:text-chalk-white mb-1.5 transition-colors duration-300">
                  {topic.title}
                </h3>
                <p className="text-sm text-chalk-white/70 group-hover:text-chalk-white/90 transition-colors duration-300 leading-relaxed">
                  {topic.desc}
                </p>
              </div>

              <div className={`p-2 rounded border border-dashed border-chalk-white/20 text-chalk-white/40 group-hover:${chalk.text} group-hover:border-dashed transition-all duration-300 flex items-center justify-center shrink-0 ml-4`}>
                <span className="text-sm font-bold transform group-hover:translate-x-0.5 transition-transform duration-300">
                  --&gt;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
