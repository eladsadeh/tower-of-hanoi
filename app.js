// console.log('Hello from app JS');
// --- CONSTANTS ---
// Default level
const DEFAULT_LEVEL = 4;
// Style variables
const DISKS_COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
const DISK_HEIGHT = 30; // Disk height in px
const PADDING = 50;
// towers ID
const TOWERS_NAMES = ['left-tower', 'mid-tower', 'right-tower'];
const START_TOWER = TOWERS_NAMES[0];
const LAST_TOWER = TOWERS_NAMES[2];

// --- Global variables ---
// State of the towers
const towersState = {
	'left-tower': [],
	'mid-tower': [],
	'right-tower': [],
};

// TO and FROM towers for disks move
let fromTowerEl = '';
let toTowerEl = '';
// Disks objects (class)
let disks = [];
// moves counter
let movesCounter = '';
// timer
let timer = '';
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

// Disks (?)

// --- Helper functions (do little things) ---
// reset towers state array
function resetTowersState() {
	TOWERS_NAMES.forEach((tower) => {
		towersState[tower] = [];
	});
}

// create array of disks using Disk class
function createDisks(num) {
	disks = [];
	// const minSize = 80 - (num - 1) * 10;
	for (i = 0; i < num; i++) {
		disks.push(
			new Disk(START_TOWER, i + 1, minSize + i * 10 + '%', DISKS_COLORS[i])
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
	diskEl.setAttribute('data-size', disk.index);
	diskEl.innerText = disk.index;
	if (disk.index === 1) {
		diskEl = makeDragable(diskEl);
	}
	return diskEl;
}

// Add draggable attributes to element and return the element
function makeDragable(el) {
	el.classList.add('top-disk');
	el.setAttribute('draggable', 'true');
	el.setAttribute('ondragstart', 'onDragStart(event)');
	el.setAttribute('ondragend', 'onDragEnd(event)');
	return el;
}

function runTimer() {}

// --- Main Functions ---
// Setup board according to level + RESET
// init(level)
function init(currentLevel) {
	// remove current disks from towers
	console.log('Running init function');
	towers.forEach((tower) => {
		// clear current contents
		Array.from(tower.getElementsByClassName('disk')).forEach((el) =>
			el.remove()
		);
		// tower.innerHTML = '';
	});
	// adjust main board height
	gameEl.style.height = currentLevel * DISK_HEIGHT + 2 * PADDING + 'px';
	// update minimal number of moves
	minMovesEl.innerText = 2 ** currentLevel - 1;
	// reset time counter
	timer = 0;
	timeEl.innerText = timer;
	// reset moves
	movesCounter = 0;
	moveEl.innerText = movesCounter;

	// adjust the rods height
	Array.from(document.getElementsByClassName('rod')).forEach((rod, i) => {
		rod.setAttribute('id', TOWERS_NAMES[i] + '-rod');
		rod.style.height = (currentLevel + 1) * DISK_HEIGHT + PADDING + 'px';
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
	// reset and initialize towers data
	resetTowersState();
	disks.forEach((disk) => {
		towersState[START_TOWER].push('disk-' + disk.index);
	});
}

// --- Drag and Drop handlers ---
// I used the folowing documentation:
// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
// and tutorial:
// https://www.javascripttutorial.net/web-apis/javascript-drag-and-drop/
// and a lot of trial and error to set up the drag and drop
//
function onDragStart(ev) {
	// console.log(
	// 	'drag-start:',
	// 	ev.target.id,
	// 	'inside',
	// 	ev.target.parentElement.id
	// );
	// Log the origin tower
	fromTowerEl = document.getElementById(ev.target.parentElement.id);
	// get the disk data (html, id)
	ev.dataTransfer.setData('text/html', ev.target.outerHTML);
	ev.dataTransfer.setData('text', ev.target.id);
	ev.dataTransfer.effectAllowed = 'move';
}

function onDragEnd(ev) {
	ev.preventDefault();
	// console.log(ev.target);
	const topDiskInFrom = fromTowerEl.querySelector('.disk');
	if (topDiskInFrom !== null) {
		makeDragable(topDiskInFrom);
	}
	// console.log(topDiskInFrom);

	// console.log('drag-end:', ev.target.id, ' in ', ev.target.parentElement.id);

	// console.log(ev.target);
	// const data = ev.dataTransfer.getData('text');
	ev.dataTransfer.dropEffect = 'move';
	// ev.target.parentElement.prepend(document.getElementById(data));
}

function onDragOver(ev) {
	ev.preventDefault();
	// console.log('Im over a ', ev.target.id);
	if (ev.target.id.includes('rod')) {
		// console.log('Im over a rod in', ev.target.parentElement.id);
		// document.getElementById(ev.target.id).style.border = '4px solid yellow';
	}
}

function onDrop(ev) {
	// console.log('drop', ev.target.id, 'in: ', ev.target.parentElement.id);
	// console.log(ev.target.classList);
	// IF the target is a rod AND its not the same rod
	if (
		ev.target.classList.contains('rod') &&
		fromTowerEl.id !== ev.target.parentElement.id
	) {
		ev.preventDefault();
		const fromId = fromTowerEl.id;
		const toId = ev.target.parentElement.id;
		// const disk = towersState[fromId][0];
		console.log('drop:', towersState[fromId][0], fromId, '->', toId);
		// Check if its OK to drop (either no disks or the top disk is bigger)
		// console.log('number of disks:', towersState[toId].length);
		if (
			!towersState[toId].length ||
			towersState[fromId][0] < towersState[toId][0]
		) {
			console.log('valid move');
			// update towers state array
			towersState[toId].unshift(towersState[fromId].shift());
			// *** check for end of game
			if (towersState[LAST_TOWER].length === currentLevel) {
				console.log('GAME END');
			} else {
				console.log('not yet');
			}
			// Update moves counter
			moveEl.innerText = ++movesCounter;
			const data = ev.dataTransfer.getData('text');
			ev.target.parentElement.prepend(document.getElementById(data));
		} else {
			console.log('invalid move!');
			// *** show message
		}
	}
}

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
	console.log(event.target.id);
});

// window.onload = function () {
init(currentLevel);
// };
