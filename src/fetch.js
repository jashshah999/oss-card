const GITHUB_API = "https://api.github.com";

const NOTABLE_ORGS = new Set([
  "pytorch", "huggingface", "google", "facebook", "microsoft", "meta",
  "apple", "nvidia", "openai", "tensorflow", "rust-lang", "golang",
  "kubernetes", "docker", "elastic", "apache", "mozilla", "vercel",
  "nextjs", "reactjs", "vuejs", "angular", "sveltejs", "django",
  "pallets", "fastapi", "torvalds", "linux", "nodejs", "deno",
]);

async function fetchUserProfile(username, token) {
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "oss-card",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(`${GITHUB_API}/users/${username}`, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return {
      avatarUrl: data.avatar_url,
      name: data.name,
      bio: data.bio,
    };
  } catch {
    return null;
  }
}

async function fetchRepoStars(repoName, token) {
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "oss-card",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(`${GITHUB_API}/repos/${repoName}`, {
      headers,
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return 0;
    const data = await response.json();
    return data.stargazers_count || 0;
  } catch {
    return 0;
  }
}

async function fetchMergedPRs(username, token, options = {}) {
  const { timeRange = "all" } = options;

  let query = `author:${username} type:pr is:merged -user:${username}`;

  if (timeRange && timeRange !== "all") {
    const now = new Date();
    let since;
    if (timeRange === "year") {
      since = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    } else if (timeRange === "6months") {
      since = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    } else if (timeRange === "3months") {
      since = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    }
    if (since) {
      query += ` merged:>${since.toISOString().split("T")[0]}`;
    }
  }

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

function categorizePR(title) {
  const lower = (title || "").toLowerCase();
  if (/\bfix\b|bug|patch|hotfix/.test(lower)) return "fix";
  if (/\bfeat\b|\badd\b|feature|implement|new/.test(lower)) return "feature";
  if (/\bperf\b|performance|speed|optim/.test(lower)) return "perf";
  if (/\bdoc\b|\bdocs\b|readme|documentation/.test(lower)) return "docs";
  if (/\brefactor\b|cleanup|clean up|restructure/.test(lower)) return "refactor";
  return "misc";
}

function calculateStreak(items) {
  if (!items || items.length === 0) return 0;

  const months = new Set();
  for (const item of items) {
    if (item.closed_at) {
      const d = new Date(item.closed_at);
      months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }
  }

  const sortedMonths = [...months].sort().reverse();
  if (sortedMonths.length === 0) return 0;

  let streak = 1;
  for (let i = 1; i < sortedMonths.length; i++) {
    const [y1, m1] = sortedMonths[i - 1].split("-").map(Number);
    const [y2, m2] = sortedMonths[i].split("-").map(Number);
    const diff = (y1 * 12 + m1) - (y2 * 12 + m2);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function getMonthlyActivity(items) {
  const activity = {};
  const now = new Date();

  // Initialize last 12 months
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    activity[key] = 0;
  }

  for (const item of items || []) {
    if (item.closed_at) {
      const d = new Date(item.closed_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (key in activity) {
        activity[key]++;
      }
    }
  }

  return Object.entries(activity)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));
}

function aggregatePRs(searchResults, options = {}) {
  const { excludeRepos = [], includeOrgs = [], sort = "count" } = options;

  const excludeSet = new Set(excludeRepos.map((r) => r.toLowerCase()));
  const includeOrgSet = new Set(includeOrgs.map((o) => o.toLowerCase()));

  const repos = {};
  let totalPRs = 0;
  let mostRecentDate = null;
  const languages = new Set();
  const categories = { feature: 0, fix: 0, perf: 0, docs: 0, refactor: 0, misc: 0 };
  const orgSet = new Set();

  for (const item of searchResults.items || []) {
    const repoUrl = item.repository_url;
    const repoName = repoUrl.replace("https://api.github.com/repos/", "");
    const org = repoName.split("/")[0].toLowerCase();

    // Apply filters
    if (excludeSet.has(repoName.toLowerCase())) continue;
    if (includeOrgSet.size > 0 && !includeOrgSet.has(org)) continue;

    if (!repos[repoName]) {
      repos[repoName] = { name: repoName, count: 0, lastPRTitle: null, lastPRDate: null, stars: 0 };
    }
    repos[repoName].count++;
    totalPRs++;
    orgSet.add(org);

    // Categorize
    const cat = categorizePR(item.title);
    categories[cat]++;

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

    if (item.labels) {
      for (const label of item.labels) {
        const name = label.name.toLowerCase();
        if (["python", "javascript", "typescript", "rust", "c++", "c", "go", "java", "ruby", "swift", "kotlin"].includes(name)) {
          languages.add(label.name);
        }
      }
    }
  }

  let sortedRepos = Object.values(repos);
  if (sort === "recent") {
    sortedRepos.sort((a, b) => (b.lastPRDate || 0) - (a.lastPRDate || 0));
  } else {
    sortedRepos.sort((a, b) => b.count - a.count);
  }

  const streak = calculateStreak(searchResults.items);
  const monthlyActivity = getMonthlyActivity(searchResults.items);

  return {
    totalPRs,
    totalRepos: sortedRepos.length,
    repos: sortedRepos,
    mostRecentDate,
    languages: [...languages],
    categories,
    streak,
    monthlyActivity,
    orgs: [...orgSet],
  };
}

async function enrichWithStars(stats, token, maxRepos = 10) {
  // Fetch stars for top repos (limited to avoid rate limits)
  const reposToCheck = stats.repos.slice(0, maxRepos);
  const starPromises = reposToCheck.map((r) => fetchRepoStars(r.name, token));
  const stars = await Promise.all(starPromises);

  let hasStarRepo10k = false;
  const notableOrgs = [];

  reposToCheck.forEach((repo, i) => {
    repo.stars = stars[i];
    if (stars[i] >= 10000) hasStarRepo10k = true;
  });

  const highStarRepos = reposToCheck.filter((r) => r.stars >= 1000);
  const starRepoCount = reposToCheck.filter((r) => r.stars >= 100).length;

  // Check for notable orgs
  for (const org of stats.orgs) {
    if (NOTABLE_ORGS.has(org)) {
      notableOrgs.push(org);
    }
  }
  // Also mark orgs with 1000+ star repos as notable
  for (const repo of highStarRepos) {
    const org = repo.name.split("/")[0];
    if (!notableOrgs.includes(org)) {
      notableOrgs.push(org);
    }
  }

  stats.hasStarRepo10k = hasStarRepo10k;
  stats.notableOrgs = notableOrgs;
  stats.highStarRepos = highStarRepos.map((r) => r.name);
  stats.starRepoCount = starRepoCount;

  return stats;
}

module.exports = { fetchMergedPRs, fetchUserProfile, aggregatePRs, enrichWithStars };
