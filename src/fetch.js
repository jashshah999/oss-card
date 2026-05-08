const GITHUB_API = "https://api.github.com";

async function fetchMergedPRs(username, token) {
  const query = `author:${username} type:pr is:merged -user:${username}`;
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "oss-card",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = `${GITHUB_API}/search/issues?q=${encodeURIComponent(query)}&per_page=100&sort=updated`;

  let response;
  try {
    response = await fetch(url, { headers, signal: AbortSignal.timeout(10000) });
  } catch (err) {
    if (err.name === "TimeoutError") {
      throw new Error("TIMEOUT");
    }
    throw err;
  }

  if (response.status === 403 || response.status === 429) {
    throw new Error("RATE_LIMITED");
  }

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
  let mostRecentDate = null;
  const languages = new Set();

  for (const item of searchResults.items || []) {
    const repoUrl = item.repository_url;
    const repoName = repoUrl.replace("https://api.github.com/repos/", "");

    if (!repos[repoName]) {
      repos[repoName] = { name: repoName, count: 0, lastPRTitle: null, lastPRDate: null };
    }
    repos[repoName].count++;
    totalPRs++;

    const closedAt = item.closed_at ? new Date(item.closed_at) : null;
    if (closedAt) {
      if (!repos[repoName].lastPRDate || closedAt > repos[repoName].lastPRDate) {
        repos[repoName].lastPRDate = closedAt;
        repos[repoName].lastPRTitle = item.title;
      }
      if (!mostRecentDate || closedAt > mostRecentDate) {
        mostRecentDate = closedAt;
      }
    }

    // Extract language labels if present
    if (item.labels) {
      for (const label of item.labels) {
        const name = label.name.toLowerCase();
        // Common language labels
        if (["python", "javascript", "typescript", "rust", "c++", "c", "go", "java", "ruby", "swift", "kotlin"].includes(name)) {
          languages.add(label.name);
        }
      }
    }
  }

  const sortedRepos = Object.values(repos).sort((a, b) => b.count - a.count);

  return {
    totalPRs,
    totalRepos: sortedRepos.length,
    repos: sortedRepos,
    mostRecentDate,
    languages: [...languages],
  };
}

module.exports = { fetchMergedPRs, aggregatePRs };
