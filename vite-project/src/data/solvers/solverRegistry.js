// Solver Registry — maps topicId → solver function
// Add new algorithms here to automatically activate their 3D visualizer

import { solveBubbleSort } from "./bubbleSortSolver";
import { solveSelectionSort } from "./selectionSortSolver";
import { solveInsertionSort } from "./insertionSortSolver";
import { solveMergeSort } from "./mergeSortSolver";
import { solveDijkstra } from "./dijkstraSolver";
import { solveBST } from "./bstSolver";
import { solveCpuScheduling } from "./cpuSchedulingSolver";
import { solveQuickSort } from "./quickSortSolver";
import { solveBinarySearch } from "./binarySearchSolver";
import { solvePageReplacement } from "./pageReplacementSolver";
import { solveSqlJoins } from "./sqlJoinsSolver";
import { solveBTree } from "./bTreeSolver";
import { solveTcpHandshake } from "./tcpHandshakeSolver";
import { solveDnsLookup } from "./dnsLookupSolver";
import { solveGradientDescent } from "./gradientDescentSolver";
import { solveKMeans } from "./kMeansSolver";
import { solveLoadBalancing } from "./loadBalancingSolver";
import { solveAutoScaling } from "./autoScalingSolver";

export const solverRegistry = {
  "bubble-sort":       solveBubbleSort,
  "selection-sort":    solveSelectionSort,
  "insertion-sort":    solveInsertionSort,
  "merge-sort":        solveMergeSort,
  "dijkstra":          solveDijkstra,
  "bst":               solveBST,
  "cpu-scheduling":    solveCpuScheduling,
  "quick-sort":        solveQuickSort,
  "binary-search":     solveBinarySearch,
  "page-replacement":  solvePageReplacement,
  "sql-joins":         solveSqlJoins,
  "b-tree":            solveBTree,
  "tcp-handshake":     solveTcpHandshake,
  "dns-lookup":        solveDnsLookup,
  "gradient-descent":  solveGradientDescent,
  "k-means":           solveKMeans,
  "load-balancing":    solveLoadBalancing,
  "auto-scaling":      solveAutoScaling,
};
