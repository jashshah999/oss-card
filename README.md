# oss-card

Embeddable SVG card showing your merged PRs across repos you don't own. The open-source contributions GitHub hides.

[![Example](https://oss-card.vercel.app/api?username=jashshah999&theme=dark&rank=true&show_streak=true)](https://github.com/jashshah999/oss-card)

**[Live Preview & Generator](https://oss-card.vercel.app/preview)** | **[JSON API](https://oss-card.vercel.app/api/json?username=jashshah999)**

## Usage

Add to your GitHub profile README:

```markdown
![OSS Contributions](https://oss-card.vercel.app/api?username=YOUR_USERNAME)
```

## Parameters

### Core

| Parameter | Default | Description |
|-----------|---------|-------------|
| `username` | (required) | GitHub username |
| `theme` | `dark` | `dark`, `light`, `dracula`, `nord`, `tokyonight`, `catppuccin`, `gruvbox`, `onedark`, `synthwave`, `cyberpunk` |
| `layout` | `default` | `default` (bars), `compact` (pills), `minimal` (big number), `detailed` (PR titles), `graph` (heatmap) |
| `max_repos` | `6` | Number of repos to show (1-20) |
| `title` | auto | Custom card title |
| `width` | `480` | Card width in px (400-800) |
| `border_radius` | `12` | Border radius (0-20) |
| `animation` | `none` | `none`, `fade`, `slide` |
| `font` | `default` | `default`, `mono`, `sans` |

### Display Options

| Parameter | Default | Description |
|-----------|---------|-------------|
| `show_avatar` | `false` | Show GitHub avatar (circular, top-right) |
| `show_streak` | `false` | Show consecutive-month contribution streak |
| `show_categories` | `false` | Show PR breakdown bar (features/fixes/perf/docs) |
| `show_notable` | `false` | Highlight contributions to repos with 1000+ stars |
| `show_trophies` | `false` | Show earned achievement badges |
| `rank` | `false` | Show letter rank (S/A/B/C/D) badge |
| `show_icons` | `false` | Show dots next to repos |
| `username_display` | `false` | Show @username under title |
| `show_stats` | `false` | Show last contribution date |
| `hide_title` | `false` | Hide the title |
| `hide_border` | `false` | Hide the border |

### Decorations

| Parameter | Default | Description |
|-----------|---------|-------------|
| `header` | `none` | Header pattern: `wave`, `geometric`, `dots`, `circuit`, `none` |
| `footer_text` | `oss-card` | Custom footer text |

### Filtering & Sorting

| Parameter | Default | Description |
|-----------|---------|-------------|
| `time_range` | `all` | `all`, `year`, `6months`, `3months` — filter PRs by time |
| `sort` | `count` | `count`, `recent`, `stars` — sort repos |
| `exclude_repos` | — | Comma-separated repos to exclude (e.g. `owner/repo`) |
| `include_orgs` | — | Only show PRs to specific orgs |

### Custom Colors

| Parameter | Description |
|-----------|-------------|
| `bg_color` | Background hex (no `#`, e.g. `0a0e17`) |
| `border_color` | Border hex |
| `title_color` | Title hex |
| `text_color` | Text hex |
| `accent_color` | Accent/bar hex |

## Rank System

Based on total merged PRs and repo diversity:

| Rank | Criteria |
|------|----------|
| **S** | 50+ PRs or 15+ repos |
| **A** | 25+ PRs or 10+ repos |
| **B** | 10+ PRs or 5+ repos |
| **C** | 5+ PRs |
| **D** | 1-4 PRs |

## Trophies

Earned achievement badges (enable with `show_trophies=true`):

| Trophy | Criteria |
|--------|----------|
| Polyglot | Contributed to 5+ different repos |
| On Fire | 3+ consecutive month streak |
| Star Contributor | Contributed to repo with 10K+ stars |
| Bug Hunter | 10+ bugfix PRs |
| Feature Builder | 10+ feature PRs |

## PR Categories

When `show_categories=true`, PRs are classified by title keywords:

- **Green** = features (`feat`, `add`, `new`, `implement`)
- **Blue** = fixes (`fix`, `bug`, `patch`)
- **Orange** = performance (`perf`, `optim`, `speed`)
- **Gray** = docs (`doc`, `readme`)
- **Purple** = refactor/other

Displayed as a stacked horizontal bar chart.

## Layouts

### Default (bar chart)
```
![OSS](https://oss-card.vercel.app/api?username=jashshah999&layout=default)
```

### Compact (pill badges)
```
![OSS](https://oss-card.vercel.app/api?username=jashshah999&layout=compact)
```

### Minimal (just the number)
```
![OSS](https://oss-card.vercel.app/api?username=jashshah999&layout=minimal)
```

### Detailed (with last PR title per repo)
```
![OSS](https://oss-card.vercel.app/api?username=jashshah999&layout=detailed)
```

### Graph (monthly heatmap)
```
![OSS](https://oss-card.vercel.app/api?username=jashshah999&layout=graph)
```

## Header Decorations

```markdown
<!-- Wave pattern -->
![OSS](https://oss-card.vercel.app/api?username=jashshah999&header=wave)

<!-- Geometric triangles -->
![OSS](https://oss-card.vercel.app/api?username=jashshah999&header=geometric)

<!-- Dot grid -->
![OSS](https://oss-card.vercel.app/api?username=jashshah999&header=dots)

<!-- Circuit board traces -->
![OSS](https://oss-card.vercel.app/api?username=jashshah999&header=circuit)
```

## JSON API

Get raw stats as JSON for custom integrations:

```
GET https://oss-card.vercel.app/api/json?username=YOUR_USERNAME
```

Response:
```json
{
  "username": "jashshah999",
  "totalPRs": 27,
  "totalRepos": 12,
  "repos": [{"name": "pytorch/pytorch", "count": 5, "stars": 85000, ...}],
  "categories": {"feature": 8, "fix": 12, "perf": 3, "docs": 2, "refactor": 1, "misc": 1},
  "streak": 5,
  "monthlyActivity": [{"month": "2025-06", "count": 3}, ...],
  "rank": "A",
  "rankLabel": "Excellent",
  "trophies": [{"label": "Polyglot", "desc": "5+ repos"}, ...],
  "notableOrgs": ["pytorch", "huggingface"]
}
```

Supports same filtering params: `time_range`, `exclude_repos`, `include_orgs`, `sort`.

## Themes

| Theme | Preview |
|-------|---------|
| dark | ![](https://oss-card.vercel.app/api?username=jashshah999&theme=dark&max_repos=3) |
| light | ![](https://oss-card.vercel.app/api?username=jashshah999&theme=light&max_repos=3) |
| dracula | ![](https://oss-card.vercel.app/api?username=jashshah999&theme=dracula&max_repos=3) |
| nord | ![](https://oss-card.vercel.app/api?username=jashshah999&theme=nord&max_repos=3) |
| tokyonight | ![](https://oss-card.vercel.app/api?username=jashshah999&theme=tokyonight&max_repos=3) |
| catppuccin | ![](https://oss-card.vercel.app/api?username=jashshah999&theme=catppuccin&max_repos=3) |
| gruvbox | ![](https://oss-card.vercel.app/api?username=jashshah999&theme=gruvbox&max_repos=3) |
| onedark | ![](https://oss-card.vercel.app/api?username=jashshah999&theme=onedark&max_repos=3) |
| synthwave | ![](https://oss-card.vercel.app/api?username=jashshah999&theme=synthwave&max_repos=3) |
| cyberpunk | ![](https://oss-card.vercel.app/api?username=jashshah999&theme=cyberpunk&max_repos=3) |

## Examples

```markdown
<!-- Full featured card -->
![OSS](https://oss-card.vercel.app/api?username=jashshah999&rank=true&show_streak=true&show_categories=true&show_trophies=true&header=wave)

<!-- Notable contributions only -->
![OSS](https://oss-card.vercel.app/api?username=jashshah999&show_notable=true&sort=stars&theme=cyberpunk)

<!-- Last 6 months, specific orgs -->
![OSS](https://oss-card.vercel.app/api?username=jashshah999&time_range=6months&include_orgs=pytorch,huggingface)

<!-- Graph heatmap layout -->
![OSS](https://oss-card.vercel.app/api?username=jashshah999&layout=graph&theme=tokyonight&header=circuit)

<!-- Custom colors with rank -->
![OSS](https://oss-card.vercel.app/api?username=jashshah999&bg_color=000000&accent_color=ff6600&text_color=ffffff&rank=true)
```

## Error Handling

- **0 PRs**: Renders a "No contributions found" card
- **Rate limited**: Renders a "Rate limited" card with retry instructions
- **Timeout**: Renders a "Request timed out" card

All error states return valid SVG so your README never shows a broken image.

## Self-hosting

Deploy your own instance to avoid rate limits:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jashshah999/oss-card&env=GITHUB_TOKEN&envDescription=GitHub%20personal%20access%20token%20for%20higher%20rate%20limits)

Set `GITHUB_TOKEN` as an environment variable (a token with no scopes works — it just increases the rate limit from 10 to 30 requests/minute).

## How it works

1. Queries GitHub Search API: `author:{username} type:pr is:merged -user:{username}`
2. Optionally fetches user profile (avatar, bio) and repo star counts
3. Categorizes PRs by title keywords, calculates streaks and monthly activity
4. Computes rank (S/A/B/C/D) and trophies based on contribution patterns
5. Renders a themed SVG card in the requested layout
6. Caches for 5 minutes (card endpoint) / 1 hour (Vercel edge)

## Rate limits

Without a token: 10 requests/minute (shared across all unauthenticated users).
With a `GITHUB_TOKEN`: 30 requests/minute.

The cache means each unique parameter combination is only fetched once per cache period.

## License

MIT
