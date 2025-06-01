// --- Cube net and puzzle generation for the Cube Unfolding Puzzle ---
// Each face will have a random number (1-100)
// The cube is shown as a static 3D SVG with 3 visible faces
// The nets are rendered as SVGs, using one of the 11 valid cube nets

// 11 valid cube nets (from your image, as [x, y] positions for each face)
const cubeNets = [
  // 1
  [[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]],
  // 2
  [[0,0],[1,0],[2,0],[1,1],[1,2],[1,3]],
  // 3
  [[0,1],[1,1],[2,1],[3,1],[2,0],[2,2]],
  // 4
  [[0,1],[1,1],[2,1],[2,0],[2,2],[3,1]],
  // 5
  [[1,0],[0,1],[1,1],[2,1],[1,2],[0,2]],
  // 6
  [[0,0],[1,0],[2,0],[2,1],[2,2],[3,2]],
  // 7
  [[0,1],[1,1],[2,1],[1,0],[1,2],[2,2]],
  // 8
  [[1,0],[0,1],[1,1],[2,1],[2,2],[3,2]],
  // 9
  [[0,1],[1,1],[2,1],[2,0],[3,0],[2,2]],
  // 10
  [[1,0],[0,1],[1,1],[2,1],[2,2],[3,1]],
  // 11
  [[0,1],[1,1],[2,1],[1,0],[2,0],[2,2]]
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateCubeFaces() {
  // Generate 6 random numbers for the cube faces
  return Array.from({length: 6}, () => randomInt(1, 100));
}

function generatePuzzle() {
  // Pick a random net
  const netIdx = randomInt(0, cubeNets.length - 1);
  const net = cubeNets[netIdx];
  const faces = generateCubeFaces();
  return { net, faces };
}

function renderCube3D(faces) {
  // SVG 3D cube, showing three faces: top, left, right
  // We'll map faces[0]=top, faces[1]=left, faces[2]=right
  const [top, left, right] = faces;
  const svg = `
    <svg width="120" height="120" viewBox="0 0 120 120">
      <!-- Top face -->
      <polygon points="60,20 100,40 60,60 20,40" fill="#b5ead7" stroke="#888" stroke-width="2"/>
      <text x="60" y="42" text-anchor="middle" font-size="20" fill="#23272e" font-family="Kanit">${top}</text>
      <!-- Left face -->
      <polygon points="20,40 60,60 60,100 20,80" fill="#c7ceea" stroke="#888" stroke-width="2"/>
      <text x="35" y="75" text-anchor="middle" font-size="20" fill="#23272e" font-family="Kanit">${left}</text>
      <!-- Right face -->
      <polygon points="60,60 100,40 100,80 60,100" fill="#f7b7a3" stroke="#888" stroke-width="2"/>
      <text x="85" y="75" text-anchor="middle" font-size="20" fill="#23272e" font-family="Kanit">${right}</text>
    </svg>
    <div style="font-size:0.9em;color:#b0b0b0;margin-top:0.5em;">(showing 3 faces)</div>
  `;
  document.getElementById('cube-visual').innerHTML = svg;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// 2D cube face projections for folding animation (relative to SVG)
// We'll use the same cube projection as renderCube3D
const cubeFaceProjections = [
  // Top
  [ [60,20], [100,40], [60,60], [20,40] ],
  // Left
  [ [20,40], [60,60], [60,100], [20,80] ],
  // Right
  [ [60,60], [100,40], [100,80], [60,100] ],
  // Back (hidden, not shown)
  [ [60,20], [100,40], [100,80], [60,100] ],
  // Bottom (hidden, not shown)
  [ [20,80], [60,100], [100,80], [60,60] ],
  // Front (hidden, not shown)
  [ [20,40], [60,20], [60,60], [20,80] ]
];

function getNetFacePolygon(net, faceIdx, t) {
  // Net face: grid cell (x, y) to SVG rect
  const cellSize = 32;
  const xs = net.map(([x]) => x);
  const ys = net.map(([,y]) => y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const [x, y] = net[faceIdx];
  // Net rect corners
  const netPoly = [
    [ (x-minX)*cellSize, (y-minY)*cellSize ],
    [ (x-minX+1)*cellSize, (y-minY)*cellSize ],
    [ (x-minX+1)*cellSize, (y-minY+1)*cellSize ],
    [ (x-minX)*cellSize, (y-minY+1)*cellSize ]
  ];
  // Cube face projection (use first 3 faces for visible, fallback to net for others)
  const cubePoly = cubeFaceProjections[faceIdx < 3 ? faceIdx : 0];
  // Interpolate each corner
  return netPoly.map((pt, i) => [
    lerp(pt[0], cubePoly[i%4][0], t),
    lerp(pt[1], cubePoly[i%4][1], t)
  ]);
}

function renderNetSVGAnimated(net, faces, optionIdx, t) {
  // Render a net as an SVG grid with faces morphing to cube positions
  const xs = net.map(([x]) => x);
  const ys = net.map(([,y]) => y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const cellSize = 32;
  const w = Math.max((maxX-minX+1)*cellSize, 120);
  const h = Math.max((maxY-minY+1)*cellSize, 120);
  let svg = `<svg width="${w}" height="${h}">`;
  for (let i = 0; i < net.length; i++) {
    const poly = getNetFacePolygon(net, i, t);
    const points = poly.map(([x, y]) => `${x},${y}`).join(' ');
    svg += `<polygon points="${points}" fill="#2c313a" stroke="#b5ead7" stroke-width="2"/>`;
    // Center for text
    const cx = poly.reduce((sum, p) => sum + p[0], 0) / 4;
    const cy = poly.reduce((sum, p) => sum + p[1], 0) / 4 + 7;
    svg += `<text x="${cx}" y="${cy}" text-anchor="middle" font-size="18" fill="#f7b7a3" font-family="Kanit">${faces[i]}</text>`;
  }
  svg += '</svg>';
  return `<div class="net-option" data-option="${optionIdx}">
    ${svg}
    <input type="range" min="0" max="100" value="0" class="fold-slider" data-option="${optionIdx}" style="width:90%;margin-top:0.5em;">
  </div>`;
}

function renderPuzzle() {
  const puzzle = generatePuzzle();
  renderCube3D(puzzle.faces.slice(0,3));
  // Generate 3 options: 1 correct, 2 random nets with shuffled faces
  const options = [
    { net: puzzle.net, faces: puzzle.faces.slice(), correct: true }
  ];
  while (options.length < 3) {
    const netIdx = randomInt(0, cubeNets.length - 1);
    const net = cubeNets[netIdx];
    let faces = puzzle.faces.slice();
    for (let i = faces.length - 1; i > 0; i--) {
      const j = randomInt(0, i);
      [faces[i], faces[j]] = [faces[j], faces[i]];
    }
    if (!options.some(opt => opt.net === net && opt.faces.join(',') === faces.join(','))) {
      options.push({ net, faces, correct: false });
    }
  }
  for (let i = options.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [options[i], options[j]] = [options[j], options[i]];
  }
  // Render options with slider at 0
  const netOptionsList = document.getElementById('net-options-list');
  netOptionsList.innerHTML = options.map((opt, idx) => renderNetSVGAnimated(opt.net, opt.faces, idx, 0)).join('');
  // Option selection
  document.querySelectorAll('.net-option').forEach(el => {
    el.onclick = () => {
      document.querySelectorAll('.net-option').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
    };
  });
  // Slider animation
  document.querySelectorAll('.fold-slider').forEach(slider => {
    slider.oninput = (e) => {
      const idx = parseInt(slider.getAttribute('data-option'));
      const t = slider.value / 100;
      const opt = options[idx];
      // Replace SVG for this option
      const parent = slider.parentElement;
      parent.querySelector('svg').outerHTML = renderNetSVGAnimated(opt.net, opt.faces, idx, t).match(/<svg[\s\S]*<\/svg>/)[0];
    };
  });
  window.currentPuzzle = { options };
  document.getElementById('feedback').textContent = '';
  document.getElementById('next-btn').style.display = 'none';
  document.getElementById('submit-btn').disabled = false;
}

// Controls
function checkAnswer() {
  const selected = document.querySelector('.net-option.selected');
  if (!selected) {
    document.getElementById('feedback').textContent = 'Please select a net.';
    return;
  }
  const idx = parseInt(selected.getAttribute('data-option'));
  const isCorrect = window.currentPuzzle.options[idx].correct;
  document.getElementById('feedback').textContent = isCorrect ? 'Correct!' : 'Incorrect.';
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('next-btn').style.display = 'inline-block';
}

document.getElementById('submit-btn').onclick = checkAnswer;
document.getElementById('next-btn').onclick = renderPuzzle;

document.addEventListener('DOMContentLoaded', renderPuzzle);
