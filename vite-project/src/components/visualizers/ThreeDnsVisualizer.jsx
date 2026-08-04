import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

export default function ThreeDnsVisualizer({
  domain = "example.com",
  dnsNodes = [],
  activeHop,
  ipResolved,
  stepLog,
  currentStep,
  totalSteps,
}) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Canvas camera={{ position: [0, 2, 12], fov: 46 }} style={{ background: "#0c1520" }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 8, 5]} intensity={0.9} />

          <Text position={[0, 3.6, 0]} fontSize={0.38} color="#67e8f9" anchorX="center">
            DNS QUERY RESOLUTION FOR: "{domain}"
          </Text>

          {/* DNS Server Nodes */}
          {dnsNodes.map((node) => {
            const isHopSource = activeHop && activeHop.from === node.id;
            const isHopTarget = activeHop && activeHop.to === node.id;

            let color = "#1e293b";
            if (node.type === "CLIENT") color = "#0284c7";
            else if (node.type === "RESOLVER") color = "#a855f7";
            else color = "#059669";

            return (
              <group key={node.id} position={node.pos}>
                <mesh>
                  <boxGeometry args={[2.0, 1.1, 1.0]} />
                  <meshStandardMaterial
                    color={color}
                    emissive={isHopTarget ? "#fef08a" : "#000000"}
                    emissiveIntensity={isHopTarget ? 0.6 : 0}
                  />
                </mesh>
                <Text position={[0, 0, 0.55]} fontSize={0.24} color="#ffffff">
                  {node.label}
                </Text>
              </group>
            );
          })}

          {ipResolved && (
            <group position={[0, -2.6, 0]}>
              <Text fontSize={0.38} color="#6ee7b7">
                RESOLVED IP: {ipResolved}
              </Text>
            </group>
          )}

          <OrbitControls minDistance={4} maxDistance={22} />
        </Canvas>
      </div>

      <div style={{ padding: "9px 16px", background: "rgba(6,12,20,0.95)", borderTop: "1px dashed rgba(255,255,255,0.08)" }}>
        <span style={{ fontSize: "13px", color: "#67e8f9", fontFamily: "'Patrick Hand', cursive" }}>
          Step {currentStep + 1}/{totalSteps} │ {stepLog}
        </span>
      </div>
    </div>
  );
}
