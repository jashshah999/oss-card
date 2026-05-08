const { fetchMergedPRs, aggregatePRs } = require("../src/fetch");
const { renderCard } = require("../src/card");

module.exports = async function handler(req, res) {
  const { username, theme, max_repos, title } = req.query;

  if (!username) {
    res.status(400).send("Missing ?username= parameter");
    return;
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const searchResults = await fetchMergedPRs(username, token);
    const stats = aggregatePRs(searchResults);

    if (stats.totalPRs === 0) {
      res.status(404).send(`No merged PRs found for user: ${username}`);
      return;
    }

    const svg = renderCard(username, stats, {
      theme: theme || "dark",
      maxRepos: parseInt(max_repos) || 6,
      title: title || null,
    });

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
    res.status(200).send(svg);
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
};
