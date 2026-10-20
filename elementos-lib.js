/* Biblioteca de elementos (carpeta ELEMENTOS-NMS).
   Sin servidor: el navegador solo puede leer una carpeta si la eliges con el botón.
   Las imágenes se abren como blob: locales, así el lienzo no se "contamina" y la descarga PNG funciona. */
(function () {
  var IMG = /\.(png|jpe?g|webp|gif|avif)$/i;
  var lib = { items: [], carpeta: '', _inp: null };

  var css = document.createElement('style');
  css.textContent =
    '.el-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--el-w,150px),1fr));gap:10px;margin-top:10px}' +
    '.el-card{display:flex;flex-direction:column;gap:6px;padding:6px;margin:0;width:auto;text-align:left;cursor:pointer;' +
    'background:#0e1526;border:1px solid #243050;border-radius:10px;color:#e9edf7;font:inherit;font-weight:400}' +
    '.el-card:hover{border-color:#ffd400}' +
    '.el-card:focus-visible{outline:2px solid #ffd400;outline-offset:1px}' +
    '.el-card .el-img{aspect-ratio:1;width:100%;border-radius:6px;display:flex;align-items:center;justify-content:center;' +
    'background-color:#0b1120;background-image:linear-gradient(45deg,#17213a 25%,transparent 25%,transparent 75%,#17213a 75%),' +
    'linear-gradient(45deg,#17213a 25%,transparent 25%,transparent 75%,#17213a 75%);background-size:16px 16px;background-position:0 0,8px 8px}' +
    '.el-card img{max-width:100%;max-height:100%;object-fit:contain;display:block}' +
    '.el-card .el-n{font-size:11px;line-height:1.25;color:#8f9bb8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.el-vacio{grid-column:1/-1;color:#8f9bb8;font-size:13px;padding:10px 2px}';
  document.head.appendChild(css);

  /* Abre el selector de carpeta. Devuelve una promesa con la lista (o null si se cancela). */
  lib.pick = function () {
    return new Promise(function (res) {
      var inp = document.createElement('input');
      inp.type = 'file';
      inp.webkitdirectory = true;
      inp.multiple = true;
      lib._inp = inp; // evita que se recoja antes de disparar 'change'
      inp.addEventListener('change', function () { res(inp.files && inp.files.length ? lib.load(inp.files) : null); });
      inp.addEventListener('cancel', function () { res(null); });
      inp.click();
    });
  };

  lib.load = function (files) {
    lib.items.forEach(function (it) { URL.revokeObjectURL(it.url); });
    var arr = Array.prototype.slice.call(files).filter(function (f) { return IMG.test(f.name); });
    lib.items = arr.map(function (f) {
      var rel = f.webkitRelativePath || f.name;
      var partes = rel.split('/');
      return { file: f, name: f.name, rel: rel, folder: partes.slice(1, -1).join('/'), url: URL.createObjectURL(f) };
    }).sort(function (a, b) { return a.rel.localeCompare(b.rel, 'es', { numeric: true }); });
    var p0 = files[0] && files[0].webkitRelativePath;
    lib.carpeta = p0 ? p0.split('/')[0] : '';
    return lib.items;
  };

  lib.folders = function () {
    var s = {};
    lib.items.forEach(function (it) { if (it.folder) s[it.folder] = 1; });
    return Object.keys(s).sort(function (a, b) { return a.localeCompare(b, 'es', { numeric: true }); });
  };

  lib.filter = function (q, folder) {
    q = (q || '').trim().toLowerCase();
    return lib.items.filter(function (it) {
      return (!folder || it.folder === folder) && (!q || it.rel.toLowerCase().indexOf(q) !== -1);
    });
  };

  /* Rellena un <select> con "Todas las subcarpetas" + las subcarpetas encontradas. */
  lib.fillFolders = function (sel) {
    var cur = sel.value;
    sel.innerHTML = '';
    var o = document.createElement('option');
    o.value = ''; o.textContent = 'Todas las subcarpetas';
    sel.appendChild(o);
    lib.folders().forEach(function (f) {
      var op = document.createElement('option');
      op.value = f; op.textContent = f;
      sel.appendChild(op);
    });
    sel.value = cur && lib.folders().indexOf(cur) !== -1 ? cur : '';
  };

  /* Dibuja la cuadrícula. onPick(item) se llama al hacer clic en una tarjeta. */
  lib.renderGrid = function (cont, list, onPick, vacio) {
    cont.innerHTML = '';
    if (!list.length) {
      var d = document.createElement('div');
      d.className = 'el-vacio';
      d.textContent = vacio || (lib.items.length ? 'Ningún elemento coincide con la búsqueda.' : 'Elige tu carpeta ELEMENTOS-NMS para ver los elementos.');
      cont.appendChild(d);
      return;
    }
    list.forEach(function (it) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'el-card';
      b.title = it.rel;
      var w = document.createElement('div'); w.className = 'el-img';
      var im = document.createElement('img');
      im.loading = 'lazy'; im.decoding = 'async'; im.alt = it.name; im.src = it.url;
      w.appendChild(im);
      var n = document.createElement('div'); n.className = 'el-n'; n.textContent = it.name;
      b.appendChild(w); b.appendChild(n);
      b.addEventListener('click', function () { onPick(it); });
      cont.appendChild(b);
    });
  };

  window.MTV_LIB = lib;
})();
