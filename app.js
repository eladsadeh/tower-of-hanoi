// console.log('Hello from app JS');
// --- CONSTANTS ---
// Default level
const DEFAULT_LEVEL = 3;
// Style variables
const DISKS_COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
const DISK_HEIGHT = 30; // Disk height in px
const PADDING = 50;
// towers ID
const TOWERS_NAMES = ['left-tower', 'mid-tower', 'right-tower'];
const START_TOWER = TOWERS_NAMES[0];
const AUX_TOWER = TOWERS_NAMES[1];
const LAST_TOWER = TOWERS_NAMES[2];

// --- Global variables ---
// State of the towers
const towersState = {};

// moves history array
const movesHistory = [];

// TO and FROM towers for disks move
let fromTowerEl = '';
let toTowerEl = '';
// Disks objects (class)
let disks = [];
// moves counter
let movesCounter = '';
// timer
let timeCounter = '';
let timerInterval = '';
// Current dificulty level
let currentLevel = DEFAULT_LEVEL;

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
// --- Elements needed for intercation
// Time counter
const timeEl = document.querySelector('#time-counter');
// Moves counter
const moveEl = document.getElementById('move-counter');
// Message
const messageEl = document.getElementById('message');
// --- Elements needed for event listeners
// Game board
const mainEl = document.getElementById('game');
// Each individual towers
const leftTowerEl = document.getElementById('left-tower');
const midTowerEl = document.getElementById('mid-tower');
const rightTowerEl = document.getElementById('right-tower');
const towers = [leftTowerEl, midTowerEl, rightTowerEl];

// --- Helper functions (do little things) ---

function readText() {
	const reader = new FileReader();
	// reader.onload = function (evt) {
	// 		console.log(evt.target.result);
	// 	};
	const content = reader.readAsText('/test.html');
	// console.log(content);
	// console.log(text.readAsText('./test.html'));
}
// show message on game board
function displayMessage(message, time = 4000) {
	messageEl.innerText = message;
	setTimeout(() => (messageEl.innerText = ''), time);
}

// create array of disks using Disk class
function createDisks(num) {
	disks = [];
	const minSize = 80 - (num - 1) * 10;
	for (i = 0; i < num; i++) {
		disks.push(
			new Disk(START_TOWER, i + 1, minSize + i * 10 + '%', DISKS_COLORS[i])
		);
	}
	// console.log(disks);
}

// create and return disk html element.
// Run during initialization and
function createDiskElement(disk) {
	let diskEl = document.createElement('span');
	// style color, size
	diskEl.style.backgroundColor = disk.color;
	diskEl.style.width = disk.size;
	diskEl.setAttribute('id', 'disk-' + disk.index);
	diskEl.setAttribute('class', 'disk');
	diskEl.setAttribute('data-size', disk.index);
	diskEl.setAttribute('ondragstart', 'onDragStart(event)');
	diskEl.setAttribute('ondragend', 'onDragEnd(event)');
	diskEl.setAttribute('draggable', 'false');
	diskEl.innerText = disk.index;
	if (disk.index === 1) {
		diskEl = makeDraggable(diskEl);
	}
	return diskEl;
}

// Add draggable attributes to element and return the element
function makeDraggable(el) {
	el.classList.add('top-disk');
	el.setAttribute('draggable', 'true');
	return el;
}

function makeUnDraggable(el) {
	el.classList.remove('top-disk');
	el.setAttribute('draggable', 'false');
	return el;
}

function runTimer(run) {
	// ** Timer start when the player move the first disk

	// 'pause' is initialized to true and is
	// controled by the drag start function and
	// the pause button
	if (run) {
		// console.log('start interval');
		timerInterval = setInterval(() => {
			timeEl.innerHTML = ++timeCounter;
		}, 1000);
	} else {
		// console.log('clear interval');
		clearInterval(timerInterval);
		timerInterval = 0;
	}
}

function endGame() {
	// console.log('GAME END');
	// stop the timer
	runTimer(false);
	let t = '';
	let m = '';
	if (movesCounter === 2 ** currentLevel - 1) {
		t = 'Perfect!';
		m = `You completed the game in ${movesCounter} moves. \n This is the minimal number of moves possible!.\n Try the next level`;
	} else {
		t = 'Well Done!';
		m = `You completed the game in ${movesCounter} moves.\n It is possible to do it in ${
			2 ** currentLevel - 1
		} moves.\n Would you like to try again?`;
	}
	// Open the game end modal with message content
	displayGameEndModal(t, m);
}

