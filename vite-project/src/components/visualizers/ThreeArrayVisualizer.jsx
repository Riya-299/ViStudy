import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

// ─── Chalk Color Palette: [solid fill, chalk accent] ───────────────────────
const CHALK_PALETTE = [
  ["#1a3d32", "#6ee7b7"], // teal
  ["#2e1a4a", "#c4b5fd"], // purple
  ["#152a4a", "#93c5fd"], // blue
  ["#3d3010", "#fef08a"], // yellow
  ["#3d1818", "#fca5a5"], // red
  ["#0e3030", "#67e8f9"], // cyan
  ["#33103a", "#f0abfc"], // violet
  ["#3a2508", "#fdba74"], // orange
];

// ─── Sub-Group Ground Slab Component ───────────────────────────────────────
function GroupGroundSlab({ centerX, width }) {
  const meshRef = useRef();

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, centerX, 0.2);
  });

  const edgesGeo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(width, 0.14, 3.6)),
    [width]
  );

  return (
    <group ref={meshRef} position={[centerX, -0.09, 0]}>
      <mesh>
        <boxGeometry args={[width, 0.14, 3.6]} />
        <meshStandardMaterial color="#0a110d" roughness={0.9} />
      </mesh>
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color="white" transparent opacity={0.12} />
      </lineSegments>
    </group>
  );
}

// ─── Single Bar Component ──────────────────────────────────────────────────
function ArrayBar({
  value,
  maxVal,
  targetIndex,
  totalItems,
  barSpacing,
  isCompared,
  isSwapped,
  isLifted,
  isDimmed,
  groupXOffset,
  colorId,
}) {
  const groupRef = useRef();
  const matRef = useRef();

  // Normalize bar height so large numbers (e.g., 100, 500) fit on canvas
  const barHeight = Math.max((Math.abs(value) / maxVal) * 4.0, 0.5);
  const barWidth = Math.min(0.75, barSpacing * 0.65);

  // Position logic: Floating key elevates high (+Y) and steps forward (+Z)
  const targetX = (targetIndex - (totalItems - 1) / 2) * barSpacing + groupXOffset;
  const targetY = isLifted ? barHeight / 2 + 1.6 : barHeight / 2;
  const targetZ = isLifted ? 0.8 : 0;

  // Scale pop when compared or lifted
  const targetScale = isLifted ? 1.15 : isCompared ? 1.1 : isDimmed ? 0.85 : 1.0;

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.2);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.2);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.2);

    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.2)
    );
  });

  const [fillColor, accentColor] = CHALK_PALETTE[colorId % CHALK_PALETTE.length];

  let resolvedFill = fillColor;
  let resolvedAccent = accentColor;
  let emissiveColor = "#000000";
  let emissiveIntensity = 0;

  if (isLifted) {
    resolvedFill = "#0284c7";
    resolvedAccent = "#38bdf8";
    emissiveColor = "#0284c7";
    emissiveIntensity = 0.95;
  } else if (isCompared) {
    if (isSwapped) {
      resolvedFill = "#a01040";
      resolvedAccent = "#ff6eb4";
      emissiveColor = "#a01040";
      emissiveIntensity = 0.8;
    } else {
      resolvedFill = "#906010";
      resolvedAccent = "#ffe040";
      emissiveColor = "#6b4800";
      emissiveIntensity = 0.7;
    }
  } else if (isDimmed) {
    resolvedFill = "#0f172a";
    resolvedAccent = "#334155";
    emissiveColor = "#000000";
    emissiveIntensity = 0;
  }

  const edgesGeo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(barWidth + 0.01, barHeight, barWidth + 0.01)),
    [barWidth, barHeight]
  );

  return (
    <group ref={groupRef} position={[targetX, targetY, targetZ]}>
      {/* Solid bar mesh */}
      <mesh>
        <boxGeometry args={[barWidth, barHeight, barWidth]} />
        <meshStandardMaterial
          ref={matRef}
          color={resolvedFill}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          transparent={isDimmed}
          opacity={isDimmed ? 0.35 : 1.0}
          roughness={0.75}
          metalness={0.06}
        />
      </mesh>

      {/* Clean 12-edge outline */}
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial
          color={resolvedAccent}
          transparent
          opacity={isDimmed ? 0.2 : isLifted || isCompared ? 1.0 : 0.55}
          linewidth={isLifted || isCompared ? 3 : 1}
        />
      </lineSegments>

      {/* Top cap glow plane */}
      <mesh position={[0, barHeight / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[barWidth, barWidth]} />
        <meshBasicMaterial
          color={resolvedAccent}
          transparent
          opacity={isDimmed ? 0.02 : isLifted ? 0.75 : isCompared ? 0.55 : 0.12}
          depthWrite={false}
        />
      </mesh>

      {/* Floating Key badge label */}
      {isLifted && (
        <Text
          position={[0, barHeight / 2 + 0.95, 0]}
          fontSize={0.34}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
          outlineColor="#000000"
          outlineWidth={0.04}
        >
          KEY
        </Text>
      )}

      {/* Value label displays actual original value */}
      <Text
        position={[0, barHeight / 2 + 0.45, 0]}
        fontSize={isLifted ? 0.42 : isCompared ? 0.4 : 0.34}
        color={isDimmed ? "#475569" : resolvedAccent}
        anchorX="center"
        anchorY="middle"
        outlineColor="#000000"
        outlineWidth={0.03}
      >
        {String(value)}
      </Text>
    </group>
  );
}

