const { getTheme } = require("./themes");
const { calculateRank } = require("./rank");
const { calculateTrophies } = require("./trophies");

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

function renderHeaderDecoration(header, width, t) {
  if (!header || header === "none") {
    return `<rect x="20" y="0" width="120" height="2" rx="1" fill="url(#glowGrad)" filter="url(#glow)"/>`;
  }

  if (header === "wave") {
    const points = [];
    for (let x = 0; x <= width; x += 4) {
      const y = 10 + Math.sin(x * 0.04) * 6;
      points.push(`${x},${y}`);
    }
    return `
      <path d="M 0,10 ${points.map((p, i) => (i === 0 ? "M " : "L ") + p).join(" ")}"
            fill="none" stroke="${t.accent}" stroke-width="1.5" opacity="0.4"/>
      <path d="M 0,16 ${points.map((p, i) => { const [x, y] = p.split(","); return (i === 0 ? "M " : "L ") + x + "," + (parseFloat(y) + 6); }).join(" ")}"
            fill="none" stroke="${t.accent}" stroke-width="0.8" opacity="0.2"/>`;
  }

  if (header === "geometric") {
    let shapes = "";
    for (let i = 0; i < width; i += 24) {
      const opacity = 0.1 + Math.random() * 0.2;
      shapes += `<polygon points="${i + 12},2 ${i + 20},16 ${i + 4},16" fill="${t.accent}" opacity="${opacity.toFixed(2)}"/>`;
    }
    return shapes;
  }

  if (header === "dots") {
    let dots = "";
    for (let x = 10; x < width - 10; x += 16) {
      for (let y = 4; y < 20; y += 8) {
        const opacity = 0.1 + Math.random() * 0.3;
        dots += `<circle cx="${x}" cy="${y}" r="2" fill="${t.accent}" opacity="${opacity.toFixed(2)}"/>`;
      }
    }
    return dots;
  }

  if (header === "circuit") {
    let paths = "";
    for (let x = 20; x < width - 20; x += 40) {
      const y1 = 4 + Math.random() * 12;
      const y2 = 4 + Math.random() * 12;
      const midX = x + 20;
      paths += `<path d="M ${x},${y1} L ${midX},${y1} L ${midX},${y2} L ${x + 40},${y2}" fill="none" stroke="${t.accent}" stroke-width="1" opacity="0.25"/>`;
      paths += `<circle cx="${x}" cy="${y1}" r="2" fill="${t.accent}" opacity="0.4"/>`;
    }
    return paths;
  }

  return `<rect x="20" y="0" width="120" height="2" rx="1" fill="url(#glowGrad)" filter="url(#glow)"/>`;
}

function renderRankBadge(rank, x, y) {
  return `
    <g transform="translate(${x}, ${y})">
      <circle cx="0" cy="0" r="22" fill="none" stroke="${rank.color}" stroke-width="2.5" opacity="0.8"/>
      <circle cx="0" cy="0" r="18" fill="${rank.color}" opacity="0.15"/>
      <text x="0" y="7" font-size="20" fill="${rank.color}" font-family="'JetBrains Mono', monospace" font-weight="900" text-anchor="middle">${rank.letter}</text>
    </g>`;
}

function renderAvatar(avatarUrl, x, y) {
  if (!avatarUrl) return "";
  return `
    <g transform="translate(${x}, ${y})">
      <defs>
        <clipPath id="avatarClip">
          <circle cx="20" cy="20" r="20"/>
        </clipPath>
      </defs>
      <circle cx="20" cy="20" r="21" fill="none" stroke="${"#ffffff"}" stroke-width="1.5" opacity="0.3"/>
      <image href="${avatarUrl}" x="0" y="0" width="40" height="40" clip-path="url(#avatarClip)"/>
    </g>`;
}

