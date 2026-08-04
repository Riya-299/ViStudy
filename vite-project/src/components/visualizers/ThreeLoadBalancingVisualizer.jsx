import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

export default function ThreeLoadBalancingVisualizer({
  servers = [],
  activeRequest,
  routedServerId,
  stepLog,
  currentStep,
  totalSteps,
}) {
  const total = servers.length;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Canvas camera={{ position: [0, 2, 11], fov: 45 }} style={{ background: "#0c1520" }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 8, 5]} intensity={0.9} />

          {/* Load Balancer Core */}
          <group position={[0, 2.5, 0]}>
            <mesh>
              <cylinderGeometry args={[1.2, 1.2, 0.8, 32]} />
              <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.5} />
            </mesh>
            <Text position={[0, 0, 0.45]} fontSize={0.32} color="#ffffff" anchorX="center">
              LOAD BALANCER
            </Text>
          </group>

          {/* Backend Servers */}
          {servers.map((s, idx) => {
            const posX = (idx - (total - 1) / 2) * 2.8;
            const isRouted = routedServerId === s.id;

            return (
              <group key={s.id} position={[posX, -1.0, 0]}>
                <mesh>
                  <boxGeometry args={[2.0, 1.8, 1.2]} />
                  <meshStandardMaterial
                    color={s.color}
                    emissive={isRouted ? s.color : "#000000"}
                    emissiveIntensity={isRouted ? 0.7 : 0}
                  />
                </mesh>
                <Text position={[0, 0.4, 0.65]} fontSize={0.3} color="#000">
                  {s.name}
                </Text>
                <Text position={[0, -0.4, 0.65]} fontSize={0.24} color="#000">
                  Conn: {s.activeConnections}
                </Text>
              </group>
            );
          })}

          <OrbitControls minDistance={4} maxDistance={20} />
        </Canvas>
      </div>

      <div style={{ padding: "9px 16px", background: "rgba(6,12,20,0.95)", borderTop: "1px dashed rgba(255,255,255,0.08)" }}>
        <span style={{ fontSize: "13px", color: "#38bdf8", fontFamily: "'Patrick Hand', cursive" }}>
          Step {currentStep + 1}/{totalSteps} │ {stepLog}
        </span>
      </div>
    </div>
  );
}
