const edgeCompatibility = {
    ruins: ['ruins', 'road', 'nature'],
    road: ['road', 'car'],
    nature: ['nature', 'ruins'],
    // More rules...
};
let placedLargeBuildings = new Set();
let assets = [];
let grid = [];
let craterPosition = null;
let condoComplexPosition = null;
const gridRows = 80; // Increased size for larger canvas
const gridCols = 80; // Increased size for larger canvas

const tileWidth = 80; // Width of a single tile in the isometric grid
const tileHeight = 30; // Height of a single tile in the isometric grid

const protectedZoneSize = 3; // Define the size of the protected zone around the crater

const densityFactor = 1; // % of the grid cells will be filled with assets

const maxAssets = 250; // Set the maximum number of assets you want to generate for non-mobile
const mobileMaxAssets = 150; // Set the maximum number of assets you want to generate for mobile

// Detect if the device is mobile
const isMobile = window.matchMedia("only screen and (max-width: 600px)").matches;

if (isMobile) {
    document.body.classList.add('mobile');
}


const mobileGridOffsetX = -30; // Customize these values as needed
const mobileGridOffsetY = -150; // Customize these values as needed
const desktopGridOffsetX = 50; // Customize these values as needed
const desktopGridOffsetY = 30; // Customize these values as needed

let useSVG = false; // Track whether to use SVG images
const maxSvgCount = 280; // Set the maximum number of SVGs you want to generate
let svgElements = []; // Store created SVG elements

//MUSIC APP

document.addEventListener('DOMContentLoaded', (event) => {
    const radio = document.getElementById('radio');
    const audioPlayer = document.getElementById('audioPlayer');
    const songNameContainer = document.getElementById('songNameContainer');
    const songNameElement = document.getElementById('songName');
    const radioSrc1 = 'assets/radio.svg';
    const radioSrc2 = 'assets/radio_active.svg';

    // List of music files and their display names
    const musicList = [
        { src: 'assets/music/heygringo.mp3', name: 'Hey Gringo - KALEO' },
        { src: 'assets/music/prettybug.mp3', name: 'Pretty Bug - Allan Rayman' },
        { src: 'assets/music/feelingyou.mp3', name: 'Feeling You - Harrison Storm' },
        { src: 'assets/music/savemesomesunshine.mp3', name: 'Save Me Some Sunshine - Rafferty' },
        { src: 'assets/music/elbuho.mp3', name: 'El Buho - Blanco White' },
        { src: 'assets/music/brotherrunfast.mp3', name: 'Brother Run Fast - KALEO' },
        { src: 'assets/music/fistfight.mp3', name: 'Fist Fight - The Balroom Thieves' },
        { src: 'assets/music/hammersnnails.mp3', name: 'Hammers and Nails - The Bones of J.R. Jones' },
        { src: 'assets/music/herewego.mp3', name: 'Here We Go - Norman' },
        { src: 'assets/music/silverlining.mp3', name: 'Silver Lining - Mt. Joy' },
        { src: 'assets/music/sunsetswest.mp3', name: 'Sun Sets West - little hurricane' },
        { src: 'assets/music/tickethome.mp3', name: 'Ticket Home - The Bones of J.R. Jones' },
        { src: 'assets/music/wakingupwithoutyou.mp3', name: 'Waking Up Without You - Rhys Lewis' },
    ];

    let currentSongIndex = 0;
    let isPlaying = false;
    let isFirstToggle = true; // Track if this is the first time the radio is toggled

    function playMusic() {
        audioPlayer.play();
        isPlaying = true;
        updateSongName(musicList[currentSongIndex].name);
    }

    function pauseMusic() {
        audioPlayer.pause();
        isPlaying = false;
    }

    function skipMusic() {
        currentSongIndex = (currentSongIndex + 1) % musicList.length;
        audioPlayer.src = musicList[currentSongIndex].src;
        audioPlayer.currentTime = 0; // Reset to start of new song
        playMusic();
    }

    function updateSongName(name) {
        songNameElement.textContent = name;
        songNameContainer.classList.remove('hidden');
        songNameContainer.classList.add('visible');
    }

    function hideSongName() {
        songNameContainer.classList.remove('visible');
        songNameContainer.classList.add('hidden');
    }

    function toggleSkipButton(show) {
        const skipButton = document.getElementById('skipButton');
        if (show) {
            skipButton.classList.add('visible');
        } else {
            skipButton.classList.remove('visible');
        }
    }

    radio.addEventListener('click', () => {
        if (radio.getAttribute('src') === radioSrc1) {
            radio.setAttribute('src', radioSrc2);
            if (isFirstToggle) {
                audioPlayer.src = musicList[currentSongIndex].src;
                isFirstToggle = false;
            }
            playMusic();
            toggleSkipButton(true);
        } else {
            radio.setAttribute('src', radioSrc1);
            pauseMusic();
            toggleSkipButton(false);
            hideSongName();
        }
        radio.classList.toggle('active'); // Toggle the active class
    });

    document.getElementById('skipButton').addEventListener('click', () => {
        skipMusic();
    });

    audioPlayer.addEventListener('ended', () => {
        if (isPlaying) {
            skipMusic(); // Automatically skip to the next song when the current song ends
        }
    });
});



