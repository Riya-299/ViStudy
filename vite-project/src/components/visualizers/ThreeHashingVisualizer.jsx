import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

const BUCKET_W = 1.35;
const BUCKET_H = 0.52;
const BUCKET_GAP = 0.18;
const START_X_OFFSET = -4.5; // centering for 7 buckets

function BucketCell({ bucketIdx, keys, currentBucket, currentKey, isCollision }) {
  const x = START_X_OFFSET + bucketIdx * (BUCKET_W + BUCKET_GAP);
  const isActive = bucketIdx === currentBucket;

  return (
    <group position={[x, 0.5, 0]}>
      {/* Bucket index label */}
      <Text position={[0, 1.05, 0]} fontSize={0.2} color="#94a3b8" anchorX="center">
        [{bucketIdx}]
      </Text>

      {/* Bucket box */}
      <mesh>
        <boxGeometry args={[BUCKET_W, BUCKET_H, 0.28]} />
        <meshStandardMaterial
          color={isActive && isCollision ? "#92400e" : isActive ? "#1d4ed8" : keys.length > 1 ? "#4c1d95" : "#1e293b"}
        />
      </mesh>

      {/* Bucket outline (empty indicator) */}
      {keys.length === 0 && (
        <Text position={[0, 0, 0.16]} fontSize={0.2} color="#475569" anchorX="center">
          —
        </Text>
      )}

      {/* Chained keys (linked list vertically) */}
      {keys.map((k, i) => {
        const isCurrentKey = k === currentKey && isActive;
        return (
          <group key={i} position={[0, -BUCKET_H * (i + 0.5), 0]}>
            {/* Chain arrow */}
            {i > 0 && (
              <Text position={[0, BUCKET_H * 0.55, 0.16]} fontSize={0.18} color="#7c3aed" anchorX="center">
                ↓
              </Text>
            )}
            <mesh>
              <boxGeometry args={[BUCKET_W, BUCKET_H, 0.28]} />
              <meshStandardMaterial color={isCurrentKey ? "#1d4ed8" : i === 0 ? "#1e3a5f" : "#1e293b"} />
            </mesh>
            <Text position={[0, 0, 0.16]} fontSize={0.22} color={isCurrentKey ? "#fbbf24" : "#e2e8f0"} anchorX="center" fontWeight="bold">
              {k}
            </Text>
          </group>
        );
      })}

      {/* NULL tail pointer */}
      {keys.length > 0 && (
        <Text position={[0, -BUCKET_H * (keys.length + 0.5) + 0.08, 0.16]} fontSize={0.16} color="#475569" anchorX="center">
          ↓ null
        </Text>
      )}
    </group>
  );
}

export default function ThreeHashingVisualizer({
  phase,
  hashTable = [],
  currentKey = null,
  currentBucket = null,
  isCollision = false,
  hashFunction = "h(k) = k mod 7",
  stepLog,
  currentStep,
  totalSteps,
}) {
  const phaseColor = phase === "COLLISION" ? "#f97316"
    : phase === "SEARCH" ? "#22c55e"
    : phase === "COMPLETE" ? "#6ee7b7"
    : phase === "HASH" ? "#60a5fa"
    : "#94a3b8";

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Canvas camera={{ position: [0, -1, 14], fov: 52 }} style={{ background: "#060d1a" }}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[5, 8, 5]} intensity={1} />

          {/* Title */}
          <Text position={[0, 5.2, 0]} fontSize={0.36} color="#60a5fa" anchorX="center">
            Hash Table — Chaining (Separate Chaining)
          </Text>

          {/* Hash function display */}
          <Text position={[0, 4.5, 0]} fontSize={0.25} color={phaseColor} anchorX="center">
            {hashFunction}
          </Text>

          {/* Current key being inserted */}
          {currentKey !== null && (
            <group position={[0, 3.7, 0]}>
              <mesh>
                <boxGeometry args={[2.8, 0.5, 0.2]} />
                <meshStandardMaterial color={isCollision ? "#7c2d12" : "#1e3a8a"} />
              </mesh>
              <Text position={[0, 0, 0.12]} fontSize={0.22} color={isCollision ? "#fca5a5" : "#93c5fd"} anchorX="center">
                {phase === "SEARCH" ? `SEARCH(${currentKey})` : `INSERT key: ${currentKey}`}
              </Text>
            </group>
          )}

          {/* Collision warning */}
          {isCollision && phase === "COLLISION" && (
            <Text position={[0, 3.0, 0]} fontSize={0.28} color="#ef4444" anchorX="center">
              ⚠ COLLISION — Chaining!
            </Text>
          )}

          {/* Hash table buckets */}
          {hashTable.map((keys, idx) => (
            <BucketCell
              key={idx}
              bucketIdx={idx}
              keys={keys}
              currentBucket={currentBucket}
              currentKey={currentKey}
              isCollision={isCollision}
            />
          ))}

          {/* Load factor / stats (on complete) */}
          {phase === "COMPLETE" && (
            <Text position={[0, -4.2, 0]} fontSize={0.22} color="#6ee7b7" anchorX="center">
              Load factor α = {(hashTable.flat().length / hashTable.length).toFixed(2)} │ Avg lookup: O(1 + α)
            </Text>
          )}

          <OrbitControls minDistance={5} maxDistance={28} />
        </Canvas>
      </div>

      <div style={{ padding: "9px 16px", background: "rgba(6,12,20,0.97)", borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
        <span style={{ fontSize: "13px", color: phaseColor, fontFamily: "'Patrick Hand', cursive" }}>
          Step {currentStep + 1}/{totalSteps} │ {stepLog}
        </span>
      </div>
    </div>
  );
}
