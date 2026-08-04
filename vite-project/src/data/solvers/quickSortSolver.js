// Quick Sort Step Solver for ViStudy Visualizer
// Partitions array around floating pivot element with structural sub-group separation

export function solveQuickSort(initialArray) {
  const arr = [...initialArray];
  const steps = [];
  const n = arr.length;

  let activeGroups = [[...Array(n).keys()]];
  const getGroupsCopy = () => activeGroups.map((g) => [...g]);

  // Frame 0: Initial state
  steps.push({
    arrayState: [...arr],
    comparedIndices: [],
    isSwapped: false,
    liftedIndex: null,
    groups: getGroupsCopy(),
    log: `Starting Quick Sort on [${arr.join(", ")}].`,
  });

  function quickSort(low, high) {
    if (low >= high) return;

    const pivotVal = arr[high];

    steps.push({
      arrayState: [...arr],
      comparedIndices: [high],
      isSwapped: false,
      liftedIndex: high,
      groups: getGroupsCopy(),
      log: `Selecting pivot element ${pivotVal} at index ${high}. Floating pivot apart.`,
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        arrayState: [...arr],
        comparedIndices: [j, high],
        isSwapped: false,
        liftedIndex: high,
        groups: getGroupsCopy(),
        log: `Comparing element ${arr[j]} at index ${j} with floating pivot ${pivotVal}.`,
      });

      if (arr[j] < pivotVal) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            arrayState: [...arr],
            comparedIndices: [i, j],
            isSwapped: true,
            liftedIndex: high,
            groups: getGroupsCopy(),
            log: `${arr[i]} < ${pivotVal} — swapping ${arr[i]} to index ${i}.`,
          });
        }
      }
    }

    // Place pivot in correct sorted position pivotTarget = i + 1
    const pivotTarget = i + 1;
    [arr[pivotTarget], arr[high]] = [arr[high], arr[pivotTarget]];

    // Split activeGroups for sub-array low..high into left, pivot, right
    const groupIdx = activeGroups.findIndex((g) => g.includes(low) && g.includes(high));
    if (groupIdx !== -1) {
      const oldGroup = activeGroups[groupIdx];
      const leftPart = oldGroup.filter((idx) => idx >= low && idx < pivotTarget);
      const pivotPart = [pivotTarget];
      const rightPart = oldGroup.filter((idx) => idx > pivotTarget && idx <= high);

      const replacementParts = [];
      if (leftPart.length > 0) replacementParts.push(leftPart);
      replacementParts.push(pivotPart);
      if (rightPart.length > 0) replacementParts.push(rightPart);

      activeGroups.splice(groupIdx, 1, ...replacementParts);
    }

    steps.push({
      arrayState: [...arr],
      comparedIndices: [pivotTarget],
      isSwapped: true,
      liftedIndex: null,
      groups: getGroupsCopy(),
      log: `DIVIDE: Placed pivot ${pivotVal} at index ${pivotTarget}. Partitioned array into Left (< ${pivotVal}) and Right (> ${pivotVal}) sub-groups.`,
    });

    quickSort(low, pivotTarget - 1);
    quickSort(pivotTarget + 1, high);
  }

  quickSort(0, n - 1);

  // Join all groups back at the end
  activeGroups = [[...Array(n).keys()]];

  // Final Frame
  steps.push({
    arrayState: [...arr],
    comparedIndices: [],
    isSwapped: false,
    liftedIndex: null,
    groups: getGroupsCopy(),
    log: `Quick Sort complete! All partitions joined into final sorted array: [${arr.join(", ")}].`,
  });

  return steps;
}
