import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

export default function ThreeSqlJoinVisualizer({
  joinType = "INNER",
  tableA = [],
  tableB = [],
  activeRowA,
  activeRowB,
  isMatch,
  resultTable = [],
  stepLog,
  currentStep,
  totalSteps,
}) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Canvas camera={{ position: [0, 3, 12], fov: 45 }} style={{ background: "#0c1520" }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 8, 5]} intensity={0.9} />

          {/* Table A (Users) */}
          <group position={[-4, 1.2, 0]}>
            <Text position={[0, 1.4, 0]} fontSize={0.34} color="#93c5fd" anchorX="center">
              Table A (Users)
            </Text>
            {tableA.map((row, idx) => {
              const isActive = activeRowA === row.id;
              return (
                <group key={row.id} position={[0, -idx * 0.7, 0]}>
                  <mesh>
                    <boxGeometry args={[3.2, 0.55, 0.4]} />
                    <meshStandardMaterial color={isActive ? "#0284c7" : "#1e293b"} />
                  </mesh>
                  <Text position={[0, 0, 0.25]} fontSize={0.24} color="#ffffff">
                    id: {row.id} │ {row.name}
                  </Text>
                </group>
              );
            })}
          </group>

          {/* Table B (Orders) */}
          <group position={[4, 1.2, 0]}>
            <Text position={[0, 1.4, 0]} fontSize={0.34} color="#c4b5fd" anchorX="center">
              Table B (Orders)
            </Text>
            {tableB.map((row, idx) => {
              const isActive = activeRowB === row.orderId;
              return (
                <group key={row.orderId} position={[0, -idx * 0.7, 0]}>
                  <mesh>
                    <boxGeometry args={[3.6, 0.55, 0.4]} />
                    <meshStandardMaterial color={isActive ? "#a855f7" : "#1e293b"} />
                  </mesh>
                  <Text position={[0, 0, 0.25]} fontSize={0.24} color="#ffffff">
                    order: {row.orderId} │ user: {row.userId} ({row.item})
                  </Text>
                </group>
              );
            })}
          </group>

          {/* Result Table */}
          <group position={[0, -2.0, 0]}>
            <Text position={[0, 0.6, 0]} fontSize={0.32} color="#6ee7b7" anchorX="center">
              SQL {joinType} JOIN Output ({resultTable.length} Records)
            </Text>
          </group>

          <OrbitControls minDistance={4} maxDistance={22} />
        </Canvas>
      </div>

      <div style={{ padding: "9px 16px", background: "rgba(6,12,20,0.95)", borderTop: "1px dashed rgba(255,255,255,0.08)" }}>
        <span style={{ fontSize: "13px", color: "#93c5fd", fontFamily: "'Patrick Hand', cursive" }}>
          Step {currentStep + 1}/{totalSteps} │ {stepLog}
        </span>
      </div>
    </div>
  );
}
