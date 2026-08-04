// Insertion Sort Step Solver for ViStudy Visualizer
// Ensures zero box overlapping by maintaining strict array permutations at every step

export function solveInsertionSort(initialArray) {
  const arr = [...initialArray];
  const steps = [];
  const n = arr.length;

  // Frame 0: Initial unsorted state
  steps.push({
    arrayState: [...arr],
    comparedIndices: [],
    isSwapped: false,
    liftedIndex: null,
    log: `Starting Insertion Sort on [${arr.join(", ")}]. First element ${arr[0]} is sorted.`,
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];

    // Pick and lift key element apart from array
    steps.push({
      arrayState: [...arr],
      comparedIndices: [i],
      isSwapped: false,
      liftedIndex: i,
      log: `Picking key element: ${key} at index ${i}. Floating key elevated apart from the array.`,
    });

    let j = i - 1;
    let currentKeyPos = i;

    // Shift elements greater than key to the right by swapping with floating key position
    while (j >= 0 && arr[j] > key) {
      steps.push({
        arrayState: [...arr],
        comparedIndices: [j, currentKeyPos],
        isSwapped: false,
        liftedIndex: currentKeyPos,
        log: `Comparing sorted element ${arr[j]} at index ${j} with floating key ${key}. Since ${arr[j]} > ${key}, shifting ${arr[j]} right.`,
      });

      // Swap element arr[j] with arr[currentKeyPos] so arr remains a valid 1-to-1 permutation
      const temp = arr[j + 1];
      arr[j + 1] = arr[j];
      arr[j] = temp;

      currentKeyPos = j; // Key position moves left as space opens up

      steps.push({
        arrayState: [...arr],
        comparedIndices: [j, j + 1],
        isSwapped: true,
        liftedIndex: currentKeyPos,
        log: `Shifted ${arr[j + 1]} to index ${j + 1}. Key ${key} remains elevated above index ${currentKeyPos}.`,
      });

      j--;
    }

    if (j >= 0) {
      steps.push({
        arrayState: [...arr],
        comparedIndices: [j, currentKeyPos],
        isSwapped: false,
        liftedIndex: currentKeyPos,
        log: `Comparing ${arr[j]} with floating key ${key}. Since ${arr[j]} <= ${key}, correct spot for key ${key} is index ${currentKeyPos}.`,
      });
    }

    // Place key down into position
    steps.push({
      arrayState: [...arr],
      comparedIndices: [currentKeyPos],
      isSwapped: false,
      liftedIndex: null, // Key drops back flat on ground
      log: `Inserted key ${key} down into index ${currentKeyPos}. Sorted portion so far: [${arr.slice(0, i + 1).join(", ")}].`,
    });
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
