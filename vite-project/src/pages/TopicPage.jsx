import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getSubjectById, getTopicById } from "../data/subjects";
import TheoryBlock from "../components/TheoryBlock";
import ThreeArrayVisualizer from "../components/visualizers/ThreeArrayVisualizer";
import ThreeGraphVisualizer from "../components/visualizers/ThreeGraphVisualizer";
import ThreeTreeVisualizer from "../components/visualizers/ThreeTreeVisualizer";
import ThreeQueueVisualizer from "../components/visualizers/ThreeQueueVisualizer";
import ThreePageReplacementVisualizer from "../components/visualizers/ThreePageReplacementVisualizer";
import ThreeSqlJoinVisualizer from "../components/visualizers/ThreeSqlJoinVisualizer";
import ThreeBTreeVisualizer from "../components/visualizers/ThreeBTreeVisualizer";
import ThreeTcpHandshakeVisualizer from "../components/visualizers/ThreeTcpHandshakeVisualizer";
import ThreeDnsVisualizer from "../components/visualizers/ThreeDnsVisualizer";
import ThreeGradientDescentVisualizer from "../components/visualizers/ThreeGradientDescentVisualizer";
import ThreeKMeansVisualizer from "../components/visualizers/ThreeKMeansVisualizer";
import ThreeLoadBalancingVisualizer from "../components/visualizers/ThreeLoadBalancingVisualizer";
import ThreeAutoScalingVisualizer from "../components/visualizers/ThreeAutoScalingVisualizer";

import PlaybackControls from "../components/common/PlaybackControls";
import CustomInputPanel from "../components/common/CustomInputPanel";
import ChatbotPanel from "../components/common/ChatbotPanel";
import { usePlayback } from "../hooks/usePlayback";
import { solverRegistry } from "../data/solvers/solverRegistry";
import { CommandLineIcon } from "@heroicons/react/24/outline";