// ─── Main 3D Visualizer Canvas ──────────────────────────────────────────────
export default function ThreeArrayVisualizer({
  initialArray,
  arrayState,
  comparedIndices,
  isSwapped,
  stepLog,
  currentStep,
  totalSteps,
  liftedIndex,
  groups,
  activeRange,
}) {
  const totalItems = initialArray.length;
  const orbitRef = useRef();

  // Find max value for dynamic height normalization
  const maxVal = useMemo(() => {
    const vals = [...initialArray, ...arrayState].map((v) => Math.abs(Number(v) || 1));
    return Math.max(...vals, 1);
  }, [initialArray, arrayState]);

  // Compute dynamic bar spacing so any array size (3 to 12) fits on screen
  const barSpacing = useMemo(() => {
    return Math.min(1.2, 10.5 / Math.max(totalItems, 1));
  }, [totalItems]);

  const stableItems = useMemo(
    () => initialArray.map((value, id) => ({ id, value })),
    [initialArray]
  );

  const itemPlacements = useMemo(() => {
    const resolvedIndices = new Set();
    return stableItems.map((item) => {
      let idx = arrayState.findIndex(
        (val, i) => val === item.value && !resolvedIndices.has(i)
      );
      if (idx === -1) idx = 0;
      else resolvedIndices.add(idx);

      const isComp = comparedIndices.includes(idx);
      const isLift = liftedIndex === idx;
      const isDimmed = activeRange && activeRange.length > 0 && !activeRange.includes(idx);

      let groupXOffset = 0;
      if (groups && groups.length > 1) {
        const gIdx = groups.findIndex((g) => g.includes(idx));
        if (gIdx !== -1) {
          const numG = groups.length;
          const groupGap = 1.2;
          groupXOffset = (gIdx - (numG - 1) / 2) * groupGap;
        }
      }

      return {
        ...item,
        targetIndex: idx,
        isCompared: isComp,
        isSwapped: isComp && isSwapped,
        isLifted: isLift,
        isDimmed,
        groupXOffset,
      };
    });
  }, [stableItems, arrayState, comparedIndices, isSwapped, liftedIndex, groups, activeRange]);

  const groupSlabs = useMemo(() => {
    if (!groups || groups.length <= 1) return [];
    const numG = groups.length;
    const groupGap = 1.2;

    return groups.map((g, gIdx) => {
      const minIdx = Math.min(...g);
      const maxIdx = Math.max(...g);
      const count = g.length;

      const groupXOffset = (gIdx - (numG - 1) / 2) * groupGap;
      const startX = (minIdx - (totalItems - 1) / 2) * barSpacing + groupXOffset;
      const endX = (maxIdx - (totalItems - 1) / 2) * barSpacing + groupXOffset;

      const centerX = (startX + endX) / 2;
      const width = Math.max((count - 1) * barSpacing + 1.2, 1.2);

      return { id: `group-${gIdx}-${g.join("-")}`, centerX, width };
    });
  }, [groups, totalItems, barSpacing]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <Canvas
          camera={{ position: [0, 4.5, 12.5], fov: 44 }}
          style={{ background: "#0c1520", width: "100%", height: "100%" }}
          gl={{ antialias: true }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 9, 6]} intensity={0.9} castShadow />

          {/* Main Board Ground Platform */}
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[Math.max(totalItems * barSpacing + 2.5, 11), 0.1, 4]} />
            <meshStandardMaterial color="#080e18" roughness={0.95} />
          </mesh>

          {/* Sub-Group Ground Slabs */}
          {groupSlabs.map((slab) => (
            <GroupGroundSlab key={slab.id} centerX={slab.centerX} width={slab.width} />
          ))}

          {/* Render Individual Array Bars */}
          {itemPlacements.map((item) => (
            <ArrayBar
              key={item.id}
              value={item.value}
              maxVal={maxVal}
              targetIndex={item.targetIndex}
              totalItems={totalItems}
              barSpacing={barSpacing}
              isCompared={item.isCompared}
              isSwapped={item.isSwapped}
              isLifted={item.isLifted}
              isDimmed={item.isDimmed}
              groupXOffset={item.groupXOffset}
              colorId={item.id}
            />
          ))}

          <OrbitControls
            ref={orbitRef}
            enableZoom={true}
            minDistance={4}
            maxDistance={22}
            target={[0, 1.8, 0]}
          />
        </Canvas>
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
            color: "#fef08a",
            fontFamily: "'Patrick Hand', cursive",
            lineHeight: 1.4,
          }}
        >
          {stepLog || "Press Play to start step-by-step visual simulation."}
        </span>
      </div>
    </div>
  );
}
