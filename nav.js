/* Barra de navegación común. Se incluye al inicio del <body> con: <script src="nav.js"></script> */
(function () {
  var paginas = [
    ['index.html', 'Inicio'],
    ['miniaturas.html', 'Miniaturas'],
    ['generador-fondos.html', 'Fondos'],
    ['elementos.html', 'Elementos']
  ];
  var actual = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');

  var css = document.createElement('style');
  css.textContent =
    '.mtv-nav{position:sticky;top:0;z-index:50;height:52px;display:flex;align-items:center;gap:4px;padding:0 16px;' +
    'background:#080d1a;border-bottom:1px solid #243050;overflow-x:auto;white-space:nowrap;' +
    'font:600 14px system-ui,-apple-system,"Segoe UI",sans-serif}' +
    '.mtv-nav .mtv-brand{font:20px Anton,Impact,sans-serif;letter-spacing:.04em;color:#ffd400;margin-right:14px;text-decoration:none}' +
    '.mtv-nav a.mtv-l{color:#8f9bb8;text-decoration:none;padding:8px 12px;border-radius:8px;border-bottom:2px solid transparent}' +
    '.mtv-nav a.mtv-l:hover{color:#e9edf7;background:rgba(255,255,255,.06)}' +
    '.mtv-nav a.mtv-l[aria-current=page]{color:#e9edf7;border-bottom-color:#ffd400}' +
    '.mtv-nav a:focus-visible{outline:2px solid #ffd400;outline-offset:1px}';
  document.head.appendChild(css);

  var nav = document.createElement('nav');
  nav.className = 'mtv-nav';
  nav.setAttribute('aria-label', 'Navegación principal');
  var marca = document.createElement('a');
  marca.className = 'mtv-brand';
  marca.href = 'index.html';
  marca.textContent = 'MORINGOSTV';
  nav.appendChild(marca);
  paginas.forEach(function (p) {
    var a = document.createElement('a');
    a.className = 'mtv-l';
    a.href = p[0];
    a.textContent = p[1];
    if (p[0] === actual || (actual === '' && p[0] === 'index.html')) a.setAttribute('aria-current', 'page');
    nav.appendChild(a);
  });
  document.body.insertBefore(nav, document.body.firstChild);
})();
