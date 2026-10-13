// Normalization Step Solver — 1NF → 2NF → 3NF for ViStudy

export function solveNormalization(config = {}) {
  const steps = [];
  let stepCount = 0;

  // --- Raw unnormalized table ---
  const unnormalized = [
    { StudentID: 1, Name: "Alice", Courses: "Math, Science", TeacherID: "T1, T2", TeacherName: "Dr. A, Dr. B", Dept: "Science" },
    { StudentID: 2, Name: "Bob",   Courses: "Math",          TeacherID: "T1",       TeacherName: "Dr. A",         Dept: "Science" },
    { StudentID: 3, Name: "Carol", Courses: "History",       TeacherID: "T3",       TeacherName: "Dr. C",         Dept: "Arts" },
  ];

  // --- 1NF: Atomic values, no repeating groups ---
  const firstNF = [
    { StudentID: 1, Name: "Alice", Course: "Math",    TeacherID: "T1", TeacherName: "Dr. A", Dept: "Science" },
    { StudentID: 1, Name: "Alice", Course: "Science",  TeacherID: "T2", TeacherName: "Dr. B", Dept: "Science" },
    { StudentID: 2, Name: "Bob",   Course: "Math",    TeacherID: "T1", TeacherName: "Dr. A", Dept: "Science" },
    { StudentID: 3, Name: "Carol", Course: "History",  TeacherID: "T3", TeacherName: "Dr. C", Dept: "Arts" },
  ];

  // --- 2NF: Remove partial dependencies (split out Student info) ---
  const studentsTable = [
    { StudentID: 1, Name: "Alice" },
    { StudentID: 2, Name: "Bob" },
    { StudentID: 3, Name: "Carol" },
  ];
  const enrollmentsTable = [
    { StudentID: 1, Course: "Math",    TeacherID: "T1", TeacherName: "Dr. A", Dept: "Science" },
    { StudentID: 1, Course: "Science",  TeacherID: "T2", TeacherName: "Dr. B", Dept: "Science" },
    { StudentID: 2, Course: "Math",    TeacherID: "T1", TeacherName: "Dr. A", Dept: "Science" },
    { StudentID: 3, Course: "History",  TeacherID: "T3", TeacherName: "Dr. C", Dept: "Arts" },
  ];

  // --- 3NF: Remove transitive dependencies (split out Teacher info) ---
  const enrollments3NF = [
    { StudentID: 1, Course: "Math",    TeacherID: "T1" },
    { StudentID: 1, Course: "Science",  TeacherID: "T2" },
    { StudentID: 2, Course: "Math",    TeacherID: "T1" },
    { StudentID: 3, Course: "History",  TeacherID: "T3" },
  ];
  const teachersTable = [
    { TeacherID: "T1", TeacherName: "Dr. A", Dept: "Science" },
    { TeacherID: "T2", TeacherName: "Dr. B", Dept: "Science" },
    { TeacherID: "T3", TeacherName: "Dr. C", Dept: "Arts" },
  ];

  // Step 0 — Initial unnormalized
  steps.push({
    stepIndex: stepCount++,
    phase: "UNF",
    label: "Unnormalized Form (UNF)",
    description: "Raw table has repeating groups and multi-valued attributes (Courses, Teachers as comma-separated lists).",
    violation: "Multi-valued columns: Courses, TeacherID, TeacherName",
    tables: { unnormalized },
    activeTable: "unnormalized",
    highlight: ["Courses", "TeacherID", "TeacherName"],
    log: "START: Table is not normalized — contains multi-valued/repeating columns.",
  });

  // Step 1 — Explain 1NF rule
  steps.push({
    stepIndex: stepCount++,
    phase: "1NF_EXPLAIN",
    label: "Applying 1NF",
    description: "First Normal Form (1NF): Each column must hold atomic (indivisible) values. Eliminate repeating groups by splitting rows.",
    violation: "Splitting multi-valued rows into atomic rows...",
    tables: { unnormalized },
    activeTable: "unnormalized",
    highlight: ["Courses", "TeacherID", "TeacherName"],
    log: "1NF Rule: All attributes must be atomic. Splitting repeating group rows...",
  });

  // Step 2 — 1NF achieved
  steps.push({
    stepIndex: stepCount++,
    phase: "1NF",
    label: "1NF Achieved ✓",
    description: "Each row now has a single Course and TeacherID. All values are atomic. Primary key: (StudentID, Course).",
    violation: null,
    tables: { firstNF },
    activeTable: "firstNF",
    highlight: [],
    log: "1NF achieved. Table now has atomic values. PK = (StudentID, Course). But partial dependencies remain.",
  });

  // Step 3 — Explain 2NF rule
  steps.push({
    stepIndex: stepCount++,
    phase: "2NF_EXPLAIN",
    label: "Applying 2NF",
    description: "Second Normal Form (2NF): Every non-key attribute must depend on the WHOLE primary key. 'Name' only depends on StudentID (partial dependency).",
    violation: "Partial dependency: Name → StudentID only (not on Course)",
    tables: { firstNF },
    activeTable: "firstNF",
    highlight: ["Name"],
    log: "2NF: Partial dependency detected — 'Name' depends only on StudentID, not full PK (StudentID, Course). Decomposing...",
  });

  // Step 4 — 2NF achieved
  steps.push({
    stepIndex: stepCount++,
    phase: "2NF",
    label: "2NF Achieved ✓",
    description: "Split into Students(StudentID, Name) and Enrollments(StudentID, Course, TeacherID, TeacherName, Dept). Partial dependencies removed.",
    violation: null,
    tables: { studentsTable, enrollmentsTable },
    activeTable: "studentsTable",
    highlight: [],
    log: "2NF achieved. Decomposed into Students and Enrollments tables. But transitive dependencies still exist.",
  });

  // Step 5 — Explain 3NF rule
  steps.push({
    stepIndex: stepCount++,
    phase: "3NF_EXPLAIN",
    label: "Applying 3NF",
    description: "Third Normal Form (3NF): No transitive dependencies. TeacherName and Dept depend on TeacherID, not on the PK (StudentID, Course).",
    violation: "Transitive dependency: TeacherName, Dept → TeacherID (not the PK)",
    tables: { studentsTable, enrollmentsTable },
    activeTable: "enrollmentsTable",
    highlight: ["TeacherName", "Dept"],
    log: "3NF: Transitive dependency — TeacherName & Dept depend on TeacherID, not PK. Decomposing...",
  });

  // Step 6 — 3NF achieved
  steps.push({
    stepIndex: stepCount++,
    phase: "3NF",
    label: "3NF Achieved ✓",
    description: "Final schema: Students(StudentID, Name) | Enrollments(StudentID, Course, TeacherID) | Teachers(TeacherID, TeacherName, Dept). Fully normalized!",
    violation: null,
    tables: { studentsTable, enrollments3NF, teachersTable },
    activeTable: "all",
    highlight: [],
    log: "3NF achieved! All transitive dependencies removed. 3 clean, normalized tables produced.",
  });

  return steps;
}
