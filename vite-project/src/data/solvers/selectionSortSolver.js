// Selection Sort Step Solver for ViStudy Visualizer
// Elevates current minimum candidate so it floats above the array as it's scanned

export function solveSelectionSort(initialArray) {
  const arr = [...initialArray];
  const steps = [];
  const n = arr.length;

  // Frame 0: Initial state
  steps.push({
    arrayState: [...arr],
    comparedIndices: [],
    isSwapped: false,
    liftedIndex: null,
    log: `Starting Selection Sort on [${arr.join(", ")}].`,
  });

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    // Start of pass: elevate initial minimum candidate
    steps.push({
      arrayState: [...arr],
      comparedIndices: [i],
      isSwapped: false,
      liftedIndex: minIndex,
      log: `Pass ${i + 1}: Assuming index ${i} (${arr[i]}) is the current minimum. Floating candidate apart.`,
    });

    // Inner scan: find the true minimum in the unsorted portion
    for (let j = i + 1; j < n; j++) {
      steps.push({
        arrayState: [...arr],
        comparedIndices: [minIndex, j],
        isSwapped: false,
        liftedIndex: minIndex,
        log: `Comparing floating min candidate (${arr[minIndex]}) with ${arr[j]} at index ${j}.`,
      });

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
        steps.push({
          arrayState: [...arr],
          comparedIndices: [minIndex],
          isSwapped: false,
          liftedIndex: minIndex,
          log: `New smaller minimum found! ${arr[minIndex]} at index ${minIndex} now floats as the new min candidate.`,
        });
      }
    }

    // Perform swap if minIndex moved
    if (minIndex !== i) {
      steps.push({
        arrayState: [...arr],
        comparedIndices: [i, minIndex],
        isSwapped: true,
        liftedIndex: minIndex,
        log: `Swapping ${arr[i]} (idx ${i}) with floating minimum ${arr[minIndex]} (idx ${minIndex}).`,
      });

      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

      steps.push({
        arrayState: [...arr],
        comparedIndices: [i],
        isSwapped: false,
        liftedIndex: i,
        log: `Floating minimum ${arr[i]} moved to index ${i}.`,
      });

      steps.push({
        arrayState: [...arr],
        comparedIndices: [i],
        isSwapped: false,
        liftedIndex: null,
        log: `${arr[i]} lands into sorted position at index ${i}.`,
      });
    } else {
      steps.push({
        arrayState: [...arr],
        comparedIndices: [i],
        isSwapped: false,
        liftedIndex: null,
        log: `${arr[i]} is already in its correct position at index ${i}. No swap needed.`,
      });
    }
  }

  // Final sorted state
  steps.push({
    arrayState: [...arr],
    comparedIndices: [],
    isSwapped: false,
    liftedIndex: null,
    log: `Array is fully sorted: [${arr.join(", ")}].`,
  });

  return steps;
}
