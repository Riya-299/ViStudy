// Hashing & Indexing Step Solver for ViStudy (Chaining collision resolution)

export function solveHashing(config = {}) {
  const tableSize = config.tableSize || 7;
  const keys = config.keys || [12, 25, 38, 6, 19, 44, 13, 7];

  const steps = [];
  let stepCount = 0;

  // Hash table: array of buckets, each is an array (chaining)
  const hashTable = Array.from({ length: tableSize }, () => []);

  // Step 0 — Intro
  steps.push({
    stepIndex: stepCount++,
    phase: "INIT",
    label: "Hash Table Initialized",
    hashTable: hashTable.map(b => [...b]),
    currentKey: null,
    currentBucket: null,
    isCollision: false,
    hashFunction: `h(k) = k mod ${tableSize}`,
    log: `Hash table initialized with ${tableSize} empty buckets. Hash function: h(k) = k mod ${tableSize}.`,
  });

  // Insert each key
  keys.forEach(key => {
    const bucket = key % tableSize;
    const isCollision = hashTable[bucket].length > 0;

    // Step: show which bucket the key maps to
    steps.push({
      stepIndex: stepCount++,
      phase: "HASH",
      label: `Hash key ${key} → bucket ${bucket}`,
      hashTable: hashTable.map(b => [...b]),
      currentKey: key,
      currentBucket: bucket,
      isCollision,
      hashFunction: `h(${key}) = ${key} mod ${tableSize} = ${bucket}`,
      log: `Computing h(${key}) = ${key} mod ${tableSize} = ${bucket}. Bucket ${bucket} is ${isCollision ? "OCCUPIED — COLLISION!" : "empty."}`,
    });

    if (isCollision) {
      // Step: show collision handling
      steps.push({
        stepIndex: stepCount++,
        phase: "COLLISION",
        label: `Collision at bucket ${bucket} — Chain!`,
        hashTable: hashTable.map(b => [...b]),
        currentKey: key,
        currentBucket: bucket,
        isCollision: true,
        hashFunction: `h(${key}) = ${bucket}`,
        log: `COLLISION: Bucket ${bucket} already contains [${hashTable[bucket].join(", ")}]. Chaining ${key} at the end of the linked list.`,
      });
    }

    // Insert into table
    hashTable[bucket].push(key);

    // Step: show after insertion
    steps.push({
      stepIndex: stepCount++,
      phase: "INSERT",
      label: `Inserted ${key} into bucket ${bucket}`,
      hashTable: hashTable.map(b => [...b]),
      currentKey: key,
      currentBucket: bucket,
      isCollision,
      hashFunction: `h(${key}) = ${bucket}`,
      log: `Key ${key} ${isCollision ? "chained" : "inserted"} at bucket ${bucket}. Bucket now contains: [${hashTable[bucket].join(" → ")}].`,
    });
  });

  // Step: Search demo — search for a key
  const searchKey = 38;
  const searchBucket = searchKey % tableSize;
  const searchIdx = hashTable[searchBucket].indexOf(searchKey);
  steps.push({
    stepIndex: stepCount++,
    phase: "SEARCH",
    label: `SEARCH key ${searchKey}`,
    hashTable: hashTable.map(b => [...b]),
    currentKey: searchKey,
    currentBucket: searchBucket,
    isCollision: false,
    hashFunction: `h(${searchKey}) = ${searchKey} mod ${tableSize} = ${searchBucket}`,
    log: `SEARCH(${searchKey}): h(${searchKey}) = ${searchBucket}. Scanning bucket ${searchBucket}: [${hashTable[searchBucket].join(" → ")}]. Found at position ${searchIdx} in chain.`,
  });

  // Final stats
  const loadFactor = (keys.length / tableSize).toFixed(2);
  const collisions = keys.filter(k => {
    const b = k % tableSize;
    return hashTable[b].length > 1;
  }).length;

  steps.push({
    stepIndex: stepCount++,
    phase: "COMPLETE",
    label: "Hashing Complete ✓",
    hashTable: hashTable.map(b => [...b]),
    currentKey: null,
    currentBucket: null,
    isCollision: false,
    hashFunction: `h(k) = k mod ${tableSize}`,
    log: `Hash table complete. ${keys.length} keys inserted, ${collisions} collision(s). Load factor α = ${keys.length}/${tableSize} = ${loadFactor}. Average lookup: O(1 + α).`,
  });

  return steps;
}
