function calculateRank(stats) {
  const { totalPRs, totalRepos } = stats;

  if (totalPRs >= 50 || totalRepos >= 15) return { letter: "S", color: "#f59e0b", label: "Legendary" };
  if (totalPRs >= 25 || totalRepos >= 10) return { letter: "A", color: "#22d3ee", label: "Excellent" };
  if (totalPRs >= 10 || totalRepos >= 5) return { letter: "B", color: "#a78bfa", label: "Great" };
  if (totalPRs >= 5) return { letter: "C", color: "#34d399", label: "Good" };
  return { letter: "D", color: "#94a3b8", label: "Starter" };
}

module.exports = { calculateRank };
