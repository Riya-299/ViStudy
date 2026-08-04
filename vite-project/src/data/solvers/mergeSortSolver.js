// Merge Sort Step Solver for ViStudy Visualizer
// Tracks structural splitting into sub-groups (Divide phase) and joining (Merge phase) with zero box overlap

export function solveMergeSort(initialArray) {
  const steps = [];
  const n = initialArray.length;

  let currentArr = [...initialArray];
  let activeGroups = [[...Array(n).keys()]];

  const getGroupsCopy = () => activeGroups.map((g) => [...g]);

  // Frame 0: Initial state
  steps.push({
    arrayState: [...currentArr],
    comparedIndices: [],
    isSwapped: false,
    groups: getGroupsCopy(),
    log: `Starting Merge Sort on [${currentArr.join(", ")}]. Phase 1: Divide array into smaller parts.`,
  });

  // Step 1: Divide phase (recording recursive splitting into separated parts)
  function divide(start, end) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);

    const groupIdx = activeGroups.findIndex((g) => g.includes(start) && g.includes(end));
    if (groupIdx !== -1) {
      const oldGroup = activeGroups[groupIdx];
      const leftPart = oldGroup.filter((i) => i >= start && i <= mid);
      const rightPart = oldGroup.filter((i) => i >= mid + 1 && i <= end);

      activeGroups.splice(groupIdx, 1, leftPart, rightPart);

      steps.push({
        arrayState: [...currentArr],
        comparedIndices: [start, end],
        isSwapped: false,
        groups: getGroupsCopy(),
        log: `DIVIDE: Split [${currentArr.slice(start, end + 1).join(", ")}] into left part [${currentArr.slice(start, mid + 1).join(", ")}] and right part [${currentArr.slice(mid + 1, end + 1).join(", ")}].`,
      });
    }

    divide(start, mid);
    divide(mid + 1, end);
  }

  divide(0, n - 1);

  steps.push({
    arrayState: [...currentArr],
    comparedIndices: [],
    isSwapped: false,
    groups: getGroupsCopy(),
    log: `DIVIDE COMPLETE: Array broken into ${activeGroups.length} separate parts. Phase 2: Merge parts back together in order.`,
  });

  // Step 2: Merge phase (joining sorted sub-parts)
  function merge(start, mid, end) {
    const left = currentArr.slice(start, mid + 1);
    const right = currentArr.slice(mid + 1, end + 1);
    
    // Calculate the desired sorted sub-array for range start..end
    const sortedSub = [...left, ...right].sort((a, b) => a - b);

    steps.push({
      arrayState: [...currentArr],
      comparedIndices: [start, end],
      isSwapped: false,
      groups: getGroupsCopy(),
      log: `MERGE: Preparing to join part [${left.join(", ")}] and part [${right.join(", ")}].`,
    });

    let i = 0, j = 0;
    for (let k = start; k <= end; k++) {
      let chosenVal;
      let fromLeft = false;

      if (i < left.length && j < right.length) {
        steps.push({
          arrayState: [...currentArr],
          comparedIndices: [start + i, mid + 1 + j],
          isSwapped: false,
          groups: getGroupsCopy(),
          log: `Comparing ${left[i]} from left part with ${right[j]} from right part.`,
        });

        if (left[i] <= right[j]) {
          chosenVal = left[i];
          fromLeft = true;
          i++;
        } else {
          chosenVal = right[j];
          j++;
        }
      } else if (i < left.length) {
        chosenVal = left[i];
        fromLeft = true;
        i++;
      } else {
        chosenVal = right[j];
        j++;
      }

      // Find where chosenVal is currently in currentArr from position k onwards
      const currentIdxOfVal = currentArr.indexOf(chosenVal, k);

      if (currentIdxOfVal !== -1 && currentIdxOfVal !== k) {
        // Swap to place chosenVal at index k without losing/duplicating any element
        const temp = currentArr[k];
        currentArr[k] = currentArr[currentIdxOfVal];
        currentArr[currentIdxOfVal] = temp;
      }

      steps.push({
        arrayState: [...currentArr],
        comparedIndices: [k],
        isSwapped: !fromLeft,
        groups: getGroupsCopy(),
        log: `Placing ${chosenVal} into index ${k}.`,
      });
    }

    // Join activeGroups corresponding to left and right into one merged group!
    const leftGIdx = activeGroups.findIndex((g) => g.includes(start));
    const rightGIdx = activeGroups.findIndex((g) => g.includes(end));

    if (leftGIdx !== -1 && rightGIdx !== -1 && leftGIdx !== rightGIdx) {
      const mergedGroup = Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
      const firstIdx = Math.min(leftGIdx, rightGIdx);
      const secondIdx = Math.max(leftGIdx, rightGIdx);

      activeGroups.splice(secondIdx, 1);
      activeGroups.splice(firstIdx, 1, mergedGroup);
    }

    steps.push({
      arrayState: [...currentArr],
      comparedIndices: Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
      isSwapped: false,
      groups: getGroupsCopy(),
      log: `JOIN: Merged result [${currentArr.slice(start, end + 1).join(", ")}] joined into a single sorted part!`,
    });
  }

  function mergeSort(start, end) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    mergeSort(start, mid);
    mergeSort(mid + 1, end);
    merge(start, mid, end);
  }

  mergeSort(0, n - 1);

  // Final Frame
  steps.push({
    arrayState: [...currentArr],
    comparedIndices: [],
    isSwapped: false,
    groups: [[...Array(n).keys()]],
    log: `Merge Sort complete! All parts joined back into final sorted array: [${currentArr.join(", ")}].`,
  });

  return steps;
}