// Modify the radio click event listener to show/hide the skip button
radio.addEventListener('click', () => {
    if (radio.getAttribute('src') === radioSrc1) {
        radio.setAttribute('src', radioSrc2);
        audioPlayer.play();
        toggleSkipButton(true); // Show the skip button when radio is active
    } else {
        radio.setAttribute('src', radioSrc1);
        pauseMusic();
        toggleSkipButton(false); // Hide the skip button when radio is inactive
    }
    radio.classList.toggle('active'); // Toggle the active class
});


document.getElementById('skipButton').addEventListener('click', () => {
    skipMusic();
});

 // Ensure music continues from where it left off when the radio is toggled back on
 audioPlayer.addEventListener('play', () => {
    if (!isPlaying) {
        audioPlayer.play();
    }
});

audioPlayer.addEventListener('pause', () => {
    if (isPlaying) {
        audioPlayer.pause();
    }
});

// Event listener for when the audio ends
audioPlayer.addEventListener('ended', () => {
    skipMusic();
});

// Ensure music continues from where it left off when the radio is toggled back on
audioPlayer.addEventListener('play', () => {
    if (!isPlaying) {
        audioPlayer.play();
    }
});

audioPlayer.addEventListener('pause', () => {
    if (isPlaying) {
        audioPlayer.pause();
    }
});



//END OF MUSIC APP


//FOR BUTTON,CINEMATIC BARS AND OTHER STUFF
document.addEventListener('DOMContentLoaded', (event) => {
    // Detect if the device is mobile
    const isMobile = window.matchMedia("only screen and (max-width: 600px)").matches;

    if (isMobile) {
        document.body.classList.add('mobile');
    }

    // Reset toggle button and cinematic bars to their initial state
    resetCinematicElements();

    // Toggle button event listener
    document.getElementById('toggleButton').addEventListener('click', () => {
        useSVG = !useSVG; // Toggle the image type
        const toggleButton = document.getElementById('toggleButton');
        if (useSVG) {
            document.body.style.backgroundColor = '#e4d6a7';
            addSVGs();
            toggleGenerateButton(true); // Disable the generate button
            showCinematicBars(); // Show the cinematic bars
            toggleButton.textContent = 'SWITCH BACK'; // Change button text
        } else {
            document.body.style.backgroundColor = '';
            removeSVGs();
            toggleGenerateButton(false); // Enable the generate button
            hideCinematicBars(); // Hide the cinematic bars
            toggleButton.textContent = 'DRAMATIZE'; // Change button text back
        }
        generateWasteland(); // Re-generate the wasteland to apply the new image type
    });
});

function resetCinematicElements() {
    const toggleButton = document.getElementById('toggleButton');
    const topBar = document.getElementById('topBar');
    const bottomBar = document.getElementById('bottomBar');

    // Reset button text
    toggleButton.textContent = 'DRAMATIZE';

    // Reset button position
    if (document.body.classList.contains('mobile')) {
        toggleButton.style.animation = '';
        toggleButton.style.transform = 'translateY(0)';
    }

    // Hide cinematic bars
    topBar.style.display = 'none';
    bottomBar.style.display = 'none';
    topBar.style.transform = 'translateY(-150%)';
    bottomBar.style.transform = 'translateY(150%)';
}

