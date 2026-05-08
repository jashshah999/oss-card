const { fetchMergedPRs, fetchUserProfile, aggregatePRs, enrichWithStars } = require("../src/fetch");
const { calculateRank } = require("../src/rank");
const { calculateTrophies } = require("../src/trophies");

module.exports = async function handler(req, res) {
  const { username, exclude_repos, include_orgs, time_range, sort } = req.query;

  if (!username) {
    res.status(400).json({ error: "Missing ?username= parameter" });
    return;
  }

  try {
    const token = process.env.GITHUB_TOKEN;

    const searchResults = await fetchMergedPRs(username, token, {
      timeRange: ["year", "6months", "3months", "all"].includes(time_range) ? time_range : "all",
    });

    const excludeRepos = exclude_repos ? exclude_repos.split(",").map((s) => s.trim()) : [];
    const includeOrgsList = include_orgs ? include_orgs.split(",").map((s) => s.trim()) : [];

    let stats = aggregatePRs(searchResults, {
      excludeRepos,
      includeOrgs: includeOrgsList,
      sort: ["count", "recent", "stars"].includes(sort) ? sort : "count",
    });

    // Enrich with stars
    stats = await enrichWithStars(stats, token);

    const profile = await fetchUserProfile(username, token);
    const rank = calculateRank(stats);
    const trophies = calculateTrophies(stats);

    const response = {
      username,
      avatarUrl: profile ? profile.avatarUrl : null,
      name: profile ? profile.name : null,
      bio: profile ? profile.bio : null,
      totalPRs: stats.totalPRs,
      totalRepos: stats.totalRepos,
      repos: stats.repos.map((r) => ({
        name: r.name,
        count: r.count,
        stars: r.stars || 0,
        lastPRTitle: r.lastPRTitle,
        lastPRDate: r.lastPRDate,
      })),
      categories: stats.categories,
      streak: stats.streak,
      monthlyActivity: stats.monthlyActivity,
      rank: rank.letter,
      rankLabel: rank.label,
      trophies: trophies.map((t) => ({ label: t.label, desc: t.desc })),
      notableOrgs: stats.notableOrgs || [],
      starRepoCount: stats.starRepoCount || 0,
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(response);
  } catch (err) {
    if (err.message === "RATE_LIMITED") {
      res.status(429).json({ error: "Rate limited by GitHub. Try again in a minute." });
      return;
    }
    if (err.message === "TIMEOUT") {
      res.status(504).json({ error: "GitHub API timed out." });
      return;
    }
    res.status(500).json({ error: err.message.substring(0, 100) });
  }
};
