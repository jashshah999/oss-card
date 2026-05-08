# oss-card

Embeddable SVG card showing your merged PRs across repos you don't own. The open-source contributions GitHub hides.

[![Example](https://oss-card.vercel.app/api?username=jashshah999&theme=dark)](https://github.com/jashshah999/oss-card)

**[Live Preview & Generator](https://oss-card.vercel.app/preview)**

## Usage

Add to your GitHub profile README:

```markdown
![OSS Contributions](https://oss-card.vercel.app/api?username=YOUR_USERNAME)
```

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `username` | (required) | GitHub username |
| `theme` | `dark` | `dark`, `light`, `dracula`, `nord`, `tokyonight`, `catppuccin`, `gruvbox`, `onedark`, `synthwave`, `cyberpunk` |
| `layout` | `default` | `default` (bars), `compact` (pill badges), `minimal` (big number), `detailed` (with PR titles) |
| `max_repos` | `6` | Number of repos to show (1-20) |
| `title` | auto | Custom card title |
| `width` | `480` | Card width in px (400-800) |
| `border_radius` | `12` | Border radius (0-20) |
| `animation` | `none` | `none`, `fade`, `slide` (CSS animations in SVG) |
| `font` | `default` | `default`, `mono`, `sans` |
| `bg_color` | — | Custom background hex (no `#`, e.g. `0a0e17`) |
| `border_color` | — | Custom border hex |
| `title_color` | — | Custom title hex |
| `text_color` | — | Custom text hex |
| `accent_color` | — | Custom accent/bar hex |
| `hide_title` | `false` | Hide the title |
| `hide_border` | `false` | Hide the border |
| `show_icons` | `false` | Show language dots next to repos |
| `username_display` | `false` | Show @username under title |
| `show_stats` | `false` | Show extra stats (last contribution date) |
| `locale` | `en` | Locale (for future i18n) |

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

## Examples

```markdown
<!-- Cyberpunk theme, compact layout -->
![OSS](https://oss-card.vercel.app/api?username=jashshah999&theme=cyberpunk&layout=compact)

<!-- Custom colors -->
![OSS](https://oss-card.vercel.app/api?username=jashshah999&bg_color=000000&accent_color=ff6600&text_color=ffffff)

<!-- Minimal with slide animation -->
![OSS](https://oss-card.vercel.app/api?username=jashshah999&layout=minimal&animation=slide&theme=nord)

<!-- Detailed, no border, mono font -->
![OSS](https://oss-card.vercel.app/api?username=jashshah999&layout=detailed&hide_border=true&font=mono&theme=gruvbox)
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
2. Aggregates results by repo, extracts PR titles and dates
3. Renders a themed SVG card in the requested layout
4. Caches for 5 minutes (card endpoint) / 1 hour (Vercel edge)

## Rate limits

Without a token: 10 requests/minute (shared across all unauthenticated users).
With a `GITHUB_TOKEN`: 30 requests/minute.

The cache means each unique parameter combination is only fetched once per cache period.

## License

MIT