function showCinematicBars() {
    const topBar = document.getElementById('topBar');
    const bottomBar = document.getElementById('bottomBar');

    topBar.style.display = 'block';
    bottomBar.style.display = 'block';

    topBar.style.animation = 'slideIn 0.5s forwards';
    bottomBar.style.animation = 'slideInBottom 0.5s forwards';
}

function hideCinematicBars() {
    const topBar = document.getElementById('topBar');
    const bottomBar = document.getElementById('bottomBar');

    topBar.style.animation = 'slideOut 0.5s forwards';
    bottomBar.style.animation = 'slideOutBottom 0.5s forwards';

    // Delay hiding the bars until the animation completes
    setTimeout(() => {
        topBar.style.display = 'none';
        bottomBar.style.display = 'none';
    }, 500); // Duration of the slide-out animation
}

function toggleGenerateButton(disable) {
    const generateButton = document.getElementById('generateButton');
    if (disable) {
        generateButton.setAttribute('disabled', 'disabled');
        generateButton.style.opacity = '0.5'; // Optional: to visually indicate the button is disabled
        generateButton.style.cursor = 'not-allowed'; // Optional: change cursor to indicate disabled state
    } else {
        generateButton.removeAttribute('disabled');
        generateButton.style.opacity = '1';
        generateButton.style.cursor = 'pointer';
    }
}


function loadSVG(path) {
    let img = createImg(path, ''); // Create an img element without displaying it initially
    img.hide(); // Hide the original HTML element
    return img;
}

function getAssetImage(asset) {
    return useSVG ? asset.svgElement : asset.png;
}


function initializeGrid() {
    grid = Array(gridRows).fill().map(() => Array(gridCols).fill(null));
    placedLargeBuildings.clear(); // Clear the set of placed large buildings
}

