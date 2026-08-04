import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

// ─── 3D BST Node ────────────────────────────────────────────────────────────
function TreeNode({ node }) {
  const groupRef = useRef();

  const targetX = node.position[0];
  const targetY = node.position[1];
  const targetZ = node.isNewlyInserted ? 0.6 : node.position[2];

  const targetScale = node.isNewlyInserted ? 1.25 : node.isComparing ? 1.18 : 1.0;

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.2);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.2);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.2);

    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.2)
    );
  });

  let nodeColor = "#152a4a"; // Slate Blue
  let nodeAccent = "#93c5fd";
  let emissiveColor = "#000000";
  let emissiveIntensity = 0;

  if (node.isNewlyInserted) {
    nodeColor = "#0284c7"; // Electric Cyan
    nodeAccent = "#38bdf8";
    emissiveColor = "#0284c7";
    emissiveIntensity = 0.9;
  } else if (node.isComparing) {
    nodeColor = "#906010"; // Amber
    nodeAccent = "#ffe040";
    emissiveColor = "#6b4800";
    emissiveIntensity = 0.8;
  }

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

      {/* Wireframe Outline */}
      <mesh>
        <sphereGeometry args={[0.67, 16, 16]} />
        <meshBasicMaterial color={nodeAccent} wireframe transparent opacity={0.6} />
      </mesh>

      {/* Node Value Label */}
      <Text
        position={[0, 0, 0.7]}
        fontSize={0.45}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineColor="#000000"
        outlineWidth={0.04}
      >
        {String(node.val)}
      </Text>

      {/* State badge label above node */}
      {(node.isNewlyInserted || node.isComparing) && (
        <Text
          position={[0, 0.95, 0]}
          fontSize={0.32}
          color={node.isNewlyInserted ? "#38bdf8" : "#ffe040"}
          anchorX="center"
          anchorY="middle"
          outlineColor="#000000"
          outlineWidth={0.04}
        >
          {node.isNewlyInserted ? "NEW NODE" : "COMPARE"}
        </Text>
      )}
    </group>
  );
}

// ─── 3D Side Staging Sphere for Incoming Value ─────────────────────────────
function IncomingSideNode({ val }) {
  const groupRef = useRef();

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.y = 4.2 + Math.sin(Date.now() * 0.004) * 0.15;
  });

  if (val === null || val === undefined) return null;

  return (
    <group ref={groupRef} position={[-6.2, 4.2, 0.8]}>
      <mesh>
        <sphereGeometry args={[0.72, 32, 32]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#0284c7"
          emissiveIntensity={0.95}
          roughness={0.3}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.76, 16, 16]} />
        <meshBasicMaterial color="#38bdf8" wireframe />
      </mesh>

      <Text
        position={[0, 0, 0.78]}
        fontSize={0.48}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineColor="#000000"
        outlineWidth={0.04}
      >
        {String(val)}
      </Text>

      <Text
        position={[0, 1.1, 0]}
        fontSize={0.32}
        color="#38bdf8"
        anchorX="center"
        anchorY="middle"
        outlineColor="#000000"
        outlineWidth={0.04}
      >
        INCOMING
      </Text>
    </group>
  );
}

// ─── 3D Branch Line ────────────────────────────────────────────────────────
function TreeEdge({ edge, nodes }) {
  const nodeU = nodes.find((n) => n.id === edge.u);
  const nodeV = nodes.find((n) => n.id === edge.v);

  if (!nodeU || !nodeV) return null;

  const posU = new THREE.Vector3(...nodeU.position);
  const posV = new THREE.Vector3(...nodeV.position);

  const curve = useMemo(
    () => new THREE.LineCurve3(posU, posV),
    [posU.x, posU.y, posU.z, posV.x, posV.y, posV.z]
  );

  return (
    <mesh>
      <tubeGeometry args={[curve, 1, 0.05, 8, false]} />
      <meshBasicMaterial color="rgba(147, 197, 253, 0.45)" transparent opacity={0.6} />
    </mesh>
  );
}

// ─── Main 3D Tree Visualizer Canvas ─────────────────────────────────────────
export default function ThreeTreeVisualizer({
  treeNodes = [],
  treeEdges = [],
  incomingVal = null,
  remainingValues = [],
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

          {/* Incoming Side Floating Node */}
          <IncomingSideNode val={incomingVal} />

          {/* Tree Edges */}
          {treeEdges.map((edge) => (
            <TreeEdge key={edge.id} edge={edge} nodes={treeNodes} />
          ))}

          {/* Tree Nodes */}
          {treeNodes.map((node) => (
            <TreeNode key={node.id} node={node} />
          ))}

          <OrbitControls
            ref={orbitRef}
            enableZoom={true}
            minDistance={4}
            maxDistance={26}
            maxPolarAngle={Math.PI / 2.05}
            target={[0, 1.5, 0]}
          />
        </Canvas>

        {/* Queue side badge indicator overlay */}
        {incomingVal !== null && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              background: "rgba(2, 132, 199, 0.25)",
              border: "1px dashed #38bdf8",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              color: "#38bdf8",
              fontFamily: "monospace",
            }}
          >
            Staged at side: <strong>{incomingVal}</strong>
          </div>
        )}

        {/* Zoom controls */}
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
                e.currentTarget.style.borderColor = "#93c5fd";
                e.currentTarget.style.color = "#93c5fd";
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
            color: "#93c5fd",
            fontFamily: "'Patrick Hand', cursive",
            lineHeight: 1.4,
          }}
        >
          {stepLog || "Press Play to start BST visualization."}
        </span>
      </div>
    </div>
  );
}