// --- Main Functions ---
// Setup board according to level + RESET
// init(level)
function init(currentLevel) {
	// remove current disks from towers
	// console.log('Running init function');
	towers.forEach((tower) => {
		// clear current contents
		Array.from(tower.getElementsByClassName('disk')).forEach((el) =>
			el.remove()
		);
		// tower.innerHTML = '';
	});
	// adjust main board height
	document.getElementById('towers').style.height =
		currentLevel * DISK_HEIGHT + 3 * PADDING + 'px';
	// update minimal number of moves
	// document.getElementById('min-moves').innerHTML = 2 ** currentLevel - 1;
    
	displayMessage(
		`Minimum steps: ${2 ** currentLevel - 1}`,
		5000
	);
	// reset time counter
	timeCounter = 0;
	timeEl.innerText = timeCounter;
	// reset moves
	movesCounter = 0;
	moveEl.innerText = movesCounter;

	// adjust the rods height
	Array.from(document.getElementsByClassName('rod')).forEach((rod, i) => {
		rod.setAttribute('id', TOWERS_NAMES[i] + '-rod');
		rod.style.height = currentLevel * DISK_HEIGHT + PADDING + 'px';
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
	TOWERS_NAMES.forEach((tower) => {
		towersState[tower] = [];
	});
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
	// console.log('"', timerInterval, "'", Boolean(timerInterval));
	// Start the timer if its not running
	if (!Boolean(timerInterval)) runTimer(true);
	// Log the origin tower
	fromTowerEl = document.getElementById(ev.target.parentElement.id);
	// console.log(fromTowerEl)
	// get the disk data (html, id)
	ev.dataTransfer.setData('text/html', ev.target.outerHTML);
	ev.dataTransfer.setData('text', ev.target.id);
	// console.log('dragged disk:', ev.target.id);
	ev.dataTransfer.effectAllowed = 'move';
}

function onDragEnd(ev) {
	ev.preventDefault();
	// console.log(ev.target);
	const topDiskInFrom = fromTowerEl.querySelector('.disk');
	if (topDiskInFrom !== null) {
		makeDraggable(topDiskInFrom);
	}

	// console.log('drag-end:', ev.target.id, ' in ', ev.target.parentElement.id);

	ev.dataTransfer.dropEffect = 'move';
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
		// console.log('drop:', towersState[fromId][0], fromId, '->', toId);
		// Check if its OK to drop (either no disks or the top disk is bigger)
		// console.log('number of disks:', towersState[toId].length);
		if (
			!towersState[toId].length ||
			towersState[fromId][0] < towersState[toId][0]
		) {
			// console.log('valid move');
			// update towers state array - move the disk from 'fromId' to 'toId'
			towersState[toId].unshift(towersState[fromId].shift());
			// Update moves counter
			moveEl.innerText = ++movesCounter;
			// Make the bottom disk undraggable (if there is one)
			if (towersState[toId].length > 1) {
				// console.log('make', towersState[toId][1], 'undraggable');
				makeUnDraggable(document.getElementById(towersState[toId][1]));
			}
			// *** check for end of game (all the disks are in the last tower)
			if (towersState[LAST_TOWER].length === currentLevel) {
				// console.log('GAME END');
				// displayGameEndModal('Success!', 'Good Job');
				// // stop the timer
				// runTimer(false);
				endGame();
			} else {
				// console.log('not yet');
			}
			// move the html element
			const data = ev.dataTransfer.getData('text');
			ev.target.parentElement.prepend(document.getElementById(data));
		} else {
			// console.log('invalid move!');
			// *** show message
			displayMessage('Disks Not allowed on top of a smaller disks');
		}
		// console.log(towersState);
	}
}

// Show level selection modal
//create modal and insert it as first child of body
function displayLevelSelect() {
	const selectLevel = document.createElement('div');
	selectLevel.setAttribute('id', 'select-level-body');
	selectLevel.setAttribute('class', 'modal-container');
	const selBtnDiv = document.createElement('div');
	selBtnDiv.setAttribute('id', 'select-level-modal');
	selBtnDiv.setAttribute('class', 'modal');
	const p = document.createElement('p');
	p.setAttribute('id', 'sel-lvl-title');
	p.innerText = 'Select number of disks';
	selBtnDiv.appendChild(p);
	const selBtnContainer = document.createElement('div');
	selBtnContainer.setAttribute('id', 'sel-btn-container');
	selBtnDiv.appendChild(selBtnContainer);
	for (i = 2; i < DISKS_COLORS.length; i++) {
		const btn = document.createElement('button');
		btn.setAttribute('id', 'lvl-btn-' + i + 1);
		btn.setAttribute('class', 'lvl-btn');
		btn.setAttribute('data-level', i + 1);
		btn.style.backgroundColor = DISKS_COLORS[i];
		btn.innerText = i + 1;
		selBtnContainer.appendChild(btn);
	}
	selectLevel.appendChild(selBtnDiv);
	document.body.prepend(selectLevel);
	// console.log(selectLevel);
}

// --- Game end modal ----
// Show level selection modal
//create modal and insert it as first child of body
function displayGameEndModal(title, message) {
	// create modal container
	const gameEndEl = document.createElement('div');
	gameEndEl.setAttribute('id', 'game-end-container');
	gameEndEl.setAttribute('class', 'modal-container');
	// create modal box
	const gameEndModalEl = document.createElement('div');
	gameEndModalEl.setAttribute('id', 'game-end-modal');
	gameEndModalEl.setAttribute('class', 'modal');
	// add the title to the modal
	const t = document.createElement('p');
	t.setAttribute('id', 'game-end-title');
	t.innerText = title;
	gameEndModalEl.appendChild(t);
	// add the message to the modal
	const m = document.createElement('p');
	m.setAttribute('id', 'game-end-message');
	m.innerText = message;
	gameEndModalEl.appendChild(m);
	// create container for the buttons
	const gameEndBtnsEl = document.createElement('div');
	gameEndBtnsEl.setAttribute('id', 'game-end-buttons');
	gameEndModalEl.appendChild(gameEndBtnsEl);
	// Re-start button
	let btn = document.createElement('button');
	btn.setAttribute('id', 'game-end-restart');
	btn.setAttribute('class', 'game-end-btn');
	btn.setAttribute('class', 'material-icons');
	btn.setAttribute('title', 'Restart');
	btn.innerText = 'reply';
	gameEndBtnsEl.appendChild(btn);
	// Cancel button
	btn = document.createElement('button');
	btn.setAttribute('id', 'game-end-cancel');
	btn.setAttribute('class', 'game-end-btn');
	btn.setAttribute('class', 'material-icons');
	btn.setAttribute('title', 'Close window');
	btn.innerText = 'close';

	gameEndBtnsEl.appendChild(btn);
	// next level button
	btn = document.createElement('button');
	btn.setAttribute('id', 'game-end-next');
	btn.setAttribute('class', 'game-end-btn');
	btn.setAttribute('class', 'material-icons');
	btn.setAttribute('title', 'Go To Next Level');
	btn.innerText = 'forward';

	gameEndBtnsEl.appendChild(btn);

	gameEndEl.appendChild(gameEndModalEl);
	document.body.prepend(gameEndEl);
	// console.log(gameEndEl);
}

// --- Event Listeners ---

// Click on main game board
// mainEl.addEventListener('click', (event) => {
document.body.addEventListener('click', (event) => {
	event.preventDefault();
	console.log(event.target.id, 'was clicked');
	console.log('The parent is:', event.target.parentElement.id);
	switch (event.target.id) {
		case 'reset-btn':
			init(currentLevel);
			break;
		case 'pause-btn':
			runTimer(false);
			break;
		case 'about-btn': // Show 'About' modal
			document.getElementById('about-container').classList.remove('hidden');
			break;
		case 'close-about-btn':
			console.log(document.getElementById('about-container').classList);
			document.getElementById('about-container').classList.add('hidden');
			console.log(document.getElementById('about-container').classList);
			break;
		case 'read-more-btn':
			if (document.getElementById('about-more').classList.contains('hidden')) {
				document.getElementById('about-more').classList.remove('hidden');
				document.getElementById('read-more-btn').innerText = 'Read Less';
			} else {
				document.getElementById('about-more').classList.add('hidden');
				document.getElementById('read-more-btn').innerText = 'Read More';
			}
			break;
		case 'level-btn':
			displayLevelSelect();
			break;
	}
	if (event.target.parentElement.id === 'game-end-buttons') {
		const id = event.target.id;
		// console.log(document.getElementById('game-end-container'));
		// remove the game end modal
		document.getElementById('game-end-container').remove();
		id.includes('next') && currentLevel++;
		// console.log(currentLevel);
		!id.includes('cancel') && init(currentLevel);
	}
	// If level selection button was clicked
	if (event.target.parentElement.id === 'sel-btn-container') {
		// console.log(event.target.dataset.level);
		// update current level variable
		currentLevel = parseInt(event.target.dataset.level);
		document.getElementById('select-level-body').remove();
		init(currentLevel);
	}
});

// window.onload = function () {
init(currentLevel);
// };
