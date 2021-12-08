// console.log('Hello from app JS');
// --- CONSTANTS ---
// Default level
const DEFAULT_LEVEL = 3;
// Discs colors (or style)
const DISKS_COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
// towers ID
const TOWERS = ['left-tower', 'mid-tower', 'right-tower'];

// --- Global variables ---
// State of each tower
let disks = [];
// Location of each disk
// Top disk on each tower
// Current dificulty level
let currentLevel = DEFAULT_LEVEL;
let minSize = 80 - (currentLevel - 1) * 10;

// --- CLASSes ---
// Disk (location, color, size)
class Disk {
	constructor(location, index, size, color) {
		this.location = location;
		this.index = index;
		this.size = size;
		this.color = color;
	}
}

// --- HTML elements ---
// --- Elements needed for interacation
// About button
const aboutBtn = document.getElementById('about-btn');
// Reset button
const resetBtn = document.getElementById('reset-btn');
// Pause button
const pauseBtn = document.getElementById('pause-btn');
// Level button
const levelBtn = document.getElementById('level-btn');
// Time counter
const timeEl = document.getElementById('time-counter');
// Moves counter
const moveEl = document.getElementById('move-counter');
// Min number of steps
const minMovesEl = document.getElementById('min-moves');
// Message
const messgeEl = document.getElementById('message');
// --- Elements needed for event listeners
// Upper panel
const upperEl = document.getElementById('upper-panel');
// Game board (three rods and disks)
// Lower panel
const lowerEl = document.getElementById('lower-panel');
// Game board
const gameEl = document.getElementById('main-board');
// Each individual towers
const leftTowerEl = document.getElementById('left-tower');
const midTowerEl = document.getElementById('mid-tower');
const rightTowerEl = document.getElementById('right-tower');
const towers = [leftTowerEl, midTowerEl, rightTowerEl];

// Disks (?)

// --- Helper functions (do little things) ---
// create array of disks
function createDisks(num) {
	const minSize = 80 - (num - 1) * 10;
	for (i = 0; i < num; i++) {
		disks.push(
			new Disk('left-tower', i, minSize + i * 10 + '%', DISKS_COLORS[i])
		);
	}
	console.log(disks);
}

// create and return disk html element.
function createDiskElement(index) {
	let disk = document.createElement('span');
	console.log(disk);
}

// --- Main Functions ---
// Setup board according to level + RESET
// init(level)
function init(currentLevel) {
	// remove current disks from towers
	towers.forEach((tower) => {
		console.log(tower);
		tower.innerHTML = '';
	});

	// create disks
	createDisks(currentLevel);
	// add new disks to left tower
	disks.forEach((disk) => {
		// create new element
		createDiskElement(disk);
	});

	// Update minimal number of moves
}

// Check validity of a move
// Move disk to new location + update moves counter
// Check for end of game
// Show 'About' modal
// Show level selection modal

// --- Event Listeners ---
// Click on upper panel
// Handle clicks on 'about' and 'level'
upperEl.addEventListener('click', (event) => {
	console.log('Upper panel was clicked', event.target.id);
});
// Click on lower panel
// handle clicks on 'pause' and 'reset'
lowerEl.addEventListener('click', (event) => {
	console.log('Lower panel was clicked', event.target.id);
	if (event.target.id === 'reset-btn') {
		init(currentLevel);
	}
});
// Click on main game board
// handle clicks on disks and towers
gameEl.addEventListener('click', (event) => {
	console.log('Game board was clicked', event.target.id);
});
