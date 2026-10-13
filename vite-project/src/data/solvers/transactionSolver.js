// Transaction & ACID Properties Solver for ViStudy

export function solveTransaction(config = {}) {
  const steps = [];
  let stepCount = 0;

  const scenario = config.scenario || "transfer"; // "transfer" | "rollback"

  // Simulated bank accounts
  let balanceA = 1000;
  let balanceB = 500;
  const transferAmount = 200;

  // Track transaction log
  const txLog = [];

  // --- STEP 0: Initial state ---
  steps.push({
    stepIndex: stepCount++,
    phase: "INIT",
    label: "Initial Database State",
    balanceA, balanceB,
    txLog: [...txLog],
    activeOp: null,
    committed: false,
    rolledBack: false,
    acid: { atomicity: "pending", consistency: "ok", isolation: "pending", durability: "pending" },
    log: `Database initialized. Account A: $${balanceA}, Account B: $${balanceB}. Starting TRANSFER transaction of $${transferAmount}.`,
  });

  // --- STEP 1: BEGIN TRANSACTION ---
  txLog.push("BEGIN TRANSACTION T1");
  steps.push({
    stepIndex: stepCount++,
    phase: "BEGIN",
    label: "BEGIN TRANSACTION",
    balanceA, balanceB,
    txLog: [...txLog],
    activeOp: "BEGIN",
    committed: false, rolledBack: false,
    acid: { atomicity: "active", consistency: "ok", isolation: "active", durability: "pending" },
    log: "BEGIN TRANSACTION T1 — Atomicity lock acquired. All operations will be treated as one atomic unit.",
  });

  // --- STEP 2: READ A ---
  txLog.push(`READ(A) → ${balanceA}`);
  steps.push({
    stepIndex: stepCount++,
    phase: "READ_A",
    label: `READ Account A = $${balanceA}`,
    balanceA, balanceB,
    txLog: [...txLog],
    activeOp: "READ_A",
    committed: false, rolledBack: false,
    acid: { atomicity: "active", consistency: "ok", isolation: "active", durability: "pending" },
    log: `READ(A): Account A balance = $${balanceA}. Isolation ensures no other transaction can see intermediate state.`,
  });

  // --- STEP 3: DEBIT A ---
  const prevA = balanceA;
  balanceA -= transferAmount;
  txLog.push(`WRITE(A) = ${balanceA}  [was ${prevA}]`);
  steps.push({
    stepIndex: stepCount++,
    phase: "WRITE_A",
    label: `DEBIT A: $${prevA} → $${balanceA}`,
    balanceA, balanceB,
    txLog: [...txLog],
    activeOp: "WRITE_A",
    committed: false, rolledBack: false,
    acid: { atomicity: "active", consistency: "checking", isolation: "active", durability: "pending" },
    log: `WRITE(A): Deducted $${transferAmount} from Account A. New balance: $${balanceA}. Consistency constraint check pending.`,
  });

  // --- STEP 4: READ B ---
  txLog.push(`READ(B) → ${balanceB}`);
  steps.push({
    stepIndex: stepCount++,
    phase: "READ_B",
    label: `READ Account B = $${balanceB}`,
    balanceA, balanceB,
    txLog: [...txLog],
    activeOp: "READ_B",
    committed: false, rolledBack: false,
    acid: { atomicity: "active", consistency: "checking", isolation: "active", durability: "pending" },
    log: `READ(B): Account B balance = $${balanceB}. Preparing to credit $${transferAmount}.`,
  });

  // --- STEP 5: CREDIT B ---
  const prevB = balanceB;
  balanceB += transferAmount;
  txLog.push(`WRITE(B) = ${balanceB}  [was ${prevB}]`);
  steps.push({
    stepIndex: stepCount++,
    phase: "WRITE_B",
    label: `CREDIT B: $${prevB} → $${balanceB}`,
    balanceA, balanceB,
    txLog: [...txLog],
    activeOp: "WRITE_B",
    committed: false, rolledBack: false,
    acid: { atomicity: "active", consistency: "ok", isolation: "active", durability: "pending" },
    log: `WRITE(B): Credited $${transferAmount} to Account B. New balance: $${balanceB}. Consistency satisfied: A+B = ${balanceA + balanceB} (unchanged).`,
  });

  if (scenario === "rollback") {
    // --- STEP 6: Simulate error ---
    txLog.push("ERROR: Constraint Violation — ROLLBACK");
    steps.push({
      stepIndex: stepCount++,
      phase: "ERROR",
      label: "⚠ Error Detected — Rollback!",
      balanceA, balanceB,
      txLog: [...txLog],
      activeOp: "ERROR",
      committed: false, rolledBack: false,
      acid: { atomicity: "violated", consistency: "failed", isolation: "active", durability: "pending" },
      log: "ERROR: Constraint violation detected mid-transaction! Atomicity guarantees we must ROLLBACK all changes.",
    });

    // Reset balances
    balanceA = 1000;
    balanceB = 500;
    txLog.push(`ROLLBACK → A=$${balanceA}, B=$${balanceB}`);
    steps.push({
      stepIndex: stepCount++,
      phase: "ROLLBACK",
      label: "ROLLBACK — State Restored",
      balanceA, balanceB,
      txLog: [...txLog],
      activeOp: "ROLLBACK",
      committed: false, rolledBack: true,
      acid: { atomicity: "ok", consistency: "ok", isolation: "released", durability: "n/a" },
      log: `ROLLBACK complete. Account A restored to $${balanceA}, Account B restored to $${balanceB}. Database in consistent state.`,
    });
  } else {
    // --- STEP 6: COMMIT ---
    txLog.push(`COMMIT T1 → A=$${balanceA}, B=$${balanceB}`);
    steps.push({
      stepIndex: stepCount++,
      phase: "COMMIT",
      label: "COMMIT — Transaction Successful",
      balanceA, balanceB,
      txLog: [...txLog],
      activeOp: "COMMIT",
      committed: true, rolledBack: false,
      acid: { atomicity: "ok", consistency: "ok", isolation: "released", durability: "ok" },
      log: `COMMIT T1: All operations persisted to disk. A=$${balanceA}, B=$${balanceB}. Durability guaranteed — data survives crashes.`,
    });
  }

  return steps;
}
