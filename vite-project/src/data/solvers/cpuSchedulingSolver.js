// CPU Scheduling (Round Robin) Step Solver for ViStudy Visualizer

export function solveCpuScheduling(config = {}) {
  const timeQuantum = config.timeQuantum || 2;
  const initialProcesses = config.processes && config.processes.length > 0 ? config.processes : [
    { id: "P1", name: "P1", burstTime: 4, color: "#6ee7b7" },
    { id: "P2", name: "P2", burstTime: 3, color: "#c4b5fd" },
    { id: "P3", name: "P3", burstTime: 5, color: "#fef08a" },
    { id: "P4", name: "P4", burstTime: 2, color: "#fca5a5" },
  ];

  const steps = [];

  let currentTime = 0;
  let remainingBursts = initialProcesses.map((p) => ({ ...p, remaining: p.burstTime }));
  let readyQueue = initialProcesses.map((p) => p.name);
  let ganttChart = [];

  const getProcessState = (activePName) => {
    return remainingBursts.map((p) => ({
      ...p,
      status: p.remaining === 0 ? "FINISHED" : p.name === activePName ? "RUNNING" : "WAITING",
    }));
  };

  steps.push({
    processes: getProcessState(null),
    readyQueue: [...readyQueue],
    activeProcess: null,
    ganttChart: [],
    currentTime: 0,
    timeQuantum,
    log: `Starting Round Robin CPU Scheduling. Quantum = ${timeQuantum} ms. Initial Ready Queue: [${readyQueue.join(", ")}].`,
  });

  while (readyQueue.length > 0) {
    const currentPName = readyQueue.shift();
    const pObj = remainingBursts.find((p) => p.name === currentPName);

    const execTime = Math.min(pObj.remaining, timeQuantum);
    const startTime = currentTime;
    currentTime += execTime;
    pObj.remaining -= execTime;

    ganttChart.push({ processName: currentPName, start: startTime, end: currentTime, color: pObj.color });

    steps.push({
      processes: getProcessState(currentPName),
      readyQueue: [...readyQueue],
      activeProcess: currentPName,
      ganttChart: [...ganttChart],
      currentTime,
      timeQuantum,
      log: `CPU executing process ${currentPName} for ${execTime} ms (Time: ${startTime} → ${currentTime} ms). Remaining burst: ${pObj.remaining} ms.`,
    });

    if (pObj.remaining > 0) {
      readyQueue.push(currentPName);
      steps.push({
        processes: getProcessState(null),
        readyQueue: [...readyQueue],
        activeProcess: null,
        ganttChart: [...ganttChart],
        currentTime,
        timeQuantum,
        log: `Process ${currentPName} quantum expired (${pObj.remaining} ms left). Preempted and re-queued at back of Ready Queue.`,
      });
    } else {
      steps.push({
        processes: getProcessState(null),
        readyQueue: [...readyQueue],
        activeProcess: null,
        ganttChart: [...ganttChart],
        currentTime,
        timeQuantum,
        log: `Process ${currentPName} completed execution at ${currentTime} ms!`,
      });
    }
  }

  steps.push({
    processes: getProcessState(null),
    readyQueue: [],
    activeProcess: null,
    ganttChart: [...ganttChart],
    currentTime,
    timeQuantum,
    log: `Round Robin Scheduling complete! All processes finished by time T=${currentTime} ms.`,
  });

  return steps;
}
