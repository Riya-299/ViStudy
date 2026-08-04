import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

export default function ThreeGradientDescentVisualizer({
  alpha = 0.25,
  currentX = 0,
  currentLoss = 0,
  gradient = 0,
  surfacePoints = [],
  stepLog,
  currentStep,
  totalSteps,
}) {
  const pointY = 0.3 * currentX * currentX - 1.5;
  const pointX = currentX;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Canvas camera={{ position: [0, 2, 11], fov: 45 }} style={{ background: "#0c1520" }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 8, 5]} intensity={0.9} />

          <Text position={[0, 3.5, 0]} fontSize={0.38} color="#fef08a" anchorX="center">
            LOSS SURFACE OPTIMIZATION (α = {alpha})
          </Text>

          {/* Parabola Surface Curve Points */}
          {surfacePoints.map((pt, idx) => (
            <mesh key={idx} position={[pt.x, pt.y - 1.5, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          ))}

          {/* Current Weight Point on Curve */}
          <group position={[pointX, pointY, 0.2]}>
            <mesh>
              <sphereGeometry args={[0.35, 32, 32]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
            </mesh>
            <Text position={[0, 0.6, 0]} fontSize={0.3} color="#fca5a5">
              x = {currentX.toFixed(2)}
            </Text>
          </group>

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