function initializeAssets() {
    assets = [
        // Small buildings (1x1 grid cell)
        { type: 'building', png: loadImage('assets/buildings/building1.png'), svg: 'assets/buildings/building1.svg', svgElement: null, sizePng: .7, sizeSvg: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 5 },
        { type: 'building', png: loadImage('assets/buildings/building2.png'), svg: 'assets/buildings/building2.svg', svgElement: null, sizePng: .9, sizeSvg: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 4 },
        { type: 'building', png: loadImage('assets/buildings/building3.png'), svg: 'assets/buildings/building3.svg', svgElement: null, sizePng: 1, sizeSvg: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 4 },
        { type: 'building', png: loadImage('assets/buildings/building4.png'), svg: 'assets/buildings/building4.svg', svgElement: null, sizePng: 1, sizeSvg: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 4 },
        { type: 'building', png: loadImage('assets/buildings/building5.png'), svg: 'assets/buildings/building5.svg', svgElement: null, sizePng: 1, sizeSvg: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 4 },
        { type: 'building', png: loadImage('assets/buildings/building6.png'), svg: 'assets/buildings/building6.svg', svgElement: null, sizePng: 1,sizeSvg: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 4 },
        { type: 'building', png: loadImage('assets/buildings/building7.png'), svg: 'assets/buildings/building7.svg', svgElement: null, sizePng: 1, sizeSvg: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 4 },
        { type: 'building', png: loadImage('assets/buildings/building8.png'), svg: 'assets/buildings/building8.svg', svgElement: null, sizePng: 1.3, sizeSvg: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 5 },
        { type: 'building', png: loadImage('assets/buildings/building9.png'), svg: 'assets/buildings/building9.svg', svgElement: null, sizePng: 1.3, sizeSvg: 2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 5 },
        { type: 'building', png: loadImage('assets/buildings/building10.png'), svg: 'assets/buildings/building10.svg', svgElement: null, sizePng: 1.3, sizeSvg: 1.2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 5 },
        { type: 'building', png: loadImage('assets/buildings/building11.png'), svg: 'assets/buildings/building11.svg', svgElement: null, sizePng: 1.3, sizeSvg: 1.8, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 5 },
        { type: 'building', png: loadImage('assets/buildings/building12.png'), svg: 'assets/buildings/building12.svg', svgElement: null, sizePng: 1.3, sizeSvg: 1.2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 5 },
        { type: 'building', png: loadImage('assets/buildings/building13.png'), svg: 'assets/buildings/building13.svg', svgElement: null, sizePng: 1.3, sizeSvg: 1.2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 5 },
        { type: 'building', png: loadImage('assets/buildings/building14.png'), svg: 'assets/buildings/building14.svg', svgElement: null, sizePng: 1.3, sizeSvg: 1.2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 5 },
        { type: 'building', png: loadImage('assets/buildings/building15.png'), svg: 'assets/buildings/building15.svg', svgElement: null, sizePng: 1.3, sizeSvg: 1.2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 5 },
        { type: 'building', png: loadImage('assets/buildings/building16.png'), svg: 'assets/buildings/building16.svg', svgElement: null, sizePng: 1.3, sizeSvg: 1.2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 5 },

        // Large buildings (3x3 grid cells)
        { type: 'largeBuilding', png: loadImage('assets/buildings/large-building1.png'), svg: 'assets/buildings/large-building1.svg', svgElement: null, sizePng: 2, sizeSvg: 3, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 7 },
        { type: 'largeBuilding', png: loadImage('assets/buildings/large-building2.png'), svg: 'assets/buildings/large-building2.svg', svgElement: null, sizePng: 2, sizeSvg: 4, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 10 },
        { type: 'largeBuilding', png: loadImage('assets/buildings/large-building3.png'), svg: 'assets/buildings/large-building3.svg', svgElement: null, sizePng: 1.2, sizeSvg: 2.5, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 7 },
        { type: 'largeBuilding', png: loadImage('assets/buildings/large-building4.png'), svg: 'assets/buildings/large-building4.svg', svgElement: null, sizePng: 1.2, sizeSvg: 2.2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 5 },
        { type: 'largeBuilding', png: loadImage('assets/buildings/large-building5.png'), svg: 'assets/buildings/large-building5.svg', svgElement: null, sizePng: 1.5, sizeSvg: 2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 10 },
        { type: 'largeBuilding', png: loadImage('assets/buildings/large-building6.png'), svg: 'assets/buildings/large-building6.svg', svgElement: null, sizePng: 2, sizeSvg: 2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 10 },
        { type: 'largeBuilding', png: loadImage('assets/buildings/large-building7.png'), svg: 'assets/buildings/large-building7.svg', svgElement: null, sizePng: 1.5, sizeSvg: 2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 5 },
        { type: 'largeBuilding', png: loadImage('assets/buildings/large-building8.png'), svg: 'assets/buildings/large-building8.svg', svgElement: null, sizePng: 2, sizeSvg: 2.3, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 5 },
        { type: 'largeBuilding', png: loadImage('assets/buildings/large-building9.png'), svg: 'assets/buildings/large-building9.svg', svgElement: null, sizePng: 1, sizeSvg: 2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 5 },
        { type: 'largeBuilding', png: loadImage('assets/buildings/large-building11.png'), svg: 'assets/buildings/large-building11.svg', svgElement: null, sizePng: 1.2, sizeSvg: 2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 5 },
        { type: 'largeBuilding', png: loadImage('assets/buildings/large-building12.png'), svg: 'assets/buildings/large-building12.svg', svgElement: null, sizePng: 2.3, sizeSvg: 2.5, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 5 },
        // Add more assets here...

        // Nature (1x1 grid cells)
        { type: 'tree', png: loadImage('assets/nature/tree1.png'), svg: 'assets/nature/tree1.svg', svgElement: null, sizePng: 1, sizeSvg: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 3 },
        { type: 'tree', png: loadImage('assets/nature/tree2.png'), svg: 'assets/nature/tree2.svg', svgElement: null, sizePng: 1, sizeSvg: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 3 },
        { type: 'tree', png: loadImage('assets/nature/tree3.png'), svg: 'assets/nature/tree3.svg', svgElement: null, sizePng: 1, sizeSvg: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 3 },
        { type: 'tree', png: loadImage('assets/nature/tree4.png'), svg: 'assets/nature/tree4.svg', svgElement: null, sizePng: 1, sizeSvg: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 3 },
        { type: 'tree', png: loadImage('assets/nature/tree5.png'), svg: 'assets/nature/tree5.svg', svgElement: null, sizePng: 1, sizeSvg: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 3 },
        { type: 'tree', png: loadImage('assets/nature/tree6.png'), svg: 'assets/nature/tree6.svg', svgElement: null, sizePng: 1, sizeSvg: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 3 },
        { type: 'tree', png: loadImage('assets/nature/tree7.png'), svg: 'assets/nature/tree7.svg', svgElement: null, sizePng: 1, sizeSvg: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 3 },
        { type: 'tree', png: loadImage('assets/nature/tree8.png'), svg: 'assets/nature/tree8.svg', svgElement: null, sizePng: 1, sizeSvg: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 3 },
        { type: 'tree', png: loadImage('assets/nature/grass1.png'), svg: 'assets/nature/grass1.svg', svgElement: null, sizePng: 1, sizeSvg: 1, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 3 },


        // Large nature (2x2 grid cells)
        { type: 'largeGrass', png: loadImage('assets/nature/drygrass-large1.png'), svg: 'assets/nature/drygrass-large1.svg', svgElement: null, sizePng: 1.2, sizeSvg: 2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 5 },
        { type: 'largeGrass', png: loadImage('assets/nature/drygrass-large2.png'), svg: 'assets/nature/drygrass-large2.svg', svgElement: null, sizePng: 1.2, sizeSvg: 2, edges: { top: 'ruins', right: 'ruins', bottom: 'ruins', left: 'ruins' }, rarity: 1 },

        // Cars (1x1 grid cell)
        { type: 'car', png: loadImage('assets/vehicles/car1.png'), svg: 'assets/vehicles/car1.svg', svgElement: null, sizePng: .5, sizeSvg: .5, edges: { top: 'road', right: 'road', bottom: 'road', left: 'road' }, rarity: 4 },
        { type: 'car', png: loadImage('assets/vehicles/car2.png'), svg: 'assets/vehicles/car2.svg', svgElement: null, sizePng: .5, sizeSvg: .5, edges: { top: 'road', right: 'road', bottom: 'road', left: 'road' }, rarity: 5 },
        { type: 'car', png: loadImage('assets/vehicles/car3.png'), svg: 'assets/vehicles/car3.svg', svgElement: null, sizePng: .5, sizeSvg: .5, edges: { top: 'road', right: 'road', bottom: 'road', left: 'road' }, rarity: 5 },
        { type: 'car', png: loadImage('assets/vehicles/truck1.png'), svg: 'assets/vehicles/truck1.svg', svgElement: null, sizePng: .5, sizeSvg: 1, edges: { top: 'road', right: 'road', bottom: 'road', left: 'road' }, rarity: 5 },

        // Light sources
        { type: 'streetLamp', png: loadImage('assets/lights/light-building1.png'), svg: 'assets/lights/light-building1.svg', svgElement: null, sizePng: .8, sizeSvg: 2, edges: { top: 'road', right: 'road', bottom: 'road', left: 'road' }, rarity: 5 },
        { type: 'streetLamp', png: loadImage('assets/lights/light-building2.png'), svg: 'assets/lights/light-building2.svg', svgElement: null, sizePng: .8, sizeSvg: 2, edges: { top: 'road', right: 'road', bottom: 'road', left: 'road' }, rarity: 5 },

        // Dead Zone Assets
        { type: 'crater', png: loadImage('assets/deadzone/largecrater.png'), svg: 'assets/deadzone/largecrater.svg', svgElement: null, sizePng: 8, sizeSvg: 12.5, edges: { top: 'deadZone', right: 'deadZone', bottom: 'deadZone', left: 'deadZone' }, rarity: 8 },

        // Downtown Zone Assets
        { type: 'condoComplex', png: loadImage('assets/downtown/largebuildingscombination.png'), svg: 'assets/downtown/largebuildingscombination.svg', svgElement: null, sizePng: 5, sizeSvg: 9, edges: { top: 'downtownZone', right: 'downtownZone', bottom: 'downtownZone', left: 'downtownZone' }, rarity: 8 },
        { type: 'skyScraper', png: loadImage('assets/downtown/dtownbuilding1.png'), svg: 'assets/downtown/dtownbuilding1.svg', svgElement: null, sizePng: .8, sizeSvg: 1.2, edges: { top: 'downtownZone', right: 'downtownZone', bottom: 'downtownZone', left: 'downtownZone' }, rarity: 5 },
        { type: 'skyScraper', png: loadImage('assets/downtown/dtownbuilding2.png'), svg: 'assets/downtown/dtownbuilding2.svg', svgElement: null, sizePng: .8, sizeSvg: 1.2, edges: { top: 'downtownZone', right: 'downtownZone', bottom: 'downtownZone', left: 'downtownZone' }, rarity: 6 },
        { type: 'skyScraper', png: loadImage('assets/downtown/dtownbuilding3.png'), svg: 'assets/downtown/dtownbuilding3.svg', svgElement: null, sizePng: .8, sizeSvg: 1.2, edges: { top: 'downtownZone', right: 'downtownZone', bottom: 'downtownZone', left: 'downtownZone' }, rarity: 5 },
        { type: 'skyScraper', png: loadImage('assets/downtown/dtownbuilding5.png'), svg: 'assets/downtown/dtownbuilding5.svg', svgElement: null, sizePng: 1.2, sizeSvg: 1.8, edges: { top: 'downtownZone', right: 'downtownZone', bottom: 'downtownZone', left: 'downtownZone' }, rarity: 10 },
        { type: 'skyScraper', png: loadImage('assets/downtown/dtownbuilding8.png'), svg: 'assets/downtown/dtownbuilding8.svg', svgElement: null, sizePng: 1.2, sizeSvg: 1.8, edges: { top: 'downtownZone', right: 'downtownZone', bottom: 'downtownZone', left: 'downtownZone' }, rarity: 10 },
    ];
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvasContainer');
    initializeAssets();
    initializeGrid(); // Initialize the grid
    document.getElementById('generateButton').addEventListener('click', () => {
        showLoadingScreen();
        setTimeout(() => {
            generateWasteland();
            hideLoadingScreen();
        }, 200); // Fake loading duration in milliseconds
    });
    generateWasteland(); // Optional: generate initial wasteland on setup
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    generateWasteland(); // Re-generate the wasteland to fit the new size
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
    'CLEANING THE NUCLEAR WASTE',
    'ESCAPING WASTELAND BANDITS',
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
        initializeGrid(); // Ensure the grid is re-initialized
        placedLargeBuildings.clear(); // Clear the set of placed large buildings

        const totalCells = gridRows * gridCols;
        const maxAssetsToGenerate = isMobile ? mobileMaxAssets : maxAssets; // Use mobile max assets if device is mobile
        const cellsToFill = Math.min(Math.floor(totalCells * densityFactor), maxAssetsToGenerate); // Ensure we do not exceed the maxAssets limit
        let placedAssets = 0;

        craterPosition = null;
        condoComplexPosition = null;

        while (placedAssets < cellsToFill) {
            let row = Math.floor(Math.random() * gridRows);
            let col = Math.floor(Math.random() * gridCols);

            let isoX = (col - row) * (tileWidth / 2);
            let isoY = (col + row) * (tileHeight / 2);

            // Check if the asset is within the canvas
            if (isoX + tileWidth > 0 && isoY + tileHeight > 0 && isoX < width && isoY < height) {
                if (!grid[row][col]) {
                    let availableAssets = assets.filter(asset => canPlaceAsset(asset, row, col));

                    // Remove condoComplex and crater if they have already been placed
                    if (condoComplexPosition) {
                        availableAssets = availableAssets.filter(asset => asset.type !== 'condoComplex');
                    }
                    if (craterPosition) {
                        availableAssets = availableAssets.filter(asset => asset.type !== 'crater');
                    }

                    // Filter out already placed large buildings
                    availableAssets = availableAssets.filter(asset => !(asset.type === 'largeBuilding' && placedLargeBuildings.has(asset.svg)));

                    if (availableAssets.length > 0) {
                        let asset = getRandomAsset(availableAssets);
                        if (asset.type === 'condoComplex' && craterPosition) {
                            let distance = Math.sqrt(Math.pow(row - craterPosition.row, 2) + Math.pow(col - craterPosition.col, 2));
                            if (distance < 25) {
                                continue; // Skip placement if too close to the crater
                            }
                        }

                        if (asset.type === 'crater' && condoComplexPosition) {
                            let distance = Math.sqrt(Math.pow(row - condoComplexPosition.row, 2) + Math.pow(col - condoComplexPosition.col, 2));
                            if (distance < 25) {
                                continue; // Skip placement if too close to the condoComplex
                            }
                        }

                        // Ensure the svgElement is created for the asset
                        if (useSVG && !asset.svgElement) {
                            asset.svgElement = loadSVG(asset.svg);
                        }

                        placeAsset(asset, row, col);
                        placedAssets++;

                        if (asset.type === 'condoComplex') {
                            condoComplexPosition = { row: row, col: col };
                        } else if (asset.type === 'crater') {
                            craterPosition = { row: row, col: col };
                        }

                        // Add the placed large building to the set
                        if (asset.type === 'largeBuilding') {
                            placedLargeBuildings.add(asset.svg);
                        }
                    }
                }
            }
        }
        drawMainCanvas();
        hideLoadingScreen();
    }, randomDelay);
}


