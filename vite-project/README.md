<div align="center">

# ✨ ViStudy

### *Visualizing Complex Computer Science Concepts in Immersive 3D*

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r173-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/R3F-8.x-black?style=for-the-badge&logo=react&logoColor=61DAFB)](https://docs.pmnd.rs/react-three-fiber)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/)

<p align="center">
  <b>ViStudy</b> turns abstract algorithms, system architecture patterns, data structures, and database engines into interactive, real-time 3D spatial visualizers. Designed for students, developers, and educators to <i>see</i> how code executes in 3-dimensional space.
</p>

---

</div>

## 🌟 Core Highlights & Features

### 🎮 3D Spatial Canvas Visualizations
* **Real-time 3D Rendering**: Built with WebGL and React Three Fiber to render spatial representations of data flows, trees, matrices, network packets, and memory states.
* **Full Camera Control**: Orbit, pan, zoom, and inspect algorithm states from any 3D angle with intuitive controls and dynamic lighting.

### ⏯️ Step-by-Step Playback Engine
* **Precise Execution Controls**: Step forward, step backward, auto-play, pause, and scrub through algorithm steps at your own pace.
* **Variable Playback Speed**: Adjust execution speeds in real-time to observe micro-transitions or quickly skip ahead to algorithm outputs.
* **Synchronized Step Logs**: Every visual transition is tied to explicit execution step logs for granular tracing.

### 🎛️ Custom Input & Dynamic Simulation
* **Interactive Parameter Panels**: Supply your own custom datasets, target search keys, capacity thresholds, or graph configurations.
* **On-the-Fly Solver Computations**: Re-computes execution pipelines dynamically as you change input parameters without page reloads.

### 🤖 AI Learning Assistant Integration
* **Context-Aware Chatbot**: Integrated interactive assistant that breaks down visual step mechanics, clarifies edge cases, and answers conceptual questions in real-time.
* **Instant Guidance**: Ask questions directly alongside the visualizer to reinforce deep understanding.

### 📚 Synchronized Theory & Solver Insight
* **Dual Viewport Design**: Combines high-level visual spatial representation with deep technical theory, time/space complexity notes, and step descriptions.
* **Modular Design System**: High contrast dark-mode glassmorphism theme engineered specifically for visual clarity and modern presentation.

---

## 🛠️ Technology Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Core Framework** | `React 18`, `Vite` |
| **3D & WebGL Engine** | `Three.js`, `@react-three/fiber`, `@react-three/drei` |
| **Styling & Theme** | Modern Glassmorphism Vanilla CSS, Responsive Layout Grids |
| **Icons & UI Assets** | `Lucide React` |
| **Solver Architecture** | Custom Step-Solver Engine & Dynamic State Hooks |

---

## 💡 Architecture & Extensibility

ViStudy is engineered with a **decoupled solver-visualizer architecture**:
* **Step Solvers**: Pure state functions compute algorithm states into step-by-step state trace arrays.
* **Visualizer Components**: Declarative 3D mesh components consume step logs and render reactive spatial animations.
* **Playback Hooks**: Centralized `usePlayback` state machine handles timing, execution indices, auto-play loops, and custom user input overrides.

---

<div align="center">

*Built with passion to make learning intuitive, visual, and engaging.*

</div>
