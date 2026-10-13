import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

const ENTITY_POSITIONS = {
  Student:    [-5, 2, 0],
  Course:     [5, 2, 0],
  Professor:  [-5, -2.5, 0],
  Department: [5, -2.5, 0],
};

const REL_POSITIONS = {
  Enrolls:   [0, 2.5, 0],
  Teaches:   [0, 0.5, 0],
  BelongsTo: [-1.5, -2.5, 0],
  Offers:    [2.5, -1, 0],
};

const ENTITY_COLOR    = "#1e3a8a";
const ENTITY_HL_COLOR = "#0ea5e9";
const REL_COLOR       = "#7c3aed";
const REL_HL_COLOR    = "#a78bfa";

function lerp(a, b, t) { return a + (b - a) * t; }

function ConnectionLine({ from, to, visible, color = "#94a3b8" }) {
  if (!visible) return null;
  const mid = [(from[0]+to[0])/2, (from[1]+to[1])/2, (from[2]+to[2])/2];
  const dx = to[0] - from[0], dy = to[1] - from[1];
  const len = Math.sqrt(dx*dx + dy*dy);
  const angle = Math.atan2(dy, dx);

  return (
    <mesh position={mid} rotation={[0, 0, angle]}>
      <boxGeometry args={[len, 0.05, 0.05]} />
      <meshStandardMaterial color={color} opacity={0.7} transparent />
    </mesh>
  );
}

function EntityBox({ entityId, attrs, visible, highlighted, position }) {
  if (!visible) return null;
  const color = highlighted ? ENTITY_HL_COLOR : ENTITY_COLOR;
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[3.5, 0.6, 0.35]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text position={[0, 0, 0.2]} fontSize={0.25} color="#ffffff" anchorX="center" fontWeight="bold">
        {entityId}
      </Text>
      {attrs.map((attr, i) => (
        <group key={attr} position={[0, -0.5 - i * 0.38, 0]}>
          <mesh>
            <boxGeometry args={[3.2, 0.32, 0.2]} />
            <meshStandardMaterial color={attr.includes("PK") ? "#065f46" : "#0f172a"} />
          </mesh>
          <Text position={[0, 0, 0.12]} fontSize={0.155} color={attr.includes("PK") ? "#6ee7b7" : "#cbd5e1"} anchorX="center">
            {attr}
          </Text>
        </group>
      ))}
    </group>
  );
}

function RelDiamond({ relId, cardinality, visible, highlighted, position }) {
  if (!visible) return null;
  const color = highlighted ? REL_HL_COLOR : REL_COLOR;
  return (
    <group position={position} rotation={[0, 0, Math.PI / 4]}>
      <mesh>
        <boxGeometry args={[1.1, 1.1, 0.22]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <group rotation={[0, 0, -Math.PI / 4]}>
        <Text position={[0, 0.15, 0.14]} fontSize={0.18} color="#ffffff" anchorX="center">
          {relId}
        </Text>
        <Text position={[0, -0.15, 0.14]} fontSize={0.14} color="#e0d4ff" anchorX="center">
          {cardinality}
        </Text>
      </group>
    </group>
  );
}

const ENTITIES_DATA = [
  { id: "Student",    attrs: ["StudentID (PK)", "Name", "Email"] },
  { id: "Course",     attrs: ["CourseID (PK)", "Title", "Credits"] },
  { id: "Professor",  attrs: ["ProfID (PK)", "Name", "Department"] },
  { id: "Department", attrs: ["DeptID (PK)", "DeptName", "Location"] },
];

const RELS_DATA = [
  { id: "Enrolls",   from: "Student",    to: "Course",     cardinality: "M:N" },
  { id: "Teaches",   from: "Professor",  to: "Course",     cardinality: "1:N" },
  { id: "BelongsTo", from: "Professor",  to: "Department", cardinality: "N:1" },
  { id: "Offers",    from: "Department", to: "Course",     cardinality: "1:N" },
];

export default function ThreeERDiagramVisualizer({
  visibleEntities = [],
  visibleRelationships = [],
  highlightEntity = null,
  highlightRel = null,
  entities = ENTITIES_DATA,
  relationships = RELS_DATA,
  stepLog,
  currentStep,
  totalSteps,
}) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Canvas camera={{ position: [0, 0, 16], fov: 50 }} style={{ background: "#060d1a" }}>
          <ambientLight intensity={0.85} />
          <directionalLight position={[5, 8, 5]} intensity={1} />

          <Text position={[0, 4.5, 0]} fontSize={0.4} color="#818cf8" anchorX="center">
            ER Diagram — University Database
          </Text>

          {/* Entities */}
          {entities.map(e => (
            <EntityBox
              key={e.id}
              entityId={e.id}
              attrs={e.attrs}
              visible={visibleEntities.includes(e.id)}
              highlighted={highlightEntity === e.id}
              position={ENTITY_POSITIONS[e.id] || [0, 0, 0]}
            />
          ))}

          {/* Relationships (diamonds) */}
          {relationships.map(r => (
            <RelDiamond
              key={r.id}
              relId={r.id}
              cardinality={r.cardinality}
              visible={visibleRelationships.includes(r.id)}
              highlighted={highlightRel === r.id}
              position={REL_POSITIONS[r.id] || [0, 0, 0]}
            />
          ))}

          {/* Connection lines */}
          {relationships.map(r => visibleRelationships.includes(r.id) && (
            <React.Fragment key={r.id}>
              <ConnectionLine
                from={ENTITY_POSITIONS[r.from] || [0,0,0]}
                to={REL_POSITIONS[r.id] || [0,0,0]}
                visible
                color={highlightRel === r.id ? "#a78bfa" : "#334155"}
              />
              <ConnectionLine
                from={REL_POSITIONS[r.id] || [0,0,0]}
                to={ENTITY_POSITIONS[r.to] || [0,0,0]}
                visible
                color={highlightRel === r.id ? "#a78bfa" : "#334155"}
              />
            </React.Fragment>
          ))}

          <OrbitControls minDistance={5} maxDistance={30} />
        </Canvas>
      </div>

      <div style={{ padding: "9px 16px", background: "rgba(6,12,20,0.97)", borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
        <span style={{ fontSize: "13px", color: "#818cf8", fontFamily: "'Patrick Hand', cursive" }}>
          Step {currentStep + 1}/{totalSteps} │ {stepLog}
        </span>
      </div>
    </div>
  );
}
