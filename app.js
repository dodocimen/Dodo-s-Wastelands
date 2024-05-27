const edgeCompatibility = {
    ruins: ['ruins', 'road', 'nature'],
    road: ['road', 'car'],
    nature: ['nature', 'ruins'],
    // More rules...
};

let assets = [];
let grid = [];
const gridRows = 40; // Increased size for larger canvas
const gridCols = 40; // Increased size for larger canvas

const tileWidth = 80; // Width of a single tile in the isometric grid
const tileHeight = 30; // Height of a single tile in the isometric grid
const cellSize = 80; // Assuming each asset is 64x64 pixels

let offsetX = 0; // For dragging the canvas
let offsetY = 0; // For dragging the canvas
let dragging = false;
let dragStartX, dragStartY;

const protectedZoneSize = 3; // Define the size of the protected zone around the crater

const densityFactor = 0.4; // % of the grid cells will be filled with assets

// Offscreen canvas
let offscreenCanvas, offscreenContext;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvasContainer');
    document.getElementById('generateButton').addEventListener('click', () => {
        showLoadingScreen();
        setTimeout(() => {
            generateWasteland();
            hideLoadingScreen();
        }, 300); // Fake loading duration in milliseconds
    });
    canvas.mousePressed(startDrag);
    canvas.mouseReleased(stopDrag);
    offscreenCanvas = createGraphics(gridCols * tileWidth, gridRows * tileHeight);
    offscreenContext = offscreenCanvas.elt.getContext('2d');
    generateWasteland(); // Optional: generate initial wasteland on setup
}

