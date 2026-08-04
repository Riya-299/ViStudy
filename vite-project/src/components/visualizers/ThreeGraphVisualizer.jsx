import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

// ─── 3D Graph Node ─────────────────────────────────────────────────────────
function GraphNode({ node }) {
  const groupRef = useRef();

  const targetX = node.position[0];
  const targetY = node.isActive ? node.position[1] + 1.2 : node.position[1];
  const targetZ = node.isActive ? 0.6 : node.position[2];

  const targetScale = node.isActive ? 1.25 : 1.0;

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.2);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.2);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.2);

    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.2)
    );
  });

  // Resolve color state
  let nodeColor = "#1e293b"; // Slate
  let nodeAccent = "#94a3b8";
  let emissiveColor = "#000000";
  let emissiveIntensity = 0;

  if (node.isActive) {
    nodeColor = "#0284c7"; // Cyan
    nodeAccent = "#38bdf8";
    emissiveColor = "#0284c7";
    emissiveIntensity = 0.9;
  } else if (node.isVisited) {
    nodeColor = "#059669"; // Emerald
    nodeAccent = "#34d399";
    emissiveColor = "#059669";
    emissiveIntensity = 0.6;
  }

  const distText = node.dist === Infinity ? "∞" : String(node.dist);

  return (
    <group ref={groupRef} position={[targetX, targetY, targetZ]}>
      {/* 3D Sphere Node */}
      <mesh>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Outer Wireframe Ring */}
      <mesh>
        <sphereGeometry args={[0.67, 16, 16]} />
        <meshBasicMaterial color={nodeAccent} wireframe transparent opacity={0.6} />
      </mesh>

      {/* Node ID label inside sphere */}
      <Text
        position={[0, 0, 0.7]}
        fontSize={0.42}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineColor="#000000"
        outlineWidth={0.04}
      >
        {node.label}
      </Text>

      {/* Distance text badge above sphere */}
      <Text
        position={[0, 0.95, 0]}
        fontSize={0.34}
        color={node.isActive ? "#38bdf8" : node.isVisited ? "#34d399" : "#e2e8f0"}
        anchorX="center"
        anchorY="middle"
        outlineColor="#000000"
        outlineWidth={0.04}
      >
        {`d = ${distText}`}
      </Text>
    </group>
  );
}

// ─── 3D Graph Edge Line & Weight Label ─────────────────────────────────────
function GraphEdge({ edge, nodes }) {
  const nodeU = nodes.find((n) => n.id === edge.u);
  const nodeV = nodes.find((n) => n.id === edge.v);

  if (!nodeU || !nodeV) return null;

  const posU = new THREE.Vector3(...nodeU.position);
  const posV = new THREE.Vector3(...nodeV.position);

  // If nodeU or nodeV is active, adjust connection endpoint to match floating height
  if (nodeU.isActive) posU.y += 1.2, posU.z += 0.6;
  if (nodeV.isActive) posV.y += 1.2, posV.z += 0.6;

  const midPos = new THREE.Vector3().addVectors(posU, posV).multiplyScalar(0.5);

  const direction = new THREE.Vector3().subVectors(posV, posU);
  const distance = direction.length();

  // Edge line orientation mesh
  const orientation = new THREE.Matrix4();
  const up = new THREE.Vector3(0, 1, 0);
  orientation.lookAt(posU, posV, up);

  let edgeColor = "rgba(255,255,255,0.25)";
  let edgeWidth = 0.04;

  if (edge.isShortestPath) {
    edgeColor = "#34d399"; // Emerald green
    edgeWidth = 0.09;
  } else if (edge.isRelaxing) {
    edgeColor = "#ff6eb4"; // Hot pink
    edgeWidth = 0.1;
  }

  // Draw 3D Tube Cylinder between node u and v
  const points = [posU, posV];
  const curve = useMemo(() => new THREE.LineCurve3(posU, posV), [posU.x, posU.y, posU.z, posV.x, posV.y, posV.z]);

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 1, edgeWidth, 8, false]} />
        <meshBasicMaterial color={edgeColor} transparent opacity={edge.isRelaxing || edge.isShortestPath ? 0.95 : 0.4} />
      </mesh>

      {/* Edge weight label at midpoint */}
      <Text
        position={[midPos.x, midPos.y + 0.35, midPos.z]}
        fontSize={0.32}
        color={edge.isRelaxing ? "#ff6eb4" : edge.isShortestPath ? "#34d399" : "#fef08a"}
        anchorX="center"
        anchorY="middle"
        outlineColor="#000000"
        outlineWidth={0.04}
      >
        {`w = ${edge.weight}`}
      </Text>
    </group>
  );
}

// ─── Main 3D Graph Visualizer Canvas ────────────────────────────────────────
export default function ThreeGraphVisualizer({
  nodes,
  edges,
  stepLog,
  currentStep,
  totalSteps,
}) {
  const orbitRef = useRef();

  const zoomIn = () => {
    if (orbitRef.current) {
      orbitRef.current.dollyOut(1.3);
      orbitRef.current.update();
    }
  };
  const zoomOut = () => {
    if (orbitRef.current) {
      orbitRef.current.dollyIn(1.3);
      orbitRef.current.update();
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <Canvas
          camera={{ position: [0, 2, 16], fov: 46 }}
          style={{ background: "#0b131e", width: "100%", height: "100%" }}
          gl={{ antialias: true }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 10, 7]} intensity={0.9} castShadow />
          <pointLight position={[-5, -5, -2]} intensity={0.3} />

          {/* Graph Edges */}
          {edges.map((edge) => (
            <GraphEdge key={edge.id} edge={edge} nodes={nodes} />
          ))}

          {/* Graph Nodes */}
          {nodes.map((node) => (
            <GraphNode key={node.id} node={node} />
          ))}

          <OrbitControls
            ref={orbitRef}
            enableZoom={true}
            minDistance={4}
            maxDistance={25}
            maxPolarAngle={Math.PI / 2.05}
            target={[0, 0.8, 0]}
          />
        </Canvas>

        {/* Zoom Controls */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            zIndex: 10,
          }}
        >
          {[
            { label: "+", fn: zoomIn, title: "Zoom In" },
            { label: "−", fn: zoomOut, title: "Zoom Out" },
          ].map(({ label, fn, title }) => (
            <button
              key={label}
              onClick={fn}
              title={title}
              style={{
                width: "30px",
                height: "30px",
                background: "rgba(8,16,24,0.85)",
                border: "1px dashed rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.7)",
                borderRadius: "6px",
                fontSize: "17px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
                fontFamily: "monospace",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#38bdf8";
                e.currentTarget.style.color = "#38bdf8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Step description banner */}
      <div
        style={{
          padding: "9px 16px",
          background: "rgba(6,12,20,0.95)",
          borderTop: "1px dashed rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontFamily: "monospace",
            color: "rgba(255,255,255,0.3)",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Step {currentStep + 1}/{totalSteps}
        </span>
        <span style={{ color: "rgba(255,255,255,0.1)", flexShrink: 0 }}>│</span>
        <span
          style={{
            fontSize: "13px",
            color: "#38bdf8",
            fontFamily: "'Patrick Hand', cursive",
            lineHeight: 1.4,
          }}
        >
          {stepLog || "Press Play to start Dijkstra visualization."}
        </span>
      </div>
    </div>
  );
}
