import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

const OP_COLORS = {
  BASE:           "#475569",
  SELECTION:      "#0ea5e9",
  PROJECTION:     "#22c55e",
  SELECTION_PROJ: "#f59e0b",
  JOIN:           "#a855f7",
  RENAME:         "#ec4899",
  COMPLETE:       "#6ee7b7",
};

const OP_SYMBOLS = {
  SELECTION:      "σ",
  PROJECTION:     "π",
  SELECTION_PROJ: "σ + π",
  JOIN:           "⋈",
  RENAME:         "ρ",
};

function TableRows({ label, rows, cols, x, y, highlightCols = [], highlightRows = [], color = "#1e3a5f" }) {
  const colW = 1.55;
  const rowH = 0.4;
  const totalW = cols.length * colW;

  return (
    <group position={[x, y, 0]}>
      {/* Table header */}
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[totalW + 0.2, 0.38, 0.22]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text position={[0, 0.26, 0.13]} fontSize={0.18} color="#ffffff" anchorX="center" fontWeight="bold">
        {label}
      </Text>

      {/* Column headers */}
      {cols.map((col, ci) => {
        const isHL = highlightCols.includes(col);
        return (
          <group key={col} position={[(ci - (cols.length - 1) / 2) * colW, -0.06, 0]}>
            <mesh>
              <boxGeometry args={[colW - 0.08, 0.32, 0.18]} />
              <meshStandardMaterial color={isHL ? "#92400e" : "#0f2644"} />
            </mesh>
            <Text position={[0, 0, 0.11]} fontSize={0.13} color={isHL ? "#fcd34d" : "#93c5fd"} anchorX="center">
              {col}
            </Text>
          </group>
        );
      })}

      {/* Data rows */}
      {rows.slice(0, 5).map((row, ri) => {
        const isRowHL = highlightRows.includes(row.StudentID) || highlightRows.includes(row.Name);
        return cols.map((col, ci) => (
          <group key={`${ri}-${ci}`} position={[(ci - (cols.length - 1) / 2) * colW, -0.06 - (ri + 1) * rowH, 0]}>
            <mesh>
              <boxGeometry args={[colW - 0.08, rowH - 0.06, 0.12]} />
              <meshStandardMaterial color={isRowHL ? "#1e3a1e" : ri % 2 === 0 ? "#0d1f35" : "#081520"} />
            </mesh>
            <Text position={[0, 0, 0.08]} fontSize={0.12} color={isRowHL ? "#86efac" : "#e2e8f0"} anchorX="center" maxWidth={colW - 0.15}>
              {String(row[col] ?? "—")}
            </Text>
          </group>
        ));
      })}
    </group>
  );
}

