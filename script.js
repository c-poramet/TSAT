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

function renderNetSVG(net, faces, optionIdx) {
  // Render a net as an SVG grid with numbers on faces
  // Find bounds
  const xs = net.map(([x]) => x);
  const ys = net.map(([,y]) => y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const cellSize = 32;
  // SVG grid
  let svg = `<svg width="${(maxX-minX+1)*cellSize}" height="${(maxY-minY+1)*cellSize}">`;
  for (let i = 0; i < net.length; i++) {
    const [x, y] = net[i];
    const fx = (x-minX)*cellSize;
    const fy = (y-minY)*cellSize;
    svg += `<rect x="${fx}" y="${fy}" width="${cellSize}" height="${cellSize}" rx="6" fill="#2c313a" stroke="#b5ead7" stroke-width="2"/>`;
    svg += `<text x="${fx+cellSize/2}" y="${fy+cellSize/2+7}" text-anchor="middle" font-size="18" fill="#f7b7a3" font-family="Kanit">${faces[i]}</text>`;
  }
  svg += '</svg>';
  return `<div class="net-option" data-option="${optionIdx}">${svg}</div>`;
}

function renderPuzzle() {
  const puzzle = generatePuzzle();
  // For the 3D cube, just show the first 3 faces
  renderCube3D(puzzle.faces.slice(0,3));
  // Generate 3 options: 1 correct, 2 random nets with shuffled faces
  const options = [
    { net: puzzle.net, faces: puzzle.faces.slice(), correct: true }
  ];
  while (options.length < 3) {
    // Pick a random net and shuffle faces
    const netIdx = randomInt(0, cubeNets.length - 1);
    const net = cubeNets[netIdx];
    let faces = puzzle.faces.slice();
    // Shuffle faces for wrong options
    for (let i = faces.length - 1; i > 0; i--) {
      const j = randomInt(0, i);
      [faces[i], faces[j]] = [faces[j], faces[i]];
    }
    // Avoid duplicate correct option
    if (!options.some(opt => opt.net === net && opt.faces.join(',') === faces.join(','))) {
      options.push({ net, faces, correct: false });
    }
  }
  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [options[i], options[j]] = [options[j], options[i]];
  }
  // Render options
  const netOptionsList = document.getElementById('net-options-list');
  netOptionsList.innerHTML = options.map((opt, idx) => renderNetSVG(opt.net, opt.faces, idx)).join('');
  // Option selection
  document.querySelectorAll('.net-option').forEach(el => {
    el.onclick = () => {
      document.querySelectorAll('.net-option').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
    };
  });
  // Store correct answer
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
