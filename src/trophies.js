function calculateTrophies(stats) {
  const trophies = [];

  if (stats.totalRepos >= 5) {
    trophies.push({ emoji: "\u{1F3C6}", label: "Polyglot", desc: "5+ repos" });
  }
  if (stats.streak >= 3) {
    trophies.push({ emoji: "\u{1F525}", label: "On Fire", desc: `${stats.streak}mo streak` });
  }
  if (stats.hasStarRepo10k) {
    trophies.push({ emoji: "⭐", label: "Star Contributor", desc: "10K+ star repo" });
  }
  if ((stats.categories && stats.categories.fix || 0) >= 10) {
    trophies.push({ emoji: "\u{1F41B}", label: "Bug Hunter", desc: "10+ fixes" });
  }
  if ((stats.categories && stats.categories.feature || 0) >= 10) {
    trophies.push({ emoji: "\u{1F680}", label: "Feature Builder", desc: "10+ features" });
  }

  return trophies;
}

module.exports = { calculateTrophies };
