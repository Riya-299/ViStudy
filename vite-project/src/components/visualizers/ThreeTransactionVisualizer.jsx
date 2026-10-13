import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

const ACID_COLORS = {
  ok:       "#22c55e",
  active:   "#3b82f6",
  checking: "#f59e0b",
  pending:  "#475569",
  violated: "#ef4444",
  failed:   "#ef4444",
  released: "#6b7280",
  "n/a":    "#374151",
};

const PHASE_BG = {
  INIT:     "#0f172a",
  BEGIN:    "#0c1a40",
  READ_A:   "#0c2040",
  WRITE_A:  "#1a1000",
  READ_B:   "#0c2040",
  WRITE_B:  "#001a10",
  COMMIT:   "#002210",
  ROLLBACK: "#1a0000",
  ERROR:    "#1a0000",
};

function AccountBox({ label, balance, x, isActive, color }) {
  return (
    <group position={[x, 0.5, 0]}>
      <mesh>
        <boxGeometry args={[2.8, 1.8, 0.4]} />
        <meshStandardMaterial color={isActive ? color : "#1e293b"} />
      </mesh>
      <Text position={[0, 0.52, 0.22]} fontSize={0.22} color="#94a3b8" anchorX="center">
        {label}
      </Text>
      <Text position={[0, 0.1, 0.22]} fontSize={0.32} color="#ffffff" anchorX="center" fontWeight="bold">
        ${balance}
      </Text>
      <Text position={[0, -0.35, 0.22]} fontSize={0.17} color={isActive ? "#fbbf24" : "#475569"} anchorX="center">
        {isActive ? "← ACTIVE" : ""}
      </Text>
    </group>
  );
}

function TxLogEntry({ text, y, color }) {
  return (
    <group position={[0, y, 0]}>
      <mesh>
        <boxGeometry args={[7.5, 0.35, 0.12]} />
        <meshStandardMaterial color="#0f1a2e" />
      </mesh>
      <Text position={[0, 0, 0.08]} fontSize={0.155} color={color} anchorX="center">
        {text}
      </Text>
    </group>
  );
}

function AcidBadge({ label, status, x }) {
  const color = ACID_COLORS[status] || "#475569";
  return (
    <group position={[x, 0, 0]}>
      <mesh>
        <boxGeometry args={[2.2, 0.55, 0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text position={[0, 0.12, 0.12]} fontSize={0.17} color="#ffffff" anchorX="center" fontWeight="bold">
        {label}
      </Text>
      <Text position={[0, -0.12, 0.12]} fontSize={0.14} color="#ffffff" anchorX="center">
        {status.toUpperCase()}
      </Text>
    </group>
  );
}

export default function ThreeTransactionVisualizer({
  phase,
  balanceA = 1000,
  balanceB = 500,
  txLog = [],
  activeOp,
  committed = false,
  rolledBack = false,
  acid = {},
  stepLog,
  currentStep,
  totalSteps,
}) {
  const bg = PHASE_BG[phase] || "#0c1520";
  const isWriteA = activeOp === "WRITE_A" || activeOp === "READ_A";
  const isWriteB = activeOp === "WRITE_B" || activeOp === "READ_B";

  const statusColor = committed ? "#22c55e" : rolledBack ? "#ef4444" : "#3b82f6";
  const statusLabel = committed ? "COMMITTED ✓" : rolledBack ? "ROLLED BACK ✗" : phase || "IN PROGRESS";

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Canvas camera={{ position: [0, 0, 14], fov: 48 }} style={{ background: bg, transition: "background 0.5s" }}>
          <ambientLight intensity={0.85} />
          <directionalLight position={[5, 8, 5]} intensity={1} />

          {/* Title */}
          <Text position={[0, 4.5, 0]} fontSize={0.38} color="#60a5fa" anchorX="center">
            Transaction T1 — Bank Transfer ($200)
          </Text>

          {/* Status */}
          <Text position={[0, 3.8, 0]} fontSize={0.28} color={statusColor} anchorX="center">
            {statusLabel}
          </Text>

          {/* Account boxes */}
          <AccountBox label="Account A" balance={balanceA} x={-4} isActive={isWriteA} color="#1d4ed8" />
          <AccountBox label="Account B" balance={balanceB} x={4}  isActive={isWriteB} color="#15803d" />

          {/* Transfer arrow */}
          {activeOp === "WRITE_B" && (
            <>
              <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
                <boxGeometry args={[4, 0.12, 0.08]} />
                <meshStandardMaterial color="#f59e0b" />
              </mesh>
              <Text position={[0, 0.85, 0]} fontSize={0.22} color="#fbbf24" anchorX="center">
                $200 →
              </Text>
            </>
          )}

          {/* Transaction Log */}
          <Text position={[0, -1.1, 0]} fontSize={0.22} color="#94a3b8" anchorX="center">
            Transaction Log
          </Text>
          {txLog.slice(-5).map((entry, i, arr) => {
            const isLast = i === arr.length - 1;
            const entryColor = entry.includes("COMMIT") ? "#22c55e"
              : entry.includes("ROLLBACK") ? "#ef4444"
              : entry.includes("ERROR") ? "#ef4444"
              : isLast ? "#fbbf24" : "#64748b";
            return (
              <TxLogEntry
                key={i}
                text={entry}
                y={-1.6 - i * 0.45}
                color={entryColor}
              />
            );
          })}

          {/* ACID badges */}
          <Text position={[0, -4.2, 0]} fontSize={0.22} color="#94a3b8" anchorX="center">
            ACID Properties
          </Text>
          <AcidBadge label="Atomicity"   status={acid.atomicity   || "pending"} x={-4.9} />
          <AcidBadge label="Consistency" status={acid.consistency || "pending"} x={-1.6} />
          <AcidBadge label="Isolation"   status={acid.isolation   || "pending"} x={1.6}  />
          <AcidBadge label="Durability"  status={acid.durability  || "pending"} x={4.9}  />

          <OrbitControls minDistance={5} maxDistance={28} />
        </Canvas>
      </div>

      <div style={{ padding: "9px 16px", background: "rgba(6,12,20,0.97)", borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
        <span style={{ fontSize: "13px", color: statusColor, fontFamily: "'Patrick Hand', cursive" }}>
          Step {currentStep + 1}/{totalSteps} │ {stepLog}
        </span>
      </div>
    </div>
  );
}
