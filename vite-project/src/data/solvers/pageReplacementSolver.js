// LRU Page Replacement Step Solver for ViStudy Visualizer

export function solvePageReplacement(config) {
  let requests = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3];
  let frameCapacity = 3;

  if (Array.isArray(config)) {
    requests = config;
  } else if (config && typeof config === "object") {
    if (Array.isArray(config.requests)) requests = config.requests;
    if (config.frameCount) frameCapacity = Number(config.frameCount) || 3;
  }

  const steps = [];
  const frames = Array(frameCapacity).fill(null);
  const lastUsed = {};
  let pageFaults = 0;
  let pageHits = 0;

  // Frame 0: Initial Empty Memory
  steps.push({
    stepIndex: 0,
    requestedPage: null,
    frames: [...frames],
    status: "INITIAL",
    pageFaults: 0,
    pageHits: 0,
    evictedPage: null,
    log: `Starting LRU Page Replacement with ${frameCapacity} physical frames. Page sequence: [${requests.join(", ")}].`,
  });

  requests.forEach((page, idx) => {
    const frameIndex = frames.indexOf(page);
    let status = "HIT";
    let evicted = null;

    if (frameIndex !== -1) {
      // Page HIT
      pageHits++;
      lastUsed[page] = idx;
      status = "HIT";
    } else {
      // Page MISS (Fault)
      pageFaults++;
      status = "FAULT";

      // Find empty slot or evict LRU page
      const emptyIdx = frames.indexOf(null);
      if (emptyIdx !== -1) {
        frames[emptyIdx] = page;
      } else {
        // Evict LRU page
        let lruPage = frames[0];
        let minTime = lastUsed[lruPage] ?? -1;
        let evictIdx = 0;

        frames.forEach((p, fIdx) => {
          const t = lastUsed[p] ?? -1;
          if (t < minTime) {
            minTime = t;
            lruPage = p;
            evictIdx = fIdx;
          }
        });

        evicted = lruPage;
        frames[evictIdx] = page;
      }
      lastUsed[page] = idx;
    }

    steps.push({
      stepIndex: idx + 1,
      requestedPage: page,
      frames: [...frames],
      status,
      pageFaults,
      pageHits,
      evictedPage: evicted,
      log: status === "HIT"
        ? `Request Page ${page}: PAGE HIT! Page ${page} is already in physical memory frame.`
        : evicted !== null
        ? `Request Page ${page}: PAGE FAULT! Evicting LRU Page ${evicted} from frame to load Page ${page}.`
        : `Request Page ${page}: PAGE FAULT! Loading Page ${page} into available empty frame.`,
    });
  });

  return steps;
}
