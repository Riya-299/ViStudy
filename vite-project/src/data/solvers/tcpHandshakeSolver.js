// TCP 3-Way Handshake Step Solver for ViStudy Visualizer

export function solveTcpHandshake(config = {}) {
  const initialSeq = typeof config === "number" ? config : (config.initialSeq || 100);
  const steps = [];

  const clientSeq = initialSeq;
  const serverSeq = 300;

  // Frame 0: Closed / Initial
  steps.push({
    stepIndex: 0,
    packet: null,
    clientState: "CLOSED",
    serverState: "LISTEN",
    activePacketPos: null,
    log: `Initial State: Client is CLOSED, Server is in LISTEN state on port 80/443.`,
  });

  // Step 1: Client sends SYN packet
  steps.push({
    stepIndex: 1,
    packet: { type: "SYN", seq: clientSeq, ack: 0, from: "Client", to: "Server" },
    clientState: "SYN_SENT",
    serverState: "LISTEN",
    activePacketPos: 0.25,
    log: `Step 1 [SYN]: Client sends SYN packet (seq = ${clientSeq}) to Server to initiate connection. Client enters SYN_SENT state.`,
  });

  // Step 2: Server receives SYN and responds with SYN-ACK
  steps.push({
    stepIndex: 2,
    packet: { type: "SYN-ACK", seq: serverSeq, ack: clientSeq + 1, from: "Server", to: "Client" },
    clientState: "SYN_SENT",
    serverState: "SYN_RECEIVED",
    activePacketPos: 0.75,
    log: `Step 2 [SYN-ACK]: Server receives SYN, allocates buffers, and replies with SYN-ACK (seq = ${serverSeq}, ack = ${clientSeq + 1}). Server enters SYN_RECEIVED state.`,
  });

  // Step 3: Client receives SYN-ACK and sends ACK
  steps.push({
    stepIndex: 3,
    packet: { type: "ACK", seq: clientSeq + 1, ack: serverSeq + 1, from: "Client", to: "Server" },
    clientState: "ESTABLISHED",
    serverState: "SYN_RECEIVED",
    activePacketPos: 0.5,
    log: `Step 3 [ACK]: Client receives SYN-ACK and responds with ACK (ack = ${serverSeq + 1}). Client enters ESTABLISHED state.`,
  });

  // Step 4: Connection fully established
  steps.push({
    stepIndex: 4,
    packet: null,
    clientState: "ESTABLISHED",
    serverState: "ESTABLISHED",
    activePacketPos: null,
    log: `CONNECTION ESTABLISHED! Both Client and Server are in ESTABLISHED state. Full-duplex TCP stream ready for HTTP data transfer.`,
  });

  return steps;
}