export default function TopicPage() {
  const { subjectId, topicId } = useParams();
  const subject = getSubjectById(subjectId);
  const topic = getTopicById(subjectId, topicId);

  // Resolve solver from registry
  const solver = solverRegistry[topicId] ?? null;
  const hasSolver = solver !== null;

  // Custom Input State
  const [customInputData, setCustomInputData] = useState(null);

  // Reset custom input when topic changes
  useEffect(() => {
    setCustomInputData(null);
  }, [topicId]);

  // Derive input data for solver (custom input or default fallback)
  const activeInputData = useMemo(() => {
    if (customInputData !== null) return customInputData;
    if (topicId === "bst") return [50, 30, 70, 20, 40, 60, 80];
    if (topicId === "cpu-scheduling") {
      return {
        timeQuantum: 2,
        processes: [
          { id: "P1", name: "P1", burstTime: 4, color: "#6ee7b7" },
          { id: "P2", name: "P2", burstTime: 3, color: "#c4b5fd" },
          { id: "P3", name: "P3", burstTime: 5, color: "#fef08a" },
          { id: "P4", name: "P4", burstTime: 2, color: "#fca5a5" },
        ],
      };
    }
    return [5, 3, 8, 2, 7, 4, 1];
  }, [customInputData, topicId]);

  // Generate steps from solver
  const steps = useMemo(
    () => (hasSolver ? solver(activeInputData) : []),
    [hasSolver, solver, activeInputData]
  );

  const totalSteps = hasSolver ? steps.length : 1;

  const {
    currentStep,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
  } = usePlayback(totalSteps);

  const handleApplyCustomInput = (input) => {
    setCustomInputData(input);
    reset(); // Reset playback to step 0
  };

  const currentFrame = useMemo(() => {
    if (hasSolver && steps.length > 0) {
      return steps[currentStep];
    }
    return {
      arrayState: Array.isArray(activeInputData) ? activeInputData : [5, 3, 8, 2, 7, 4, 1],
      comparedIndices: [],
      isSwapped: false,
      log: "Visualizer active.",
    };
  }, [hasSolver, steps, currentStep, activeInputData]);

  if (!subject || !topic) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <h2 className="font-handwritten text-2xl font-bold text-chalk-white mb-4">Topic Not Found</h2>
        <p className="text-chalk-white/60 mb-8">The requested topic does not exist or may have been moved.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 border border-dashed border-white/20 text-slate-200 font-semibold"
        >
          &lt;-- Back to Dashboard
        </Link>
      </div>
    );
  }

  const getSubjectChalkColor = (id) => {
    switch (id) {
      case "dsa":
        return { title: "text-chalk-yellow chalk-shadow-yellow", accent: "text-chalk-yellow border-chalk-yellow/20 bg-chalk-yellow/10" };
      case "os":
        return { title: "text-chalk-pink chalk-shadow-pink", accent: "text-chalk-pink border-chalk-pink/20 bg-chalk-pink/10" };
      case "dbms":
        return { title: "text-chalk-blue chalk-shadow-blue", accent: "text-chalk-blue border-chalk-blue/20 bg-chalk-blue/10" };
      case "cn":
        return { title: "text-chalk-green chalk-shadow-green", accent: "text-chalk-green border-chalk-green/20 bg-chalk-green/10" };
      case "ml":
        return { title: "text-chalk-yellow/90 chalk-shadow-yellow", accent: "text-chalk-yellow/90 border-chalk-yellow/20 bg-chalk-yellow/10" };
      default:
        return { title: "text-chalk-white chalk-shadow-white", accent: "text-chalk-white border-chalk-white/20 bg-chalk-white/10" };
    }
  };

  const chalk = getSubjectChalkColor(subject.id);

  // Render appropriate 3D Visualizer component based on topic/frame structure
  const renderVisualizerComponent = () => {
    if (topicId === "page-replacement" || currentFrame.frames) {
      return (
        <ThreePageReplacementVisualizer
          requestedPage={currentFrame.requestedPage}
          frames={currentFrame.frames}
          status={currentFrame.status}
          pageFaults={currentFrame.pageFaults}
          pageHits={currentFrame.pageHits}
          stepLog={currentFrame.log}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      );
    }

    if (topicId === "sql-joins" || currentFrame.resultTable) {
      return (
        <ThreeSqlJoinVisualizer
          joinType={currentFrame.joinType}
          tableA={currentFrame.tableA}
          tableB={currentFrame.tableB}
          activeRowA={currentFrame.activeRowA}
          activeRowB={currentFrame.activeRowB}
          isMatch={currentFrame.isMatch}
          resultTable={currentFrame.resultTable}
          stepLog={currentFrame.log}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      );
    }

    if (topicId === "b-tree" || currentFrame.bTreeNodes) {
      return (
        <ThreeBTreeVisualizer
          targetKey={currentFrame.targetKey}
          activeNodeId={currentFrame.activeNodeId}
          comparedKey={currentFrame.comparedKey}
          bTreeNodes={currentFrame.bTreeNodes}
          stepLog={currentFrame.log}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      );
    }

    if (topicId === "tcp-handshake" || currentFrame.clientState) {
      return (
        <ThreeTcpHandshakeVisualizer
          packet={currentFrame.packet}
          clientState={currentFrame.clientState}
          serverState={currentFrame.serverState}
          activePacketPos={currentFrame.activePacketPos}
          stepLog={currentFrame.log}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      );
    }

    if (topicId === "dns-lookup" || currentFrame.dnsNodes) {
      return (
        <ThreeDnsVisualizer
          domain={currentFrame.domain}
          dnsNodes={currentFrame.dnsNodes}
          activeHop={currentFrame.activeHop}
          ipResolved={currentFrame.ipResolved}
          stepLog={currentFrame.log}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      );
    }

    if (topicId === "gradient-descent" || currentFrame.surfacePoints) {
      return (
        <ThreeGradientDescentVisualizer
          alpha={currentFrame.alpha}
          currentX={currentFrame.currentX}
          currentLoss={currentFrame.currentLoss}
          gradient={currentFrame.gradient}
          surfacePoints={currentFrame.surfacePoints}
          stepLog={currentFrame.log}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      );
    }

    if (topicId === "k-means" || currentFrame.centroids) {
      return (
        <ThreeKMeansVisualizer
          k={currentFrame.k}
          points={currentFrame.points}
          centroids={currentFrame.centroids}
          status={currentFrame.status}
          stepLog={currentFrame.log}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      );
    }

    if (topicId === "load-balancing" || currentFrame.servers) {
      return (
        <ThreeLoadBalancingVisualizer
          servers={currentFrame.servers}
          activeRequest={currentFrame.activeRequest}
          routedServerId={currentFrame.routedServerId}
          stepLog={currentFrame.log}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      );
    }

    if (topicId === "auto-scaling" || currentFrame.pods) {
      return (
        <ThreeAutoScalingVisualizer
          cpuLoad={currentFrame.cpuLoad}
          threshold={currentFrame.threshold}
          pods={currentFrame.pods}
          stepLog={currentFrame.log}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      );
    }

    if (currentFrame.nodes) {
      return (
        <ThreeGraphVisualizer
          nodes={currentFrame.nodes}
          edges={currentFrame.edges}
          stepLog={currentFrame.log}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      );
    }

    if (currentFrame.treeNodes) {
      return (
        <ThreeTreeVisualizer
          treeNodes={currentFrame.treeNodes}
          treeEdges={currentFrame.treeEdges}
          incomingVal={currentFrame.incomingVal}
          remainingValues={currentFrame.remainingValues}
          stepLog={currentFrame.log}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      );
    }

    if (currentFrame.processes) {
      return (
        <ThreeQueueVisualizer
          processes={currentFrame.processes}
          readyQueue={currentFrame.readyQueue}
          activeProcess={currentFrame.activeProcess}
          ganttChart={currentFrame.ganttChart}
          currentTime={currentFrame.currentTime}
          timeQuantum={currentFrame.timeQuantum}
          stepLog={currentFrame.log}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      );
    }

    // Default Fallback: Array Visualizer (Sorting & Binary Search)
    return (
      <ThreeArrayVisualizer
        initialArray={Array.isArray(activeInputData) ? activeInputData : [5, 3, 8, 2, 7, 4, 1]}
        arrayState={currentFrame.arrayState || [5, 3, 8, 2, 7, 4, 1]}
        comparedIndices={currentFrame.comparedIndices || []}
        isSwapped={currentFrame.isSwapped}
        stepLog={currentFrame.log}
        currentStep={currentStep}
        totalSteps={totalSteps}
        liftedIndex={currentFrame.liftedIndex}
        groups={currentFrame.groups}
        activeRange={currentFrame.activeRange}
      />
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
      {/* Navigation Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-chalk-white/40 mb-6 flex-wrap">
        <Link to="/" className="hover:text-chalk-yellow transition-colors">
          Subjects
        </Link>
        <span>/</span>
        <Link to={`/subject/${subject.id}`} className="hover:text-chalk-yellow transition-colors">
          {subject.shortTitle}
        </Link>
        <span>/</span>
        <span className="text-chalk-white/80 font-normal">{topic.title}</span>
      </div>

      {/* Main Title Section */}
      <div className="mb-8">
        <h1 className={`font-handwritten text-2xl md:text-3xl font-bold flex items-center gap-3 ${chalk.title}`}>
          {topic.title}
        </h1>
      </div>

      {/* Grid Layout: Left Column (Theory, Visualizer & Custom Input), Right Column (AI Chatbot Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Side: Visualizer, Playback, Theory & Custom Input Panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* Concept Theory Overview */}
          <TheoryBlock theory={topic.theory} />

          {/* Interactive Visualizer Canvas Box */}
          <div className="relative rounded-xl bg-brand-board border-2 border-dashed border-white/10 overflow-hidden flex flex-col shadow-lg">
            <div className="px-6 py-4 border-b-2 border-dashed border-white/10 bg-slate-950/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-chalk-white/70">
                <CommandLineIcon className={`w-4 h-4 ${chalk.title}`} />
                <span className="font-handwritten">Visual Drawing Board</span>
              </div>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border border-dashed ${chalk.accent} text-[10px] uppercase font-bold tracking-wider`}>
                Interactive 3D Board
              </div>
            </div>

            <div style={{ width: "100%", height: "420px" }}>
              {renderVisualizerComponent()}
            </div>
          </div>

          {/* Playback Controls Toolbar */}
          {hasSolver && (
            <PlaybackControls
              isPlaying={isPlaying}
              play={play}
              pause={pause}
              stepForward={stepForward}
              stepBackward={stepBackward}
              reset={reset}
              speed={speed}
              setSpeed={setSpeed}
              currentStep={currentStep}
              totalSteps={totalSteps}
            />
          )}

          {/* Custom Visualizer Input Solver Panel */}
          <CustomInputPanel
            topicId={topicId}
            onApplyCustomInput={handleApplyCustomInput}
            subjectChalkColor={chalk}
          />
        </div>

        {/* Right Side: Interactive AI Assistant Chat Sidebar */}
        <div className="lg:col-span-1 h-full lg:sticky lg:top-24">
          <ChatbotPanel
            topic={topic}
            subject={subject}
            currentFrame={currentFrame}
            currentStep={currentStep}
            totalSteps={totalSteps}
            hasSolver={hasSolver}
          />
        </div>
      </div>
    </div>
  );
}
