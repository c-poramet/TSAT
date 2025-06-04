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
        const facePattern = {
          type: patternType,
          grid: []
        };
        
        // Fill 3x3 grid with random values based on pattern type
        for (let row = 0; row < 3; row++) {
          const gridRow = [];
          for (let col = 0; col < 3; col++) {
            let value;
            
            switch (patternType) {
              case 'colors':
                value = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
                break;
              case 'letters':
                value = this.config.letters[Math.floor(Math.random() * this.config.letters.length)];
                break;
              case 'numbers':
                value = this.config.numbers[Math.floor(Math.random() * this.config.numbers.length)];
                break;
            }
            
            gridRow.push(value);
          }
          facePattern.grid.push(gridRow);
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
      
      // Create the net container
      const netContainer = document.createElement('div');
      netContainer.className = 'net-container';
      
      // Determine grid dimensions
      let maxX = 0;
      let maxY = 0;
      this.currentLayout.faces.forEach(facePos => {
        maxX = Math.max(maxX, facePos.x);
        maxY = Math.max(maxY, facePos.y);
      });
      
      // Set the grid size
      netContainer.style.gridTemplateColumns = `repeat(${maxX + 1}, 1fr)`;
      netContainer.style.gridTemplateRows = `repeat(${maxY + 1}, 1fr)`;
      
      // Add faces to the grid
      this.currentLayout.faces.forEach(facePos => {
        const faceElement = document.createElement('div');
        faceElement.className = 'cube-face';
        faceElement.style.gridColumn = facePos.x + 1;
        faceElement.style.gridRow = facePos.y + 1;
        
        // Apply rotation
        if (facePos.rotation) {
          faceElement.style.transform = `rotate(${facePos.rotation}deg)`;
        }
        
        // Create the 3x3 grid for the face
        const facePattern = this.facePatterns[facePos.face];
        const faceGrid = document.createElement('div');
        faceGrid.className = 'face-grid';
        
        // Add cells to the grid
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            
            // Apply the pattern value
            const value = facePattern.grid[row][col];
            
            // Style based on pattern type
            switch(facePattern.type) {
              case 'colors':
                cell.style.backgroundColor = value;
                cell.textContent = '';
                break;
              case 'letters':
                cell.textContent = value;
                cell.style.backgroundColor = '#222';
                break;
              case 'numbers':
                cell.textContent = value;
                cell.style.backgroundColor = '#222';
                break;
            }
            
            faceGrid.appendChild(cell);
          }
        }
        
        faceElement.appendChild(faceGrid);
        netContainer.appendChild(faceElement);
      });
      
      // Create a new net button
      const newNetBtn = document.createElement('button');
      newNetBtn.className = 'new-net-btn';
      newNetBtn.textContent = 'New Net';
      newNetBtn.addEventListener('click', () => {
        this.selectRandomLayout();
        this.generateFacePatterns();
        this.renderNet(container);
      });
      
      // Append elements to the container
      container.appendChild(netContainer);
      container.appendChild(newNetBtn);
    }
  }

  // Initialize the generator and render the first net
  const netContainer = document.querySelector('.net');
  const cubeNetGenerator = new CubeNetGenerator(config);
  cubeNetGenerator.renderNet(netContainer);
  
  // Initialize the stats
  const solves = document.querySelector('.stat-value');
  solves.textContent = '0';
});