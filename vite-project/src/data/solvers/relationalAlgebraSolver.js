// Relational Algebra Step Solver for ViStudy

export function solveRelationalAlgebra(config = {}) {
  const steps = [];
  let stepCount = 0;

  // Base relations
  const students = [
    { StudentID: 1, Name: "Alice",  Age: 20, DeptID: "CS" },
    { StudentID: 2, Name: "Bob",    Age: 22, DeptID: "Math" },
    { StudentID: 3, Name: "Carol",  Age: 19, DeptID: "CS" },
    { StudentID: 4, Name: "David",  Age: 23, DeptID: "Physics" },
    { StudentID: 5, Name: "Eve",    Age: 21, DeptID: "CS" },
  ];

  const departments = [
    { DeptID: "CS",      DeptName: "Computer Science", HOD: "Prof. Smith" },
    { DeptID: "Math",    DeptName: "Mathematics",       HOD: "Prof. Jones" },
    { DeptID: "Physics", DeptName: "Physics",           HOD: "Prof. Lee" },
  ];

  // Step 0 — Show base relations
  steps.push({
    stepIndex: stepCount++,
    phase: "BASE",
    operation: null,
    label: "Base Relations",
    inputRelation: null,
    outputRelation: null,
    students, departments,
    highlightCols: [],
    highlightRows: [],
    expression: "Students, Departments",
    log: "START: Two base relations — Students (5 tuples) and Departments (3 tuples). We will apply Relational Algebra operations.",
  });

  // --- Op 1: SELECTION σ(DeptID = 'CS')(Students) ---
  const op1Result = students.filter(s => s.DeptID === "CS");
  steps.push({
    stepIndex: stepCount++,
    phase: "SELECTION",
    operation: "σ (SELECTION)",
    label: "σ DeptID='CS' (Students)",
    inputRelation: students,
    outputRelation: op1Result,
    students, departments,
    highlightCols: ["DeptID"],
    highlightRows: op1Result.map(r => r.StudentID),
    expression: "σ(DeptID = 'CS')(Students)",
    log: `SELECTION σ: Filter Students where DeptID = 'CS'. Result: ${op1Result.length} tuples (Alice, Carol, Eve).`,
  });

  // --- Op 2: PROJECTION π(Name, Age)(Students) ---
  const op2Result = students.map(s => ({ Name: s.Name, Age: s.Age }));
  steps.push({
    stepIndex: stepCount++,
    phase: "PROJECTION",
    operation: "π (PROJECTION)",
    label: "π Name, Age (Students)",
    inputRelation: students,
    outputRelation: op2Result,
    students, departments,
    highlightCols: ["Name", "Age"],
    highlightRows: [],
    expression: "π(Name, Age)(Students)",
    log: "PROJECTION π: Extract only Name and Age columns from Students. Eliminates StudentID and DeptID columns.",
  });

  // --- Op 3: SELECTION then PROJECTION (combined) ---
  const op3Result = students
    .filter(s => s.Age >= 21)
    .map(s => ({ Name: s.Name, Age: s.Age, DeptID: s.DeptID }));
  steps.push({
    stepIndex: stepCount++,
    phase: "SELECTION_PROJ",
    operation: "σ + π (Combined)",
    label: "π Name,Age,Dept (σ Age≥21 (Students))",
    inputRelation: students,
    outputRelation: op3Result,
    students, departments,
    highlightCols: ["Age", "Name", "DeptID"],
    highlightRows: op3Result.map(r => students.find(s => s.Name === r.Name)?.StudentID),
    expression: "π(Name,Age,DeptID)(σ(Age≥21)(Students))",
    log: `Chained: First SELECT students with Age ≥ 21, then PROJECT Name, Age, DeptID. Result: ${op3Result.length} tuples.`,
  });

  // --- Op 4: NATURAL JOIN Students ⋈ Departments ---
  const op4Result = students.map(s => {
    const dept = departments.find(d => d.DeptID === s.DeptID);
    return { StudentID: s.StudentID, Name: s.Name, Age: s.Age, DeptName: dept?.DeptName, HOD: dept?.HOD };
  });
  steps.push({
    stepIndex: stepCount++,
    phase: "JOIN",
    operation: "⋈ (NATURAL JOIN)",
    label: "Students ⋈ Departments",
    inputRelation: null,
    outputRelation: op4Result,
    students, departments,
    highlightCols: ["DeptID", "DeptName"],
    highlightRows: [],
    expression: "Students ⋈ Departments",
    log: `NATURAL JOIN ⋈: Join Students and Departments on DeptID. Result: ${op4Result.length} tuples with enriched department data.`,
  });

  // --- Op 5: RENAME ---
  steps.push({
    stepIndex: stepCount++,
    phase: "RENAME",
    operation: "ρ (RENAME)",
    label: "ρ(S, Students)",
    inputRelation: students,
    outputRelation: students, // same data, renamed
    students, departments,
    highlightCols: [],
    highlightRows: [],
    expression: "ρ(S, Students)",
    log: "RENAME ρ: Rename the Students relation to 'S' for use in self-joins or sub-expressions.",
  });

  // Final
  steps.push({
    stepIndex: stepCount++,
    phase: "COMPLETE",
    operation: null,
    label: "Relational Algebra Complete ✓",
    inputRelation: null,
    outputRelation: null,
    students, departments,
    highlightCols: [],
    highlightRows: [],
    expression: "σ, π, ⋈, ρ all demonstrated",
    log: "All core Relational Algebra operators demonstrated: σ (Selection), π (Projection), ⋈ (Join), ρ (Rename).",
  });

  return steps;
}
