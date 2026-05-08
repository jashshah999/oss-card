const { getTheme } = require("./themes");

function getAnimationCSS(animation) {
  if (animation === "fade") {
    return `
    <style>
      .fade-in { opacity: 0; animation: fadeIn 0.5s ease forwards; }
      .fade-in-1 { animation-delay: 0.1s; }
      .fade-in-2 { animation-delay: 0.2s; }
      .fade-in-3 { animation-delay: 0.3s; }
      .fade-in-4 { animation-delay: 0.4s; }
      .fade-in-5 { animation-delay: 0.5s; }
      .fade-in-6 { animation-delay: 0.6s; }
      .fade-in-7 { animation-delay: 0.7s; }
      .fade-in-8 { animation-delay: 0.8s; }
      .fade-in-9 { animation-delay: 0.9s; }
      .fade-in-10 { animation-delay: 1.0s; }
      @keyframes fadeIn { to { opacity: 1; } }
    </style>`;
  }
  if (animation === "slide") {
    return `
    <style>
      .slide-in { transform: translateX(-20px); opacity: 0; animation: slideIn 0.4s ease forwards; }
      .slide-in-1 { animation-delay: 0.1s; }
      .slide-in-2 { animation-delay: 0.15s; }
      .slide-in-3 { animation-delay: 0.2s; }
      .slide-in-4 { animation-delay: 0.25s; }
      .slide-in-5 { animation-delay: 0.3s; }
      .slide-in-6 { animation-delay: 0.35s; }
      .slide-in-7 { animation-delay: 0.4s; }
      .slide-in-8 { animation-delay: 0.45s; }
      .slide-in-9 { animation-delay: 0.5s; }
      .slide-in-10 { animation-delay: 0.55s; }
      @keyframes slideIn { to { transform: translateX(0); opacity: 1; } }
    </style>`;
  }
  return "";
}

function getFontFamily(font) {
  if (font === "mono") return "'JetBrains Mono', 'Fira Code', monospace";
  if (font === "sans") return "'Inter', 'Segoe UI', system-ui, sans-serif";
  return "'Inter', 'Segoe UI', sans-serif";
}