function preload() {
    assets = [
        // Small buildings (1x1 grid cell)
        { type: 'building', image: loadImage('assets/buildings/building1.png'), size: .7, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 5 },
        { type: 'building', image: loadImage('assets/buildings/building2.png'), size: 1.2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 7 },
        { type: 'building', image: loadImage('assets/buildings/building3.png'), size: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 3 },
        { type: 'building', image: loadImage('assets/buildings/building4.png'), size: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 2 },
        { type: 'building', image: loadImage('assets/buildings/building5.png'), size: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 4 },
        { type: 'building', image: loadImage('assets/buildings/building6.png'), size: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 6 },
        { type: 'building', image: loadImage('assets/buildings/building7.png'), size: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 8 },
        { type: 'building', image: loadImage('assets/buildings/building8.png'), size: 1.3, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 5 },
        { type: 'building', image: loadImage('assets/buildings/building9.png'), size: 1.3, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 5 },
        { type: 'building', image: loadImage('assets/buildings/building10.png'), size: 1.3, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 5 },
        { type: 'building', image: loadImage('assets/buildings/building11.png'), size: 1.3, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 5 },
        { type: 'building', image: loadImage('assets/buildings/building12.png'), size: 1.3, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 5 },
        { type: 'building', image: loadImage('assets/buildings/building13.png'), size: 1.3, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 5 },
        { type: 'building', image: loadImage('assets/buildings/building14.png'), size: 1.3, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 5 },
        { type: 'building', image: loadImage('assets/buildings/building15.png'), size: 1.3, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 5 },
        { type: 'building', image: loadImage('assets/buildings/building16.png'), size: 1.3, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 5 },

        // Large building (3x3 grid cells)
        { type: 'largeBuilding', image: loadImage('assets/buildings/large-building1.png'), size: 2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 5 },
        { type: 'largeBuilding', image: loadImage('assets/buildings/large-building3.png'), size: 2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 5 },
        { type: 'largeBuilding', image: loadImage('assets/buildings/large-building4.png'), size: 1.5, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 5 },
        { type: 'largeBuilding', image: loadImage('assets/buildings/large-building6.png'), size: 2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' },
        rarity: 5 },
        { type: 'largeBuilding', image: loadImage('assets/buildings/large-building7.png'), size: 1.5, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 5 },
        { type: 'largeBuilding', image: loadImage('assets/buildings/large-building8.png'), size: 2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 5 },
        { type: 'largeBuilding', image: loadImage('assets/buildings/large-building9.png'), size: 2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 5 },
        { type: 'largeBuilding', image: loadImage('assets/buildings/large-building11.png'), size: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 5},
        { type: 'largeBuilding', image: loadImage('assets/buildings/large-building12.png'), size: 2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 5},
        
        // Nature (1x1 grid cells)
        { type: 'tree', image: loadImage('assets/nature/tree1.png'), size: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 1 },
        { type: 'tree', image: loadImage('assets/nature/tree2.png'), size: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 1 },
        { type: 'tree', image: loadImage('assets/nature/tree3.png'), size: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 1 },
        { type: 'tree', image: loadImage('assets/nature/tree4.png'), size: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 1 },
        { type: 'tree', image: loadImage('assets/nature/tree5.png'), size: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 1 },
        { type: 'tree', image: loadImage('assets/nature/tree6.png'), size: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 1 },
        { type: 'tree', image: loadImage('assets/nature/tree7.png'), size: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 1 },
        { type: 'tree', image: loadImage('assets/nature/tree8.png'), size: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 1 },

        // Large nature (2x2 grid cells)
        { type: 'largeGrass', image: loadImage('assets/nature/drygrass-large1.png'), size: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 5 },
        { type: 'largeGrass', image: loadImage('assets/nature/drygrass-large2.png'), size: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, 
        rarity: 1 },

        // Cars (1x1 grid cell)
        { type: 'car', image: loadImage('assets/vehicles/car1.png'), size: 1, edges: { top: 'road', right: 'road', bottom: 'road', left: 'road' }, 
        rarity: 4 },
        { type: 'car', image: loadImage('assets/vehicles/car2.png'), size: 1, edges: { top: 'road', right: 'road', bottom: 'road', left: 'road' }, 
        rarity: 5 },
        { type: 'car', image: loadImage('assets/vehicles/car3.png'), size: 1, edges: { top: 'road', right: 'road', bottom: 'road', left: 'road' }, 
        rarity: 6 },

        // Light sources
        { type: 'streetLamp', image: loadImage('assets/lights/light-building1.png'), size: 1, edges: { top: 'road', right: 'road', bottom: 'road', left: 'road' }, 
        rarity: 5 },
        { type: 'streetLamp', image: loadImage('assets/lights/light-building2.png'), size: .7, edges: { top: 'road', right: 'road', bottom: 'road', left: 'road' }, 
        rarity: 5 },

        // Dead Zone Assets
        { type: 'crater', image: loadImage('assets/deadzone/largecrater.png'), size: 6, edges: { top: 'deadZone', right: 'deadZone', bottom: 'deadZone', left: 'deadZone' }, 
        rarity: 5 },

        // Downtown Zone Assets
        { type: 'condoComplex', image: loadImage('assets/downtown/largebuildingscombination.png'), size: 5, edges: { top: 'downtownZone', right: 'downtownZone', bottom: 'downtownZone', left: 'downtownZone' }, 
        rarity: 6 },
        { type: 'skyScraper', image: loadImage('assets/downtown/dtownbuilding1.png'), size: 1.3, edges: { top: 'downtownZone', right: 'downtownZone', bottom: 'downtownZone', left: 'downtownZone' }, 
        rarity: 3 },
        { type: 'skyScraper', image: loadImage('assets/downtown/dtownbuilding2.png'), size: 1.2, edges: { top: 'downtownZone', right: 'downtownZone', bottom: 'downtownZone', left: 'downtownZone' }, 
        rarity: 3 },
        { type: 'skyScraper', image: loadImage('assets/downtown/dtownbuilding3.png'), size: 1.3, edges: { top: 'downtownZone', right: 'downtownZone', bottom: 'downtownZone', left: 'downtownZone' }, 
        rarity: 3 },
        { type: 'skyScraper', image: loadImage('assets/downtown/dtownbuilding5.png'), size: 2.5, edges: { top: 'downtownZone', right: 'downtownZone', bottom: 'downtownZone', left: 'downtownZone' }, 
        rarity: 5 },
        { type: 'skyScraper', image: loadImage('assets/downtown/dtownbuilding8.png'), size: 2, edges: { top: 'downtownZone', right: 'downtownZone', bottom: 'downtownZone', left: 'downtownZone' }, 
        rarity: 5 },
    ];
}

