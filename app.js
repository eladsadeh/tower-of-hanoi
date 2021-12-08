// console.log('Hello from app JS');
// --- CONSTANTS ---
// Default level
const DEFAULT_LEVEL = 4;
// Style variables
const DISKS_COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
const DISK_HEIGHT = 30; // Disk height in px
const PADDING = 50;
// towers ID
const TOWERS = ['left-tower', 'mid-tower', 'right-tower'];

// --- Global variables ---
// State of each tower
// Disks objects (class)
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
// const gameEl = document.getElementById('main-board');
const gameEl = document.getElementById('towers');
// Each individual towers
const leftTowerEl = document.getElementById('left-tower');
const midTowerEl = document.getElementById('mid-tower');
const rightTowerEl = document.getElementById('right-tower');
const towers = [leftTowerEl, midTowerEl, rightTowerEl];
// const towers = {
//     'left-tower': leftTowerEl,
//     'mid-tower': midTowerEl,
//     'right-tower': rightTowerEl
// };

// Disks (?)

// --- Helper functions (do little things) ---
// create array of disks
function createDisks(num) {
	disks = [];
	const minSize = 80 - (num - 1) * 10;
	for (i = 0; i < num; i++) {
		disks.push(
			new Disk('left-tower', i, minSize + i * 10 + '%', DISKS_COLORS[i])
		);
	}
	// console.log(disks);
}

// create and return disk html element.
function createDiskElement(disk) {
	let diskEl = document.createElement('span');
	// style color, size
	diskEl.style.backgroundColor = disk.color;
	diskEl.style.width = disk.size;
	diskEl.setAttribute('id', 'disk-' + disk.index);
	diskEl.setAttribute('class', 'disk');
	diskEl.innerText = disk.index + 1;
	return diskEl;
}

// --- Main Functions ---
// Setup board according to level + RESET
// init(level)
function init(currentLevel) {
	// remove current disks from towers
	console.log('Running init function');
	towers.forEach((tower) => {
		// clear current contents
		tower.innerHTML = '';
		// adjust main board height
		gameEl.style.height = currentLevel * DISK_HEIGHT + 2 * PADDING + 'px';
		// create the rods
		let rod = document.createElement('span');
		rod.classList.add('rod');
		rod.style.height = (currentLevel + 1) * DISK_HEIGHT + 'px';
		tower.appendChild(rod);
	});

	// create disks
	createDisks(currentLevel);
	// add new disks to left tower
	disks.forEach((disk) => {
		// create new element
		el = createDiskElement(disk);
		// console.log(el);
		// Add the disk to the left tower
		leftTowerEl.appendChild(el);
		// console.log(leftTowerEl);
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
	event.preventDefault();
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