function renderDefaultLayout(username, stats, t, options) {
  const {
    maxRepos = 6,
    title = null,
    hideTitle = false,
    hideBorder = false,
    borderRadius = 12,
    width = 480,
    animation = "none",
    font = "default",
    usernameDisplay = false,
    showStats = false,
    showIcons = false,
  } = options;

  const fontFamily = getFontFamily(font);
  const monoFont = font === "sans" ? fontFamily : "'JetBrains Mono', monospace";
  const displayTitle = title || "Open Source Contributions";
  const topRepos = stats.repos.slice(0, maxRepos);
  const maxCount = topRepos.length > 0 ? topRepos[0].count : 1;
  const animClass = animation !== "none" ? animation + "-in" : "";

  let headerHeight = hideTitle ? 20 : 34;
  if (usernameDisplay && !hideTitle) headerHeight += 16;

  const statsStart = headerHeight + 42;
  const repoListStart = statsStart + 60 + (showStats ? 24 : 0);
  const rowHeight = 32;

  const barMaxWidth = Math.min(180, width * 0.38);

  const repoRows = topRepos
    .map((repo, i) => {
      const y = repoListStart + i * rowHeight;
      const shortName = repo.name.length > 28 ? repo.name.substring(0, 25) + "..." : repo.name;
      const barWidth = Math.max(30, (repo.count / maxCount) * barMaxWidth);
      const delayClass = animClass ? `${animClass} ${animClass}-${i + 1}` : "";
      const icon = showIcons ? `<circle cx="4" cy="11" r="4" fill="${t.accent}" opacity="0.7"/>` : "";
      const iconOffset = showIcons ? 14 : 0;
      return `
      <g transform="translate(20, ${y})" class="${delayClass}">
        ${icon}
        <rect x="${iconOffset}" y="2" width="${barWidth}" height="18" rx="4" fill="${t.barBg}" stroke="${t.badgeBorder}" stroke-width="0.5" opacity="0.6"/>
        <rect x="${iconOffset}" y="2" width="${barWidth}" height="18" rx="4" fill="${t.bar}" opacity="0.2"/>
        <text x="${iconOffset + 8}" y="15" font-size="11" fill="${t.badgeText}" font-family="${monoFont}" font-weight="600">${repo.count}</text>
        <text x="${iconOffset + barWidth + 12}" y="15" font-size="12" fill="${t.text}" font-family="${fontFamily}" font-weight="500">${shortName}</text>
      </g>`;
    })
    .join("");

  const remainingRepos = stats.totalRepos - maxRepos;
  const remainingRow =
    remainingRepos > 0
      ? `<text x="20" y="${repoListStart + topRepos.length * rowHeight + 18}" font-size="11" fill="${t.subtext}" font-family="${fontFamily}" font-style="italic">+ ${remainingRepos} more repos</text>`
      : "";

  const cardHeight = repoListStart + topRepos.length * rowHeight + (remainingRepos > 0 ? 40 : 20);

  const titleMarkup = hideTitle
    ? ""
    : `<text x="20" y="28" font-size="11" fill="${t.subtext}" font-family="${fontFamily}" font-weight="500" letter-spacing="1.5">${displayTitle.toUpperCase()}</text>`;

  const usernameMarkup = usernameDisplay && !hideTitle
    ? `<text x="20" y="44" font-size="11" fill="${t.subtext}" font-family="${fontFamily}" font-weight="400" letter-spacing="0.5">@${username}</text>`
    : "";

  const statsExtraMarkup = showStats && stats.mostRecentDate
    ? `<text x="20" y="${statsStart + 74}" font-size="10" fill="${t.subtext}" font-family="${fontFamily}">Last contribution: ${stats.mostRecentDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</text>`
    : "";

  const borderMarkup = hideBorder
    ? `<rect x="0" y="0" width="${width}" height="${cardHeight}" rx="${borderRadius}" fill="url(#bgGrad)"/>`
    : `<rect x="0.5" y="0.5" width="${width - 1}" height="${cardHeight - 1}" rx="${borderRadius}" fill="url(#bgGrad)" stroke="${t.border}" stroke-width="1"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${cardHeight}" viewBox="0 0 ${width} ${cardHeight}">
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
  ${getAnimationCSS(animation)}

  ${borderMarkup}

  <!-- Top accent line -->
  <rect x="20" y="0" width="120" height="2" rx="1" fill="url(#glowGrad)" filter="url(#glow)"/>

  <!-- Header -->
  ${titleMarkup}
  ${usernameMarkup}

  <!-- Stats -->
  <g transform="translate(20, ${statsStart})">
    <text font-size="38" fill="${t.text}" font-family="${monoFont}" font-weight="800" filter="url(#glow)" y="36">${stats.totalPRs}</text>
    <text x="0" y="54" font-size="12" fill="${t.subtext}" font-family="${fontFamily}">merged across <tspan fill="${t.accent}" font-weight="600">${stats.totalRepos}</tspan> repos</text>
  </g>
  ${statsExtraMarkup}

  <!-- Divider -->
  <line x1="20" y1="${repoListStart - 8}" x2="${width - 20}" y2="${repoListStart - 8}" stroke="${t.border}" stroke-width="0.5" opacity="0.5"/>

  ${repoRows}
  ${remainingRow}

  <!-- Footer -->
  <text x="${width - 20}" y="${cardHeight - 10}" font-size="9" fill="${t.subtext}" text-anchor="end" font-family="${monoFont}" opacity="0.6">oss-card</text>
</svg>`;
}

function renderCompactLayout(username, stats, t, options) {
  const {
    maxRepos = 6,
    title = null,
    hideTitle = false,
    hideBorder = false,
    borderRadius = 12,
    width = 480,
    animation = "none",
    font = "default",
  } = options;

  const fontFamily = getFontFamily(font);
  const monoFont = font === "sans" ? fontFamily : "'JetBrains Mono', monospace";
  const displayTitle = title || "Open Source Contributions";
  const topRepos = stats.repos.slice(0, maxRepos);
  const animClass = animation !== "none" ? animation + "-in" : "";

  // Render repos as pill badges
  let pillsMarkup = "";
  let x = 20;
  let y = hideTitle ? 70 : 90;
  const pillHeight = 22;
  const pillPadding = 12;
  const pillGap = 8;
  const rowGap = 28;

  topRepos.forEach((repo, i) => {
    const shortName = repo.name.split("/")[1] || repo.name;
    const label = `${shortName} (${repo.count})`;
    const textWidth = label.length * 6.5;
    const pillWidth = textWidth + pillPadding * 2;

    if (x + pillWidth > width - 20) {
      x = 20;
      y += rowGap;
    }

    const delayClass = animClass ? `${animClass} ${animClass}-${i + 1}` : "";
    pillsMarkup += `
    <g transform="translate(${x}, ${y})" class="${delayClass}">
      <rect width="${pillWidth}" height="${pillHeight}" rx="11" fill="${t.badge}" stroke="${t.badgeBorder}" stroke-width="0.8"/>
      <text x="${pillPadding}" y="15" font-size="10" fill="${t.badgeText}" font-family="${monoFont}" font-weight="500">${label}</text>
    </g>`;
    x += pillWidth + pillGap;
  });

  const cardHeight = y + 50;
  const titleMarkup = hideTitle
    ? ""
    : `<text x="20" y="24" font-size="11" fill="${t.subtext}" font-family="${fontFamily}" font-weight="500" letter-spacing="1.5">${displayTitle.toUpperCase()}</text>`;

  const borderMarkup = hideBorder
    ? `<rect x="0" y="0" width="${width}" height="${cardHeight}" rx="${borderRadius}" fill="url(#bgGrad)"/>`
    : `<rect x="0.5" y="0.5" width="${width - 1}" height="${cardHeight - 1}" rx="${borderRadius}" fill="url(#bgGrad)" stroke="${t.border}" stroke-width="1"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${cardHeight}" viewBox="0 0 ${width} ${cardHeight}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${t.bg}"/>
      <stop offset="100%" style="stop-color:${t.bgGrad}"/>
    </linearGradient>
  </defs>
  ${getAnimationCSS(animation)}

  ${borderMarkup}
  ${titleMarkup}

  <g transform="translate(20, ${hideTitle ? 20 : 36})">
    <text font-size="28" fill="${t.text}" font-family="${monoFont}" font-weight="800" y="24">${stats.totalPRs}</text>
    <text x="60" y="24" font-size="12" fill="${t.subtext}" font-family="${fontFamily}">merged PRs across ${stats.totalRepos} repos</text>
  </g>

  ${pillsMarkup}

  <text x="${width - 20}" y="${cardHeight - 10}" font-size="9" fill="${t.subtext}" text-anchor="end" font-family="${monoFont}" opacity="0.6">oss-card</text>
</svg>`;
}

