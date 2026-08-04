import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

export default function ThreeTcpHandshakeVisualizer({
  packet,
  clientState = "CLOSED",
  serverState = "LISTEN",
  activePacketPos,
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

          {/* Client Node */}
          <group position={[-4.5, 0.5, 0]}>
            <mesh>
              <boxGeometry args={[2.2, 1.8, 1.4]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
            <Text position={[0, 0.4, 0.75]} fontSize={0.34} color="#ffffff">
              CLIENT
            </Text>
            <Text position={[0, -0.4, 0.75]} fontSize={0.26} color="#6ee7b7">
              {clientState}
            </Text>
          </group>

          {/* Server Node */}
          <group position={[4.5, 0.5, 0]}>
            <mesh>
              <boxGeometry args={[2.2, 1.8, 1.4]} />
              <meshStandardMaterial color="#7e22ce" />
            </mesh>
            <Text position={[0, 0.4, 0.75]} fontSize={0.34} color="#ffffff">
              SERVER
            </Text>
            <Text position={[0, -0.4, 0.75]} fontSize={0.26} color="#fca5a5">
              {serverState}
            </Text>
          </group>

          {/* Active Traveling Packet */}
          {packet && activePacketPos !== null && (
            <group position={[-4.5 + activePacketPos * 9, 0.8, 0.5]}>
              <mesh>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
              </mesh>

              <Text position={[0, 0.8, 0]} fontSize={0.32} color="#fef08a">
                {packet.type} (seq:{packet.seq})
              </Text>
            </group>
          )}

          <OrbitControls minDistance={4} maxDistance={20} />
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
