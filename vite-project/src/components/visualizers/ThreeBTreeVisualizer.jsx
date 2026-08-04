import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

export default function ThreeBTreeVisualizer({
  targetKey,
  activeNodeId,
  comparedKey,
  bTreeNodes = [],
  stepLog,
  currentStep,
  totalSteps,
}) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Canvas camera={{ position: [0, 2, 11], fov: 45 }} style={{ background: "#0c1520" }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 8, 5]} intensity={0.9} />

          <Text position={[0, 3.6, 0]} fontSize={0.38} color="#fef08a" anchorX="center">
            B-TREE INDEX LOOKUP: TARGET = {targetKey}
          </Text>

          {bTreeNodes.map((node) => {
            const isActive = activeNodeId === node.id;
            return (
              <group key={node.id} position={node.pos}>
                <mesh>
                  <boxGeometry args={[node.keys.length * 1.2 + 0.4, 0.9, 0.8]} />
                  <meshStandardMaterial
                    color={isActive ? "#0284c7" : "#1e293b"}
                    emissive={isActive ? "#0284c7" : "#000000"}
                    emissiveIntensity={isActive ? 0.4 : 0}
                  />
                </mesh>
                <Text position={[0, 0, 0.45]} fontSize={0.32} color="#ffffff">
                  [{node.keys.join(" │ ")}]
                </Text>
              </group>
            );
          })}

          <OrbitControls minDistance={4} maxDistance={20} />
        </Canvas>
      </div>

      <div style={{ padding: "9px 16px", background: "rgba(6,12,20,0.95)", borderTop: "1px dashed rgba(255,255,255,0.08)" }}>
        <span style={{ fontSize: "13px", color: "#fef08a", fontFamily: "'Patrick Hand', cursive" }}>
          Step {currentStep + 1}/{totalSteps} │ {stepLog}
        </span>
      </div>
    </div>
  );
}