function renderMinimalLayout(username, stats, t, options) {
  const {
    title = null,
    hideTitle = false,
    hideBorder = false,
    borderRadius = 12,
    width = 300,
    animation = "none",
    font = "default",
  } = options;

  const fontFamily = getFontFamily(font);
  const monoFont = font === "sans" ? fontFamily : "'JetBrains Mono', monospace";
  const displayTitle = title || "OSS Contributions";
  const cardHeight = 120;
  const animClass = animation !== "none" ? animation + "-in fade-in-1" : "";

  const titleMarkup = hideTitle
    ? ""
    : `<text x="${width / 2}" y="24" font-size="10" fill="${t.subtext}" font-family="${fontFamily}" font-weight="500" letter-spacing="1.5" text-anchor="middle">${displayTitle.toUpperCase()}</text>`;

  const borderMarkup = hideBorder
    ? `<rect x="0" y="0" width="${width}" height="${cardHeight}" rx="${borderRadius}" fill="url(#bgGrad)"/>`
    : `<rect x="0.5" y="0.5" width="${width - 1}" height="${cardHeight - 1}" rx="${borderRadius}" fill="url(#bgGrad)" stroke="${t.border}" stroke-width="1"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${cardHeight}" viewBox="0 0 ${width} ${cardHeight}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${t.bg}"/>
      <stop offset="100%" style="stop-color:${t.bgGrad}"/>
    </linearGradient>
  </defs>
  ${getAnimationCSS(animation)}

  ${borderMarkup}
  ${titleMarkup}

  <text x="${width / 2}" y="72" font-size="48" fill="${t.text}" font-family="${monoFont}" font-weight="800" text-anchor="middle" class="${animClass}">${stats.totalPRs}</text>
  <text x="${width / 2}" y="96" font-size="12" fill="${t.subtext}" font-family="${fontFamily}" text-anchor="middle">merged PRs in ${stats.totalRepos} repos</text>

  <text x="${width - 12}" y="${cardHeight - 8}" font-size="8" fill="${t.subtext}" text-anchor="end" font-family="${monoFont}" opacity="0.5">oss-card</text>
</svg>`;
}

