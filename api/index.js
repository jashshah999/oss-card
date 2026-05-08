const { fetchMergedPRs, fetchUserProfile, aggregatePRs, enrichWithStars } = require("../src/fetch");
const { renderCard, renderErrorCard } = require("../src/card");

module.exports = async function handler(req, res) {
  const {
    username,
    theme,
    max_repos,
    title,
    bg_color,
    border_color,
    title_color,
    text_color,
    accent_color,
    hide_title,
    hide_border,
    border_radius,
    width,
    layout,
    show_icons,
    animation,
    font,
    username_display,
    show_stats,
    locale,
    // New params
    show_avatar,
    show_streak,
    show_categories,
    show_notable,
    show_trophies,
    rank,
    header,
    footer_text,
    exclude_repos,
    include_orgs,
    time_range,
    sort,
  } = req.query;

  if (!username) {
    res.status(400).send("Missing ?username= parameter");
    return;
  }

  try {
    const token = process.env.GITHUB_TOKEN;

    // Fetch PRs with time range filter
    const searchResults = await fetchMergedPRs(username, token, {
      timeRange: ["year", "6months", "3months", "all"].includes(time_range) ? time_range : "all",
    });

    // Aggregate with filters
    const excludeRepos = exclude_repos ? exclude_repos.split(",").map((s) => s.trim()) : [];
    const includeOrgsList = include_orgs ? include_orgs.split(",").map((s) => s.trim()) : [];

    let stats = aggregatePRs(searchResults, {
      excludeRepos,
      includeOrgs: includeOrgsList,
      sort: ["count", "recent", "stars"].includes(sort) ? sort : "count",
    });

    if (stats.totalPRs === 0) {
      const svg = renderErrorCard(
        "No contributions found",
        `@${username} has no merged PRs in external repos`
      );
      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
      res.status(200).send(svg);
      return;
    }

    // Fetch extra data if needed
    let avatarUrl = null;
    const needsProfile = show_avatar === "true";
    const needsStars = show_notable === "true" || show_trophies === "true" || sort === "stars";

    if (needsProfile) {
      const profile = await fetchUserProfile(username, token);
      if (profile) avatarUrl = profile.avatarUrl;
    }

    if (needsStars) {
      stats = await enrichWithStars(stats, token);
      if (sort === "stars") {
        stats.repos.sort((a, b) => (b.stars || 0) - (a.stars || 0));
      }
    }

    const parsedWidth = parseInt(width);
    const parsedBorderRadius = parseInt(border_radius);

    const svg = renderCard(username, stats, {
      theme: theme || "dark",
      maxRepos: Math.min(20, Math.max(1, parseInt(max_repos) || 6)),
      title: title || null,
      layout: layout || "default",
      bg_color: bg_color || null,
      border_color: border_color || null,
      title_color: title_color || null,
      text_color: text_color || null,
      accent_color: accent_color || null,
      hideTitle: hide_title === "true",
      hideBorder: hide_border === "true",
      borderRadius: parsedBorderRadius >= 0 && parsedBorderRadius <= 20 ? parsedBorderRadius : 12,
      width: parsedWidth >= 400 && parsedWidth <= 800 ? parsedWidth : (layout === "minimal" ? 300 : layout === "detailed" ? 520 : 480),
      showIcons: show_icons === "true",
      animation: ["fade", "slide"].includes(animation) ? animation : "none",
      font: ["mono", "sans", "default"].includes(font) ? font : "default",
      usernameDisplay: username_display === "true",
      showStats: show_stats === "true",
      locale: locale || "en",
      // New options
      showAvatar: show_avatar === "true",
      avatarUrl,
      showStreak: show_streak === "true",
      showCategories: show_categories === "true",
      showNotable: show_notable === "true",
      showTrophies: show_trophies === "true",
      rank: rank === "true",
      header: ["wave", "geometric", "dots", "circuit", "none"].includes(header) ? header : "none",
      footerText: footer_text || "oss-card",
    });

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
    res.status(200).send(svg);
  } catch (err) {
    if (err.message === "RATE_LIMITED") {
      const svg = renderErrorCard(
        "Rate limited by GitHub",
        "Try again in a minute, or deploy with your own GITHUB_TOKEN"
      );
      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "public, max-age=60, s-maxage=60");
      res.status(200).send(svg);
      return;
    }
    if (err.message === "TIMEOUT") {
      const svg = renderErrorCard(
        "Request timed out",
        "GitHub API took too long to respond"
      );
      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "public, max-age=60, s-maxage=60");
      res.status(200).send(svg);
      return;
    }
    const svg = renderErrorCard("Something went wrong", err.message.substring(0, 60));
    res.setHeader("Content-Type", "image/svg+xml");
    res.status(500).send(svg);
  }
};
