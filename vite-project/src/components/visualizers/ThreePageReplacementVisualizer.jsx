import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

function FrameBox({ val, index, total, status, isEvicted }) {
  const groupRef = useRef();
  const targetX = (index - (total - 1) / 2) * 2.2;
  const targetY = 0.8;

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.2);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.2);
  });

  const color = val === null ? "#1e293b" : status === "HIT" ? "#16a34a" : "#dc2626";

  return (
    <group ref={groupRef} position={[targetX, targetY, 0]}>
      <mesh>
        <boxGeometry args={[1.8, 1.4, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <Text position={[0, 0, 0.65]} fontSize={0.45} color="#ffffff" anchorX="center" anchorY="middle">
        {val !== null ? `Page ${val}` : "EMPTY"}
      </Text>

      <Text position={[0, -1.0, 0]} fontSize={0.28} color="#94a3b8" anchorX="center">
        Frame {index + 1}
      </Text>
    </group>
  );
}

export default function ThreePageReplacementVisualizer({
  requestedPage,
  frames = [],
  status,
  pageFaults = 0,
  pageHits = 0,
  stepLog,
  currentStep,
  totalSteps,
}) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Canvas camera={{ position: [0, 3, 11], fov: 45 }} style={{ background: "#0c1520" }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 8, 5]} intensity={0.9} />

          {/* Requested Page Badge Header */}
          <group position={[0, 2.8, 0]}>
            <Text fontSize={0.38} color="#fef08a" anchorX="center">
              {requestedPage !== null ? `CURRENT REQUEST: PAGE ${requestedPage}` : "LRU PAGE REPLACEMENT"}
            </Text>
            {status && (
              <Text position={[0, -0.45, 0]} fontSize={0.32} color={status === "HIT" ? "#6ee7b7" : "#fca5a5"} anchorX="center">
                STATUS: {status === "HIT" ? "🟢 PAGE HIT" : "🔴 PAGE FAULT"}
              </Text>
            )}
          </group>

          {/* Memory Frames */}
          {frames.map((val, idx) => (
            <FrameBox key={idx} val={val} index={idx} total={frames.length} status={status} />
          ))}

          {/* Page Fault Counter */}
          <group position={[0, -1.8, 0]}>
            <Text position={[-3, 0, 0]} fontSize={0.32} color="#fca5a5">
              Faults: {pageFaults}
            </Text>
            <Text position={[3, 0, 0]} fontSize={0.32} color="#6ee7b7">
              Hits: {pageHits}
            </Text>
          </group>

          <OrbitControls minDistance={4} maxDistance={20} />
        </Canvas>
      </div>

      <div style={{ padding: "9px 16px", background: "rgba(6,12,20,0.95)", borderTop: "1px dashed rgba(255,255,255,0.08)" }}>
        <span style={{ fontSize: "13px", color: "#fca5a5", fontFamily: "'Patrick Hand', cursive" }}>
          Step {currentStep + 1}/{totalSteps} │ {stepLog}
        </span>
      </div>
    </div>
  );
}
