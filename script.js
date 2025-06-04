// Cube Net Generator
document.addEventListener('DOMContentLoaded', () => {
  // Configuration for the cube patterns
  const config = {
    // Types of patterns we can apply to faces
    patternTypes: ['colors', 'letters', 'numbers'],
    
    // Only primary and secondary colors
    colors: [
      'red', 'blue', 'yellow', 'green', 'orange', 'purple'
    ],
    
    // Letter patterns (uppercase alphabet)
    letters: Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i)),
    
    // Number patterns (1-99)
    numbers: Array.from({length: 99}, (_, i) => i + 1),
    
    // 11 valid cube net layouts (from reference image)
    netLayouts: [
      // Type 1
      { name: 'Type 1', faces: [
        {face:5,x:0,y:0}, {face:4,x:1,y:0}, {face:3,x:2,y:0}, {face:0,x:1,y:1}, {face:1,x:1,y:2}, {face:2,x:1,y:3}
      ]},
      // Type 2
      { name: 'Type 2', faces: [
        {face:0,x:0,y:0}, {face:1,x:1,y:0}, {face:2,x:1,y:1}, {face:3,x:2,y:1}, {face:4,x:1,y:2}, {face:5,x:1,y:3}
      ]},
      // Type 3
      { name: 'Type 3', faces: [
        {face:0,x:0,y:0}, {face:1,x:1,y:0}, {face:2,x:1,y:1}, {face:3,x:1,y:2}, {face:4,x:2,y:2}, {face:5,x:1,y:3}
      ]},
      // Type 4
      { name: 'Type 4', faces: [
        {face:0,x:0,y:0}, {face:1,x:1,y:0}, {face:2,x:1,y:1}, {face:3,x:1,y:2}, {face:4,x:1,y:3}, {face:5,x:2,y:3}
      ]},
      // Type 5
      { name: 'Type 5', faces: [
        {face:0,x:0,y:0}, {face:1,x:0,y:1}, {face:2,x:1,y:1}, {face:3,x:2,y:1}, {face:4,x:1,y:2}, {face:5,x:1,y:3}
      ]},
      // Type 6
      { name: 'Type 6', faces: [
        {face:0,x:0,y:0}, {face:1,x:0,y:1}, {face:2,x:1,y:1}, {face:3,x:1,y:2}, {face:4,x:2,y:2}, {face:5,x:1,y:3}
      ]},
      // Type 7
      { name: 'Type 7', faces: [
        {face:0,x:0,y:0}, {face:1,x:0,y:1}, {face:2,x:1,y:1}, {face:3,x:1,y:2}, {face:4,x:1,y:3}, {face:5,x:2,y:3}
      ]},
      // Type 8
      { name: 'Type 8', faces: [
        {face:0,x:0,y:0}, {face:1,x:0,y:1}, {face:2,x:1,y:1}, {face:3,x:1,y:2}, {face:4,x:2,y:2}, {face:5,x:2,y:3}
      ]},
      // Type 9
      { name: 'Type 9', faces: [
        {face:0,x:1,y:0}, {face:1,x:0,y:1}, {face:2,x:1,y:1}, {face:3,x:2,y:1}, {face:4,x:1,y:2}, {face:5,x:1,y:3}
      ]},
      // Type 10
      { name: 'Type 10', faces: [
        {face:0,x:1,y:0}, {face:1,x:0,y:1}, {face:2,x:1,y:1}, {face:3,x:1,y:2}, {face:4,x:2,y:2}, {face:5,x:1,y:3}
      ]},
      // Type 11
      { name: 'Type 11', faces: [
        {face:0,x:0,y:0}, {face:1,x:0,y:1}, {face:2,x:0,y:2}, {face:3,x:1,y:2}, {face:4,x:1,y:3}, {face:5,x:1,y:4}
      ]}
    ]
  };

  // Define all 8 possible corner views for the cube (make sure this is at top-level scope)
  const cubeCornerViews = [
    {
      name: 'Top-Front-Right',
      rotation: { x: -35.264, y: -45 },
      faces: ['top', 'front', 'right']
    },
    {
      name: 'Top-Front-Left',
      rotation: { x: -35.264, y: 45 },
      faces: ['top', 'front', 'left']
    },
    {
      name: 'Top-Back-Right',
      rotation: { x: -35.264, y: -135 },
      faces: ['top', 'back', 'right']
    },
    {
      name: 'Top-Back-Left',
      rotation: { x: -35.264, y: 135 },
      faces: ['top', 'back', 'left']
    },
    {
      name: 'Bottom-Front-Right',
      rotation: { x: 35.264, y: -45 },
      faces: ['bottom', 'front', 'right']
    },
    {
      name: 'Bottom-Front-Left',
      rotation: { x: 35.264, y: 45 },
      faces: ['bottom', 'front', 'left']
    },
    {
      name: 'Bottom-Back-Right',
      rotation: { x: 35.264, y: -135 },
      faces: ['bottom', 'back', 'right']
    },
    {
      name: 'Bottom-Back-Left',
      rotation: { x: 35.264, y: 135 },
      faces: ['bottom', 'back', 'left']
    }
  ];

  // Main generator class for cube nets
  class CubeNetGenerator {
    constructor(config) {
      this.config = config;
      this.currentLayout = null;
      this.facePatterns = [];
    }

    // Generate a random pattern for each face
    generateFacePatterns() {
      this.facePatterns = [];
      // Randomly select pattern types for each face
      const selectedPatternTypes = [];
      for (let i = 0; i < 6; i++) {
        // Random pattern type selection
        const patternType = this.config.patternTypes[Math.floor(Math.random() * this.config.patternTypes.length)];
        selectedPatternTypes.push(patternType);
      }
      // Generate the pattern for each face based on its type
      for (let i = 0; i < 6; i++) {
        const patternType = selectedPatternTypes[i];
        let facePattern;
        if (patternType === 'colors') {
          // 3x3 grid of random colors
          facePattern = {
            type: patternType,
            grid: Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => this.config.colors[Math.floor(Math.random() * this.config.colors.length)]))
          };
        } else if (patternType === 'letters') {
          // Single random letter
          facePattern = {
            type: patternType,
            value: this.config.letters[Math.floor(Math.random() * this.config.letters.length)]
          };
        } else if (patternType === 'numbers') {
          // Single random number
          facePattern = {
            type: patternType,
            value: this.config.numbers[Math.floor(Math.random() * this.config.numbers.length)]
          };
        }
        this.facePatterns.push(facePattern);
      }
    }

    // Select a random net layout
    selectRandomLayout() {
      const layoutIndex = Math.floor(Math.random() * this.config.netLayouts.length);
      this.currentLayout = this.config.netLayouts[layoutIndex];
      return this.currentLayout;
    }

    // Render the net to the DOM
    renderNet(container) {
      if (!this.currentLayout || this.facePatterns.length !== 6) {
        this.selectRandomLayout();
        this.generateFacePatterns();
      }
      // Clear the container
      container.innerHTML = '';
      // Find min/max x/y to normalize positions
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      this.currentLayout.faces.forEach(facePos => {
        minX = Math.min(minX, facePos.x);
        minY = Math.min(minY, facePos.y);
        maxX = Math.max(maxX, facePos.x);
        maxY = Math.max(maxY, facePos.y);
      });
      const gridW = maxX - minX + 1;
      const gridH = maxY - minY + 1;
      const cellSize = 120;
      // Calculate the bounding box of the net
      const netPixelW = gridW * cellSize;
      const netPixelH = gridH * cellSize;
      // Create the net container
      const netContainer = document.createElement('div');
      netContainer.className = 'net-container';
      netContainer.style.width = netPixelW + 'px';
      netContainer.style.height = netPixelH + 'px';
      netContainer.style.position = 'relative';
      netContainer.style.background = 'none';
      // Add faces to the grid
      this.currentLayout.faces.forEach(facePos => {
        const faceElement = document.createElement('div');
        faceElement.className = 'cube-face';
        faceElement.dataset.faceIndex = facePos.face; // Store the face index as data attribute
        faceElement.style.left = `${(facePos.x - minX) * cellSize}px`;
        faceElement.style.top = `${(facePos.y - minY) * cellSize}px`;
        faceElement.style.position = 'absolute';
        faceElement.style.width = cellSize + 'px';
        faceElement.style.height = cellSize + 'px';
        if (facePos.rotation) {
          faceElement.style.transform = `rotate(${facePos.rotation}deg)`;
        } else {
          faceElement.style.transform = '';
        }
        // Render face content based on type
        const facePattern = this.facePatterns[facePos.face];
        if (facePattern.type === 'colors') {
          // 3x3 grid of colors
          const faceGrid = document.createElement('div');
          faceGrid.className = 'face-grid';
          for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
              const cell = document.createElement('div');
              cell.className = 'grid-cell';
              cell.style.backgroundColor = facePattern.grid[row][col];
              cell.textContent = '';
              faceGrid.appendChild(cell);
            }
          }
          faceElement.appendChild(faceGrid);
        } else if (facePattern.type === 'letters' || facePattern.type === 'numbers') {
          // Single centered letter or number
          const singleCell = document.createElement('div');
          singleCell.className = 'grid-cell';
          singleCell.style.width = '100%';
          singleCell.style.height = '100%';
          singleCell.style.fontSize = '3.5rem';
          singleCell.style.backgroundColor = '#222';
          singleCell.style.display = 'flex';
          singleCell.style.alignItems = 'center';
          singleCell.style.justifyContent = 'center';
          singleCell.textContent = facePattern.value;
          faceElement.appendChild(singleCell);
        }
        netContainer.appendChild(faceElement);
      });
      // Responsive scaling: fit net-container to parent
      setTimeout(() => {
        const parent = container;
        const parentW = parent.offsetWidth;
        const parentH = parent.offsetHeight;
        // Calculate scale to fit net-container inside parent
        const scale = Math.min(parentW / netPixelW, parentH / netPixelH, 1);
        netContainer.style.transform = `scale(${scale})`;
        netContainer.style.transformOrigin = 'top left';
        // Center the scaled net-container in parent
        netContainer.style.left = `calc(50% - ${(netPixelW * scale) / 2}px)`;
        netContainer.style.top = `calc(50% - ${(netPixelH * scale) / 2}px)`;
        netContainer.style.position = 'absolute';
      }, 0);
      // Move the New Net button and others to the control panel
      const controlPanel = document.querySelector('.control-panel');
      controlPanel.innerHTML = '';
      // Create CORRECT button
      const correctBtn = document.createElement('button');
      correctBtn.className = 'correct-btn';
      correctBtn.textContent = 'CORRECT';
      // Create New Net button
      const newNetBtn = document.createElement('button');
      newNetBtn.className = 'new-net-btn';
      newNetBtn.textContent = 'New Net';
      newNetBtn.addEventListener('click', () => {
        this.selectRandomLayout();
        this.generateFacePatterns();
        this.renderNet(container);
      });
      // Create INCORRECT button
      const incorrectBtn = document.createElement('button');
      incorrectBtn.className = 'incorrect-btn';
      incorrectBtn.textContent = 'INCORRECT';
      // Add all three buttons to the control panel
      controlPanel.appendChild(correctBtn);
      controlPanel.appendChild(newNetBtn);
      controlPanel.appendChild(incorrectBtn);

      // --- Score logic ---
      // Move score variable and updateScoreDisplay to top-level scope so it persists
      if (typeof window.cubeScore === 'undefined') {
        window.cubeScore = parseInt(localStorage.getItem('cubeScore') || '0', 10);
      }
      // Define window.isImpossible at the window level so it's accessible from anywhere
      window.isImpossible = false;
      
      const scoreCircle = document.getElementById('score-circle');
      function updateScoreDisplay() {
        scoreCircle.textContent = window.cubeScore;
      }
      updateScoreDisplay();
      function resetScore() {
        window.cubeScore = 0;
        localStorage.setItem('cubeScore', window.cubeScore);
        updateScoreDisplay();
      }
      function addPoint() {
        window.cubeScore += 1;
        localStorage.setItem('cubeScore', window.cubeScore);
        updateScoreDisplay();
      }
      // Button logic
      correctBtn.onclick = () => {
        if (window.isImpossible) {
          // Incorrect answer: highlight rotated face and disable buttons
          highlightRotatedFaceAndPause();
        } else {
          addPoint();
          // Always go to next problem
          setTimeout(() => newNetBtn.click(), 0);
        }
      };
      incorrectBtn.onclick = () => {
        if (window.isImpossible) {
          addPoint();
          // Always go to next problem
          setTimeout(() => newNetBtn.click(), 0);
        } else {
          // Incorrect answer: highlight rotated face and disable buttons
          highlightRotatedFaceAndPause();
        }
      };

      // Helper to highlight the rotated face and pause UI
      function highlightRotatedFaceAndPause() {
        // Reset score when incorrect
        resetScore();
        
        // Disable and gray out buttons
        correctBtn.disabled = true;
        incorrectBtn.disabled = true;
        correctBtn.style.opacity = '0.5';
        incorrectBtn.style.opacity = '0.5';
        
        // Only highlight if a face was rotated (impossible case)
        if (window.isImpossible && typeof window.rotatedNetIdx === 'number' && window.rotatedNetIdx >= 0) {
          // Find the face element that has the data-face-index attribute matching rotatedNetIdx
          const highlightFace = document.querySelector(`.cube-face[data-face-index="${window.rotatedNetIdx}"]`);
          
          if (highlightFace) {
            highlightFace.classList.add('glow-red');
          }
        }
      }
      // When NEW NET is pressed, re-enable buttons and remove highlight
      newNetBtn.addEventListener('click', () => {
        correctBtn.disabled = false;
        incorrectBtn.disabled = false;
        correctBtn.style.opacity = '1';
        incorrectBtn.style.opacity = '1';
        // Remove highlight from all faces
        document.querySelectorAll('.net-container .cube-face.glow-red').forEach(el => {
          el.classList.remove('glow-red');
        });
      });

      // Make sure the parent is relative for absolute centering
      container.style.position = 'relative';
      container.appendChild(netContainer);
      // --- 3D Cube Rendering ---
      // Mapping for all net layouts: face name, net index, and rotation
      const cubeFaceMaps = {
        'Type 1': [
          { net: 0, cube: 'top', rotation: 0 },
          { net: 1, cube: 'front', rotation: 0 },
          { net: 2, cube: 'bottom', rotation: 0 },
          { net: 3, cube: 'right', rotation: 180 },
          { net: 4, cube: 'back', rotation: 180 },
          { net: 5, cube: 'left', rotation: 180 },
        ],
        'Type 2': [
          { net: 0, cube: 'left', rotation: 180 },
          { net: 1, cube: 'back', rotation: 180 },
          { net: 2, cube: 'top', rotation: 0 },
          { net: 3, cube: 'right', rotation: 90 },
          { net: 4, cube: 'front', rotation: 0 },
          { net: 5, cube: 'bottom', rotation: 0 },
        ],
        'Type 3': [
          { net: 0, cube: 'left', rotation: 180 },
          { net: 1, cube: 'back', rotation: 180 },
          { net: 2, cube: 'top', rotation: 0 },
          { net: 3, cube: 'front', rotation: 0 },
          { net: 4, cube: 'right', rotation: 0 },
          { net: 5, cube: 'bottom', rotation: 0 },
        ],
        'Type 4': [
          { net: 0, cube: 'left', rotation: 180 },
          { net: 1, cube: 'back', rotation: 180 },
          { net: 2, cube: 'top', rotation: 0 },
          { net: 3, cube: 'front', rotation: 0 },
          { net: 4, cube: 'bottom', rotation: 0 },
          { net: 5, cube: 'right', rotation: 270 },
        ],
        'Type 5': [
          { net: 0, cube: 'back', rotation: 270 },
          { net: 1, cube: 'left', rotation: 270 },
          { net: 2, cube: 'top', rotation: 0 },
          { net: 3, cube: 'right', rotation: 90 },
          { net: 4, cube: 'front', rotation: 0 },
          { net: 5, cube: 'bottom', rotation: 0 },
        ],
        'Type 6': [
          { net: 0, cube: 'back', rotation: 270 },
          { net: 1, cube: 'left', rotation: 270 },
          { net: 2, cube: 'top', rotation: 0 },
          { net: 3, cube: 'front', rotation: 0 },
          { net: 4, cube: 'right', rotation: 0 },
          { net: 5, cube: 'bottom', rotation: 0 },
        ],
        'Type 7': [
          { net: 0, cube: 'back', rotation: 270 },
          { net: 1, cube: 'left', rotation: 270 },
          { net: 2, cube: 'top', rotation: 0 },
          { net: 3, cube: 'front', rotation: 0 },
          { net: 4, cube: 'bottom', rotation: 0 },
          { net: 5, cube: 'right', rotation: 270 },
        ],
        'Type 8': [
          { net: 0, cube: 'back', rotation: 270 },
          { net: 1, cube: 'left', rotation: 270 },
          { net: 2, cube: 'top', rotation: 0 },
          { net: 3, cube: 'front', rotation: 0 },
          { net: 4, cube: 'right', rotation: 0 },
          { net: 5, cube: 'bottom', rotation: 90 },
        ],
        'Type 9': [
          { net: 0, cube: 'back', rotation: 180 },
          { net: 1, cube: 'left', rotation: 270 },
          { net: 2, cube: 'top', rotation: 0 },
          { net: 3, cube: 'right', rotation: 90 },
          { net: 4, cube: 'front', rotation: 0 },
          { net: 5, cube: 'bottom', rotation: 0 },
        ],
        'Type 10': [
          { net: 0, cube: 'back', rotation: 180 },
          { net: 1, cube: 'left', rotation: 270 },
          { net: 2, cube: 'top', rotation: 0 },
          { net: 3, cube: 'front', rotation: 0 },
          { net: 4, cube: 'right', rotation: 0 },
          { net: 5, cube: 'bottom', rotation: 0 },
        ],
        'Type 11': [
          { net: 0, cube: 'bottom', rotation: 0 },
          { net: 1, cube: 'back', rotation: 180 },
          { net: 2, cube: 'top', rotation: 0 },
          { net: 3, cube: 'right', rotation: 90 },
          { net: 4, cube: 'front', rotation: 90 },
          { net: 5, cube: 'left', rotation: 90 },
        ],
      };

      function renderCube3D(netLayout, facePatterns) {
        // Use the correct face map for the current net layout
        const faceMap = cubeFaceMaps[netLayout.name];
        if (!faceMap) {
          const cubeDiv = document.getElementById('cube-container');
          cubeDiv.innerHTML = '<div style="color:#888;text-align:center;padding:2rem;">3D folding not supported for this net layout.</div>';
          return;
        }

        // --- Randomize the view among 8 corners ---
        let currentCorner = getRandomCubeCornerView();

        // Find the 3 visible faces in the net layout (before mapping)
        // Map: cube face name -> net face index
        const cubeToNet = {};
        faceMap.forEach(({ net, cube }) => { cubeToNet[cube] = net; });
        const visibleNetIndices = currentCorner.faces.map(cubeFace => cubeToNet[cubeFace]);

        // 50-50 random chance to rotate one visible face in the net layout
        window.isImpossible = false; // Make it globally accessible
// Use window.isImpossible everywhere instead of local impossible
        let rotatedNetIdx = -1;
        let rotatedDeg = 0;
        let rotationApplied = false;
        let rotatedFacePattern = null;
        if (Math.random() < 0.5) {
          // Pick one of the 3 visible net faces at random
          const idx = Math.floor(Math.random() * visibleNetIndices.length);
          rotatedNetIdx = visibleNetIndices[idx];
          rotatedFacePattern = facePatterns[rotatedNetIdx];
          let allowedRotations = [90, 180, 270];
          let skip = false;
          if (rotatedFacePattern.type === 'letters') {
            const val = rotatedFacePattern.value.toUpperCase();
            if (["H","I","Z","N","S"].includes(val)) {
              allowedRotations = [90];
            } else if (["O"].includes(val)) {
              skip = true;
            } else if (["W","M"].includes(val)) {
              allowedRotations = [90, 270];
            }
          } else if (rotatedFacePattern.type === 'numbers') {
            const val = rotatedFacePattern.value.toString();
            if (["69", "88","96"].includes(val)) {
              skip = true;
            }
          }
          if (!skip) {
            rotatedDeg = allowedRotations[Math.floor(Math.random() * allowedRotations.length)];
            window.isImpossible = true;
            window.rotatedNetIdx = rotatedNetIdx; // Store for later
            rotationApplied = true;
          }
        }

        // Prepare textures for each face
        const faceCanvases = [];
        for (let i = 0; i < 6; i++) {
          const pattern = facePatterns[i];
          const canvas = document.createElement('canvas');
          canvas.width = 120;
          canvas.height = 120;
          const ctx = canvas.getContext('2d');
          // Draw background
          ctx.fillStyle = '#222';
          ctx.fillRect(0, 0, 120, 120);
          ctx.save();
          // If this is the rotated net face, apply the rotation
          if (rotationApplied && i === rotatedNetIdx) {
  window.isImpossible = true;
            ctx.translate(60, 60);
            ctx.rotate((rotatedDeg * Math.PI) / 180);
            ctx.translate(-60, -60);
          }
          if (pattern.type === 'colors') {
            // 3x3 grid
            for (let row = 0; row < 3; row++) {
              for (let col = 0; col < 3; col++) {
                ctx.fillStyle = pattern.grid[row][col];
                ctx.fillRect(col * 40 + 4, row * 40 + 4, 32, 32);
              }
            }
          } else if (pattern.type === 'letters' || pattern.type === 'numbers') {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 72px Kanit, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(pattern.value, 60, 60);
          }
          ctx.restore();
          faceCanvases.push(canvas);
        }
        // Map net faces to cube faces for this layout
        const faceImages = {};
        faceMap.forEach(({ net, cube, rotation }) => {
          const src = faceCanvases[net];
          const out = document.createElement('canvas');
          out.width = 120;
          out.height = 120;
          const ctx = out.getContext('2d');
          ctx.save();
          ctx.translate(60, 60);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.drawImage(src, -60, -60);
          ctx.restore();
          faceImages[cube] = out.toDataURL();
        });

        // Build the 3D cube
        const cubeDiv = document.getElementById('cube-container');
        cubeDiv.innerHTML = '';

        // Create the 3D cube
        const cube3d = document.createElement('div');
        cube3d.className = 'cube-3d';
        cube3d.style.transform = `rotateX(${currentCorner.rotation.x}deg) rotateY(${currentCorner.rotation.y}deg)`;

        // Add all 6 faces, but only show the 3 visible ones
        ['front','back','left','right','top','bottom'].forEach(faceName => {
          const face = document.createElement('div');
          face.className = `cube-face-3d ${faceName}`;
          face.style.backgroundImage = `url('${faceImages[faceName]}')`;
          face.style.opacity = currentCorner.faces.includes(faceName) ? '1' : '0';
          cube3d.appendChild(face);
        });
        cubeDiv.appendChild(cube3d);

        // Handler to randomize the view
        // randomBtn.onclick = () => {
        //   currentCorner = getRandomCubeCornerView();
        //   cube3d.style.transform = `rotateX(${currentCorner.rotation.x}deg) rotateY(${currentCorner.rotation.y}deg)`;
        //   // Update face visibility
        //   cube3d.childNodes.forEach(face => {
        //     const faceName = Array.from(face.classList).find(cls => ['front','back','left','right','top','bottom'].includes(cls));
        //     face.style.opacity = currentCorner.faces.includes(faceName) ? '1' : '0';
        //   });
        // };
      }

      // Helper to get a random corner view
      function getRandomCubeCornerView() {
        const idx = Math.floor(Math.random() * cubeCornerViews.length);
        return cubeCornerViews[idx];
      }

      // After rendering the net, render the 3D cube
      renderCube3D(this.currentLayout, this.facePatterns);
    }
  }

  // Initialize the generator and render the first net
  const netContainer = document.querySelector('.net-center-container');
  const cubeNetGenerator = new CubeNetGenerator(config);
  cubeNetGenerator.renderNet(netContainer);
  
  // Initialize the stats
  const solves = document.querySelector('.stat-value');
  solves.textContent = '0';
});