function renderCard(username, stats, options = {}) {
  const {
    theme = "dark",
    maxRepos = 6,
    title = null,
  } = options;

  const themes = {
    dark: {
      bg: "#0d1117",
      border: "#30363d",
      title: "#58a6ff",
      text: "#c9d1d9",
      subtext: "#8b949e",
      accent: "#238636",
      badge: "#1f6feb",
      badgeText: "#ffffff",
    },
    light: {
      bg: "#ffffff",
      border: "#d0d7de",
      title: "#0969da",
      text: "#1f2328",
      subtext: "#656d76",
      accent: "#1a7f37",
      badge: "#0969da",
      badgeText: "#ffffff",
    },
    dracula: {
      bg: "#282a36",
      border: "#44475a",
      title: "#bd93f9",
      text: "#f8f8f2",
      subtext: "#6272a4",
      accent: "#50fa7b",
      badge: "#ff79c6",
      badgeText: "#282a36",
    },
  };

  const t = themes[theme] || themes.dark;
  const displayTitle = title || `${username}'s Open Source Contributions`;
  const topRepos = stats.repos.slice(0, maxRepos);

  const repoListStart = 100;
  const rowHeight = 30;

  const repoRows = topRepos
    .map((repo, i) => {
      const y = repoListStart + i * rowHeight;
      const shortName = repo.name.length > 30
        ? repo.name.substring(0, 27) + "..."
        : repo.name;
      const badgeWidth = 28;
      return `
      <g transform="translate(20, ${y})">
        <rect x="0" y="0" width="${badgeWidth}" height="20" rx="10" fill="${t.badge}"/>
        <text x="${badgeWidth / 2}" y="14" font-size="11" fill="${t.badgeText}" text-anchor="middle" font-family="Segoe UI, sans-serif" font-weight="600">${repo.count}</text>
        <text x="${badgeWidth + 10}" y="14" font-size="13" fill="${t.text}" font-family="Segoe UI, sans-serif">${shortName}</text>
      </g>`;
    })
    .join("");

  const remainingRepos = stats.totalRepos - maxRepos;
  const remainingRow =
    remainingRepos > 0
      ? `<text x="20" y="${repoListStart + topRepos.length * rowHeight + 16}" font-size="12" fill="${t.subtext}" font-family="Segoe UI, sans-serif">+ ${remainingRepos} more repos</text>`
      : "";

  const cardHeight = repoListStart + topRepos.length * rowHeight + (remainingRepos > 0 ? 35 : 15);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="450" height="${cardHeight}" viewBox="0 0 450 ${cardHeight}">
  <rect x="0.5" y="0.5" width="449" height="${cardHeight - 1}" rx="8" fill="${t.bg}" stroke="${t.border}" stroke-width="1"/>

  <text x="20" y="30" font-size="14" fill="${t.title}" font-family="Segoe UI, sans-serif" font-weight="700">${displayTitle}</text>

  <g transform="translate(20, 45)">
    <text font-size="32" fill="${t.text}" font-family="Segoe UI, sans-serif" font-weight="700" y="28">${stats.totalPRs}</text>
    <text x="0" y="48" font-size="12" fill="${t.subtext}" font-family="Segoe UI, sans-serif">PRs merged across ${stats.totalRepos} repos</text>
  </g>

  ${repoRows}
  ${remainingRow}

  <text x="430" y="${cardHeight - 8}" font-size="9" fill="${t.subtext}" text-anchor="end" font-family="Segoe UI, sans-serif">oss-card</text>
</svg>`;
}

module.exports = { renderCard };
