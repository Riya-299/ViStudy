// Dijkstra's Shortest Path Algorithm Step Solver for ViStudy Visualizer

export function solveDijkstra() {
  // Graph definition: 6 nodes (A..F) with positions for 3D layout
  const graphNodes = [
    { id: "A", label: "A", position: [-4.5, 0.8, 0] },
    { id: "B", label: "B", position: [-1.8, 3.2, 0] },
    { id: "C", label: "C", position: [-1.8, -1.8, 0] },
    { id: "D", label: "D", position: [1.8, 3.2, 0] },
    { id: "E", label: "E", position: [1.8, -1.8, 0] },
    { id: "F", label: "F", position: [4.5, 0.8, 0] },
  ];

  const graphEdges = [
    { id: "A-B", u: "A", v: "B", weight: 4 },
    { id: "A-C", u: "A", v: "C", weight: 2 },
    { id: "B-C", u: "B", v: "C", weight: 1 },
    { id: "B-D", u: "B", v: "D", weight: 5 },
    { id: "C-E", u: "C", v: "E", weight: 8 },
    { id: "C-D", u: "C", v: "D", weight: 10 },
    { id: "D-F", u: "D", v: "F", weight: 2 },
    { id: "E-F", u: "E", v: "F", weight: 3 },
  ];

  const steps = [];

  // State initialization
  const dist = {};
  const prev = {};
  const visited = new Set();

  graphNodes.forEach((node) => {
    dist[node.id] = Infinity;
    prev[node.id] = null;
  });

  const sourceId = "A";
  dist[sourceId] = 0;

  const makeFrame = (activeNodeId, activeEdgeId, logText, shortestEdges = []) => {
    return {
      nodes: graphNodes.map((n) => ({
        ...n,
        dist: dist[n.id],
        isVisited: visited.has(n.id),
        isActive: n.id === activeNodeId,
      })),
      edges: graphEdges.map((e) => ({
        ...e,
        isRelaxing: e.id === activeEdgeId || `${e.v}-${e.u}` === activeEdgeId,
        isShortestPath: shortestEdges.includes(e.id) || shortestEdges.includes(`${e.v}-${e.u}`),
      })),
      activeNodeId,
      log: logText,
    };
  };

  // Step 0: Initial state
  steps.push(
    makeFrame(
      null,
      null,
      `Starting Dijkstra's Shortest Path from Source Node A. Initial distances: A=0, all others=∞.`
    )
  );

  while (visited.size < graphNodes.length) {
    // Find unvisited node with minimum distance
    let u = null;
    let minDist = Infinity;

    graphNodes.forEach((node) => {
      if (!visited.has(node.id) && dist[node.id] < minDist) {
        minDist = dist[node.id];
        u = node.id;
      }
    });

    if (!u || minDist === Infinity) break; // All remaining nodes unreachable

    // Highlight picking active node u
    steps.push(
      makeFrame(
        u,
        null,
        `Selecting unvisited node ${u} with smallest tentative distance (${minDist}).`
      )
    );

    // Get adjacent edges for node u
    const incidentEdges = graphEdges.filter((e) => e.u === u || e.v === u);

    for (const edge of incidentEdges) {
      const v = edge.u === u ? edge.v : edge.u;

      if (!visited.has(v)) {
        const alt = dist[u] + edge.weight;

        steps.push(
          makeFrame(
            u,
            edge.id,
            `Checking edge ${u}–${v} (weight ${edge.weight}). Tentative distance via ${u} = ${dist[u]} + ${edge.weight} = ${alt}.`
          )
        );

        if (alt < dist[v]) {
          dist[v] = alt;
          prev[v] = u;

          steps.push(
            makeFrame(
              u,
              edge.id,
              `Distance to node ${v} improved! Updated dist[${v}] = ${alt} (predecessor: ${u}).`
            )
          );
        } else {
          steps.push(
            makeFrame(
              u,
              edge.id,
              `No improvement for node ${v} (${dist[v]} <= ${alt}). Keeping dist[${v}] = ${dist[v]}.`
            )
          );
        }
      }
    }

    visited.add(u);

    steps.push(
      makeFrame(
        u,
        null,
        `Node ${u} marked as visited. Shortest distance to ${u} is finalized as ${dist[u]}.`
      )
    );
  }

  // Reconstruct shortest paths from A to F
  const shortestEdges = [];
  let curr = "F";
  while (prev[curr]) {
    const p = prev[curr];
    const edge = graphEdges.find(
      (e) => (e.u === p && e.v === curr) || (e.u === curr && e.v === p)
    );
    if (edge) shortestEdges.push(edge.id);
    curr = p;
  }

  steps.push(
    makeFrame(
      null,
      null,
      `Dijkstra complete! Shortest path from A to F is A → B → C → E → F (Distance: ${dist["F"]}).`,
      shortestEdges
    )
  );

  return steps;
}
