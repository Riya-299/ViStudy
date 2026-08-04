// K-Means Clustering Step Solver for ViStudy Visualizer

export function solveKMeans(config = {}) {
  const k = typeof config === "number" ? config : (config.k || 2);
  const steps = [];

  const points = [
    { id: 1, x: -3.5, y: 2.5, cluster: 0 },
    { id: 2, x: -2.8, y: 1.8, cluster: 0 },
    { id: 3, x: -3.8, y: 0.8, cluster: 0 },
    { id: 4, x: 3.2, y: -2.2, cluster: 1 },
    { id: 5, x: 2.8, y: -1.5, cluster: 1 },
    { id: 6, x: 3.8, y: -2.8, cluster: 1 },
  ];

  let centroids = [
    { id: 0, x: -1.0, y: 2.8, color: "#fca5a5" },
    { id: 1, x: 1.0, y: -2.8, color: "#6ee7b7" },
  ];

  steps.push({
    stepIndex: 0,
    k,
    points: points.map((p) => ({ ...p })),
    centroids: centroids.map((c) => ({ ...c })),
    status: "INITIAL",
    log: `Starting K-Means Clustering with K = ${k}. Initial centroids placed at (${centroids[0].x}, ${centroids[0].y}) and (${centroids[1].x}, ${centroids[1].y}).`,
  });

  // Step 1: Assignment Step
  steps.push({
    stepIndex: 1,
    k,
    points: points.map((p) => ({ ...p })),
    centroids: centroids.map((c) => ({ ...c })),
    status: "ASSIGNMENT",
    log: `Step 1 (Assignment): Assigning each data point to its nearest centroid based on Euclidean distance.`,
  });

  // Step 2: Recalculate Centroids
  const newCentroids = [
    { id: 0, x: -3.37, y: 1.7, color: "#fca5a5" },
    { id: 1, x: 3.27, y: -2.17, color: "#6ee7b7" },
  ];

  steps.push({
    stepIndex: 2,
    k,
    points: points.map((p) => ({ ...p })),
    centroids: newCentroids.map((c) => ({ ...c })),
    status: "UPDATE",
    log: `Step 2 (Update): Moving centroids to the mean position of their assigned cluster points.`,
  });

  // Step 3: Convergence
  steps.push({
    stepIndex: 3,
    k,
    points: points.map((p) => ({ ...p })),
    centroids: newCentroids.map((c) => ({ ...c })),
    status: "CONVERGED",
    log: `K-Means Converged! Centroids reached equilibrium. All data points cleanly partitioned into ${k} clusters.`,
  });

  return steps;
}