function renderCategoryBar(categories, x, y, width, t) {
  const total = Object.values(categories).reduce((s, v) => s + v, 0);
  if (total === 0) return "";

  const colors = {
    feature: "#34d399",
    fix: "#60a5fa",
    perf: "#fb923c",
    docs: "#94a3b8",
    refactor: "#a78bfa",
    misc: "#6b7280",
  };

  const barWidth = width - 40;
  let currentX = x;
  let bars = "";
  let labels = "";
  let labelX = x;

  for (const [cat, count] of Object.entries(categories)) {
    if (count === 0) continue;
    const w = (count / total) * barWidth;
    bars += `<rect x="${currentX}" y="${y}" width="${w}" height="8" fill="${colors[cat]}" rx="0"/>`;
    currentX += w;
  }

  // Round corners on the full bar
  bars = `<g>
    <clipPath id="catBarClip"><rect x="${x}" y="${y}" width="${barWidth}" height="8" rx="4"/></clipPath>
    <g clip-path="url(#catBarClip)">${bars}</g>
  </g>`;

  // Labels
  labelX = x;
  for (const [cat, count] of Object.entries(categories)) {
    if (count === 0) continue;
    const shortLabel = cat === "feature" ? "feat" : cat;
    labels += `<g transform="translate(${labelX}, ${y + 16})">
      <rect width="6" height="6" rx="1" fill="${colors[cat]}"/>
      <text x="8" y="6" font-size="8" fill="${t.subtext}" font-family="Inter, sans-serif">${shortLabel} ${count}</text>
    </g>`;
    labelX += 56;
  }

  return bars + labels;
}

function renderStreakBadge(streak, x, y, t) {
  if (!streak || streak === 0) return "";
  return `
    <g transform="translate(${x}, ${y})">
      <rect width="${60 + String(streak).length * 6}" height="20" rx="10" fill="${t.badge}" stroke="${t.badgeBorder}" stroke-width="0.5"/>
      <text x="8" y="14" font-size="10" fill="${t.badgeText}" font-family="Inter, sans-serif">&#x1F525; ${streak}mo streak</text>
    </g>`;
}

function renderNotableLine(notableOrgs, x, y, t) {
  if (!notableOrgs || notableOrgs.length === 0) return "";
  const names = notableOrgs.slice(0, 5).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(", ");
  return `<text x="${x}" y="${y}" font-size="10" fill="${t.accent}" font-family="Inter, sans-serif" font-weight="500">&#x26A1; Notable: ${names}</text>`;
}

function renderTrophies(trophies, x, y, t, width) {
  if (!trophies || trophies.length === 0) return { markup: "", height: 0 };

  let currentX = x;
  let markup = "";

  for (const trophy of trophies) {
    const label = `${trophy.emoji} ${trophy.label}`;
    const pillWidth = label.length * 7 + 16;
    if (currentX + pillWidth > width - 20) {
      currentX = x;
      y += 26;
    }
    markup += `
      <g transform="translate(${currentX}, ${y})">
        <rect width="${pillWidth}" height="20" rx="10" fill="${t.badge}" stroke="${t.badgeBorder}" stroke-width="0.5"/>
        <text x="8" y="14" font-size="9" fill="${t.badgeText}" font-family="Inter, sans-serif" font-weight="500">${label}</text>
      </g>`;
    currentX += pillWidth + 8;
  }

  return { markup, height: 30 };
}

