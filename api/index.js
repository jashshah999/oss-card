const { fetchMergedPRs, aggregatePRs } = require("../src/fetch");
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
  } = req.query;

  if (!username) {
    res.status(400).send("Missing ?username= parameter");
    return;
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const searchResults = await fetchMergedPRs(username, token);
    const stats = aggregatePRs(searchResults);

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
