(function(){
  const STORAGE_KEY = 'stockmaster_theme';
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved = localStorage.getItem(STORAGE_KEY);
  const theme = saved || 'light';

  function applyTheme(value){
    document.documentElement.setAttribute('data-theme', value);
  }

  function injectStyles(){
    if (document.getElementById('theme-style-overrides')) return;
    const style = document.createElement('style');
    style.id = 'theme-style-overrides';
    style.textContent = `
      :root {
        --bg: #F8F9FA;
        --card: #FFFFFF;
        --text: #202124;
        --muted: #5F6368;
        --border: rgba(0,0,0,0.06);
        --primary: #1A73E8;
        --primary-hover: #1557B0;
      }
      [data-theme="dark"] {
        --bg: #121212;
        --card: #1E1E1E;
        --text: #E3E3E3;
        --muted: #A1A1A1;
        --border: rgba(255,255,255,0.08);
        --primary: #8AB4F8;
        --primary-hover: #AECBFA;
      }
      body { background: var(--bg) !important; color: var(--text) !important; }
      #sidebar { background: var(--card) !important; box-shadow: 1px 0 0 var(--border) !important; }
      .main-content { color: var(--text) !important; }
      .report-card, .card, .panel, .table-container { background: var(--card) !important; border-color: var(--border) !important; color: var(--text) !important; }
      .metric-item { background: rgba(255,255,255,0.04) !important; }
      [data-theme="dark"] .metric-item { background: rgba(255,255,255,0.06) !important; }
      .btn-primary { background: var(--primary) !important; }
      .btn-primary:hover { background: var(--primary-hover) !important; }
      /* Auth pages */
      .login-container, .signup-container { background: var(--card) !important; color: var(--text) !important; }
      .form-group input, .form-group textarea, .form-group select { background: #111418 !important; color: var(--text) !important; border-color: var(--border) !important; }
      [data-theme="light"] .form-group input, [data-theme="light"] .form-group textarea, [data-theme="light"] .form-group select { background: #F8F9FA !important; color: #202124 !important; }
      .error-message { background: rgba(197,34,31,0.15) !important; color: #ffb3ae !important; }
    `;
    document.head.appendChild(style);
  }

  function createToggle(){
    if (document.getElementById('theme-toggle')) return;
    if (!document.body) { setTimeout(createToggle, 50); return; }
    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.style.cssText = `
      position: fixed; right: 16px; top: 16px; z-index: 2147483647;
      width: 44px; height: 44px; border-radius: 999px; border: none;
      background: var(--card); color: var(--text); box-shadow: 0 4px 16px rgba(0,0,0,0.2), 0 0 0 1px var(--border);
      cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px;
    `;
    function renderIcon(mode){ btn.textContent = mode === 'dark' ? '🌙' : '☀️'; }
    renderIcon(localStorage.getItem(STORAGE_KEY) || 'light');
    btn.addEventListener('click', function(){
      const current = localStorage.getItem(STORAGE_KEY) || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
      renderIcon(next);
    });
    document.body.appendChild(btn);
  }

  // init
  injectStyles();
  applyTheme(theme);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createToggle);
  } else {
    // In case some other script manipulates the DOM late, retry once after a tick
    setTimeout(createToggle, 0);
  }
})();
