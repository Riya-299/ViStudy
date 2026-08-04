# ViStudy - 3D Interactive CS & Engineering Visualizer

**ViStudy** is a web-based, interactive 3D learning platform designed to demystify complex Computer Science and Software Engineering concepts through real-time 3D visualizations, step-by-step execution, and interactive theoretical breakdowns.

---

## 📌 Project Overview

- **Project Name:** ViStudy
- **Location:** `C:\Users\riyaa\Projects\ViStudy\vite-project`
- **Application Type:** Interactive Single-Page Web Application (SPA)
- **Primary Goal:** Transform abstract CS concepts (Algorithms, OS, Networking, Databases, ML, Cloud) into tangible, interactive 3D simulations using Three.js and React Three Fiber.

---

## 🛠️ Technology Stack

| Category | Technologies / Libraries |
| :--- | :--- |
| **Frontend Framework** | React 19 (`react`, `react-dom`) |
| **Build Tool & Server** | Vite 8 (`vite`, `@vitejs/plugin-react`) |
| **3D Engine** | Three.js (`three`), React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`) |
| **Styling & UI** | Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`) |
| **Icons** | Heroicons (`@heroicons/react`) |
| **Routing** | React Router DOM v7 (`react-router-dom`) |
| **Linting & Quality** | ESLint (`eslint`) |

---

## 📚 Covered Domains & Visualized Topics

ViStudy features **6 core subject areas** containing **13 specialized interactive 3D visualizers**:

### 1. Data Structures & Algorithms (DSA)
- **Bubble Sort:** 3D array bar height swapping with step-by-step play/pause.
- **Selection Sort:** Minimum element selection and array partitioning.
- **Insertion Sort:** Dynamic shifting of elements into sorted prefix.
- **Merge Sort:** Recursive array splitting and sub-array merging.
- **Quick Sort:** Pivot element selection and dual-pointer partitioning.
- **Binary Search:** Logarithmic search interval halving in 3D space.
- **Binary Search Tree (BST):** 3D node insertion, branch expansion, and traversals.
- **Dijkstra's Algorithm:** Weighted graph node relaxation and shortest-path highlighting.

### 2. Operating Systems (OS)
- **CPU Scheduling (Round Robin):** Time-quantum preemption with 3D process queue rotation and Gantt charts.
- **Page Replacement (LRU):** Physical frame allocation and least-recently-used page eviction tracking.

### 3. Database Management Systems (DBMS)
- **SQL JOINS:** 3D tuple matching for INNER, LEFT, and RIGHT joins between relational tables.
- **B-Tree Indexing:** Multi-way node splitting and disk block I/O optimization.

### 4. Computer Networks (CN)
- **TCP 3-Way Handshake:** Packet animation (SYN, SYN-ACK, ACK) establishing client-server connection.
- **DNS Resolution (Recursive):** Domain resolution steps across Resolver, Root, TLD, and Authoritative servers.

### 5. Machine Learning (ML)
- **Gradient Descent Optimization:** 3D loss surface terrain with particle step trajectory toward global minimum.
- **K-Means Clustering:** Iterative centroid relocation and 3D point cloud cluster assignments.

### 6. Cloud Computing (Cloud)
- **Load Balancing:** Round-robin request routing across active backend server pods.
- **Cloud Auto-Scaling:** Dynamic pod scaling based on CPU utilization and incoming traffic surges.

---

## 📁 Directory & File Architecture

```
C:\Users\riyaa\Projects\ViStudy\vite-project\
├── package.json               # Dependencies & build scripts
├── vite.config.js             # Vite configuration with Tailwind CSS plugin
├── index.html                 # Main entry HTML file
└── src/
    ├── App.jsx                # Router configuration & main app wrapper
    ├── main.jsx               # Entry point mounting React DOM
    ├── index.css              # Custom CSS rules & Tailwind directives
    ├── data/
    │   └── subjects.js        # Comprehensive registry of all subjects, topics & theory
    ├── pages/
    │   ├── Home.jsx           # Landing page with subject selection grid
    │   ├── SubjectPage.jsx    # Subject detail view listing topics & complexity
    │   └── TopicPage.jsx      # Topic view containing the 3D Visualizer & theory breakdown
    └── components/
        ├── Navbar.jsx         # Navigation header & brand logo
        ├── SubjectCard.jsx    # UI card component for subject cards
        ├── TheoryBlock.jsx   # Theoretical breakdown & complexity display
        └── visualizers/       # 3D Canvas visualizer components (R3F)
            ├── ThreeArrayVisualizer.jsx
            ├── ThreeTreeVisualizer.jsx
            ├── ThreeGraphVisualizer.jsx
            ├── ThreeQueueVisualizer.jsx
            ├── ThreePageReplacementVisualizer.jsx
            ├── ThreeSqlJoinVisualizer.jsx
            ├── ThreeBTreeVisualizer.jsx
            ├── ThreeTcpHandshakeVisualizer.jsx
            ├── ThreeDnsVisualizer.jsx
            ├── ThreeGradientDescentVisualizer.jsx
            ├── ThreeKMeansVisualizer.jsx
            ├── ThreeLoadBalancingVisualizer.jsx
            └── ThreeAutoScalingVisualizer.jsx
```

---

## 🚀 Available NPM Scripts

Inside the `C:\Users\riyaa\Projects\ViStudy\vite-project` directory:

- **Start Dev Server:**
  ```bash
  npm run dev
  ```
- **Build for Production:**
  ```bash
  npm run build
  ```
- **Preview Production Build:**
  ```bash
  npm run preview
  ```
- **Run Linter:**
  ```bash
  npm run lint
  ```
