function transformGithubUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname === 'github.com' && u.pathname.includes('/blob/')) {
      const parts = u.pathname.split('/');
      const org = parts[1];
      const repo = parts[2];
      const branch = parts[4];
      const rest = parts.slice(5).join('/');
      return `https://raw.githubusercontent.com/${org}/${repo}/${branch}/${rest}`;
    }
    return url;
  } catch (_) {
    return url;
  }
}

function guessExt(url) {
  try {
    const u = new URL(transformGithubUrl(url));
    const m = u.pathname.match(/\.([a-z0-9]+)$/i);
    return m ? `.${m[1].toLowerCase()}` : '';
  } catch (_) {
    return '';
  }
}

async function downloadFromRemote(url, filename) {
  try {
    const fixed = transformGithubUrl(url);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(fixed, { mode: 'cors', signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return false;
    const blob = await res.blob();
    const link = document.createElement('a');
    const href = URL.createObjectURL(blob);
    link.href = href;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(href), 2000);
    return true;
  } catch (_) {
    return false;
  }
}

export function initDownloads() {
  document.addEventListener('click', async (e) => {
    const a = e.target.closest('a.download-direct');
    if (!a) return;
    e.preventDefault();
    const url = a.getAttribute('data-url');
    const filename = a.getAttribute('data-filename') || `arquivo${guessExt(url)}`;
    a.setAttribute('aria-busy', 'true');
    const original = a.textContent;
    a.textContent = 'Baixando…';
    try {
      const ok = await downloadFromRemote(url, filename);
      if (!ok) window.open(url, '_blank', 'noopener');
    } catch (_) {
      window.open(url, '_blank', 'noopener');
    } finally {
      a.removeAttribute('aria-busy');
      a.textContent = original;
    }
  });
}

