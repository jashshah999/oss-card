# oss-card

Embeddable SVG card showing your merged PRs across repos you don't own. The open-source contributions GitHub hides.

[![Example](https://oss-card.vercel.app/api?username=jashshah999&theme=dark)](https://github.com/jashshah999/oss-card)

## Usage

Add to your GitHub profile README:

```markdown
![OSS Contributions](https://oss-card.vercel.app/api?username=YOUR_USERNAME)
```

## Options

| Parameter | Default | Description |
|-----------|---------|-------------|
| `username` | (required) | GitHub username |
| `theme` | `dark` | `dark`, `light`, or `dracula` |
| `max_repos` | `6` | Number of repos to show |
| `title` | auto | Custom card title |

## Examples

```markdown
<!-- Dark theme (default) -->
![OSS](https://oss-card.vercel.app/api?username=jashshah999)

<!-- Light theme -->
![OSS](https://oss-card.vercel.app/api?username=jashshah999&theme=light)

<!-- Custom title + fewer repos -->
![OSS](https://oss-card.vercel.app/api?username=jashshah999&theme=dracula&max_repos=4&title=My%20Contributions)
```

## Why?

GitHub profiles show your own repos but completely hide your contributions to other people's projects. A developer with 50 PRs merged into PyTorch, Linux, or React has no way to surface that on their profile.

This fixes that.

## What it shows

- Total merged PRs (excluding your own repos)
- Number of distinct repos contributed to
- Top repos by PR count with badge counts

## Self-hosting

Deploy your own instance to avoid rate limits:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jashshah999/oss-card&env=GITHUB_TOKEN&envDescription=GitHub%20personal%20access%20token%20for%20higher%20rate%20limits)

Set `GITHUB_TOKEN` as an environment variable (a token with no scopes works — it just increases the rate limit from 10 to 30 requests/minute).

## How it works

1. Queries GitHub Search API: `author:{username} type:pr is:merged -user:{username}`
2. Aggregates results by repo
3. Renders an SVG card
4. Caches for 1 hour

## Rate limits

Without a token: 10 requests/minute (shared across all unauthenticated users).
With a `GITHUB_TOKEN`: 30 requests/minute.

The 1-hour cache means each unique username is only fetched once per hour regardless of how many times the SVG is loaded.

## License

MIT
