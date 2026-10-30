// Gera sitemap.xml a partir das páginas .html do site.
// Páginas 404 ou com <meta name="robots" content="noindex"> ficam de fora.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const domain = fs.readFileSync(path.join(root, 'CNAME'), 'utf8').trim();
const skipDirs = new Set(['assets', 'scripts', 'node_modules']);

function findPages(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(function (entry) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return entry.name.startsWith('.') || skipDirs.has(entry.name) ? [] : findPages(full);
    }
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

function isIndexable(file) {
  if (path.basename(file) === '404.html') return false;
  return !/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(fs.readFileSync(file, 'utf8'));
}

function toUrl(file) {
  const rel = path.relative(root, file).split(path.sep).map(encodeURIComponent).join('/');
  return 'https://' + domain + '/' + rel.replace(/(^|\/)index\.html$/, '$1');
}

const urls = findPages(root).filter(isIndexable).map(toUrl).sort(function (a, b) {
  return a.length - b.length || a.localeCompare(b);
});

const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + urls.map(function (u) { return '  <url><loc>' + u + '</loc></url>\n'; }).join('')
  + '</urlset>\n';

// Só grava se mudou, para não gerar diffs à toa
const target = path.join(root, 'sitemap.xml');
if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== xml) fs.writeFileSync(target, xml);
