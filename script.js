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
    
    // Number patterns (1-100)
    numbers: Array.from({length: 100}, (_, i) => i + 1),
    
    // 11 valid cube net layouts (from reference image)
    netLayouts: [
      // Type 1
      { name: 'Type 1', faces: [
        {face:0,x:0,y:0}, {face:1,x:1,y:0}, {face:2,x:2,y:0}, {face:3,x:1,y:1}, {face:4,x:1,y:2}, {face:5,x:1,y:3}
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
      // Move the New Net button to the control panel
      const controlPanel = document.querySelector('.control-panel');
      controlPanel.innerHTML = '';
      const newNetBtn = document.createElement('button');
      newNetBtn.className = 'new-net-btn';
      newNetBtn.textContent = 'New Net';
      newNetBtn.addEventListener('click', () => {
        this.selectRandomLayout();
        this.generateFacePatterns();
        this.renderNet(container);
      });
      controlPanel.appendChild(newNetBtn);
      // Make sure the parent is relative for absolute centering
      container.style.position = 'relative';
      container.appendChild(netContainer);
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