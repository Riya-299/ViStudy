import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

export default function ThreeKMeansVisualizer({
  k = 2,
  points = [],
  centroids = [],
  status,
  stepLog,
  currentStep,
  totalSteps,
}) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Canvas camera={{ position: [0, 0, 11], fov: 45 }} style={{ background: "#0c1520" }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 8, 5]} intensity={0.9} />

          <Text position={[0, 3.8, 0]} fontSize={0.38} color="#fca5a5" anchorX="center">
            K-MEANS CLUSTERING (K = {k})
          </Text>

          {/* Data Points */}
          {points.map((pt) => (
            <mesh key={pt.id} position={[pt.x, pt.y, 0]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color={pt.cluster === 0 ? "#fca5a5" : "#6ee7b7"} />
            </mesh>
          ))}

          {/* Centroids */}
          {centroids.map((c) => (
            <group key={c.id} position={[c.x, c.y, 0.3]}>
              <mesh>
                <boxGeometry args={[0.6, 0.6, 0.6]} />
                <meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={0.6} />
              </mesh>
              <Text position={[0, 0.6, 0]} fontSize={0.24} color="#ffffff">
                Centroid {c.id + 1}
              </Text>
            </group>
          ))}

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
