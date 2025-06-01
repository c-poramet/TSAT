// --- Cube Data Structure and Net Generation ---

// Cube face indices: 0=+X, 1=-X, 2=+Y, 3=-Y, 4=+Z, 5=-Z
// We'll use this order for all cube operations
const FACE_LABELS = ['+X', '-X', '+Y', '-Y', '+Z', '-Z'];

// 11 valid cube nets (as before)
const cubeNets = [
  [[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]],
  [[0,0],[1,0],[2,0],[1,1],[1,2],[1,3]],
  [[0,1],[1,1],[2,1],[3,1],[2,0],[2,2]],
  [[0,1],[1,1],[2,1],[2,0],[2,2],[3,1]],
  [[1,0],[0,1],[1,1],[2,1],[1,2],[0,2]],
  [[0,0],[1,0],[2,0],[2,1],[2,2],[3,2]],
  [[0,1],[1,1],[2,1],[1,0],[1,2],[2,2]],
  [[1,0],[0,1],[1,1],[2,1],[2,2],[3,2]],
  [[0,1],[1,1],[2,1],[2,0],[3,0],[2,2]],
  [[1,0],[0,1],[1,1],[2,1],[2,2],[3,1]],
  [[0,1],[1,1],[2,1],[1,0],[2,0],[2,2]]
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Generate a cube with random numbers on each face
function generateCube() {
  // Faces: [0=+X, 1=-X, 2=+Y, 3=-Y, 4=+Z, 5=-Z]
  const faces = Array.from({length: 6}, () => randomInt(1, 100));
  return { faces };
}

// For a given cube orientation, return the 3 visible faces in a standard isometric view
function getVisibleFaces() {
  // We'll use the +X, +Y, +Z faces as visible (indices 0, 2, 4)
  return [0, 2, 4];
}

// Render the cube as SVG, showing the 3 visible faces
function renderCubeSVG(cube) {
  const faces = cube.faces;
  const [fx, fy, fz] = getVisibleFaces();
  const svg = `
    <svg width="120" height="120" viewBox="0 0 120 120">
      <polygon points="60,20 100,40 60,60 20,40" fill="#b5ead7" stroke="#888" stroke-width="2"/>
      <text x="60" y="42" text-anchor="middle" font-size="20" fill="#23272e" font-family="Kanit">${faces[fz]}</text>
      <polygon points="20,40 60,60 60,100 20,80" fill="#c7ceea" stroke="#888" stroke-width="2"/>
      <text x="35" y="75" text-anchor="middle" font-size="20" fill="#23272e" font-family="Kanit">${faces[fx]}</text>
      <polygon points="60,60 100,40 100,80 60,100" fill="#f7b7a3" stroke="#888" stroke-width="2"/>
      <text x="85" y="75" text-anchor="middle" font-size="20" fill="#23272e" font-family="Kanit">${faces[fy]}</text>
    </svg>
    <div style="font-size:0.9em;color:#b0b0b0;margin-top:0.5em;">(showing faces +Z, +X, +Y)</div>
  `;
  document.getElementById('cube-visual').innerHTML = svg;
}

// Map cube faces to net faces (for a given net, pick a random mapping)
function mapCubeToNet(cube, netIdx) {
  // For simplicity, assign cube faces to net faces in a random order
  const mapping = [0,1,2,3,4,5];
  shuffle(mapping);
  return mapping.map(i => cube.faces[i]);
}

// Render a net as SVG
function renderNetSVG(net, faces, optionIdx) {
  const xs = net.map(([x]) => x);
  const ys = net.map(([,y]) => y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const cellSize = 32;
  // Calculate SVG size to fit the entire net
  const width = (maxX-minX+1)*cellSize;
  const height = (maxY-minY+1)*cellSize;
  let svg = `<svg width="${width}" height="${height}">`;
  
  // Draw the net outline to help visualize connectivity
  let outline = '';
  net.forEach(([x, y], i) => {
    const fx = (x-minX)*cellSize;
    const fy = (y-minY)*cellSize;
    outline += `<rect x="${fx}" y="${fy}" width="${cellSize}" height="${cellSize}" rx="6" 
                 fill="#2c313a" stroke="#b5ead7" stroke-width="2"/>
                <text x="${fx+cellSize/2}" y="${fy+cellSize/2+7}" 
                 text-anchor="middle" font-size="18" fill="#f7b7a3" font-family="Kanit">${faces[i]}</text>`;
  });
  svg += outline;
  return `<div class="net-option" data-option="${optionIdx}">${svg}</div>`;
}

// Generate false nets by swapping one visible face with a hidden face
function generateFalseNets(correctFaces, net, visibleNetIndices) {
  const falseNets = [];
  for (let i = 0; i < 3; i++) {
    // Copy correct faces
    let faces = correctFaces.slice();
    // Pick a visible face and a hidden face to swap
    const vi = visibleNetIndices[i];
    const hidden = [0,1,2,3,4,5].filter(idx => !visibleNetIndices.includes(idx));
    const hi = hidden[randomInt(0, hidden.length-1)];
    [faces[vi], faces[hi]] = [faces[hi], faces[vi]];
    falseNets.push(faces);
  }
  return falseNets;
}

function renderPuzzle() {
  // 1. Generate cube
  const cube = generateCube();
  // 2. Render cube SVG
  renderCubeSVG(cube);
  // 3. Pick a random net
  const netIdx = randomInt(0, cubeNets.length-1);
  const net = cubeNets[netIdx];
  // 4. Map cube faces to net faces (random mapping)
  const correctFaces = mapCubeToNet(cube, netIdx);
  // 5. Determine which net faces correspond to the visible cube faces
  // For this demo, just use first 3 net faces as visible
  const visibleNetIndices = [0,1,2];
  // 6. Generate 3 false nets by swapping one visible face with a hidden face
  const falseNets = generateFalseNets(correctFaces, net, visibleNetIndices);
  // 7. Shuffle and render options
  const options = [
    { faces: correctFaces, correct: true },
    ...falseNets.map(faces => ({ faces, correct: false }))
  ];
  shuffle(options);
  const netOptionsList = document.getElementById('net-options-list');
  netOptionsList.innerHTML = options.map((opt, idx) => renderNetSVG(net, opt.faces, idx)).join('');
  // Option selection
  document.querySelectorAll('.net-option').forEach(el => {
    el.onclick = () => {
      document.querySelectorAll('.net-option').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
    };
  });
  window.currentPuzzle = { options };
  document.getElementById('feedback').textContent = '';
  document.getElementById('next-btn').style.display = 'none';
  document.getElementById('submit-btn').disabled = false;
}

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
