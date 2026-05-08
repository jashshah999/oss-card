const GITHUB_API = "https://api.github.com";

async function fetchMergedPRs(username, token) {
  const query = `author:${username} type:pr is:merged -user:${username}`;
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "oss-card",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = `${GITHUB_API}/search/issues?q=${encodeURIComponent(query)}&per_page=100&sort=updated`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return data;
}

function aggregatePRs(searchResults) {
  const repos = {};
  let totalPRs = 0;

  for (const item of searchResults.items || []) {
    const repoUrl = item.repository_url;
    const repoName = repoUrl.replace("https://api.github.com/repos/", "");

    if (!repos[repoName]) {
      repos[repoName] = { name: repoName, count: 0 };
    }
    repos[repoName].count++;
    totalPRs++;
  }

  const sortedRepos = Object.values(repos).sort((a, b) => b.count - a.count);

  return {
    totalPRs,
    totalRepos: sortedRepos.length,
    repos: sortedRepos,
  };
}

module.exports = { fetchMergedPRs, aggregatePRs };
