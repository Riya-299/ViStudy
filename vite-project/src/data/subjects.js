// Subjects and Topics Data Registry for ViStudy

export const subjects = [
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    shortTitle: "DSA",
    iconName: "CommandLineIcon",
    desc: "Master key algorithms including sorting, graph search, and tree traversal.",
    topics: [
      {
        id: "bubble-sort",
        title: "Bubble Sort",
        desc: "A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
        theory: {
          overview: "Bubble Sort works by repeatedly swapping adjacent elements if they are in the wrong order. Larger elements float to the end of the array like bubbles.",
          keyConcepts: ["Adjacent Comparisons", "In-place Swapping", "Pass-by-Pass Bubble Effect"],
          complexity: { best: "O(n)", average: "O(n^2)", worst: "O(n^2)", space: "O(1)" }
        }
      },
      {
        id: "selection-sort",
        title: "Selection Sort",
        desc: "An in-place comparison sort that divides the list into a sorted and unsorted region, repeatedly selecting the smallest element.",
        theory: {
          overview: "Selection Sort divides the array into a sorted and unsorted section. It finds the minimum element in the unsorted section and swaps it to the front.",
          keyConcepts: ["Minimum Element Selection", "In-place Sorting", "Fixed N-1 Swaps"],
          complexity: { best: "O(n^2)", average: "O(n^2)", worst: "O(n^2)", space: "O(1)" }
        }
      },
      {
        id: "insertion-sort",
        title: "Insertion Sort",
        desc: "Builds the sorted array one element at a time by inserting each new element into its correct position among already-sorted elements.",
        theory: {
          overview: "Insertion Sort iterates through the array and shifts larger sorted elements to the right to insert the current element into its correct spot.",
          keyConcepts: ["Sorted Prefix", "Element Shifting", "Adaptive Linear Time for Nearly Sorted Input"],
          complexity: { best: "O(n)", average: "O(n^2)", worst: "O(n^2)", space: "O(1)" }
        }
      },
      {
        id: "merge-sort",
        title: "Merge Sort",
        desc: "An efficient divide-and-conquer sorting algorithm that splits the list into halves, recursively sorts them, and merges them.",
        theory: {
          overview: "Merge Sort splits the input array into two halves, recursively sorts each half, and merges the sorted sub-arrays together in guaranteed O(n log n) time.",
          keyConcepts: ["Divide & Conquer", "Recursive Halving", "Stable Sub-array Merging"],
          complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)" }
        }
      },
      {
        id: "quick-sort",
        title: "Quick Sort",
        desc: "An efficient divide-and-conquer algorithm selecting a pivot element to partition the array into smaller and larger elements.",
        theory: {
          overview: "Quick Sort picks a pivot element and rearranges the array so elements smaller than the pivot go left and larger go right.",
          keyConcepts: ["Pivot Selection", "Partitioning Step", "Recursive In-place Sorting"],
          complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n^2)", space: "O(log n)" }
        }
      },
      {
        id: "binary-search",
        title: "Binary Search",
        desc: "Finds the position of a target value within a sorted array by repeatedly halving the search interval.",
        theory: {
          overview: "Binary Search compares the target value to the middle element of a sorted array, discarding half of the search space on each step.",
          keyConcepts: ["Sorted Input Requirement", "Search Interval Halving", "Logarithmic Time Complexity"],
          complexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(1)" }
        }
      },
      {
        id: "bst",
        title: "Binary Search Tree (BST)",
        desc: "A node-based binary tree where left child keys are smaller and right child keys are larger than the parent node.",
        theory: {
          overview: "A Binary Search Tree is a hierarchical structure facilitating fast O(log n) search, insertion, and deletion by placing smaller elements left and larger right.",
          keyConcepts: ["Root & Branch Hierarchy", "Left-Smaller / Right-Larger Rule", "In-Order Traversal Sorting"],
          complexity: { best: "O(log n)", average: "O(log n)", worst: "O(n)", space: "O(n)" }
        }
      },
      {
        id: "dijkstra",
        title: "Dijkstra's Algorithm",
        desc: "Finds the shortest paths between nodes in a weighted graph from a single source node.",
        theory: {
          overview: "Dijkstra's algorithm greedily explores the unvisited node with the smallest tentative distance, updating neighboring path lengths.",
          keyConcepts: ["Greedy Distance Minimization", "Edge Relaxation", "Priority Queue / Min Distance Tracking"],
          complexity: { best: "O((V+E) log V)", average: "O((V+E) log V)", worst: "O(V^2)", space: "O(V)" }
        }
      }
    ]
  },
  {
    id: "os",
    title: "Operating Systems",
    shortTitle: "OS",
    iconName: "CpuChipIcon",
    desc: "Understand CPU instruction scheduling, memory paging, and process execution.",
    topics: [
      {
        id: "cpu-scheduling",
        title: "CPU Scheduling (Round Robin)",
        desc: "A preemptive scheduling algorithm that assigns a fixed time quantum to each process in circular order.",
        theory: {
          overview: "Round Robin assigns a time slice (Time Quantum) to each process in a FIFO Ready Queue. Unfinished processes yield the CPU and return to the back of the queue.",
          keyConcepts: ["Preemptive Time Slicing", "Ready Queue Rotation", "Gantt Timeline Execution"],
          complexity: { best: "O(1) switch", average: "O(1) switch", worst: "O(n)", space: "O(n)" }
        }
      },
      {
        id: "page-replacement",
        title: "Page Replacement (LRU)",
        desc: "Replaces the virtual memory page that has not been referenced for the longest duration when physical memory is full.",
        theory: {
          overview: "Least Recently Used (LRU) tracks memory page access order. When a Page Fault occurs and frames are full, the least recently used page is evicted.",
          keyConcepts: ["Page Fault Detection", "Physical Frame Allocation", "LRU Eviction Strategy"],
          complexity: { best: "O(1)", average: "O(1)", worst: "O(n)", space: "O(k frames)" }
        }
      }
    ]
  },
  {
    id: "dbms",
    title: "Database Management Systems",
    shortTitle: "DBMS",
    iconName: "CircleStackIcon",
    desc: "Visualize relational algebra, SQL join structures, and database indexing.",
    topics: [
      {
        id: "sql-joins",
        title: "SQL JOINS",
        desc: "Combines rows from Table A and Table B based on matching key columns (INNER, LEFT, RIGHT).",
        theory: {
          overview: "SQL JOIN operations match keys between relational tables. INNER JOIN returns intersecting matches; LEFT JOIN returns all rows from Table A.",
          keyConcepts: ["Primary/Foreign Key Matching", "INNER vs LEFT vs RIGHT Join", "Merged Tuple Selection"],
          complexity: { best: "O(N + M)", average: "O(N * M)", worst: "O(N * M)", space: "O(N + M)" }
        }
      },
      {
        id: "b-tree",
        title: "B-Tree Indexing",
        desc: "A self-balancing search tree structure used in databases to optimize file access and disk I/O.",
        theory: {
          overview: "B-Trees keep data sorted and allow search, sequential access, insertions, and deletions in logarithmic time by grouping keys in multi-way nodes.",
          keyConcepts: ["Multi-way Node Splitting", "Disk Page Block Optimization", "Balanced Tree Height"],
          complexity: { best: "O(log n)", average: "O(log n)", worst: "O(log n)", space: "O(n)" }
        }
      },
      {
        id: "normalization",
        title: "Normalization (1NF → 2NF → 3NF)",
        desc: "The process of decomposing a relation into smaller, well-structured tables to eliminate redundancy and update anomalies.",
        theory: {
          overview: "Normalization progressively removes data anomalies by applying normal forms. 1NF enforces atomic values; 2NF eliminates partial dependencies; 3NF removes transitive dependencies.",
          keyConcepts: ["Functional Dependencies", "Partial & Transitive Dependencies", "Decomposition into Boyce-Codd NF"],
          complexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(n)" }
        }
      },
      {
        id: "er-diagram",
        title: "ER Diagram",
        desc: "Entity-Relationship modeling: entities, attributes, and relationships visualized as a conceptual database blueprint.",
        theory: {
          overview: "ER Diagrams model real-world data as entities (rectangles), attributes (ovals), and relationships (diamonds) with cardinality constraints (1:1, 1:N, M:N).",
          keyConcepts: ["Entities & Primary Keys", "Relationship Cardinality (1:1, 1:N, M:N)", "Weak Entities & Participation Constraints"],
          complexity: { best: "O(E + R)", average: "O(E + R)", worst: "O(E + R)", space: "O(E + R)" }
        }
      },
      {
        id: "transaction",
        title: "Transactions & ACID Properties",
        desc: "Database transactions ensure reliable execution through Atomicity, Consistency, Isolation, and Durability guarantees.",
        theory: {
          overview: "A transaction is a logical unit of work. ACID properties guarantee that database operations are processed reliably: Atomicity (all-or-nothing), Consistency (valid state), Isolation (concurrent safety), Durability (crash recovery).",
          keyConcepts: ["Atomicity — All or Nothing", "Commit & Rollback Mechanisms", "Concurrency Control & Serializability"],
          complexity: { best: "O(1)", average: "O(n ops)", worst: "O(n ops)", space: "O(log size)" }
        }
      },
      {
        id: "relational-algebra",
        title: "Relational Algebra",
        desc: "Formal query language using operators like Selection (σ), Projection (π), Join (⋈), and Rename (ρ) on relations.",
        theory: {
          overview: "Relational Algebra is the mathematical foundation of SQL. Operators transform input relations into output relations: σ filters rows, π selects columns, ⋈ joins tables, and ρ renames relations.",
          keyConcepts: ["σ Selection — Filter Rows", "π Projection — Pick Columns", "⋈ Natural Join — Merge Relations"],
          complexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(n)" }
        }
      },
      {
        id: "hashing",
        title: "Hashing & Indexing",
        desc: "Hash-based indexing maps keys to buckets using a hash function, with chaining for collision resolution.",
        theory: {
          overview: "Hashing computes h(k) = k mod m to find the bucket for key k. Separate Chaining handles collisions by maintaining a linked list at each bucket. Average lookup is O(1 + α) where α is the load factor.",
          keyConcepts: ["Hash Function Design", "Collision Resolution (Chaining / Open Addressing)", "Load Factor α = n/m"],
          complexity: { best: "O(1)", average: "O(1 + α)", worst: "O(n)", space: "O(n + m)" }
        }
      }
    ]
  },
  {
    id: "cn",
    title: "Computer Networks",
    shortTitle: "CN",
    iconName: "GlobeAltIcon",
    desc: "Explore network protocol handshakes, packet routing paths, and DNS resolution.",
    topics: [
      {
        id: "tcp-handshake",
        title: "TCP 3-Way Handshake",
        desc: "The connection establishment process in TCP/IP networks using SYN, SYN-ACK, and ACK packets.",
        theory: {
          overview: "The TCP 3-Way Handshake establishes a reliable full-duplex connection between Client and Server through SYN, SYN-ACK, and ACK packet exchange.",
          keyConcepts: ["SYN (Synchronize Sequence)", "SYN-ACK Confirmation", "ACK Connection Established"],
          complexity: { best: "1 RTT", average: "1 RTT", worst: "Timeout Retry", space: "O(1)" }
        }
      },
      {
        id: "dns-lookup",
        title: "DNS Resolution (Recursive)",
        desc: "The process of resolving domain names (e.g. google.com) to IP addresses across DNS servers.",
        theory: {
          overview: "DNS Resolution queries the Resolver, Root Server, TLD Server, and Authoritative Nameserver to translate domain names into IP addresses.",
          keyConcepts: ["Recursive vs Iterative Queries", "Root & TLD Servers", "IP Address Cache"],
          complexity: { best: "O(1) cached", average: "O(4 hops)", worst: "O(4 hops)", space: "O(1)" }
        }
      }
    ]
  },
  {
    id: "ml",
    title: "Machine Learning",
    shortTitle: "ML",
    iconName: "AcademicCapIcon",
    desc: "Demystify loss surface optimization, gradient descent, and cluster grouping.",
    topics: [
      {
        id: "gradient-descent",
        title: "Gradient Descent Optimization",
        desc: "Iterative optimization algorithm to find the minimum loss by stepping in the opposite direction of the gradient.",
        theory: {
          overview: "Gradient Descent calculates the slope (gradient) of a loss function and takes steps proportional to the learning rate α toward the global minimum.",
          keyConcepts: ["Loss Function Surface", "Gradient Direction (-∇L)", "Learning Rate Step Size"],
          complexity: { best: "O(iter * d)", average: "O(iter * d)", worst: "O(iter * d)", space: "O(d weights)" }
        }
      },
      {
        id: "k-means",
        title: "K-Means Clustering",
        desc: "Unsupervised algorithm that partitions data points into K clusters based on centroid proximity.",
        theory: {
          overview: "K-Means selects K initial centroids, assigns points to the nearest centroid, and recomputes centroid centers iteratively until convergence.",
          keyConcepts: ["Centroid Initialization", "Euclidean Distance Assignment", "Iterative Mean Re-calculation"],
          complexity: { best: "O(K * N * I)", average: "O(K * N * I)", worst: "O(K * N * I)", space: "O(N + K)" }
        }
      }
    ]
  },
  {
    id: "cloud",
    title: "Cloud Computing",
    shortTitle: "Cloud",
    iconName: "CloudIcon",
    desc: "Visualize load balancing traffic distribution and cluster auto-scaling.",
    topics: [
      {
        id: "load-balancing",
        title: "Load Balancing (Round Robin / Least Conn)",
        desc: "Distributes incoming web requests across a pool of backend servers to ensure high availability.",
        theory: {
          overview: "Cloud Load Balancers route client HTTP/TCP requests across healthy backend servers to prevent overload and ensure high uptime.",
          keyConcepts: ["Server Health Checks", "Request Routing Algorithms", "Fault Tolerant Traffic Distribution"],
          complexity: { best: "O(1)", average: "O(1)", worst: "O(S servers)", space: "O(S)" }
        }
      },
      {
        id: "auto-scaling",
        title: "Cloud Auto-Scaling",
        desc: "Automatically expands or shrinks active server pods based on CPU utilization and traffic surges.",
        theory: {
          overview: "Cloud Auto-Scalers monitor metrics like CPU load. When traffic surges past threshold, new server pods spin up automatically to share the load.",
          keyConcepts: ["CPU Load Threshold", "Scale-Up / Scale-Down Triggers", "Dynamic Pod Allocation"],
          complexity: { best: "O(1)", average: "O(1)", worst: "O(max_pods)", space: "O(max_pods)" }
        }
      }
    ]
  }
];

export const getSubjectById = (id) => subjects.find((s) => s.id === id);
export const getTopicById = (subjectId, topicId) => {
  const subject = getSubjectById(subjectId);
  return subject ? subject.topics.find((t) => t.id === topicId) : null;
};
