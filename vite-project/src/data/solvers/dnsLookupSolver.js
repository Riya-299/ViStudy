// DNS Resolution Step Solver for ViStudy Visualizer

export function solveDnsLookup(config = {}) {
  const domain = typeof config === "string" ? config : (config.domain || "example.com");
  const steps = [];

  const dnsNodes = [
    { id: "client", label: "Browser / Client", type: "CLIENT", pos: [-5, 0, 0] },
    { id: "resolver", label: "Recursive Resolver", type: "RESOLVER", pos: [-2, 2.2, 0] },
    { id: "root", label: "Root Server (.)", type: "ROOT", pos: [1, 3, 0] },
    { id: "tld", label: "TLD Server (.com)", type: "TLD", pos: [3.5, 1, 0] },
    { id: "authoritative", label: "Auth NS (ns1.com)", type: "AUTH", pos: [4.5, -1.8, 0] },
  ];

  steps.push({
    stepIndex: 0,
    domain,
    dnsNodes,
    activeHop: null,
    ipResolved: null,
    log: `Starting DNS Resolution for domain "${domain}". Client checks local cache (Cache Miss).`,
  });

  steps.push({
    stepIndex: 1,
    domain,
    dnsNodes,
    activeHop: { from: "client", to: "resolver", msg: `Query IP for ${domain}` },
    ipResolved: null,
    log: `Hop 1: Client queries Recursive Resolver (ISP / 8.8.8.8) for "${domain}".`,
  });

  steps.push({
    stepIndex: 2,
    domain,
    dnsNodes,
    activeHop: { from: "resolver", to: "root", msg: `Where is .com TLD?` },
    ipResolved: null,
    log: `Hop 2: Resolver queries Root Nameserver (.) for .com Top-Level Domain server IP.`,
  });

  steps.push({
    stepIndex: 3,
    domain,
    dnsNodes,
    activeHop: { from: "resolver", to: "tld", msg: `Where is ${domain}?` },
    ipResolved: null,
    log: `Hop 3: Resolver queries .com TLD Server for Authoritative Nameserver IP of "${domain}".`,
  });

  steps.push({
    stepIndex: 4,
    domain,
    dnsNodes,
    activeHop: { from: "resolver", to: "authoritative", msg: `Get A Record for ${domain}` },
    ipResolved: null,
    log: `Hop 4: Resolver queries Authoritative Nameserver (ns1.example.com) for A Record.`,
  });

  steps.push({
    stepIndex: 5,
    domain,
    dnsNodes,
    activeHop: { from: "resolver", to: "client", msg: `IP: 93.184.216.34` },
    ipResolved: "93.184.216.34",
    log: `DNS SUCCESS! Authoritative server returns IP 93.184.216.34. Resolver caches record and returns IP to Client.`,
  });

  return steps;
}
