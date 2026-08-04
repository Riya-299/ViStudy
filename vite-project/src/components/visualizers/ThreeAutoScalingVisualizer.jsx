import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

export default function ThreeAutoScalingVisualizer({
  cpuLoad = 45,
  threshold = 80,
  pods = [],
  stepLog,
  currentStep,
  totalSteps,
}) {
  const total = pods.length;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Canvas camera={{ position: [0, 2, 11], fov: 45 }} style={{ background: "#0c1520" }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 8, 5]} intensity={0.9} />

          {/* Metric Gauge Header */}
          <group position={[0, 2.8, 0]}>
            <Text fontSize={0.36} color={cpuLoad > threshold ? "#fca5a5" : "#6ee7b7"} anchorX="center">
              KUBERNETES CLUSTER CPU LOAD: {cpuLoad}% (THRESHOLD: {threshold}%)
            </Text>
          </group>

          {/* Active Pod Cluster */}
          {pods.map((pod, idx) => {
            const posX = (idx - (total - 1) / 2) * 2.2;
            const isSpinning = pod.status === "SPINNING_UP";
            const isHigh = pod.status === "HIGH_LOAD";
            const color = isSpinning ? "#fef08a" : isHigh ? "#ef4444" : "#10b981";

            return (
              <group key={pod.id} position={[posX, 0.2, 0]}>
                <mesh>
                  <boxGeometry args={[1.8, 1.6, 1.2]} />
                  <meshStandardMaterial color={color} roughness={0.4} />
                </mesh>
                <Text position={[0, 0.3, 0.65]} fontSize={0.28} color="#000">
                  {pod.name}
                </Text>
                <Text position={[0, -0.4, 0.65]} fontSize={0.22} color="#000">
                  {isSpinning ? "SPINNING UP" : `Load: ${pod.load}%`}
                </Text>
              </group>
            );
          })}

          <OrbitControls minDistance={4} maxDistance={20} />
        </Canvas>
      </div>

      <div style={{ padding: "9px 16px", background: "rgba(6,12,20,0.95)", borderTop: "1px dashed rgba(255,255,255,0.08)" }}>
        <span style={{ fontSize: "13px", color: "#6ee7b7", fontFamily: "'Patrick Hand', cursive" }}>
          Step {currentStep + 1}/{totalSteps} │ {stepLog}
        </span>
      </div>
    </div>
  );
}