const loadingMessages = [
    'NUKING THE CITY',
    'DISCOVERING NEW WASTELAND',
    'PETTING DOGMEAT',
    'CREATING RADIOACTIVE CRATERS',
    'SPAWNING ABANDONED BUILDINGS',
    'GENERATING RUSTY VEHICLES',
    'PLACING SCATTERED DEBRIS',
    'PLANTING DEAD TREES',
    'DEPLOYING WRECKED VEHICLES',
    'CREATING POST-APOCALYPTIC LANDMARKS',
    'CLEANING THE NUCLEAR WASTE',
    'ESCAPING WASTELAND BANDITS'
];

function showLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loadingScreen';
    loadingScreen.className = 'loadingScreen';
    const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    loadingScreen.innerHTML = randomMessage;
    document.body.appendChild(loadingScreen);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        document.body.removeChild(loadingScreen);
    }
}

function generateWasteland() {
    showLoadingScreen();
    const randomDelay = Math.random() * 2000 + 1000; // Random delay between 1000ms (1 second) and 3000ms (3 seconds)
    setTimeout(() => {
        grid = Array(gridRows).fill().map(() => Array(gridCols).fill(null));
        
        const totalCells = gridRows * gridCols;
        const cellsToFill = Math.floor(totalCells * densityFactor);
        let placedAssets = 0;

        while (placedAssets < cellsToFill) {
            let row = Math.floor(Math.random() * gridRows);
            let col = Math.floor(Math.random() * gridCols);

            if (!grid[row][col]) {
                let availableAssets = assets.filter(asset => canPlaceAsset(asset, row, col));
                if (availableAssets.length > 0) {
                    let asset = getRandomAsset(availableAssets);
                    placeAsset(asset, row, col);
                    placedAssets++;
                }
            }
        }
        drawOffscreenCanvas();
        hideLoadingScreen();
    }, randomDelay);
}



function getRandomAsset(availableAssets) {
    if (availableAssets.length === 0) {
        console.warn('No available assets to choose from');
        return null;
    }

    let totalWeight = availableAssets.reduce((total, asset) => total + (11 - asset.rarity), 0);
    let randomWeight = Math.random() * totalWeight;

    for (let asset of availableAssets) {
        randomWeight -= (11 - asset.rarity);
        if (randomWeight <= 0) {
            return asset;
        }
    }

    return availableAssets[availableAssets.length - 1];
}

function canPlaceAsset(asset, row, col) {
    for (let r = row; r < row + asset.size; r++) {
        for (let c = col; c < col + asset.size; c++) {
            if (r >= gridRows || c >= gridCols || grid[r][c]) {
                return false;
            }
        }
    }

    // Check neighboring cells for the same asset image
    const neighbors = [
        { r: row - 1, c: col },
        { r: row + 1, c: col },
        { r: row, c: col - 1 },
        { r: row, c: col + 1 }
    ];

    for (let neighbor of neighbors) {
        if (neighbor.r >= 0 && neighbor.r < gridRows && neighbor.c >= 0 && neighbor.c < gridCols) {
            let neighborAsset = grid[neighbor.r][neighbor.c];
            if (neighborAsset && neighborAsset.image === asset.image) {
                return false;
            }
        }
    }

    // Prevent other assets from overlapping the middle part of the crater
    if (asset.type !== 'crater') {
        for (let r = row - protectedZoneSize; r <= row + protectedZoneSize; r++) {
            for (let c = col - protectedZoneSize; c <= col + protectedZoneSize; c++) {
                if (r >= 0 && r < gridRows && c >= 0 && c < gridCols) {
                    let centerAsset = grid[r][c];
                    if (centerAsset && centerAsset.type === 'crater' && !centerAsset.part) {
                        return false;
                    }
                }
            }
        }
    }

    return true;
}