function OpSymbol({ symbol, x, y, color }) {
  return (
    <group position={[x, y, 0]}>
      <mesh>
        <circleGeometry args={[0.55, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text position={[0, 0, 0.06]} fontSize={0.38} color="#ffffff" anchorX="center">
        {symbol}
      </Text>
    </group>
  );
}

export default function ThreeRelationalAlgebraVisualizer({
  phase,
  operation,
  expression,
  inputRelation = null,
  outputRelation = null,
  students = [],
  departments = [],
  highlightCols = [],
  highlightRows = [],
  stepLog,
  currentStep,
  totalSteps,
}) {
  const color = OP_COLORS[phase] || "#60a5fa";
  const symbol = OP_SYMBOLS[phase];

  const renderScene = () => {
    if (phase === "BASE") {
      return (
        <>
          <TableRows label="Students" rows={students} cols={["StudentID","Name","Age","DeptID"]} x={-4.5} y={2.5} color="#1e3a8a" />
          <TableRows label="Departments" rows={departments} cols={["DeptID","DeptName","HOD"]} x={4} y={2.5} color="#065f46" />
        </>
      );
    }
    if (phase === "SELECTION" || phase === "PROJECTION" || phase === "SELECTION_PROJ" || phase === "RENAME") {
      return (
        <>
          <TableRows label="INPUT: Students" rows={inputRelation || students} cols={["StudentID","Name","Age","DeptID"]} x={-4.5} y={2.5} color="#1e3a8a" highlightCols={highlightCols} highlightRows={highlightRows} />
          {symbol && <OpSymbol symbol={symbol} x={0} y={1.2} color={color} />}
          <Text position={[0, 2.5, 0]} fontSize={0.2} color={color} anchorX="center">
            {expression}
          </Text>
          <TableRows
            label={`OUTPUT (${outputRelation?.length || 0} tuples)`}
            rows={outputRelation || []}
            cols={phase === "PROJECTION" ? ["Name","Age"] : phase === "RENAME" ? ["StudentID","Name","Age","DeptID"] : ["Name","Age","DeptID"]}
            x={4.5} y={2.5}
            color={color === "#475569" ? "#1e3a8a" : color.replace("0e","12").replace("22","0a").replace("f5","b45").replace("a8","6b").replace("ec","8b")}
            highlightCols={[]}
          />
        </>
      );
    }
    if (phase === "JOIN") {
      return (
        <>
          <TableRows label="Students" rows={students} cols={["StudentID","Name","Age","DeptID"]} x={-5} y={3} color="#1e3a8a" highlightCols={["DeptID"]} />
          <TableRows label="Departments" rows={departments} cols={["DeptID","DeptName","HOD"]} x={1.5} y={3} color="#065f46" highlightCols={["DeptID"]} />
          {symbol && <OpSymbol symbol={symbol} x={-1.5} y={0.5} color={color} />}
          <TableRows
            label={`JOIN Result (${outputRelation?.length || 0} tuples)`}
            rows={outputRelation || []}
            cols={["StudentID","Name","Age","DeptName","HOD"]}
            x={0} y={-1.5}
            color="#5b21b6"
          />
        </>
      );
    }
    if (phase === "COMPLETE") {
      return (
        <>
          <Text position={[0, 1, 0]} fontSize={0.45} color="#6ee7b7" anchorX="center">σ  π  ⋈  ρ</Text>
          <Text position={[0, 0.2, 0]} fontSize={0.28} color="#94a3b8" anchorX="center">All Operators Demonstrated</Text>
          {[
            { sym:"σ", label:"Selection\nFilter rows", x:-4.5, c:"#0ea5e9" },
            { sym:"π", label:"Projection\nPick columns", x:-1.5, c:"#22c55e" },
            { sym:"⋈", label:"Natural Join\nMerge tables",   x:1.5,  c:"#a855f7" },
            { sym:"ρ", label:"Rename\nAlias relation", x:4.5,  c:"#ec4899" },
          ].map(({sym,label,x,c}) => (
            <group key={sym} position={[x, -1.5, 0]}>
              <mesh><circleGeometry args={[0.65, 32]} /><meshStandardMaterial color={c} /></mesh>
              <Text position={[0, 0, 0.07]} fontSize={0.42} color="#fff" anchorX="center">{sym}</Text>
              <Text position={[0, -1.05, 0]} fontSize={0.17} color={c} anchorX="center">{label}</Text>
            </group>
          ))}
        </>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Canvas camera={{ position: [0, 0, 16], fov: 52 }} style={{ background: "#060d1a" }}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[5, 8, 5]} intensity={1} />

          <Text position={[0, 5.2, 0]} fontSize={0.36} color={color} anchorX="center">
            {operation || "Relational Algebra"}
          </Text>

          {renderScene()}

          <OrbitControls minDistance={5} maxDistance={30} />
        </Canvas>
      </div>

      <div style={{ padding: "9px 16px", background: "rgba(6,12,20,0.97)", borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
        <span style={{ fontSize: "13px", color: color, fontFamily: "'Patrick Hand', cursive" }}>
          Step {currentStep + 1}/{totalSteps} │ {stepLog}
        </span>
      </div>
    </div>
  );
}
