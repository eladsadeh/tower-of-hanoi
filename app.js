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
// width of smallest disk in px
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
// create array of disks using Disk class
function createDisks(num) {
	disks = [];
	// const minSize = 80 - (num - 1) * 10;
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
	if (disk.index === 0) {
		diskEl.classList.add('top-disk');
		diskEl = makeDragable(diskEl);
	}
	return diskEl;
}

// Add draggable attributes to element and retrun the element
function makeDragable(el) {
	el.setAttribute('draggable', 'true');
	el.setAttribute('ondragstart', 'onDragStart(event)');
	el.setAttribute('ondragend', 'onDragEnd(event)');
	return el;
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
		// update minimal number of moves
		minMovesEl.innerText = 2 ** currentLevel - 1;
		// reset time counter
		timeEl.innerText = 0;
		// reset moves
		moveEl.innerText = 0;
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
}

// ---- Game logic pseudocode ---
// Drag a disk to new location
// IF new location is valid (empty or top disk is bigger)
//   Drop the disk
//   Make the top disk in the "from" tower dragablle
//   Make the disk bellow the new disk in the "to" tower non-draggable.
// ELSE display message that the move is not allowed
//
// Check if the game ended (all disks are in the last tower)

// --- Drag and Drop handlers ---
function onDragEnd(ev) {
	ev.preventDefault();
    // console.log(ev.target);
    console.log('drag-end:', ev.target.parentElement);

	// console.log(ev.target);
	ev.dataTransfer.dropEffect = 'move';
}

function onDragStart(ev) {
    console.log('drag-start', ev.target.parentElement)
	ev.dataTransfer.setData('text/html', ev.target.outerHTML);
	ev.dataTransfer.setData('text', ev.target.id);
	ev.dataTransfer.effectAllowed = 'move';
}
function onDragOver(ev) {
    ev.preventDefault();
}

function onDrop(ev) {
    console.log('drop: ', ev.target);
	// console.log(ev.target.classList);
	if (ev.target.classList.contains('rod')) {
        ev.preventDefault();
		// console.log('Its a rod! ', ev.target);

		console.log(ev.target.parentElement);
		// Get the id of the target and add the moved element to the target's DOM
		const data = ev.dataTransfer.getData('text');
		// console.log(data);
		ev.target.parentElement.prepend(document.getElementById(data));
	}
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
	console.log(event.target.id, ' is dragged');
});

window.onload = function () {
	init(currentLevel);
};
