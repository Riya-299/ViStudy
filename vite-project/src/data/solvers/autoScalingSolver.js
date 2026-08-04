// Cloud Auto-Scaling Step Solver for ViStudy Visualizer

export function solveAutoScaling(config = {}) {
  const targetThreshold = typeof config === "number" ? config : (config.threshold || 80);
  const steps = [];

  // Frame 0: Baseline Cluster (2 Pods, 45% CPU)
  steps.push({
    stepIndex: 0,
    cpuLoad: 45,
    threshold: targetThreshold,
    pods: [
      { id: "pod-1", name: "Pod-1", status: "HEALTHY", load: 45 },
      { id: "pod-2", name: "Pod-2", status: "HEALTHY", load: 45 },
    ],
    log: `Cluster Baseline: 2 active Pods running at 45% CPU load (Threshold = ${targetThreshold}%).`,
  });

  // Step 1: Traffic Surge (88% CPU)
  steps.push({
    stepIndex: 1,
    cpuLoad: 88,
    threshold: targetThreshold,
    pods: [
      { id: "pod-1", name: "Pod-1", status: "HIGH_LOAD", load: 88 },
      { id: "pod-2", name: "Pod-2", status: "HIGH_LOAD", load: 88 },
    ],
    log: `ALERT: Traffic Surge detected! CPU utilization spiked to 88% (Exceeds ${targetThreshold}% threshold). Auto-Scaler triggering scale-up event.`,
  });

  // Step 2: Spinning up Pod 3 and Pod 4
  steps.push({
    stepIndex: 2,
    cpuLoad: 88,
    threshold: targetThreshold,
    pods: [
      { id: "pod-1", name: "Pod-1", status: "HIGH_LOAD", load: 88 },
      { id: "pod-2", name: "Pod-2", status: "HIGH_LOAD", load: 88 },
      { id: "pod-3", name: "Pod-3 (New)", status: "SPINNING_UP", load: 0 },
      { id: "pod-4", name: "Pod-4 (New)", status: "SPINNING_UP", load: 0 },
    ],
    log: `Auto-Scaler Action: Provisioning 2 new Pods (Pod-3 & Pod-4). Registering with Cluster Load Balancer.`,
  });

  // Step 3: Load Re-balanced & Normalized (42% CPU)
  steps.push({
    stepIndex: 3,
    cpuLoad: 42,
    threshold: targetThreshold,
    pods: [
      { id: "pod-1", name: "Pod-1", status: "HEALTHY", load: 42 },
      { id: "pod-2", name: "Pod-2", status: "HEALTHY", load: 42 },
      { id: "pod-3", name: "Pod-3", status: "HEALTHY", load: 42 },
      { id: "pod-4", name: "Pod-4", status: "HEALTHY", load: 42 },
    ],
    log: `SCALE-UP COMPLETE! Cluster expanded to 4 Pods. CPU load normalized to 42% per pod. System stable.`,
  });

  return steps;
}
