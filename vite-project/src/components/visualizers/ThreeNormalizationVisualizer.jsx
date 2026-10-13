import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

const PHASE_COLORS = {
  UNF:         "#ef4444",
  "1NF_EXPLAIN":"#f97316",
  "1NF":       "#22c55e",
  "2NF_EXPLAIN":"#f97316",
  "2NF":       "#3b82f6",
  "3NF_EXPLAIN":"#f97316",
  "3NF":       "#a855f7",
};

function TableBox({ label, rows, cols, x, y, color = "#1e3a5f", highlight = [] }) {
  const rowH = 0.48;
  const colW = 1.7;
  const numCols = cols.length;
  const totalW = colW * numCols;

  return (
    <group position={[x, y, 0]}>
      {/* Header */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[totalW + 0.3, 0.42, 0.25]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text position={[0, 0.28, 0.14]} fontSize={0.2} color="#ffffff" anchorX="center">
        {label}
      </Text>

      {/* Column headers */}
      {cols.map((col, ci) => {
        const isHL = highlight.includes(col);
        return (
          <group key={col} position={[(ci - (numCols - 1) / 2) * colW, -0.08, 0]}>
            <mesh>
              <boxGeometry args={[colW - 0.1, 0.36, 0.2]} />
              <meshStandardMaterial color={isHL ? "#f59e0b" : "#0f2644"} />
            </mesh>
            <Text position={[0, 0, 0.12]} fontSize={0.15} color={isHL ? "#000" : "#93c5fd"} anchorX="center">
              {col}
            </Text>
          </group>
        );
      })}

      {/* Data rows */}
      {rows.slice(0, 4).map((row, ri) => (
        cols.map((col, ci) => (
          <group key={`${ri}-${ci}`} position={[(ci - (numCols - 1) / 2) * colW, -0.08 - (ri + 1) * rowH, 0]}>
            <mesh>
              <boxGeometry args={[colW - 0.1, rowH - 0.06, 0.15]} />
              <meshStandardMaterial color={ri % 2 === 0 ? "#0d1f35" : "#0a192d"} />
            </mesh>
            <Text position={[0, 0, 0.09]} fontSize={0.13} color="#e2e8f0" anchorX="center" maxWidth={colW - 0.2}>
              {String(row[col] ?? "—")}
            </Text>
          </group>
        ))
      ))}
    </group>
  );
}

export default function ThreeNormalizationVisualizer({
  phase,
  tables = {},
  activeTable,
  highlight = [],
  stepLog,
  currentStep,
  totalSteps,
}) {
  const phaseColor = PHASE_COLORS[phase] || "#60a5fa";

  const renderTables = () => {
    if (phase === "UNF" || phase === "1NF_EXPLAIN") {
      const data = tables.unnormalized || [];
      return <TableBox label="Unnormalized Table" rows={data} cols={["StudentID","Name","Courses","TeacherID","Dept"]} x={0} y={1.5} color="#7f1d1d" highlight={highlight} />;
    }
    if (phase === "1NF") {
      const data = tables.firstNF || [];
      return <TableBox label="1NF Table (PK: StudentID + Course)" rows={data} cols={["StudentID","Name","Course","TeacherID","Dept"]} x={0} y={1.5} color="#14532d" highlight={highlight} />;
    }
    if (phase === "2NF_EXPLAIN") {
      const data = tables.firstNF || [];
      return <TableBox label="1NF Table — Partial Dependency!" rows={data} cols={["StudentID","Name","Course","TeacherID","Dept"]} x={0} y={1.5} color="#7c2d12" highlight={highlight} />;
    }
    if (phase === "2NF") {
      return (
        <>
          <TableBox label="Students (2NF)" rows={tables.studentsTable||[]} cols={["StudentID","Name"]} x={-4} y={1.5} color="#1e3a8a" highlight={[]} />
          <TableBox label="Enrollments (2NF)" rows={tables.enrollmentsTable||[]} cols={["StudentID","Course","TeacherID","Dept"]} x={3} y={1.5} color="#1e3a8a" highlight={[]} />
        </>
      );
    }
    if (phase === "3NF_EXPLAIN") {
      return (
        <>
          <TableBox label="Students" rows={tables.studentsTable||[]} cols={["StudentID","Name"]} x={-4.5} y={1.5} color="#1e3a8a" highlight={[]} />
          <TableBox label="Enrollments — Transitive Dep!" rows={tables.enrollmentsTable||[]} cols={["StudentID","Course","TeacherID","TeacherName","Dept"]} x={2.5} y={1.5} color="#7c2d12" highlight={highlight} />
        </>
      );
    }
    if (phase === "3NF") {
      return (
        <>
          <TableBox label="Students" rows={tables.studentsTable||[]} cols={["StudentID","Name"]} x={-5} y={1.5} color="#7e22ce" highlight={[]} />
          <TableBox label="Enrollments" rows={tables.enrollments3NF||[]} cols={["StudentID","Course","TeacherID"]} x={0} y={1.5} color="#7e22ce" highlight={[]} />
          <TableBox label="Teachers" rows={tables.teachersTable||[]} cols={["TeacherID","TeacherName","Dept"]} x={5} y={1.5} color="#7e22ce" highlight={[]} />
        </>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Canvas camera={{ position: [0, 0, 14], fov: 50 }} style={{ background: "#060d1a" }}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[5, 8, 5]} intensity={1} />

          {/* Phase label */}
          <Text position={[0, 4.2, 0]} fontSize={0.38} color={phaseColor} anchorX="center" fontStyle="italic">
            {phase?.replace(/_/g, " ")}
          </Text>

          {renderTables()}

          <OrbitControls minDistance={4} maxDistance={28} />
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
