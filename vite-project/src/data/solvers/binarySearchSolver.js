// Binary Search Step Solver for ViStudy Visualizer
// Floating middle element with active range highlighting and eliminated half dimming

export function solveBinarySearch() {
  const arr = [1, 2, 3, 4, 5, 7, 8];
  const target = 7;
  const steps = [];

  const getRangeIndices = (low, high) => {
    const range = [];
    for (let i = low; i <= high; i++) range.push(i);
    return range;
  };

  // Frame 0: Full initial range
  steps.push({
    arrayState: [...arr],
    comparedIndices: [],
    isSwapped: false,
    liftedIndex: null,
    activeRange: getRangeIndices(0, arr.length - 1),
    log: `Starting Binary Search for target value ${target} on sorted array [${arr.join(", ")}].`,
  });

  let low = 0;
  let high = arr.length - 1;
  let found = false;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midVal = arr[mid];
    const currentActiveRange = getRangeIndices(low, high);

    steps.push({
      arrayState: [...arr],
      comparedIndices: [low, mid, high],
      isSwapped: false,
      liftedIndex: mid,
      activeRange: currentActiveRange,
      log: `Active search range: indices ${low}..${high} [${arr.slice(low, high + 1).join(", ")}]. Floating middle element ${midVal} at index ${mid}.`,
    });

    steps.push({
      arrayState: [...arr],
      comparedIndices: [mid],
      isSwapped: false,
      liftedIndex: mid,
      activeRange: currentActiveRange,
      log: `Comparing target ${target} with floating middle value ${midVal}.`,
    });

    if (midVal === target) {
      steps.push({
        arrayState: [...arr],
        comparedIndices: [mid],
        isSwapped: false,
        liftedIndex: mid,
        activeRange: [mid],
        log: `TARGET FOUND! Target value ${target} is located at index ${mid}.`,
      });
      found = true;
      break;
    } else if (midVal < target) {
      steps.push({
        arrayState: [...arr],
        comparedIndices: [mid],
        isSwapped: false,
        liftedIndex: null,
        activeRange: currentActiveRange,
        log: `${midVal} < ${target} → Target lies in right half. Eliminating left half [${arr.slice(low, mid + 1).join(", ")}].`,
      });
      low = mid + 1;
    } else {
      steps.push({
        arrayState: [...arr],
        comparedIndices: [mid],
        isSwapped: false,
        liftedIndex: null,
        activeRange: currentActiveRange,
        log: `${midVal} > ${target} → Target lies in left half. Eliminating right half [${arr.slice(mid, high + 1).join(", ")}].`,
      });
      high = mid - 1;
    }
  }

  if (!found) {
    steps.push({
      arrayState: [...arr],
      comparedIndices: [],
      isSwapped: false,
      liftedIndex: null,
      activeRange: [],
      log: `Target ${target} was not found in the array.`,
    });
  }

  return steps;
}
