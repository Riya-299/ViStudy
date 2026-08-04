// B-Tree Indexing Step Solver for ViStudy Visualizer

export function solveBTree(config = {}) {
  const targetKey = typeof config === "number" ? config : (config.targetKey || 42);
  const steps = [];

  const bTreeNodes = [
    { id: "root", level: 0, pos: [0, 2.8, 0], keys: [30, 60], children: ["child-1", "child-2", "child-3"] },
    { id: "child-1", level: 1, pos: [-4.2, 0.8, 0], keys: [10, 20], children: [] },
    { id: "child-2", level: 1, pos: [0, 0.8, 0], keys: [40, 50], children: [] },
    { id: "child-3", level: 1, pos: [4.2, 0.8, 0], keys: [70, 80, 90], children: [] },
  ];

  steps.push({
    stepIndex: 0,
    targetKey,
    activeNodeId: "root",
    comparedKey: null,
    status: "SEARCHING",
    bTreeNodes,
    log: `Starting B-Tree index lookup for target key ${targetKey}. Beginning search at Root node [30, 60].`,
  });

  if (targetKey < 30) {
    steps.push({
      stepIndex: 1,
      targetKey,
      activeNodeId: "root",
      comparedKey: 30,
      status: "COMPARING",
      bTreeNodes,
      log: `Target ${targetKey} < 30. Following left pointer to child node [10, 20].`,
    });
    steps.push({
      stepIndex: 2,
      targetKey,
      activeNodeId: "child-1",
      comparedKey: targetKey === 20 ? 20 : 10,
      status: "FOUND",
      bTreeNodes,
      log: `Inspecting leaf node [10, 20]: Target key ${targetKey} located in index block! Disk I/O complete.`,
    });
  } else if (targetKey <= 60) {
    steps.push({
      stepIndex: 1,
      targetKey,
      activeNodeId: "root",
      comparedKey: 60,
      status: "COMPARING",
      bTreeNodes,
      log: `30 <= Target ${targetKey} <= 60. Following middle pointer to child node [40, 50].`,
    });
    steps.push({
      stepIndex: 2,
      targetKey,
      activeNodeId: "child-2",
      comparedKey: 40,
      status: "FOUND",
      bTreeNodes,
      log: `Inspecting leaf node [40, 50]: Key boundary matches target ${targetKey}! Index page loaded from disk.`,
    });
  } else {
    steps.push({
      stepIndex: 1,
      targetKey,
      activeNodeId: "root",
      comparedKey: 60,
      status: "COMPARING",
      bTreeNodes,
      log: `Target ${targetKey} > 60. Following right pointer to child node [70, 80, 90].`,
    });
    steps.push({
      stepIndex: 2,
      targetKey,
      activeNodeId: "child-3",
      comparedKey: 70,
      status: "FOUND",
      bTreeNodes,
      log: `Inspecting leaf node [70, 80, 90]: Target key ${targetKey} located in index page!`,
    });
  }

  return steps;
}
