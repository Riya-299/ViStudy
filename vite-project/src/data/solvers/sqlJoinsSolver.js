// SQL JOINS Step Solver for ViStudy Visualizer

export function solveSqlJoins(config = {}) {
  const joinType = config.joinType || "INNER";
  const tableA = config.tableA || [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
    { id: 4, name: "David" },
  ];
  const tableB = config.tableB || [
    { orderId: 101, userId: 1, item: "Laptop" },
    { orderId: 102, userId: 2, item: "Phone" },
    { orderId: 103, userId: 1, item: "Book" },
    { orderId: 104, userId: 5, item: "Tablet" },
  ];

  const steps = [];
  let resultTable = [];
  let stepCount = 1;

  steps.push({
    stepIndex: 0,
    joinType,
    tableA,
    tableB,
    activeRowA: null,
    activeRowB: null,
    isMatch: false,
    resultTable: [],
    log: `Starting SQL ${joinType} JOIN on Table A (Users) and Table B (Orders) on A.id = B.userId.`,
  });

  tableA.forEach((rowA) => {
    let matchedInB = false;

    tableB.forEach((rowB) => {
      const isMatch = rowA.id === rowB.userId;

      if (isMatch) {
        matchedInB = true;
        const joinedRow = {
          userId: rowA.id,
          name: rowA.name,
          orderId: rowB.orderId,
          item: rowB.item,
        };
        resultTable.push(joinedRow);

        steps.push({
          stepIndex: stepCount++,
          joinType,
          tableA,
          tableB,
          activeRowA: rowA.id,
          activeRowB: rowB.orderId,
          isMatch: true,
          resultTable: [...resultTable],
          log: `MATCH FOUND! User ${rowA.name} (id: ${rowA.id}) matches Order ${rowB.orderId} (${rowB.item}). Adding to Joined Result.`,
        });
      } else {
        steps.push({
          stepIndex: stepCount++,
          joinType,
          tableA,
          tableB,
          activeRowA: rowA.id,
          activeRowB: rowB.orderId,
          isMatch: false,
          resultTable: [...resultTable],
          log: `Checking User ${rowA.name} (id: ${rowA.id}) against Order ${rowB.orderId} (userId: ${rowB.userId}) — Keys do not match.`,
        });
      }
    });

    if (!matchedInB && (joinType === "LEFT" || joinType === "FULL")) {
      const nullRow = {
        userId: rowA.id,
        name: rowA.name,
        orderId: "NULL",
        item: "NULL",
      };
      resultTable.push(nullRow);

      steps.push({
        stepIndex: stepCount++,
        joinType,
        tableA,
        tableB,
        activeRowA: rowA.id,
        activeRowB: null,
        isMatch: true,
        resultTable: [...resultTable],
        log: `${joinType} JOIN: User ${rowA.name} (id: ${rowA.id}) has no matching orders. Including with NULL values.`,
      });
    }
  });

  steps.push({
    stepIndex: stepCount,
    joinType,
    tableA,
    tableB,
    activeRowA: null,
    activeRowB: null,
    isMatch: false,
    resultTable: [...resultTable],
    log: `SQL ${joinType} JOIN completed! Total joined records produced: ${resultTable.length}.`,
  });

  return steps;
}