function getRandomAsset(availableAssets) {
    if (availableAssets.length === 0) {
        console.warn('No available assets to choose from');
        return null;
    }

    console.log('Available Assets:', availableAssets);

    // Calculate the total weight based on the rarity
    let totalWeight = availableAssets.reduce((total, asset) => total + (11 - asset.rarity), 0);
    console.log('Total Weight:', totalWeight);

    // Generate a random weight
    let randomWeight = Math.random() * totalWeight;
    console.log('Random Weight:', randomWeight);

    // Select an asset based on the random weight
    for (let asset of availableAssets) {
        randomWeight -= (11 - asset.rarity);
        console.log('Random Weight after subtraction:', randomWeight, 'Current Asset:', asset);
        if (randomWeight <= 0) {
            console.log('Selected Asset:', asset);
            return asset;
        }
    }

    // Fallback in case the loop doesn't return an asset
    console.warn('Fallback to last asset due to rounding issues:', availableAssets[availableAssets.length - 1]);
    return availableAssets[availableAssets.length - 1];
}


function canPlaceAsset(asset, row, col) {
    // Check if the asset fits in the grid and if the grid cell is empty
    for (let r = row; r < row + asset.size; r++) {
        for (let c = col; c < col + asset.size; c++) {
            if (r >= gridRows || c >= gridCols || grid[r][c]) {
                return false;
            }
        }
    }

    // Check neighboring cells for condoComplex and crater
    const neighbors = [
        { r: row - 1, c: col },
        { r: row + 1, c: col },
        { r: row, c: col - 1 },
        { r: row, c: col + 1 }
    ];

    for (let neighbor of neighbors) {
        if (neighbor.r >= 0 && neighbor.r < gridRows && neighbor.c >= 0 && neighbor.c < gridCols) {
            let neighborAsset = grid[neighbor.r][neighbor.c];
            if (neighborAsset) {
                if ((asset.type === 'condoComplex' && neighborAsset.type === 'crater') ||
                    (asset.type === 'crater' && neighborAsset.type === 'condoComplex')) {
                    return false;
                }

                // New check: Ensure no same assets are placed next to each other
                if (asset.type === neighborAsset.type) {
                    return false;
                }
            }
        }
    }

    // Additional existing checks
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

    // Check for overlaps with largebuildingscombination.svg and largecrater.svg
    if (asset.type !== 'largeBuilding' && asset.type !== 'crater') {
        for (let r = row; r < row + asset.size; r++) {
            for (let c = col; c < col + asset.size; c++) {
                if (r >= 0 && r < gridRows && c >= 0 && c < gridCols) {
                    let nearbyAsset = grid[r][c];
                    if (nearbyAsset) {
                        if (nearbyAsset.type === 'largeBuilding' && nearbyAsset.svg.includes('largebuildingscombination.svg')) {
                            return false;
                        }
                        if (nearbyAsset.type === 'crater' && nearbyAsset.svg.includes('largecrater.svg')) {
                            return false;
                        }
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
    clear();
    if (isMobile) {
        translate(mobileGridOffsetX, mobileGridOffsetY); // Apply custom grid position for mobile
        scale(0.8); // Scale down for mobile view
        translate(width / 4, height / 4); // Adjust translation to center the scaled-down content
    } else {
        translate(desktopGridOffsetX, desktopGridOffsetY); // Apply custom grid position for desktop
    }
    drawMainCanvas();
    drawGrid(); // Draw the grid lines on top of the assets
}

function drawMainCanvas() {
    clear();
    // Clear existing SVG elements if toggling
    if (!useSVG && svgElements.length > 0) {
        removeSVGs();
    }

    // Draw all assets
    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            let asset = getAssetAt(row, col);
            if (asset && !asset.part) {
                let drawWidth, drawHeight;
                let img = getAssetImage(asset);

                if (useSVG && svgElements.length < maxSvgCount) {
                    // Calculate draw size for SVGs using sizeSvg
                    drawWidth = tileWidth * asset.sizeSvg;
                    drawHeight = tileHeight * asset.sizeSvg;

                    // Create a new SVG element for each instance
                    let newSvg = createImg(asset.svg, '');
                    newSvg.size(drawWidth, drawHeight);
                    newSvg.position(
                        (col - row) * (tileWidth / 2) + (tileWidth - drawWidth) / 2,
                        (col + row) * (tileHeight / 2) + (tileHeight - drawHeight) / 2
                    );
                    svgElements.push(newSvg); // Store the created SVG element
                } else if (!useSVG) {
                    // Calculate draw size for PNGs using sizePng
                    let aspectRatio = img.width / img.height;
                    if (aspectRatio > 1) {
                        drawWidth = tileWidth * asset.sizePng;
                        drawHeight = (tileWidth * asset.sizePng) / aspectRatio;
                    } else {
                        drawWidth = (tileHeight * asset.sizePng) * aspectRatio;
                        drawHeight = tileHeight * asset.sizePng;
                    }

                    let isoX = (col - row) * (tileWidth / 2);
                    let isoY = (col + row) * (tileHeight / 2);

                    let x = isoX + (tileWidth - drawWidth) / 2;
                    let y = isoY + (tileHeight - drawHeight) / 2;

                    // Ensure assets are within the visible area
                    if (x + drawWidth > 0 && y + drawHeight > 0 && x < width && y < height) {
                        // Draw PNG
                        image(img, x, y, drawWidth, drawHeight);
                    }
                }
            }
        }
    }
}



function drawGrid() {
    stroke(200, 0); // Light gray color for grid lines
    for (let row = 0; row <= gridRows; row++) {
        for (let col = 0; col <= gridCols; col++) {
            let isoX = (col - row) * (tileWidth / 2);
            let isoY = (col + row) * (tileHeight / 2);

            // Vertical lines
            line(isoX, isoY, isoX + tileWidth, isoY + tileHeight);

            // Horizontal lines
            line(isoX, isoY, isoX - tileWidth, isoY + tileHeight);
        }
    }
}

function getAssetAt(row, col) {
    if (row < 0 || row >= gridRows || col < 0 || col >= gridCols || !grid[row] || !grid[row][col]) {
        return null;
    }
    return grid[row][col];
}

function addSVGs() {
    for (let asset of assets) {
        if (!asset.svgElement) {
            asset.svgElement = loadSVG(asset.svg);
        }
    }
}


function removeSVGs() {
    for (let svg of svgElements) {
        svg.remove();
    }
    svgElements = []; // Clear the stored SVG elements
}