function renderDetailedLayout(username, stats, t, options) {
  const {
    maxRepos = 6,
    title = null,
    hideTitle = false,
    hideBorder = false,
    borderRadius = 12,
    width = 520,
    animation = "none",
    font = "default",
    showStats = false,
  } = options;

  const fontFamily = getFontFamily(font);
  const monoFont = font === "sans" ? fontFamily : "'JetBrains Mono', monospace";
  const displayTitle = title || "Open Source Contributions";
  const topRepos = stats.repos.slice(0, maxRepos);
  const animClass = animation !== "none" ? animation + "-in" : "";

  const headerHeight = hideTitle ? 20 : 34;
  const statsStart = headerHeight + 10;
  const repoListStart = statsStart + 60 + (showStats ? 24 : 0);
  const rowHeight = 44;

  const repoRows = topRepos
    .map((repo, i) => {
      const y = repoListStart + i * rowHeight;
      const shortName = repo.name.length > 35 ? repo.name.substring(0, 32) + "..." : repo.name;
      const prTitle = repo.lastPRTitle
        ? (repo.lastPRTitle.length > 50 ? repo.lastPRTitle.substring(0, 47) + "..." : repo.lastPRTitle)
        : "";
      const delayClass = animClass ? `${animClass} ${animClass}-${i + 1}` : "";
      return `
      <g transform="translate(20, ${y})" class="${delayClass}">
        <text x="0" y="12" font-size="12" fill="${t.text}" font-family="${fontFamily}" font-weight="600">${shortName}</text>
        <text x="0" y="28" font-size="10" fill="${t.subtext}" font-family="${fontFamily}" font-style="italic">${prTitle}</text>
        <rect x="${width - 70}" y="0" width="30" height="18" rx="9" fill="${t.badge}" stroke="${t.badgeBorder}" stroke-width="0.5"/>
        <text x="${width - 55}" y="13" font-size="10" fill="${t.badgeText}" font-family="${monoFont}" font-weight="600" text-anchor="middle">${repo.count}</text>
      </g>`;
    })
    .join("");

  const cardHeight = repoListStart + topRepos.length * rowHeight + 30;

  const titleMarkup = hideTitle
    ? ""
    : `<text x="20" y="28" font-size="11" fill="${t.subtext}" font-family="${fontFamily}" font-weight="500" letter-spacing="1.5">${displayTitle.toUpperCase()}</text>`;

  const statsExtraMarkup = showStats && stats.mostRecentDate
    ? `<text x="20" y="${statsStart + 74}" font-size="10" fill="${t.subtext}" font-family="${fontFamily}">Last contribution: ${stats.mostRecentDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</text>`
    : "";

  const borderMarkup = hideBorder
    ? `<rect x="0" y="0" width="${width}" height="${cardHeight}" rx="${borderRadius}" fill="url(#bgGrad)"/>`
    : `<rect x="0.5" y="0.5" width="${width - 1}" height="${cardHeight - 1}" rx="${borderRadius}" fill="url(#bgGrad)" stroke="${t.border}" stroke-width="1"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${cardHeight}" viewBox="0 0 ${width} ${cardHeight}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${t.bg}"/>
      <stop offset="100%" style="stop-color:${t.bgGrad}"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  ${getAnimationCSS(animation)}

  ${borderMarkup}
  ${titleMarkup}

  <g transform="translate(20, ${statsStart})">
    <text font-size="32" fill="${t.text}" font-family="${monoFont}" font-weight="800" filter="url(#glow)" y="36">${stats.totalPRs}</text>
    <text x="0" y="54" font-size="12" fill="${t.subtext}" font-family="${fontFamily}">merged across <tspan fill="${t.accent}" font-weight="600">${stats.totalRepos}</tspan> repos</text>
  </g>
  ${statsExtraMarkup}

  <line x1="20" y1="${repoListStart - 8}" x2="${width - 20}" y2="${repoListStart - 8}" stroke="${t.border}" stroke-width="0.5" opacity="0.5"/>

  ${repoRows}

  <text x="${width - 20}" y="${cardHeight - 10}" font-size="9" fill="${t.subtext}" text-anchor="end" font-family="${monoFont}" opacity="0.6">oss-card</text>
</svg>`;
}

function renderErrorCard(message, subtext) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="120" viewBox="0 0 480 120">
  <rect x="0.5" y="0.5" width="479" height="119" rx="12" fill="#0a0e17" stroke="#1e3a5f" stroke-width="1"/>
  <text x="240" y="50" font-size="14" fill="#e2e8f0" font-family="Inter, sans-serif" font-weight="600" text-anchor="middle">${message}</text>
  <text x="240" y="75" font-size="11" fill="#64748b" font-family="Inter, sans-serif" text-anchor="middle">${subtext || ""}</text>
  <text x="460" y="108" font-size="9" fill="#64748b" text-anchor="end" font-family="JetBrains Mono, monospace" opacity="0.6">oss-card</text>
</svg>`;
}

function renderCard(username, stats, options = {}) {
  const {
    theme = "dark",
    layout = "default",
    bg_color,
    border_color,
    title_color,
    text_color,
    accent_color,
  } = options;

  const t = getTheme(theme, { bg_color, border_color, title_color, text_color, accent_color });

  switch (layout) {
    case "compact":
      return renderCompactLayout(username, stats, t, options);
    case "minimal":
      return renderMinimalLayout(username, stats, t, options);
    case "detailed":
      return renderDetailedLayout(username, stats, t, options);
    default:
      return renderDefaultLayout(username, stats, t, options);
  }
}

module.exports = { renderCard, renderErrorCard };
