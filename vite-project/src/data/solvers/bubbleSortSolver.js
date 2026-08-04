// Bubble Sort Step Solver for ViStudy Visualizer

export function solveBubbleSort(initialArray) {
  const arr = [...initialArray];
  const steps = [];
  const n = arr.length;

  // Frame 0: Unsorted initial state
  steps.push({
    stepIndex: 0,
    arrayState: [...arr],
    comparedIndices: [],
    isSwapped: false,
    liftedIndex: null,
    log: `Starting Bubble Sort on array [${arr.join(", ")}].`,
  });

  let stepCount = 1;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      const indexA = j;
      const indexB = j + 1;
      const valA = arr[indexA];
      const valB = arr[indexB];

      // Step: Comparing adjacent elements
      steps.push({
        stepIndex: stepCount++,
        arrayState: [...arr],
        comparedIndices: [indexA, indexB],
        isSwapped: false,
        liftedIndex: null,
        log: `Comparing index ${indexA} (${valA}) and index ${indexB} (${valB}).`,
      });

      if (valA > valB) {
        // Swap elements
        arr[indexA] = valB;
        arr[indexB] = valA;

        // Step: Swapped frame (flat on ground)
        steps.push({
          stepIndex: stepCount++,
          arrayState: [...arr],
          comparedIndices: [indexA, indexB],
          isSwapped: true,
          liftedIndex: null,
          log: `Since ${valA} > ${valB}, swapping ${valA} and ${valB}.`,
        });
      } else {
        // Step: Element order correct
        steps.push({
          stepIndex: stepCount++,
          arrayState: [...arr],
          comparedIndices: [indexA, indexB],
          isSwapped: false,
          liftedIndex: null,
          log: `Since ${valA} <= ${valB}, no swap is necessary.`,
        });
      }
    }
  }

  // Final Step: Sorted state
  steps.push({
    stepIndex: stepCount,
    arrayState: [...arr],
    comparedIndices: [],
    isSwapped: false,
    liftedIndex: null,
    log: `Array is fully sorted: [${arr.join(", ")}].`,
  });

  return steps;
}
