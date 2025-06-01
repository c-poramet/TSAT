// --- Cube Data Structure and Net Generation ---
// Cube face indices: 0=+X, 1=-X, 2=+Y, 3=-Y, 4=+Z, 5=-Z
const FACE_LABELS = ['+X', '-X', '+Y', '-Y', '+Z', '-Z'];

// 11 valid cube nets, each with a canonical face mapping (see image)
// Each net: { layout: [ [x,y], ... ], faceMap: [cubeFaceIdx for each net cell] }
const cubeNets = [
  // Net 1 (T)
  { layout: [[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]], faceMap: [4,0,2,1,5,3] },
  // Net 2
  { layout: [[0,0],[1,0],[2,0],[1,1],[1,2],[1,3]], faceMap: [0,2,4,1,3,5] },
  // Net 3
  { layout: [[0,1],[1,1],[2,1],[3,1],[2,0],[2,2]], faceMap: [1,2,4,0,5,3] },
  // Net 4
  { layout: [[0,1],[1,1],[2,1],[2,0],[2,2],[3,1]], faceMap: [1,2,4,5,0,3] },
  // Net 5
  { layout: [[1,0],[0,1],[1,1],[2,1],[1,2],[0,2]], faceMap: [4,1,2,0,3,5] },
  // Net 6
  { layout: [[0,0],[1,0],[2,0],[2,1],[2,2],[3,2]], faceMap: [0,2,4,1,3,5] },
  // Net 7
  { layout: [[0,1],[1,1],[2,1],[1,0],[1,2],[2,2]], faceMap: [1,2,4,0,3,5] },
  // Net 8
  { layout: [[1,0],[0,1],[1,1],[2,1],[2,2],[3,2]], faceMap: [4,1,2,0,3,5] },
  // Net 9
  { layout: [[0,1],[1,1],[2,1],[2,0],[3,0],[2,2]], faceMap: [1,2,4,5,0,3] },
  // Net 10
  { layout: [[1,0],[0,1],[1,1],[2,1],[2,2],[3,1]], faceMap: [4,1,2,0,3,5] },
  // Net 11
  { layout: [[0,1],[1,1],[2,1],[1,0],[2,0],[2,2]], faceMap: [1,2,4,0,5,3] }
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

function generateCube() {
  // Faces: [0=+X, 1=-X, 2=+Y, 3=-Y, 4=+Z, 5=-Z]
  const faces = Array.from({length: 6}, () => randomInt(1, 100));
  return { faces };
}

function getVisibleFaces() {
  // We'll use the +X, +Y, +Z faces as visible (indices 0, 2, 4)
  return [0, 2, 4];
}

function renderCubeSVG(cube) {
  const faces = cube.faces;
  const [fx, fy, fz] = getVisibleFaces();
  const svg = `
    <div class="cube-container">
      <svg width="180" height="180" viewBox="0 0 120 120">
        <polygon points="60,20 100,40 60,60 20,40" fill="#b5ead7" stroke="#888" stroke-width="2"/>
        <text x="60" y="42" text-anchor="middle" font-size="20" fill="#23272e" font-family="Kanit">${faces[fz]}</text>
        <polygon points="20,40 60,60 60,100 20,80" fill="#c7ceea" stroke="#888" stroke-width="2"/>
        <text x="35" y="75" text-anchor="middle" font-size="20" fill="#23272e" font-family="Kanit">${faces[fx]}</text>
        <polygon points="60,60 100,40 100,80 60,100" fill="#f7b7a3" stroke="#888" stroke-width="2"/>
        <text x="85" y="75" text-anchor="middle" font-size="20" fill="#23272e" font-family="Kanit">${faces[fy]}</text>
      </svg>
    </div>
  `;
  document.getElementById('cube-visual').innerHTML = svg;
}

function renderNetSVG(net, faces, optionIdx) {
  const xs = net.layout.map(([x]) => x);
  const ys = net.layout.map(([,y]) => y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const cellSize = 32;
  const width = (maxX-minX+1)*cellSize;
  const height = (maxY-minY+1)*cellSize;
  let svg = `<svg width="${width}" height="${height}">`;
  let outline = '';
  net.layout.forEach(([x, y], i) => {
    const fx = (x-minX)*cellSize;
    const fy = (y-minY)*cellSize;
    outline += `<rect x="${fx}" y="${fy}" width="${cellSize}" height="${cellSize}" rx="6" fill="#2c313a" stroke="#b5ead7" stroke-width="2"/>
                <text x="${fx+cellSize/2}" y="${fy+cellSize/2+7}" text-anchor="middle" font-size="18" fill="#f7b7a3" font-family="Kanit">${faces[i]}</text>`;
  });
  svg += outline;
  return `<div class="net-option" data-option="${optionIdx}">${svg}</div>`;
}

function renderPuzzle() {
  // 1. Generate cube
  const cube = generateCube();
  // 2. Render cube SVG
  renderCubeSVG(cube);
  // 3. Pick a random net for the correct answer
  const correctNetIdx = randomInt(0, cubeNets.length-1);
  const correctNet = cubeNets[correctNetIdx];
  // 4. Map cube faces to net faces using the canonical mapping
  const correctFaces = correctNet.faceMap.map(idx => cube.faces[idx]);
  
  // 5. Generate 3 false nets by creating alternative cube orientations
  const usedNetIndices = [correctNetIdx];
  const options = [
    { net: correctNet, faces: correctFaces, correct: true }
  ];
  
  while (options.length < 4) {
    // For incorrect answers, we'll create a valid cube with different face values
    const altCube = { faces: [...cube.faces] };
    
    // Create a wrong answer by swapping 2-4 pairs of face values
    // This creates a geometrically valid cube with incorrect face placements
    const numSwaps = randomInt(2, 3); // 2 or 3 swaps
    for (let i = 0; i < numSwaps; i++) {
      const idx1 = randomInt(0, 5);
      let idx2;
      do {
        idx2 = randomInt(0, 5);
      } while (idx2 === idx1);
      [altCube.faces[idx1], altCube.faces[idx2]] = [altCube.faces[idx2], altCube.faces[idx1]];
    }
    
    // Select a random net (can be the same shape as correct answer)
    let netIdx;
    do {
      netIdx = randomInt(0, cubeNets.length-1);
    } while (usedNetIndices.includes(netIdx));
    usedNetIndices.push(netIdx);
    
    const net = cubeNets[netIdx];
    if (!net.layout || !net.faceMap || net.layout.length !== 6 || net.faceMap.length !== 6) continue;
    
    // Map the altered cube faces to the net
    const faces = net.faceMap.map(idx => altCube.faces[idx]);
    options.push({ net, faces, correct: false });
  }
  
  shuffle(options);
  const netOptionsList = document.getElementById('net-options-list');
  netOptionsList.innerHTML = options.map((opt, idx) => renderNetSVG(opt.net, opt.faces, idx)).join('');
  
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
