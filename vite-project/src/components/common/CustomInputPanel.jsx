import React, { useState, useEffect } from "react";
import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  CheckIcon,
  ExclamationCircleIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

/**
 * CustomInputPanel allows users to supply custom data for every topic visualizer in ViStudy.
 */
export default function CustomInputPanel({ topicId, onApplyCustomInput, subjectChalkColor }) {
  // State for different topic inputs
  const [arrayInput, setArrayInput] = useState("5, 3, 8, 2, 7, 4, 1");
  const [bstInput, setBstInput] = useState("50, 30, 70, 20, 40, 60, 80");
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [processes, setProcesses] = useState([
    { id: "P1", name: "P1", burstTime: 4, color: "#6ee7b7" },
    { id: "P2", name: "P2", burstTime: 3, color: "#c4b5fd" },
    { id: "P3", name: "P3", burstTime: 5, color: "#fef08a" },
    { id: "P4", name: "P4", burstTime: 2, color: "#fca5a5" },
  ]);

  // New Topic States
  const [pageRequests, setPageRequests] = useState("7, 0, 1, 2, 0, 3, 0, 4, 2, 3");
  const [frameCount, setFrameCount] = useState(3);
  const [joinType, setJoinType] = useState("INNER");
  const [bTreeKey, setBTreeKey] = useState(42);
  const [tcpSeq, setTcpSeq] = useState(100);
  const [dnsDomain, setDnsDomain] = useState("example.com");
  const [learningRate, setLearningRate] = useState(0.25);
  const [kClusters, setKClusters] = useState(2);
  const [lbServerCount, setLbServerCount] = useState(3);
  const [autoScaleThreshold, setAutoScaleThreshold] = useState(80);

  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Array / Sorting Input
  const handleApplyArray = (e) => {
    e?.preventDefault();
    setError(null);
    const parsed = arrayInput.split(",").map((v) => Number(v.trim())).filter((v) => !isNaN(v));
    if (parsed.length < 3 || parsed.length > 12) {
      setError("Please enter between 3 and 12 numbers.");
      return;
    }
    onApplyCustomInput(parsed);
    setSuccessMsg("Applied custom array!");
  };

  const handleRandomizeArray = () => {
    setError(null);
    const count = Math.floor(Math.random() * 3) + 6;
    const randomNums = Array.from({ length: count }, () => Math.floor(Math.random() * 45) + 5);
    setArrayInput(randomNums.join(", "));
    onApplyCustomInput(randomNums);
    setSuccessMsg("Generated random array!");
  };

  // BST Input
  const handleApplyBST = (e) => {
    e?.preventDefault();
    setError(null);
    const parsed = bstInput.split(",").map((v) => Number(v.trim())).filter((v) => !isNaN(v));
    if (parsed.length < 2 || parsed.length > 9) {
      setError("Please enter between 2 and 9 node numbers.");
      return;
    }
    onApplyCustomInput(parsed);
    setSuccessMsg("Rebuilt BST tree!");
  };

  // CPU Scheduling Input
  const handleApplyCPU = (e) => {
    e?.preventDefault();
    setError(null);
    onApplyCustomInput({
      timeQuantum: Number(timeQuantum),
      processes: processes.map((p) => ({ ...p, burstTime: Number(p.burstTime) })),
    });
    setSuccessMsg("Updated CPU Round Robin parameters!");
  };

  // Page Replacement Input
  const handleApplyPageReplacement = (e) => {
    e?.preventDefault();
    setError(null);
    const parsed = pageRequests.split(",").map((v) => Number(v.trim())).filter((v) => !isNaN(v));
    if (parsed.length < 3) {
      setError("Please enter at least 3 page request numbers.");
      return;
    }
    onApplyCustomInput({ requests: parsed, frameCount: Number(frameCount) });
    setSuccessMsg("Updated LRU Page Replacement parameters!");
  };

  // SQL Join Input
  const handleApplySqlJoin = (type) => {
    setJoinType(type);
    onApplyCustomInput({ joinType: type });
    setSuccessMsg(`Switched to SQL ${type} JOIN!`);
  };

  // B-Tree Input
  const handleApplyBTree = (e) => {
    e?.preventDefault();
    onApplyCustomInput(Number(bTreeKey));
    setSuccessMsg(`Searching B-Tree for key ${bTreeKey}!`);
  };

  // TCP Handshake Input
  const handleApplyTcp = (e) => {
    e?.preventDefault();
    onApplyCustomInput(Number(tcpSeq));
    setSuccessMsg(`Started TCP Handshake with initial sequence ${tcpSeq}!`);
  };

  // DNS Lookup Input
  const handleApplyDns = (e) => {
    e?.preventDefault();
    if (!dnsDomain.trim()) return;
    onApplyCustomInput(dnsDomain.trim());
    setSuccessMsg(`Resolving DNS query for ${dnsDomain}!`);
  };

  // Gradient Descent Input
  const handleApplyGradient = (e) => {
    e?.preventDefault();
    onApplyCustomInput(Number(learningRate));
    setSuccessMsg(`Running Gradient Descent with α = ${learningRate}!`);
  };

  // K-Means Input
  const handleApplyKMeans = (e) => {
    e?.preventDefault();
    onApplyCustomInput(Number(kClusters));
    setSuccessMsg(`Clustering data points with K = ${kClusters}!`);
  };

  // Load Balancing Input
  const handleApplyLoadBalancing = (e) => {
    e?.preventDefault();
    onApplyCustomInput(Number(lbServerCount));
    setSuccessMsg(`Configured Load Balancer with ${lbServerCount} servers!`);
  };

  // Auto-Scaling Input
  const handleApplyAutoScaling = (e) => {
    e?.preventDefault();
    onApplyCustomInput(Number(autoScaleThreshold));
    setSuccessMsg(`Updated Auto-Scaling threshold to ${autoScaleThreshold}%!`);
  };

  const isArrayTopic = [
    "bubble-sort",
    "selection-sort",
    "insertion-sort",
    "merge-sort",
    "quick-sort",
    "binary-search",
  ].includes(topicId);

  return (
    <div className="p-6 rounded-xl bg-brand-board border-2 border-dashed border-white/10 shadow-lg animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-handwritten text-sm font-bold text-chalk-white/90 uppercase tracking-wider flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="w-5 h-5 text-chalk-yellow" />
          <span>Custom Solver Problem Input</span>
        </h3>

        {successMsg && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-chalk-green/20 border border-dashed border-chalk-green/40 text-chalk-green text-xs font-handwritten">
            <CheckIcon className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-dashed border-chalk-pink/40 bg-chalk-pink/10 text-chalk-pink text-xs flex items-center gap-2">
          <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ARRAY / SORTING TOPICS */}
      {isArrayTopic && (
        <form onSubmit={handleApplyArray} className="space-y-4">
          <div>
            <label className="block text-xs font-handwritten text-chalk-white/70 mb-1.5">
              Enter Custom Numeric Array (3 to 12 numbers, comma-separated):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                className="flex-1 bg-brand-bg/80 border border-dashed border-white/20 rounded-lg px-4 py-2 text-sm text-chalk-white font-mono focus:outline-none focus:border-chalk-yellow"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-chalk-yellow/20 border border-dashed border-chalk-yellow/50 text-chalk-yellow text-xs font-bold font-handwritten hover:bg-chalk-yellow/30"
              >
                Apply Array
              </button>
              <button
                type="button"
                onClick={handleRandomizeArray}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-dashed border-white/20 text-chalk-white/80 text-xs font-handwritten flex items-center gap-1.5 hover:bg-slate-700"
              >
                <ArrowPathIcon className="w-4 h-4 text-chalk-blue" />
                <span>Randomize</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* BST TOPIC */}
      {topicId === "bst" && (
        <form onSubmit={handleApplyBST} className="space-y-4">
          <div>
            <label className="block text-xs font-handwritten text-chalk-white/70 mb-1.5">
              BST Insertion Sequence:
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={bstInput}
                onChange={(e) => setBstInput(e.target.value)}
                className="flex-1 bg-brand-bg/80 border border-dashed border-white/20 rounded-lg px-4 py-2 text-sm text-chalk-white font-mono focus:outline-none focus:border-chalk-yellow"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-chalk-yellow/20 border border-dashed border-chalk-yellow/50 text-chalk-yellow text-xs font-bold font-handwritten hover:bg-chalk-yellow/30"
              >
                Build Tree
              </button>
            </div>
          </div>
        </form>
      )}

      {/* CPU SCHEDULING TOPIC */}
      {topicId === "cpu-scheduling" && (
        <form onSubmit={handleApplyCPU} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-handwritten text-chalk-white/70 mb-1.5">
                Time Quantum (ms):
              </label>
              <input
                type="number"
                min="1"
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(Math.max(1, Number(e.target.value) || 1))}
                className="w-24 bg-brand-bg/80 border border-dashed border-white/20 rounded px-3 py-1.5 text-xs text-chalk-yellow font-bold text-center font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-handwritten text-chalk-white/70 mb-1.5">
                Process Burst Times (P1 - P4):
              </label>
              <div className="flex items-center gap-2">
                {processes.map((p, idx) => (
                  <div key={p.id} className="flex flex-col items-center">
                    <span className="text-[10px] font-bold" style={{ color: p.color }}>
                      {p.name}
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={p.burstTime}
                      onChange={(e) => {
                        const next = [...processes];
                        next[idx].burstTime = Math.max(1, Number(e.target.value) || 1);
                        setProcesses(next);
                      }}
                      className="w-12 bg-brand-bg/80 border border-dashed border-white/20 rounded px-1 text-xs text-chalk-white text-center font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-chalk-yellow/20 border border-dashed border-chalk-yellow/50 text-chalk-yellow text-xs font-bold font-handwritten hover:bg-chalk-yellow/30"
          >
            Simulate CPU Scheduling
          </button>
        </form>
      )}

      {/* PAGE REPLACEMENT TOPIC */}
      {topicId === "page-replacement" && (
        <form onSubmit={handleApplyPageReplacement} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-handwritten text-chalk-white/70 mb-1.5">
                Page Reference Sequence (comma-separated):
              </label>
              <input
                type="text"
                value={pageRequests}
                onChange={(e) => setPageRequests(e.target.value)}
                className="w-full bg-brand-bg/80 border border-dashed border-white/20 rounded px-3 py-2 text-xs text-chalk-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-handwritten text-chalk-white/70 mb-1.5">
                Memory Frames: {frameCount}
              </label>
              <input
                type="range"
                min="2"
                max="5"
                value={frameCount}
                onChange={(e) => setFrameCount(Number(e.target.value))}
                className="w-full accent-chalk-yellow"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-chalk-yellow/20 border border-dashed border-chalk-yellow/50 text-chalk-yellow text-xs font-bold font-handwritten hover:bg-chalk-yellow/30"
          >
            Simulate LRU Page Replacement
          </button>
        </form>
      )}

      {/* SQL JOINS TOPIC */}
      {topicId === "sql-joins" && (
        <div className="space-y-3">
          <label className="block text-xs font-handwritten text-chalk-white/70">
            Select SQL JOIN Type:
          </label>
          <div className="flex items-center gap-3">
            {["INNER", "LEFT", "RIGHT"].map((type) => (
              <button
                key={type}
                onClick={() => handleApplySqlJoin(type)}
                className={`px-4 py-2 rounded-lg border border-dashed text-xs font-handwritten font-bold transition-all ${
                  joinType === type
                    ? "bg-chalk-yellow/20 border-chalk-yellow text-chalk-yellow"
                    : "bg-slate-800 border-white/10 text-chalk-white/70 hover:bg-slate-700"
                }`}
              >
                SQL {type} JOIN
              </button>
            ))}
          </div>
        </div>
      )}

      {/* B-TREE INDEXING TOPIC */}
      {topicId === "b-tree" && (
        <form onSubmit={handleApplyBTree} className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-handwritten text-chalk-white/70 mb-1">
              Target Key to Search in B-Tree Index:
            </label>
            <input
              type="number"
              value={bTreeKey}
              onChange={(e) => setBTreeKey(Number(e.target.value))}
              className="w-full bg-brand-bg/80 border border-dashed border-white/20 rounded px-3 py-1.5 text-xs text-chalk-white font-mono"
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 rounded-lg bg-chalk-yellow/20 border border-dashed border-chalk-yellow/50 text-chalk-yellow text-xs font-bold font-handwritten hover:bg-chalk-yellow/30"
          >
            Search Key
          </button>
        </form>
      )}

      {/* TCP HANDSHAKE TOPIC */}
      {topicId === "tcp-handshake" && (
        <form onSubmit={handleApplyTcp} className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-handwritten text-chalk-white/70 mb-1">
              Initial Client SYN Sequence Number (ISN):
            </label>
            <input
              type="number"
              value={tcpSeq}
              onChange={(e) => setTcpSeq(Number(e.target.value))}
              className="w-full bg-brand-bg/80 border border-dashed border-white/20 rounded px-3 py-1.5 text-xs text-chalk-white font-mono"
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 rounded-lg bg-chalk-yellow/20 border border-dashed border-chalk-yellow/50 text-chalk-yellow text-xs font-bold font-handwritten hover:bg-chalk-yellow/30"
          >
            Start Handshake
          </button>
        </form>
      )}

      {/* DNS LOOKUP TOPIC */}
      {topicId === "dns-lookup" && (
        <form onSubmit={handleApplyDns} className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-handwritten text-chalk-white/70 mb-1">
              Target Domain Name:
            </label>
            <input
              type="text"
              value={dnsDomain}
              onChange={(e) => setDnsDomain(e.target.value)}
              placeholder="e.g. google.com"
              className="w-full bg-brand-bg/80 border border-dashed border-white/20 rounded px-3 py-1.5 text-xs text-chalk-white font-mono"
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 rounded-lg bg-chalk-yellow/20 border border-dashed border-chalk-yellow/50 text-chalk-yellow text-xs font-bold font-handwritten hover:bg-chalk-yellow/30"
          >
            Resolve DNS
          </button>
        </form>
      )}

      {/* GRADIENT DESCENT TOPIC */}
      {topicId === "gradient-descent" && (
        <form onSubmit={handleApplyGradient} className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-handwritten text-chalk-white/70 mb-1">
              Learning Rate (α): {learningRate}
            </label>
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.05"
              value={learningRate}
              onChange={(e) => setLearningRate(Number(e.target.value))}
              className="w-full accent-chalk-yellow"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-chalk-yellow/20 border border-dashed border-chalk-yellow/50 text-chalk-yellow text-xs font-bold font-handwritten hover:bg-chalk-yellow/30"
          >
            Optimize Loss
          </button>
        </form>
      )}

      {/* K-MEANS TOPIC */}
      {topicId === "k-means" && (
        <form onSubmit={handleApplyKMeans} className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-handwritten text-chalk-white/70 mb-1">
              Number of Clusters (K): {kClusters}
            </label>
            <input
              type="range"
              min="2"
              max="4"
              value={kClusters}
              onChange={(e) => setKClusters(Number(e.target.value))}
              className="w-full accent-chalk-yellow"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-chalk-yellow/20 border border-dashed border-chalk-yellow/50 text-chalk-yellow text-xs font-bold font-handwritten hover:bg-chalk-yellow/30"
          >
            Cluster Points
          </button>
        </form>
      )}

      {/* LOAD BALANCING TOPIC */}
      {topicId === "load-balancing" && (
        <form onSubmit={handleApplyLoadBalancing} className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-handwritten text-chalk-white/70 mb-1">
              Backend Server Pool Count: {lbServerCount}
            </label>
            <input
              type="range"
              min="2"
              max="4"
              value={lbServerCount}
              onChange={(e) => setLbServerCount(Number(e.target.value))}
              className="w-full accent-chalk-yellow"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-chalk-yellow/20 border border-dashed border-chalk-yellow/50 text-chalk-yellow text-xs font-bold font-handwritten hover:bg-chalk-yellow/30"
          >
            Balance Traffic
          </button>
        </form>
      )}

      {/* AUTO-SCALING TOPIC */}
      {topicId === "auto-scaling" && (
        <form onSubmit={handleApplyAutoScaling} className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-handwritten text-chalk-white/70 mb-1">
              CPU Scale-Up Threshold (%): {autoScaleThreshold}%
            </label>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={autoScaleThreshold}
              onChange={(e) => setAutoScaleThreshold(Number(e.target.value))}
              className="w-full accent-chalk-yellow"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-chalk-yellow/20 border border-dashed border-chalk-yellow/50 text-chalk-yellow text-xs font-bold font-handwritten hover:bg-chalk-yellow/30"
          >
            Set Threshold
          </button>
        </form>
      )}
    </div>
  );
}
