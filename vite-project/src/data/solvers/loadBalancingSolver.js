// Cloud Load Balancing Step Solver for ViStudy Visualizer

export function solveLoadBalancing(config = {}) {
  const serverCount = typeof config === "number" ? config : (config.serverCount || 3);
  const steps = [];

  const servers = Array.from({ length: serverCount }, (_, i) => ({
    id: `server-${i + 1}`,
    name: `Server ${i + 1}`,
    activeConnections: 0,
    health: "HEALTHY",
    color: ["#6ee7b7", "#c4b5fd", "#fef08a", "#fca5a5"][i % 4],
  }));

  steps.push({
    stepIndex: 0,
    servers: servers.map((s) => ({ ...s })),
    activeRequest: null,
    routedServerId: null,
    log: `Starting Cloud Load Balancer with ${serverCount} active backend servers. Health check OK.`,
  });

  const requestList = [
    { reqId: "REQ-101", client: "Client A" },
    { reqId: "REQ-102", client: "Client B" },
    { reqId: "REQ-103", client: "Client C" },
    { reqId: "REQ-104", client: "Client D" },
  ];

  requestList.forEach((req, idx) => {
    const serverIdx = idx % serverCount;
    servers[serverIdx].activeConnections += 1;

    steps.push({
      stepIndex: idx + 1,
      servers: servers.map((s) => ({ ...s })),
      activeRequest: req,
      routedServerId: servers[serverIdx].id,
      log: `Incoming ${req.reqId} from ${req.client}: Load Balancer routes traffic to ${servers[serverIdx].name} (Round-Robin).`,
    });
  });

  steps.push({
    stepIndex: requestList.length + 1,
    servers: servers.map((s) => ({ ...s })),
    activeRequest: null,
    routedServerId: null,
    log: `Traffic distribution complete! All ${requestList.length} HTTP requests evenly balanced across server cluster.`,
  });

  return steps;
}
