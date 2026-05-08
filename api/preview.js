module.exports = function handler(req, res) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>oss-card — GitHub Contribution Card Generator</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, system-ui, sans-serif;
      background: #0a0e17;
      color: #e2e8f0;
      min-height: 100vh;
      padding: 40px 20px;
    }
    .container { max-width: 1100px; margin: 0 auto; }
    h1 { font-size: 2rem; font-weight: 800; margin-bottom: 8px; }
    h1 span { color: #22d3ee; }
    .subtitle { color: #64748b; font-size: 0.95rem; margin-bottom: 32px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
    .panel {
      background: #0f1923;
      border: 1px solid #1e3a5f;
      border-radius: 12px;
      padding: 24px;
    }
    .panel h2 { font-size: 1rem; font-weight: 600; margin-bottom: 16px; color: #7dd3fc; }
    .field { margin-bottom: 14px; }
    .field label { display: block; font-size: 0.8rem; color: #94a3b8; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .field input, .field select {
      width: 100%;
      padding: 8px 12px;
      background: #1a2332;
      border: 1px solid #2d4a6f;
      border-radius: 6px;
      color: #e2e8f0;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .field input:focus, .field select:focus { border-color: #22d3ee; }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .field-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
    .checkbox-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 14px; }
    .checkbox-row label { font-size: 0.85rem; color: #94a3b8; display: flex; align-items: center; gap: 6px; cursor: pointer; }
    .checkbox-row input[type="checkbox"] { accent-color: #22d3ee; }
    .preview-area {
      background: #060a10;
      border: 1px solid #1e3a5f;
      border-radius: 8px;
      padding: 20px;
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .preview-area img { max-width: 100%; height: auto; }
    .url-box {
      background: #1a2332;
      border: 1px solid #2d4a6f;
      border-radius: 6px;
      padding: 10px 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #94a3b8;
      word-break: break-all;
      position: relative;
      cursor: pointer;
      margin-bottom: 12px;
    }
    .url-box:hover { border-color: #22d3ee; }
    .url-box .copy-hint {
      position: absolute; top: -8px; right: 8px; background: #22d3ee; color: #0a0e17;
      font-size: 0.65rem; padding: 1px 6px; border-radius: 4px; font-weight: 600;
    }
    .btn {
      background: #22d3ee;
      color: #0a0e17;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn:hover { opacity: 0.85; }
    .btn-outline {
      background: transparent;
      border: 1px solid #22d3ee;
      color: #22d3ee;
    }
    .btn-row { display: flex; gap: 10px; flex-wrap: wrap; }
    .section-divider { border-top: 1px solid #1e3a5f; margin: 16px 0; }
    .theme-gallery { margin-top: 40px; }
    .theme-gallery h2 { font-size: 1.2rem; margin-bottom: 20px; color: #7dd3fc; }
    .theme-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
    .theme-card {
      background: #0f1923;
      border: 1px solid #1e3a5f;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    .theme-card:hover { border-color: #22d3ee; }
    .theme-card img { width: 100%; height: auto; border-radius: 4px; margin-bottom: 8px; }
    .theme-card span { font-size: 0.8rem; color: #94a3b8; text-transform: capitalize; }
  </style>
</head>
<body>
  <div class="container">
    <h1>oss<span>-</span>card</h1>
    <p class="subtitle">Generate an embeddable SVG card showing your open source contributions. Now with ranks, trophies, streaks, and more.</p>

    <div class="grid">
      <div class="panel">
        <h2>Configuration</h2>
        <div class="field">
          <label>GitHub Username</label>
          <input type="text" id="username" placeholder="jashshah999" value="jashshah999">
        </div>
        <div class="field-row">
          <div class="field">
            <label>Theme</label>
            <select id="theme">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="dracula">Dracula</option>
              <option value="nord">Nord</option>
              <option value="tokyonight">Tokyo Night</option>
              <option value="catppuccin">Catppuccin</option>
              <option value="gruvbox">Gruvbox</option>
              <option value="onedark">One Dark</option>
              <option value="synthwave">Synthwave</option>
              <option value="cyberpunk">Cyberpunk</option>
            </select>
          </div>
          <div class="field">
            <label>Layout</label>
            <select id="layout">
              <option value="default">Default (bars)</option>
              <option value="compact">Compact (pills)</option>
              <option value="minimal">Minimal (number)</option>
              <option value="detailed">Detailed (with PR titles)</option>
              <option value="graph">Graph (heatmap)</option>
            </select>
          </div>
        </div>
        <div class="field-row-3">
          <div class="field">
            <label>Max Repos</label>
            <input type="number" id="max_repos" min="1" max="20" value="6">
          </div>
          <div class="field">
            <label>Width</label>
            <input type="number" id="width" min="400" max="800" value="480">
          </div>
          <div class="field">
            <label>Time Range</label>
            <select id="time_range">
              <option value="all">All time</option>
              <option value="year">Last year</option>
              <option value="6months">Last 6 months</option>
              <option value="3months">Last 3 months</option>
            </select>
          </div>
        </div>
        <div class="field-row-3">
          <div class="field">
            <label>Animation</label>
            <select id="animation">
              <option value="none">None</option>
              <option value="fade">Fade</option>
              <option value="slide">Slide</option>
            </select>
          </div>
          <div class="field">
            <label>Font</label>
            <select id="font">
              <option value="default">Default</option>
              <option value="mono">Mono</option>
              <option value="sans">Sans</option>
            </select>
          </div>
          <div class="field">
            <label>Header</label>
            <select id="header">
              <option value="none">None (accent line)</option>
              <option value="wave">Wave</option>
              <option value="geometric">Geometric</option>
              <option value="dots">Dots</option>
              <option value="circuit">Circuit</option>
            </select>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label>Border Radius (0-20)</label>
            <input type="number" id="border_radius" min="0" max="20" value="12">
          </div>
          <div class="field">
            <label>Sort</label>
            <select id="sort">
              <option value="count">By PR count</option>
              <option value="recent">Most recent</option>
              <option value="stars">By stars</option>
            </select>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label>Title (optional)</label>
            <input type="text" id="title" placeholder="Custom title...">
          </div>
          <div class="field">
            <label>Footer Text</label>
            <input type="text" id="footer_text" placeholder="oss-card">
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label>Exclude Repos (comma-sep)</label>
            <input type="text" id="exclude_repos" placeholder="owner/repo, owner/repo2">
          </div>
          <div class="field">
            <label>Include Orgs Only</label>
            <input type="text" id="include_orgs" placeholder="pytorch, huggingface">
          </div>
        </div>

        <div class="section-divider"></div>
        <h2>Custom Colors (hex, no #)</h2>
        <div class="field-row">
          <div class="field">
            <label>Background</label>
            <input type="text" id="bg_color" placeholder="0a0e17">
          </div>
          <div class="field">
            <label>Border</label>
            <input type="text" id="border_color" placeholder="1e3a5f">
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label>Title Color</label>
            <input type="text" id="title_color" placeholder="7dd3fc">
          </div>
          <div class="field">
            <label>Text Color</label>
            <input type="text" id="text_color" placeholder="e2e8f0">
          </div>
        </div>
        <div class="field">
          <label>Accent Color</label>
          <input type="text" id="accent_color" placeholder="22d3ee" style="max-width: 50%;">
        </div>

        <div class="section-divider"></div>
        <h2>Features</h2>
        <div class="checkbox-row">
          <label><input type="checkbox" id="hide_title"> Hide title</label>
          <label><input type="checkbox" id="hide_border"> Hide border</label>
          <label><input type="checkbox" id="show_icons"> Show icons</label>
          <label><input type="checkbox" id="username_display"> Show username</label>
          <label><input type="checkbox" id="show_stats"> Extra stats</label>
        </div>
        <div class="checkbox-row">
          <label><input type="checkbox" id="show_avatar"> Avatar</label>
          <label><input type="checkbox" id="show_streak"> Streak</label>
          <label><input type="checkbox" id="show_categories"> Categories</label>
          <label><input type="checkbox" id="show_notable"> Notable orgs</label>
          <label><input type="checkbox" id="show_trophies"> Trophies</label>
          <label><input type="checkbox" id="rank"> Rank badge</label>
        </div>

        <div class="btn-row">
          <button class="btn" onclick="generate()">Generate</button>
          <button class="btn btn-outline" onclick="window.open(buildUrl().replace('/api?', '/api/json?'), '_blank')">View JSON</button>
        </div>
      </div>

      <div class="panel">
        <h2>Preview</h2>
        <div class="preview-area" id="preview">
          <span style="color: #64748b;">Click Generate to preview</span>
        </div>

        <h2>Embed URL</h2>
        <div class="url-box" id="url-box" onclick="copyUrl()">
          <span class="copy-hint">click to copy</span>
          <span id="url-text">https://oss-card.vercel.app/api?username=...</span>
        </div>

        <h2>Markdown</h2>
        <div class="url-box" id="md-box" onclick="copyMd()">
          <span class="copy-hint">click to copy</span>
          <span id="md-text">![OSS Contributions](https://oss-card.vercel.app/api?username=...)</span>
        </div>

        <h2>JSON API</h2>
        <div class="url-box" id="json-box" onclick="copyJson()">
          <span class="copy-hint">click to copy</span>
          <span id="json-text">https://oss-card.vercel.app/api/json?username=...</span>
        </div>
      </div>
    </div>

    <div class="theme-gallery">
      <h2>Theme Gallery</h2>
      <div class="theme-grid" id="theme-grid"></div>
    </div>
  </div>

  <script>
    const BASE = window.location.origin + '/api';
    const THEMES = ['dark','light','dracula','nord','tokyonight','catppuccin','gruvbox','onedark','synthwave','cyberpunk'];

    function buildUrl() {
      const params = new URLSearchParams();
      const username = document.getElementById('username').value.trim() || 'jashshah999';
      params.set('username', username);

      const fields = ['theme','layout','max_repos','width','animation','font','border_radius','title',
                      'bg_color','border_color','title_color','text_color','accent_color',
                      'header','footer_text','exclude_repos','include_orgs','time_range','sort'];
      const defaults = { theme:'dark', layout:'default', max_repos:'6', width:'480', animation:'none',
                         font:'default', border_radius:'12', title:'', header:'none', footer_text:'',
                         exclude_repos:'', include_orgs:'', time_range:'all', sort:'count' };

      for (const f of fields) {
        const el = document.getElementById(f);
        if (!el) continue;
        const val = el.value.trim();
        if (val && val !== (defaults[f] || '')) params.set(f, val);
      }

      const checkboxes = ['hide_title','hide_border','show_icons','username_display','show_stats',
                          'show_avatar','show_streak','show_categories','show_notable','show_trophies','rank'];
      for (const c of checkboxes) {
        const el = document.getElementById(c);
        if (el && el.checked) params.set(c, 'true');
      }

      return BASE + '?' + params.toString();
    }

    function generate() {
      const url = buildUrl();
      document.getElementById('preview').innerHTML = '<img src="' + url + '" alt="oss-card preview">';
      document.getElementById('url-text').textContent = url;
      document.getElementById('md-text').textContent = '![OSS Contributions](' + url + ')';
      document.getElementById('json-text').textContent = url.replace('/api?', '/api/json?');
    }

    function copyUrl() {
      navigator.clipboard.writeText(document.getElementById('url-text').textContent);
      flash('url-box');
    }
    function copyMd() {
      navigator.clipboard.writeText(document.getElementById('md-text').textContent);
      flash('md-box');
    }
    function copyJson() {
      navigator.clipboard.writeText(document.getElementById('json-text').textContent);
      flash('json-box');
    }
    function flash(id) {
      const el = document.getElementById(id);
      el.style.borderColor = '#22d3ee';
      setTimeout(() => el.style.borderColor = '#2d4a6f', 600);
    }

    // Theme gallery
    function renderGallery() {
      const grid = document.getElementById('theme-grid');
      const username = document.getElementById('username').value.trim() || 'jashshah999';
      grid.innerHTML = THEMES.map(t =>
        '<div class="theme-card" onclick="document.getElementById(\\'theme\\').value=\\'' + t + '\\'; generate();">' +
        '<img src="' + BASE + '?username=' + username + '&theme=' + t + '&max_repos=3" loading="lazy" alt="' + t + '">' +
        '<span>' + t + '</span></div>'
      ).join('');
    }

    // Init
    generate();
    renderGallery();
  </script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).send(html);
};
