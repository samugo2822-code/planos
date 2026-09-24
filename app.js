const canvas = document.getElementById('nailCanvas');
const content = document.getElementById('nailContent');
const toast = document.getElementById('toast');
const palette = ['#dba89c', '#e7c7b5', '#8f5360', '#d7b75c', '#5d7470', '#f7eee7'];
const nails = [
  { name:'Pulgar', x:125, y:250, w:130, h:250, color:'#dba89c', pattern:'none', finish:'glossy', angle:-18 },
  { name:'Índice', x:285, y:125, w:120, h:280, color:'#e7c7b5', pattern:'french', finish:'glossy', angle:-7 },
  { name:'Medio', x:440, y:85, w:125, h:300, color:'#8f5360', pattern:'sparkle', finish:'chrome', angle:0 },
  { name:'Anular', x:600, y:125, w:120, h:280, color:'#e7c7b5', pattern:'dots', finish:'matte', angle:7 },
  { name:'Meñique', x:755, y:215, w:110, h:235, color:'#dba89c', pattern:'none', finish:'glossy', angle:17 }
];
let selected = 2;
let zoom = 100;
function svgElement(tag, attrs = {}) { const element = document.createElementNS('http://www.w3.org/2000/svg', tag); Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value)); return element; }
function setText(id, value) { document.getElementById(id).textContent = value; }
function colorLight(color) { return color === '#8f5360' ? '#f4d4d7' : '#fff8f1'; }
function addPattern(group, nail) {
  const { x, y, w, h, pattern } = nail; const center = x + w / 2;
  if (pattern === 'french') group.append(svgElement('path', { d:`M ${x+4} ${y+52} Q ${center} ${y+30} ${x+w-4} ${y+52} L ${x+w-4} ${y+75} Q ${center} ${y+55} ${x+4} ${y+75} Z`, fill:colorLight(nail.color), opacity:.9 }));
  if (pattern === 'sparkle') { group.append(svgElement('path', { d:`M ${center} ${y+95} l 7 17 17 7-17 7-7 17-7-17-17-7 17-7z`, fill:'#f8e8a6' })); group.append(svgElement('circle', { cx:center+30, cy:y+180, r:5, fill:'#fff3c5' })); }
  if (pattern === 'dots') [0,1,2].forEach(index => group.append(svgElement('circle', { cx:center-22+index*22, cy:y+110+(index%2)*35, r:7, fill:'#d7b75c' })));
  if (pattern === 'flame') group.append(svgElement('path', { d:`M ${center} ${y+55} C ${center-28} ${y+100} ${center+18} ${y+135} ${center-12} ${y+185} C ${center+35} ${y+160} ${center+29} ${y+90} ${center} ${y+55}Z`, fill:'#d7b75c' }));
  if (pattern === 'line') group.append(svgElement('path', { d:`M ${x+22} ${y+215} L ${x+w-15} ${y+70}`, stroke:'#f5dfaa', 'stroke-width':8, 'stroke-linecap':'round', opacity:.9 }));
}
function renderNails() {
  content.innerHTML = '';
  nails.forEach((nail, index) => {
    const group = svgElement('g', { class:'nail-group', 'data-index':index, transform:`rotate(${nail.angle} ${nail.x+nail.w/2} ${nail.y+nail.h/2})` });
    const fill = nail.finish === 'matte' ? nail.color : `url(#nailGradient${index})`;
    const defs = svgElement('defs'); const gradient = svgElement('linearGradient', { id:`nailGradient${index}`, x1:'0', y1:'0', x2:'1', y2:'1' });
    gradient.append(svgElement('stop', { offset:'0%', 'stop-color':nail.color })); gradient.append(svgElement('stop', { offset:'100%', 'stop-color':nail.finish === 'chrome' ? '#fff7ea' : colorLight(nail.color) })); defs.append(gradient); group.append(defs);
    const shape = svgElement('rect', { class:`nail-shape ${index === selected ? 'selected' : ''}`, x:nail.x, y:nail.y, width:nail.w, height:nail.h, rx:nail.w/2, fill, filter:'url(#shadow)', stroke:index === selected ? '#4f3630' : '#fff', 'stroke-width':index === selected ? 5 : 2 });
    group.append(shape); addPattern(group, nail);
    const label = svgElement('text', { class:'nail-label', x:nail.x+nail.w/2, y:nail.y+nail.h+34, 'text-anchor':'middle' }); label.textContent = `${String(index+1).padStart(2,'0')}  ${nail.name}`; group.append(label);
    group.addEventListener('click', () => { selected = index; renderNails(); updateInspector(); }); content.append(group);
  });
}
function updateInspector() {
  const nail = nails[selected]; setText('inspectorTitle', nail.name); setText('selectionName', nail.name); setText('selectionMeta', `${nail.finish === 'chrome' ? 'Chrome' : nail.finish === 'matte' ? 'Mate' : 'Brillo'} · ${nail.pattern === 'none' ? 'sin detalle' : nail.pattern}`); setText('selectionPreview', String(selected+1).padStart(2,'0'));
  document.querySelectorAll('.finish-button').forEach(button => button.classList.toggle('active', button.dataset.finish === nail.finish)); document.querySelectorAll('.pattern-button').forEach(button => button.classList.toggle('active', button.dataset.pattern === nail.pattern));
  setText('paintedStat', `${nails.length} / 5`); setText('colorStat', new Set(nails.map(item => item.color)).size); setText('patternStat', nails.filter(item => item.pattern !== 'none').length);
}
function showToast(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 1900); }
function renderPalettes() { const make = container => { container.innerHTML = ''; palette.forEach(color => { const button = document.createElement('button'); button.className = 'swatch'; button.style.setProperty('--swatch', color); button.title = color; button.addEventListener('click', () => { nails[selected].color = color; renderNails(); updateInspector(); showToast('Color aplicado'); }); container.append(button); }); }; make(document.getElementById('palette')); make(document.getElementById('inspectorPalette')); }
function applyTemplate(template) { const colors = { aurora:['#dba89c','#e7c7b5','#8f5360','#e7c7b5','#dba89c'], french:['#f7eee7','#f7eee7','#e7c7b5','#f7eee7','#f7eee7'], berry:['#8f5360','#dba89c','#8f5360','#d7b75c','#8f5360'] }; colors[template].forEach((color, index) => { nails[index].color = color; }); renderNails(); updateInspector(); }
document.querySelectorAll('.template-card').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.template-card').forEach(item => item.classList.toggle('active', item === button)); applyTemplate(button.dataset.template); showToast(`${button.querySelector('strong').textContent} cargada`); }));
document.querySelectorAll('.tool-button').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.tool-button').forEach(item => item.classList.toggle('active', item === button)); showToast(button.dataset.tool === 'paint' ? 'Haz clic en una uña para pintarla' : button.dataset.tool === 'pattern' ? 'Elige un detalle en el inspector' : 'Modo selección activo'); }));
document.querySelectorAll('.finish-button').forEach(button => button.addEventListener('click', () => { nails[selected].finish = button.dataset.finish; renderNails(); updateInspector(); showToast('Acabado actualizado'); }));
document.querySelectorAll('.pattern-button').forEach(button => button.addEventListener('click', () => { nails[selected].pattern = button.dataset.pattern; renderNails(); updateInspector(); showToast('Detalle aplicado'); }));
document.getElementById('customColor').addEventListener('input', event => { nails[selected].color = event.target.value; renderNails(); updateInspector(); });
document.getElementById('clearNail').addEventListener('click', () => { nails[selected].pattern = 'none'; nails[selected].color = '#f7eee7'; renderNails(); updateInspector(); showToast('Uña limpiada'); });
document.getElementById('applyAll').addEventListener('click', () => { const source = nails[selected]; nails.forEach(nail => { nail.color = source.color; nail.finish = source.finish; nail.pattern = source.pattern; }); renderNails(); updateInspector(); showToast('Estilo aplicado a todas'); });
document.getElementById('addColor').addEventListener('click', () => { const color = prompt('Escribe un color HEX', '#c78f86'); if (color && /^#[0-9a-f]{6}$/i.test(color)) { palette.push(color); renderPalettes(); showToast('Color añadido a tu paleta'); } });
document.getElementById('gridToggle').addEventListener('click', event => { event.currentTarget.classList.toggle('active'); document.querySelector('.grid-background').style.opacity = event.currentTarget.classList.contains('active') ? '0' : '1'; });
document.getElementById('zoomIn').addEventListener('click', () => { zoom = Math.min(130, zoom + 10); document.getElementById('zoomValue').textContent = `${zoom}%`; canvas.style.transform = `scale(${zoom/100})`; });
document.getElementById('zoomOut').addEventListener('click', () => { zoom = Math.max(80, zoom - 10); document.getElementById('zoomValue').textContent = `${zoom}%`; canvas.style.transform = `scale(${zoom/100})`; });
document.getElementById('fullscreenButton').addEventListener('click', () => document.getElementById('canvasWrap').requestFullscreen?.());
document.getElementById('renameProject').addEventListener('click', () => { const name = prompt('Nombre de la colección', document.getElementById('projectTitle').textContent); if (name) document.getElementById('projectTitle').textContent = name; });
document.getElementById('saveButton').addEventListener('click', () => { localStorage.setItem('atelier-nail-lab', JSON.stringify({ nails, notes:document.getElementById('notes').value })); showToast('Diseño guardado localmente'); });
document.getElementById('resetButton').addEventListener('click', () => { applyTemplate('aurora'); document.getElementById('notes').value = 'Base nude con detalles metálicos en dos uñas.'; showToast('Colección reiniciada'); });
document.getElementById('exportButton').addEventListener('click', () => { const copy = canvas.cloneNode(true); copy.setAttribute('xmlns','http://www.w3.org/2000/svg'); const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)], { type:'image/svg+xml' })); link.download = 'atelier-nail-set.svg'; link.click(); URL.revokeObjectURL(link.href); showToast('SVG exportado'); });
window.addEventListener('keydown', event => { if (event.target.matches('input,textarea')) return; if (event.key === '1') { selected = 0; renderNails(); updateInspector(); } if (event.key === '2') document.querySelector('[data-tool="paint"]').click(); if (event.key === '3') document.querySelector('[data-tool="pattern"]').click(); });
renderPalettes(); renderNails(); updateInspector();
