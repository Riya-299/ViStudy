// Binary Search Tree (BST) Step Solver for ViStudy Visualizer
// Keeps existing tree nodes intact and staged incoming numbers on the side before insertion

export function solveBST(customValues) {
  const insertValues = Array.isArray(customValues) && customValues.length > 0 ? customValues : [50, 30, 70, 20, 40, 60, 80];
  const steps = [];

  let root = null;

  const getCoordinates = (depth, posInLevel, maxInLevel) => {
    const xSpacing = Math.max(6.5 / (depth + 1), 1.6);
    const x = (posInLevel - (maxInLevel - 1) / 2) * xSpacing;
    const y = 3.8 - depth * 1.8;
    return [x, y, 0];
  };

  class TreeNode {
    constructor(val, depth = 0, indexInLevel = 0, maxInLevel = 1) {
      this.val = val;
      this.id = `node-${val}`;
      this.left = null;
      this.right = null;
      this.depth = depth;
      this.indexInLevel = indexInLevel;
      this.maxInLevel = maxInLevel;
      this.position = getCoordinates(depth, indexInLevel, maxInLevel);
    }
  }

  const updateTreePositions = (node, depth = 0, index = 0, maxInLevel = 1) => {
    if (!node) return;
    node.depth = depth;
    node.indexInLevel = index;
    node.maxInLevel = maxInLevel;
    node.position = getCoordinates(depth, index, maxInLevel);

    updateTreePositions(node.left, depth + 1, index * 2, maxInLevel * 2);
    updateTreePositions(node.right, depth + 1, index * 2 + 1, maxInLevel * 2);
  };

  const flattenTree = (node, comparingVal = null, newlyInsertedVal = null) => {
    const nodes = [];
    const edges = [];

    const traverse = (n) => {
      if (!n) return;
      nodes.push({
        id: n.id,
        val: n.val,
        position: n.position,
        isComparing: n.val === comparingVal,
        isNewlyInserted: n.val === newlyInsertedVal,
      });

      if (n.left) {
        edges.push({ id: `${n.id}-${n.left.id}`, u: n.id, v: n.left.id });
        traverse(n.left);
      }
      if (n.right) {
        edges.push({ id: `${n.id}-${n.right.id}`, u: n.id, v: n.right.id });
        traverse(n.right);
      }
    };

    traverse(node);
    return { treeNodes: nodes, treeEdges: edges };
  };

  steps.push({
    ...flattenTree(root),
    incomingVal: null,
    log: `Starting BST Construction. Values to insert: [${insertValues.join(", ")}].`,
  });

  for (let idx = 0; idx < insertValues.length; idx++) {
    const val = insertValues[idx];
    const remainingValues = insertValues.slice(idx + 1);

    // Frame: Announce incoming number staged at the side
    steps.push({
      ...flattenTree(root),
      incomingVal: val,
      remainingValues,
      log: `Next number to insert: ${val}. Staged at the side panel before entering the tree.`,
    });

    if (!root) {
      root = new TreeNode(val, 0, 0, 1);
      steps.push({
        ...flattenTree(root, null, val),
        incomingVal: null,
        remainingValues,
        log: `Tree is currently empty. Added ${val} as the Root node.`,
      });
      continue;
    }

    let curr = root;
    let parent = null;
    let isLeft = false;

    while (curr) {
      steps.push({
        ...flattenTree(root, curr.val, null),
        incomingVal: val,
        remainingValues,
        log: `Comparing incoming number ${val} (at side) with Tree Node ${curr.val}: ${val < curr.val ? `${val} < ${curr.val} → Traverse LEFT` : `${val} > ${curr.val} → Traverse RIGHT`}.`,
      });

      parent = curr;
      if (val < curr.val) {
        curr = curr.left;
        isLeft = true;
      } else {
        curr = curr.right;
        isLeft = false;
      }
    }

    const newNode = new TreeNode(val);
    if (isLeft) parent.left = newNode;
    else parent.right = newNode;

    updateTreePositions(root);

    steps.push({
      ...flattenTree(root, null, val),
      incomingVal: null,
      remainingValues,
      log: `Insertion point found! Added ${val} into the tree as the ${isLeft ? "LEFT" : "RIGHT"} child of ${parent.val}.`,
    });
  }

  steps.push({
    ...flattenTree(root),
    incomingVal: null,
    remainingValues: [],
    log: `BST Construction complete! All 7 nodes are placed obeying BST order (Left < Root < Right).`,
  });

  return steps;
}
