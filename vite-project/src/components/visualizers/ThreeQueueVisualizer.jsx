import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

// ─── 3D Process Block Component ─────────────────────────────────────────────
function ProcessBlock({ process, index, total }) {
  const groupRef = useRef();

  // Dynamic layout calculation for Ready Queue and Finished Processes
  let targetX = -4.5 + (index % 3) * 1.2;
  let targetY = 0.5 + Math.floor(index / 3) * 1.1;
  let targetZ = 0;

  if (process.status === "RUNNING") {
    targetX = 0;
    targetY = 2.2;
    targetZ = 0.8;
  } else if (process.status === "FINISHED") {
    targetX = 4.2 + (index % 3) * 1.2;
    targetY = 0.5 + Math.floor(index / 3) * 1.1;
  }

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.2);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.2);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.2);
  });

  const isRunning = process.status === "RUNNING";
  const isFinished = process.status === "FINISHED";

  return (
    <group ref={groupRef} position={[targetX, targetY, targetZ]}>
      <mesh>
        <boxGeometry args={[1.1, 0.85, 0.85]} />
        <meshStandardMaterial
          color={process.color}
          emissive={isRunning ? process.color : "#000000"}
          emissiveIntensity={isRunning ? 0.8 : 0}
          roughness={0.5}
        />
      </mesh>

      <Text
        position={[0, 0, 0.45]}
        fontSize={0.34}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
      >
        {process.name}
      </Text>

      <Text
        position={[0, -0.62, 0]}
        fontSize={0.26}
        color={isRunning ? "#fca5a5" : isFinished ? "#6ee7b7" : "#cbd5e1"}
        anchorX="center"
        anchorY="middle"
        outlineColor="#000000"
        outlineWidth={0.03}
      >
        {isFinished ? "DONE" : `${process.remaining} ms`}
      </Text>
    </group>
  );
}

// ─── Main 3D Queue & CPU Visualizer Canvas ─────────────────────────────────
export default function ThreeQueueVisualizer({
  processes = [],
  readyQueue = [],
  activeProcess,
  ganttChart = [],
  currentTime,
  timeQuantum,
  stepLog,
  currentStep,
  totalSteps,
}) {
  const orbitRef = useRef();

  // Dynamically calculate horizontal scale for Gantt chart so it NEVER overflows
  const { scalePerMs, ganttWidth, startXOffset } = useMemo(() => {
    const maxEndTime = ganttChart.length > 0 ? Math.max(ganttChart[ganttChart.length - 1].end, 10) : 10;
    const maxAvailableWidth = 10.5; // fits inside visual canvas bounds
    const scale = maxAvailableWidth / Math.max(maxEndTime, 1);
    const totalGanttW = maxEndTime * scale;
    const startX = -totalGanttW / 2;

    return { scalePerMs: scale, ganttWidth: totalGanttW, startXOffset: startX };
  }, [ganttChart]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <Canvas
          camera={{ position: [0, 4, 15], fov: 46 }}
          style={{ background: "#0c1520", width: "100%", height: "100%" }}
          gl={{ antialias: true }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 10, 6]} intensity={0.9} castShadow />

          {/* 3D Central CPU Core Box */}
          <group position={[0, 2.2, 0]}>
            <mesh>
              <boxGeometry args={[2.4, 1.8, 1.8]} />
              <meshStandardMaterial
                color="#1e293b"
                emissive={activeProcess ? "#38bdf8" : "#000000"}
                emissiveIntensity={activeProcess ? 0.35 : 0}
                wireframe
              />
            </mesh>
            <Text
              position={[0, 1.2, 0]}
              fontSize={0.34}
              color="#38bdf8"
              anchorX="center"
              anchorY="middle"
            >
              {`CPU CORE (${activeProcess ? `RUNNING: ${activeProcess}` : "IDLE"})`}
            </Text>
          </group>

          {/* Ready Queue Header */}
          <Text position={[-4.5, 2.2, 0]} fontSize={0.32} color="#fca5a5" anchorX="center">
            READY QUEUE
          </Text>

          {/* Finished Area Header */}
          <Text position={[4.5, 2.2, 0]} fontSize={0.32} color="#6ee7b7" anchorX="center">
            FINISHED PROCESSES
          </Text>

          {/* Render Process Blocks */}
          {processes.map((proc, idx) => (
            <ProcessBlock
              key={proc.id}
              process={proc}
              index={idx}
              total={processes.length}
            />
          ))}

          {/* Dynamic Gantt Chart Timeline Blocks on Ground */}
          <group position={[0, -1.8, 0]}>
            {/* Ground timeline bar */}
            <mesh position={[0, -0.05, 0]}>
              <boxGeometry args={[Math.max(ganttWidth + 1.2, 11), 0.1, 1.2]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>

            <Text position={[startXOffset - 0.7, 0, 0]} fontSize={0.28} color="#94a3b8" anchorX="right">
              Gantt:
            </Text>

            {/* Dynamically scaled Gantt Blocks */}
            {ganttChart.map((g, idx) => {
              const blockW = (g.end - g.start) * scalePerMs;
              const posX = startXOffset + g.start * scalePerMs + blockW / 2;

              return (
                <group key={idx} position={[posX, 0.3, 0]}>
                  <mesh>
                    <boxGeometry args={[Math.max(blockW - 0.04, 0.05), 0.5, 0.8]} />
                    <meshStandardMaterial color={g.color} />
                  </mesh>

                  {/* Show Process Name if block is wide enough */}
                  {blockW >= 0.35 && (
                    <Text position={[0, 0, 0.45]} fontSize={Math.min(0.24, blockW * 0.4)} color="#000">
                      {g.processName}
                    </Text>
                  )}

                  {/* Time Markers */}
                  <Text position={[-blockW / 2, -0.4, 0]} fontSize={0.2} color="#94a3b8">
                    {String(g.start)}
                  </Text>

                  {idx === ganttChart.length - 1 && (
                    <Text position={[blockW / 2, -0.4, 0]} fontSize={0.2} color="#94a3b8">
                      {String(g.end)}
                    </Text>
                  )}
                </group>
              );
            })}
          </group>

          <OrbitControls
            ref={orbitRef}
            enableZoom={true}
            minDistance={4}
            maxDistance={25}
            target={[0, 0.5, 0]}
          />
        </Canvas>
      </div>

      {/* Step description banner */}
      <div
        style={{
          padding: "9px 16px",
          background: "rgba(6,12,20,0.95)",
          borderTop: "1px dashed rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontFamily: "monospace",
            color: "rgba(255,255,255,0.3)",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Step {currentStep + 1}/{totalSteps}
        </span>
        <span style={{ color: "rgba(255,255,255,0.1)", flexShrink: 0 }}>│</span>
        <span
          style={{
            fontSize: "13px",
            color: "#fca5a5",
            fontFamily: "'Patrick Hand', cursive",
            lineHeight: 1.4,
          }}
        >
          {stepLog || "Press Play to start Round Robin CPU scheduling visualizer."}
        </span>
      </div>
    </div>
  );
}