function placeAsset(asset, startRow, startCol) {
    for (let row = startRow; row < startRow + asset.size; row++) {
        for (let col = startCol; col < startCol + asset.size; col++) {
            if (row < gridRows && col < gridCols) {
                grid[row][col] = { ...asset, part: true };
            }
        }
    }
    grid[startRow][startCol] = { ...asset, part: false };
}

function draw() {
    background(200); // Sets the background to a light gray color
    clear();
    translate(offsetX, offsetY);
    image(offscreenCanvas, -offsetX, -offsetY, offscreenCanvas.width, offscreenCanvas.height);
    checkMousePositionForScrolling();
}

function drawOffscreenCanvas() {
    offscreenCanvas.clear();
    // First, draw the dead zone assets
    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            let asset = getAssetAt(row, col);
            if (asset && !asset.part && asset.type === 'crater') {
                let img = asset.image;
                let aspectRatio = img.width / img.height;
                let drawWidth, drawHeight;

                if (aspectRatio > 1) {
                    drawWidth = tileWidth * asset.size;
                    drawHeight = (tileWidth * asset.size) / aspectRatio;
                } else {
                    drawWidth = (tileHeight * asset.size) * aspectRatio;
                    drawHeight = tileHeight * asset.size;
                }

                let isoX = (col - row) * (tileWidth / 2);
                let isoY = (col + row) * (tileHeight / 2);

                let x = isoX + (tileWidth - drawWidth) / 2;
                let y = isoY + (tileHeight - drawHeight) / 2;

                offscreenCanvas.image(img, x, y, drawWidth, drawHeight);
            }
        }
    }

    // Then, draw all other assets
    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            let asset = getAssetAt(row, col);
            if (asset && !asset.part && asset.type !== 'crater') {
                let img = asset.image;
                let aspectRatio = img.width / img.height;
                let drawWidth, drawHeight;

                if (aspectRatio > 1) {
                    drawWidth = tileWidth * asset.size;
                    drawHeight = (tileWidth * asset.size) / aspectRatio;
                } else {
                    drawWidth = (tileHeight * asset.size) * aspectRatio;
                    drawHeight = tileHeight * asset.size;
                }

                let isoX = (col - row) * (tileWidth / 2);
                let isoY = (col + row) * (tileHeight / 2);

                let x = isoX + (tileWidth - drawWidth) / 2;
                let y = isoY + (tileHeight - drawHeight) / 2;

                offscreenCanvas.image(img, x, y, drawWidth, drawHeight);
            }
        }
    }
}

function startDrag() {
    dragging = true;
    dragStartX = mouseX - offsetX;
    dragStartY = mouseY - offsetY;
}

function stopDrag() {
    dragging = false;
}

function mouseDragged() {
    if (dragging) {
        offsetX = mouseX - dragStartX;
        offsetY = mouseY - dragStartY;
    }
}

let lastScrollCheck = 0;
function checkMousePositionForScrolling() {
    const edgeScrollMargin = 20; // Distance from edge to start scrolling
    const scrollSpeed = 5; // Speed of scrolling

    if (millis() - lastScrollCheck > 50) { // Throttling scroll check
        if (mouseX < edgeScrollMargin) {
            offsetX += scrollSpeed;
        }
        if (mouseX > width - edgeScrollMargin) {
            offsetX -= scrollSpeed;
        }
        if (mouseY < edgeScrollMargin) {
            offsetY += scrollSpeed;
        }
        if (mouseY > height - edgeScrollMargin) {
            offsetY -= scrollSpeed;
        }
        lastScrollCheck = millis();
    }
}

function getAssetAt(row, col) {
    let wrappedRow = (row % gridRows + gridRows) % gridRows;
    let wrappedCol = (col % gridCols + gridCols) % gridCols;
    return grid[wrappedRow][wrappedCol];
}