function renderGraphLayout(username, stats, t, options) {
  const {
    title = null,
    hideTitle = false,
    hideBorder = false,
    borderRadius = 12,
    width = 480,
    animation = "none",
    font = "default",
    header = "none",
    footerText = "oss-card",
    showStreak = false,
    rank: showRank = false,
  } = options;

  const fontFamily = getFontFamily(font);
  const monoFont = font === "sans" ? fontFamily : "'JetBrains Mono', monospace";
  const displayTitle = title || "Contribution Activity";
  const monthly = stats.monthlyActivity || [];

  const headerHeight = hideTitle ? 20 : 40;
  const graphY = headerHeight + 30;
  const squareSize = 28;
  const gap = 6;
  const graphWidth = monthly.length * (squareSize + gap);
  const startX = (width - graphWidth) / 2;

  const maxCount = Math.max(...monthly.map((m) => m.count), 1);

  let squares = "";
  monthly.forEach((m, i) => {
    const intensity = m.count / maxCount;
    const opacity = m.count === 0 ? 0.1 : 0.2 + intensity * 0.8;
    const x = startX + i * (squareSize + gap);
    squares += `<rect x="${x}" y="${graphY}" width="${squareSize}" height="${squareSize}" rx="4" fill="${t.accent}" opacity="${opacity.toFixed(2)}"/>`;
    if (m.count > 0) {
      squares += `<text x="${x + squareSize / 2}" y="${graphY + squareSize / 2 + 4}" font-size="9" fill="${t.text}" font-family="${monoFont}" text-anchor="middle" font-weight="600">${m.count}</text>`;
    }
    // Month label
    const monthLabel = m.month.split("-")[1];
    squares += `<text x="${x + squareSize / 2}" y="${graphY + squareSize + 14}" font-size="7" fill="${t.subtext}" font-family="${fontFamily}" text-anchor="middle">${monthLabel}</text>`;
  });

  let extraY = graphY + squareSize + 30;
  let extraMarkup = "";

  if (showStreak && stats.streak > 0) {
    extraMarkup += renderStreakBadge(stats.streak, 20, extraY, t);
    extraY += 30;
  }

  const cardHeight = extraY + 20;

  const titleMarkup = hideTitle
    ? ""
    : `<text x="20" y="28" font-size="11" fill="${t.subtext}" font-family="${fontFamily}" font-weight="500" letter-spacing="1.5">${displayTitle.toUpperCase()}</text>`;

  const rankMarkup = showRank ? renderRankBadge(calculateRank(stats), width - 40, 30) : "";

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
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  ${getAnimationCSS(animation)}
  ${borderMarkup}
  ${renderHeaderDecoration(header, width, t)}
  ${titleMarkup}
  ${rankMarkup}

  <!-- Stats summary -->
  <text x="20" y="${headerHeight + 16}" font-size="12" fill="${t.text}" font-family="${fontFamily}">
    <tspan font-weight="700" font-size="14">${stats.totalPRs}</tspan> merged PRs across <tspan fill="${t.accent}" font-weight="600">${stats.totalRepos}</tspan> repos
  </text>

  ${squares}
  ${extraMarkup}

  <text x="${width - 20}" y="${cardHeight - 10}" font-size="9" fill="${t.subtext}" text-anchor="end" font-family="${monoFont}" opacity="0.6">${footerText}</text>
</svg>`;
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
    header = "none",
    footerText = "oss-card",
    showAvatar = false,
    showStreak = false,
    showCategories = false,
    showNotable = false,
    showTrophies = false,
    rank: showRank = false,
    avatarUrl = null,
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
  let repoListStart = statsStart + 60 + (showStats ? 24 : 0);

  // Extra sections height
  let extraSections = "";
  let extraHeight = 0;

  if (showCategories && stats.categories) {
    extraSections += renderCategoryBar(stats.categories, 20, repoListStart - 4, width, t);
    extraHeight += 34;
    repoListStart += 34;
  }

  if (showStreak && stats.streak > 0) {
    extraSections += renderStreakBadge(stats.streak, 20, repoListStart - 4, t);
    extraHeight += 28;
    repoListStart += 28;
  }

  if (showNotable && stats.notableOrgs && stats.notableOrgs.length > 0) {
    extraSections += renderNotableLine(stats.notableOrgs, 20, repoListStart + 4, t);
    extraHeight += 20;
    repoListStart += 20;
  }

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
      const starBadge = repo.stars >= 1000 ? `<text x="${iconOffset + barWidth + 12 + shortName.length * 7 + 8}" y="15" font-size="9" fill="${t.subtext}" font-family="${fontFamily}">&#x2B50;${repo.stars >= 1000 ? Math.floor(repo.stars / 1000) + "k" : repo.stars}</text>` : "";
      return `
      <g transform="translate(20, ${y})" class="${delayClass}">
        ${icon}
        <rect x="${iconOffset}" y="2" width="${barWidth}" height="18" rx="4" fill="${t.barBg}" stroke="${t.badgeBorder}" stroke-width="0.5" opacity="0.6"/>
        <rect x="${iconOffset}" y="2" width="${barWidth}" height="18" rx="4" fill="${t.bar}" opacity="0.2"/>
        <text x="${iconOffset + 8}" y="15" font-size="11" fill="${t.badgeText}" font-family="${monoFont}" font-weight="600">${repo.count}</text>
        <text x="${iconOffset + barWidth + 12}" y="15" font-size="12" fill="${t.text}" font-family="${fontFamily}" font-weight="500">${shortName}</text>
        ${starBadge}
      </g>`;
    })
    .join("");

  const remainingRepos = stats.totalRepos - maxRepos;
  const remainingRow =
    remainingRepos > 0
      ? `<text x="20" y="${repoListStart + topRepos.length * rowHeight + 18}" font-size="11" fill="${t.subtext}" font-family="${fontFamily}" font-style="italic">+ ${remainingRepos} more repos</text>`
      : "";

  let cardHeight = repoListStart + topRepos.length * rowHeight + (remainingRepos > 0 ? 40 : 20);

  // Trophies
  let trophyMarkup = "";
  if (showTrophies) {
    const trophies = calculateTrophies(stats);
    if (trophies.length > 0) {
      const result = renderTrophies(trophies, 20, cardHeight, t, width);
      trophyMarkup = result.markup;
      cardHeight += result.height + 10;
    }
  }

  cardHeight += 10; // footer padding

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

  const rankMarkup = showRank ? renderRankBadge(calculateRank(stats), width - 40, 30) : "";
  const avatarMarkup = showAvatar ? renderAvatar(avatarUrl, width - 60, hideTitle ? 4 : 8) : "";

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

  <!-- Header decoration -->
  ${renderHeaderDecoration(header, width, t)}

  <!-- Header -->
  ${titleMarkup}
  ${usernameMarkup}
  ${rankMarkup}
  ${avatarMarkup}

  <!-- Stats -->
  <g transform="translate(20, ${statsStart})">
    <text font-size="38" fill="${t.text}" font-family="${monoFont}" font-weight="800" filter="url(#glow)" y="36">${stats.totalPRs}</text>
    <text x="0" y="54" font-size="12" fill="${t.subtext}" font-family="${fontFamily}">merged across <tspan fill="${t.accent}" font-weight="600">${stats.totalRepos}</tspan> repos</text>
  </g>
  ${statsExtraMarkup}

  ${extraSections}

  <!-- Divider -->
  <line x1="20" y1="${repoListStart - 8}" x2="${width - 20}" y2="${repoListStart - 8}" stroke="${t.border}" stroke-width="0.5" opacity="0.5"/>

  ${repoRows}
  ${remainingRow}
  ${trophyMarkup}

  <!-- Footer -->
  <text x="${width - 20}" y="${cardHeight - 10}" font-size="9" fill="${t.subtext}" text-anchor="end" font-family="${monoFont}" opacity="0.6">${footerText}</text>
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
    header = "none",
    footerText = "oss-card",
    rank: showRank = false,
  } = options;

  const fontFamily = getFontFamily(font);
  const monoFont = font === "sans" ? fontFamily : "'JetBrains Mono', monospace";
  const displayTitle = title || "Open Source Contributions";
  const topRepos = stats.repos.slice(0, maxRepos);
  const animClass = animation !== "none" ? animation + "-in" : "";

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

  const rankMarkup = showRank ? renderRankBadge(calculateRank(stats), width - 40, 30) : "";

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
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  ${getAnimationCSS(animation)}

  ${borderMarkup}
  ${renderHeaderDecoration(header, width, t)}
  ${titleMarkup}
  ${rankMarkup}

  <g transform="translate(20, ${hideTitle ? 20 : 36})">
    <text font-size="28" fill="${t.text}" font-family="${monoFont}" font-weight="800" y="24">${stats.totalPRs}</text>
    <text x="60" y="24" font-size="12" fill="${t.subtext}" font-family="${fontFamily}">merged PRs across ${stats.totalRepos} repos</text>
  </g>

  ${pillsMarkup}

  <text x="${width - 20}" y="${cardHeight - 10}" font-size="9" fill="${t.subtext}" text-anchor="end" font-family="${monoFont}" opacity="0.6">${footerText}</text>
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
    header = "none",
    footerText = "oss-card",
    rank: showRank = false,
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

  const rankMarkup = showRank ? renderRankBadge(calculateRank(stats), width - 35, 60) : "";

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
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  ${getAnimationCSS(animation)}

  ${borderMarkup}
  ${renderHeaderDecoration(header, width, t)}
  ${titleMarkup}
  ${rankMarkup}

  <text x="${width / 2}" y="72" font-size="48" fill="${t.text}" font-family="${monoFont}" font-weight="800" text-anchor="middle" class="${animClass}">${stats.totalPRs}</text>
  <text x="${width / 2}" y="96" font-size="12" fill="${t.subtext}" font-family="${fontFamily}" text-anchor="middle">merged PRs in ${stats.totalRepos} repos</text>

  <text x="${width - 12}" y="${cardHeight - 8}" font-size="8" fill="${t.subtext}" text-anchor="end" font-family="${monoFont}" opacity="0.5">${footerText}</text>
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
    header = "none",
    footerText = "oss-card",
    showCategories = false,
    showNotable = false,
    showTrophies = false,
    rank: showRank = false,
  } = options;

  const fontFamily = getFontFamily(font);
  const monoFont = font === "sans" ? fontFamily : "'JetBrains Mono', monospace";
  const displayTitle = title || "Open Source Contributions";
  const topRepos = stats.repos.slice(0, maxRepos);
  const animClass = animation !== "none" ? animation + "-in" : "";

  const headerHeight = hideTitle ? 20 : 34;
  const statsStart = headerHeight + 10;
  let repoListStart = statsStart + 60 + (showStats ? 24 : 0);

  let extraSections = "";
  if (showCategories && stats.categories) {
    extraSections += renderCategoryBar(stats.categories, 20, repoListStart - 4, width, t);
    repoListStart += 34;
  }
  if (showNotable && stats.notableOrgs && stats.notableOrgs.length > 0) {
    extraSections += renderNotableLine(stats.notableOrgs, 20, repoListStart + 4, t);
    repoListStart += 20;
  }

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

  let cardHeight = repoListStart + topRepos.length * rowHeight + 30;

  let trophyMarkup = "";
  if (showTrophies) {
    const trophies = calculateTrophies(stats);
    if (trophies.length > 0) {
      const result = renderTrophies(trophies, 20, cardHeight - 10, t, width);
      trophyMarkup = result.markup;
      cardHeight += result.height + 10;
    }
  }

  const titleMarkup = hideTitle
    ? ""
    : `<text x="20" y="28" font-size="11" fill="${t.subtext}" font-family="${fontFamily}" font-weight="500" letter-spacing="1.5">${displayTitle.toUpperCase()}</text>`;

  const statsExtraMarkup = showStats && stats.mostRecentDate
    ? `<text x="20" y="${statsStart + 74}" font-size="10" fill="${t.subtext}" font-family="${fontFamily}">Last contribution: ${stats.mostRecentDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</text>`
    : "";

  const borderMarkup = hideBorder
    ? `<rect x="0" y="0" width="${width}" height="${cardHeight}" rx="${borderRadius}" fill="url(#bgGrad)"/>`
    : `<rect x="0.5" y="0.5" width="${width - 1}" height="${cardHeight - 1}" rx="${borderRadius}" fill="url(#bgGrad)" stroke="${t.border}" stroke-width="1"/>`;

  const rankMarkup = showRank ? renderRankBadge(calculateRank(stats), width - 40, 30) : "";

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
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  ${getAnimationCSS(animation)}

  ${borderMarkup}
  ${renderHeaderDecoration(header, width, t)}
  ${titleMarkup}
  ${rankMarkup}

  <g transform="translate(20, ${statsStart})">
    <text font-size="32" fill="${t.text}" font-family="${monoFont}" font-weight="800" filter="url(#glow)" y="36">${stats.totalPRs}</text>
    <text x="0" y="54" font-size="12" fill="${t.subtext}" font-family="${fontFamily}">merged across <tspan fill="${t.accent}" font-weight="600">${stats.totalRepos}</tspan> repos</text>
  </g>
  ${statsExtraMarkup}
  ${extraSections}

  <line x1="20" y1="${repoListStart - 8}" x2="${width - 20}" y2="${repoListStart - 8}" stroke="${t.border}" stroke-width="0.5" opacity="0.5"/>

  ${repoRows}
  ${trophyMarkup}

  <text x="${width - 20}" y="${cardHeight - 10}" font-size="9" fill="${t.subtext}" text-anchor="end" font-family="${monoFont}" opacity="0.6">${footerText}</text>
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
    case "graph":
      return renderGraphLayout(username, stats, t, options);
    default:
      return renderDefaultLayout(username, stats, t, options);
  }
}

module.exports = { renderCard, renderErrorCard };
