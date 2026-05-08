function renderCard(username, stats, options = {}) {
  const {
    theme = "dark",
    maxRepos = 6,
    title = null,
  } = options;

  const themes = {
    dark: {
      bg: "#0a0e17",
      bgGrad: "#0f1923",
      border: "#1e3a5f",
      glow: "#58a6ff",
      title: "#7dd3fc",
      text: "#e2e8f0",
      subtext: "#64748b",
      accent: "#22d3ee",
      badge: "rgba(34, 211, 238, 0.15)",
      badgeBorder: "#22d3ee",
      badgeText: "#22d3ee",
      bar: "#0ea5e9",
      barBg: "rgba(14, 165, 233, 0.1)",
    },
    light: {
      bg: "#f8fafc",
      bgGrad: "#f1f5f9",
      border: "#cbd5e1",
      glow: "#0369a1",
      title: "#0c4a6e",
      text: "#1e293b",
      subtext: "#64748b",
      accent: "#0891b2",
      badge: "rgba(8, 145, 178, 0.1)",
      badgeBorder: "#0891b2",
      badgeText: "#0891b2",
      bar: "#0891b2",
      barBg: "rgba(8, 145, 178, 0.08)",
    },
    dracula: {
      bg: "#1a1b2e",
      bgGrad: "#1e1f3b",
      border: "#44475a",
      glow: "#bd93f9",
      title: "#cba6ff",
      text: "#f8f8f2",
      subtext: "#6272a4",
      accent: "#ff79c6",
      badge: "rgba(255, 121, 198, 0.15)",
      badgeBorder: "#ff79c6",
      badgeText: "#ff79c6",
      bar: "#bd93f9",
      barBg: "rgba(189, 147, 249, 0.1)",
    },
  };

  const t = themes[theme] || themes.dark;
  const displayTitle = title || `Open Source Contributions`;
  const topRepos = stats.repos.slice(0, maxRepos);
  const maxCount = topRepos.length > 0 ? topRepos[0].count : 1;

  const repoListStart = 110;
  const rowHeight = 32;

  const repoRows = topRepos
    .map((repo, i) => {
      const y = repoListStart + i * rowHeight;
      const shortName = repo.name.length > 28
        ? repo.name.substring(0, 25) + "..."
        : repo.name;
      const barWidth = Math.max(30, (repo.count / maxCount) * 180);
      return `
      <g transform="translate(20, ${y})">
        <rect x="0" y="2" width="${barWidth}" height="18" rx="4" fill="${t.barBg}" stroke="${t.badgeBorder}" stroke-width="0.5" opacity="0.6"/>
        <rect x="0" y="2" width="${barWidth}" height="18" rx="4" fill="${t.bar}" opacity="0.2"/>
        <text x="8" y="15" font-size="11" fill="${t.badgeText}" font-family="JetBrains Mono, monospace" font-weight="600">${repo.count}</text>
        <text x="${barWidth + 12}" y="15" font-size="12" fill="${t.text}" font-family="Inter, Segoe UI, sans-serif" font-weight="500">${shortName}</text>
      </g>`;
    })
    .join("");

  const remainingRepos = stats.totalRepos - maxRepos;
  const remainingRow =
    remainingRepos > 0
      ? `<text x="20" y="${repoListStart + topRepos.length * rowHeight + 18}" font-size="11" fill="${t.subtext}" font-family="Inter, Segoe UI, sans-serif" font-style="italic">+ ${remainingRepos} more repos</text>`
      : "";

  const cardHeight = repoListStart + topRepos.length * rowHeight + (remainingRepos > 0 ? 40 : 20);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="${cardHeight}" viewBox="0 0 480 ${cardHeight}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${t.bg}"/>
      <stop offset="100%" style="stop-color:${t.bgGrad}"/>
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${t.glow};stop-opacity:0.6"/>
      <stop offset="100%" style="stop-color:${t.accent};stop-opacity:0.6"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect x="0.5" y="0.5" width="479" height="${cardHeight - 1}" rx="12" fill="url(#bgGrad)" stroke="${t.border}" stroke-width="1"/>

  <!-- Top accent line -->
  <rect x="20" y="0" width="120" height="2" rx="1" fill="url(#glowGrad)" filter="url(#glow)"/>

  <!-- Header -->
  <text x="20" y="28" font-size="11" fill="${t.subtext}" font-family="Inter, Segoe UI, sans-serif" font-weight="500" letter-spacing="1.5">${displayTitle.toUpperCase()}</text>
  <text x="20" y="34" font-size="11" fill="${t.subtext}" font-family="Inter, Segoe UI, sans-serif" font-weight="400" letter-spacing="0.5" opacity="0">@${username}</text>

  <!-- Stats -->
  <g transform="translate(20, 42)">
    <text font-size="38" fill="${t.text}" font-family="JetBrains Mono, monospace" font-weight="800" filter="url(#glow)" y="36">${stats.totalPRs}</text>
    <text x="0" y="54" font-size="12" fill="${t.subtext}" font-family="Inter, Segoe UI, sans-serif">merged across <tspan fill="${t.accent}" font-weight="600">${stats.totalRepos}</tspan> repos</text>
  </g>

  <!-- Divider -->
  <line x1="20" y1="${repoListStart - 8}" x2="460" y2="${repoListStart - 8}" stroke="${t.border}" stroke-width="0.5" opacity="0.5"/>

  ${repoRows}
  ${remainingRow}

  <!-- Footer -->
  <text x="460" y="${cardHeight - 10}" font-size="9" fill="${t.subtext}" text-anchor="end" font-family="JetBrains Mono, monospace" opacity="0.6">oss-card</text>
</svg>`;
}

module.exports = { renderCard };
