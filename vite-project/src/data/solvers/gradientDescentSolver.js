// Gradient Descent Optimization Step Solver for ViStudy Visualizer

export function solveGradientDescent(config = {}) {
  const alpha = typeof config === "number" ? config : (config.alpha || 0.25);
  const startX = config.startX !== undefined ? config.startX : 3.8;
  const iterations = config.iterations || 8;

  const steps = [];
  let currX = startX;

  // Parabola loss surface points: f(x) = 0.3 * x^2
  const surfacePoints = [];
  for (let x = -4.5; x <= 4.5; x += 0.3) {
    surfacePoints.push({ x, y: 0.3 * x * x });
  }

  steps.push({
    stepIndex: 0,
    alpha,
    currentX: currX,
    currentLoss: 0.3 * currX * currX,
    gradient: 0.6 * currX,
    surfacePoints,
    log: `Starting Gradient Descent at x = ${currX.toFixed(2)}. Learning rate α = ${alpha}. Loss f(x) = ${(0.3 * currX * currX).toFixed(2)}.`,
  });

  for (let i = 1; i <= iterations; i++) {
    const loss = 0.3 * currX * currX;
    const grad = 0.6 * currX;
    const stepSize = alpha * grad;
    const nextX = currX - stepSize;

    steps.push({
      stepIndex: i,
      alpha,
      currentX: nextX,
      currentLoss: 0.3 * nextX * nextX,
      gradient: grad,
      stepSize,
      surfacePoints,
      log: `Iteration ${i}: Computed Gradient ∇L = ${grad.toFixed(2)}. Weight update: x = ${currX.toFixed(2)} - (${alpha} * ${grad.toFixed(2)}) => ${nextX.toFixed(2)}. Loss decreased to ${(0.3 * nextX * nextX).toFixed(3)}.`,
    });

    currX = nextX;
  }

  return steps;
}
