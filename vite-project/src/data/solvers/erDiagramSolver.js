// ER Diagram Step Solver for ViStudy

export function solveERDiagram(config = {}) {
  const steps = [];
  let stepCount = 0;

  const entities = [
    { id: "Student",    attrs: ["StudentID (PK)", "Name", "Email"],          type: "strong" },
    { id: "Course",     attrs: ["CourseID (PK)", "Title", "Credits"],        type: "strong" },
    { id: "Professor",  attrs: ["ProfID (PK)", "Name", "Department"],        type: "strong" },
    { id: "Department", attrs: ["DeptID (PK)", "DeptName", "Location"],      type: "strong" },
  ];

  const relationships = [
    { id: "Enrolls",  from: "Student",   to: "Course",     cardinality: "M:N", attrs: ["EnrollDate", "Grade"] },
    { id: "Teaches",  from: "Professor", to: "Course",     cardinality: "1:N", attrs: []                       },
    { id: "BelongsTo",from: "Professor", to: "Department", cardinality: "N:1", attrs: []                       },
    { id: "Offers",   from: "Department",to: "Course",     cardinality: "1:N", attrs: []                       },
  ];

  // Step 0 — Intro
  steps.push({
    stepIndex: stepCount++,
    phase: "INTRO",
    label: "Building ER Diagram",
    visibleEntities: [],
    visibleRelationships: [],
    highlightEntity: null,
    highlightRel: null,
    log: "START: Constructing Entity-Relationship diagram for a University DB schema.",
  });

  // Steps: reveal entities one by one
  entities.forEach((entity, i) => {
    steps.push({
      stepIndex: stepCount++,
      phase: "ENTITY",
      label: `Add Entity: ${entity.id}`,
      visibleEntities: entities.slice(0, i + 1).map(e => e.id),
      visibleRelationships: [],
      highlightEntity: entity.id,
      highlightRel: null,
      log: `Entity "${entity.id}" added. Attributes: ${entity.attrs.join(", ")}.`,
      entities,
      relationships,
    });
  });

  // Steps: reveal relationships one by one
  relationships.forEach((rel, i) => {
    steps.push({
      stepIndex: stepCount++,
      phase: "RELATIONSHIP",
      label: `Add Relationship: ${rel.id}`,
      visibleEntities: entities.map(e => e.id),
      visibleRelationships: relationships.slice(0, i + 1).map(r => r.id),
      highlightEntity: null,
      highlightRel: rel.id,
      log: `Relationship "${rel.id}": ${rel.from} → ${rel.to} (${rel.cardinality})${rel.attrs.length ? `. Rel. attrs: ${rel.attrs.join(", ")}` : ""}.`,
      entities,
      relationships,
    });
  });

  // Final step
  steps.push({
    stepIndex: stepCount++,
    phase: "COMPLETE",
    label: "ER Diagram Complete ✓",
    visibleEntities: entities.map(e => e.id),
    visibleRelationships: relationships.map(r => r.id),
    highlightEntity: null,
    highlightRel: null,
    log: `ER Diagram complete. ${entities.length} entities, ${relationships.length} relationships. Ready for relational schema mapping.`,
    entities,
    relationships,
  });

  return steps;
}
