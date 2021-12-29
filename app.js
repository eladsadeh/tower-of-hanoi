// --- CONSTANTS ---
// Default level
const DEFAULT_LEVEL = 3;
// Style variables
const DISKS_COLORS = [
	'orange',
	'forestgreen',
	'mediumblue',
	'indigo',
	'firebrick',
	'mediumseagreen',
	'purple',
	'navy',
	'darkcyan',
];
const DISK_HEIGHT = 30; // Disk height in px
const PADDING = 50; // Padding for the rods height
// towers ID and lables
const TOWERS = [
	{ id: 'left-tower', label: 'A' },
	{ id: 'mid-tower', label: 'B' },
	{ id: 'right-tower', label: 'C' },
];
// Start, End and Aux towers indexes
const START = 0;
const AUX = 1;
const END = 2;

// --- Global variables ---
const towersState = {}; // State of the towers
let movesArray = []; // Hold minimum moves sequence

let fromId = ''; // FROM tower ID for disks move
let disks = []; // Disks objects (class)
let movesCounter = ''; // moves counter
let timeCounter = ''; // timer
let timerInterval = '';
let currentLevel = DEFAULT_LEVEL; // Current dificulty level
let guidedMode = true;

// --- CLASSes ---
// Disk (location, color, size)
class Disk {
	constructor(index, size, color) {
		this.id = 'disk-' + index;
		this.index = index;
		this.size = size;
		this.color = color;
	}
	// move this disk to destination 'to' (to is the ID of the destination)
	moveTo(to) {
		// console.log('moving', this.id, 'to', to);
		// Save the element that is moving
		const el = document.getElementById(this.id);
		// remove the disk from its current location
		document.getElementById(this.id).remove();
		// add the disk to destination tower
		document.getElementById(to).prepend(el);
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

// --- Helper functions (do little things) ---
// show message on game board
function displayMessage(message, time = 4000) {
	if (Number.isInteger(time)) {
		setTimeout(() => (messageEl.innerText = ''), time);
	}
	messageEl.innerText = message;
}

// create array of disks using Disk class
function createDisks(num) {
	disks = [];
	// minSize and step are used to keep the first and last disks width the same for all levels
	const minSize = 40;
	const step = 40 / (num - 1);
	for (i = 0; i < num; i++) {
		disks.push(new Disk(i + 1, minSize + i * step + '%', DISKS_COLORS[i]));
	}
}

// create and return disk html element.
// Run during initialization and restart
function createDiskElement(disk) {
	let diskEl = document.createElement('span');
	// style color, size
	diskEl.style.backgroundColor = disk.color;
	diskEl.style.width = disk.size;
	diskEl.setAttribute('id', 'disk-' + disk.index);
	diskEl.setAttribute('class', 'disk');
	diskEl.setAttribute('ondragstart', 'onDragStart(event)');
	// diskEl.setAttribute('ondragend', 'onDragEnd(event)');
	diskEl.setAttribute('draggable', 'false');
	diskEl.innerText = disk.index;
	if (disk.index === 1) {
		diskEl = makeDraggable(diskEl, true);
	}
	return diskEl;
}

// Add draggable attributes to element and return the element
function makeDraggable(el, bol) {
	el.classList.add('top-disk');
	el.setAttribute('draggable', bol);
	return el;
}

// Convert the time counter to string in format 00:00
function secondsToString(time) {
	const minutes = Math.floor(time / 60);
	const seconds = minutes ? time % 60 : time;
	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
		2,
		'0'
	)}`;
}

function runTimer(run) {
	// ** Timer start when the player move the first disk

	// 'run' is initialized to true and is
	// controled by the drag start function and
	// the pause button
	if (run) {
		// If true, start the timer
		timerInterval = setInterval(() => {
			timeEl.innerHTML = secondsToString(++timeCounter);
		}, 1000);
	} else {
		// Pause - clear the setInterval
		clearInterval(timerInterval);
		timerInterval = 0;
	}
}

function endGame() {
	// stop the timer
	runTimer(false);
	// Display message
	let t = '';
	let m = '';
	if (movesCounter === 2 ** currentLevel - 1) {
		// Game done in minimum number of steps
		t = 'Perfect!';
		m = `Game completed in ${movesCounter} moves. \n This is the minimum number of moves possible!\n Try the next level`;
	} else {
		// Can be done better ...
		t = 'Well Done!';
		m = `Game completed in ${movesCounter} moves.\n It is possible to do it in ${
			2 ** currentLevel - 1
		} moves.\n Would you like to try again?`;
	}
	// Open the game end modal with message content
	displayGameEndModal(t, m);
}

function checkMoveValidity(from, to) {
	// Green = its OK to drop
	// Red = drop is not allowed
	// Orange = in guided mode, its not the correct place to drop (not allowed)
	if (towersState[to].length && towersState[from][0] > towersState[to][0]) {
		return 'red';
	} else if (
		// if its guided mode

		guidedMode &&
		// AND it's not the right disk OR not the right destination
		(movesArray[movesCounter].disk !== towersState[from][0] ||
			TOWERS[movesArray[movesCounter].to].id !== to)
	) {
		return 'orange';
	} else return 'green';
}

// --- Main Functions ---
// Setup board according to level + RESET
function init(currentLevel) {
	// remove current disks from towers
	Array.from(document.getElementsByClassName('disk')).forEach((el) =>
		el.remove()
	);
	// adjust main board height
	document.getElementById('towers').style.height =
		currentLevel * DISK_HEIGHT + 3 * PADDING + 'px';
	// Prepare an array of moves
	movesArray = [];
	generateMoves(currentLevel);
	console.log(movesArray);
	// reset time counter
	runTimer(false);
	timeCounter = 0;
	timeEl.innerText = secondsToString(timeCounter);

	// reset moves counter
	movesCounter = 0;
	moveEl.innerText = movesCounter;
	// display minimal number of moves
	guidedMode
		? displayMessage(
				`Move ${movesArray[0].disk.replace('-', ' ')} to ${
					TOWERS[movesArray[0].to].label
				}`,
				'keep'
		  )
		: displayMessage(`Minimum steps: ${2 ** currentLevel - 1}`);

	// adjust the rods height based on number of disks
	Array.from(document.getElementsByClassName('rod')).forEach((rod, i) => {
		rod.setAttribute('id', TOWERS[i].id + '-rod');
		rod.style.height = currentLevel * DISK_HEIGHT + PADDING + 'px';
	});

	// create disks and store in 'disks' array
	createDisks(currentLevel);
	// add new disks to left tower
	disks.forEach((disk) => {
		// create new element
		el = createDiskElement(disk);
		// Add the disk to the left tower
		document.getElementById(TOWERS[START].id).appendChild(el);
	});
	// reset and initialize towers data
	TOWERS.forEach((tower) => {
		towersState[tower.id] = [];
	});
	disks.forEach((disk) => {
		towersState[TOWERS[START].id].push(disk.id);
	});
}

// Recursive function creates array of moves that solve the game for n disks
// Algorithm taken from www.tutorialspoint.com/data_structures_algorithms/tower_of_hanoi.htm
function generateMoves(n, begin = START, finish = END, mid = AUX) {
	// if n=1, move disk from start to end
	// if (n === 1) movesArray.push({ disk: n, to: end });
	if (n === 1) movesArray.push({ disk: 'disk-' + n, to: finish });
	else {
		// move 'n-1' disk to aux
		generateMoves(n - 1, begin, mid, finish);
		// then move the last disk to end
		// movesArray.push({ disk: n, to: end });
		movesArray.push({ disk: 'disk-' + n, to: finish });
		// then move 'n-1' disks to end
		generateMoves(n - 1, mid, finish, begin);
	}
	return movesArray;
}

// ****** Start Work in Progress  (code not used in app) ****************
// move the disks according to algorithm
function moveDisks(currentLevel) {
	// generate the array of moves (movesArray)
	generateMoves(currentLevel);
	// Iterate through moves and execute them with time delay
	// movesArray.forEach((move) => {
	for (i = 0; i < movesArray.length; i++) {
		// console.log('moving', movesArray[i].disk, 'to', movesArray[i].to);
		// console.log('moving', move.disk, 'to', move.to);
		// Save the element that is moving
		// const el = document.getElementById(movesArray[0].disk);
		// // remove the disk from its current location
		// document.getElementById(movesArray[0].disk).remove();
		// // add the disk to destination tower
		// document.getElementById(movesArray[0].to).prepend(el);
		moveOneDisk(movesArray[i].disk, movesArray[i].to);
		// console.log(i, movesArray[i]);
		// disks[movesArray[0].disk - 1].moveTo(movesArray[0].to);
		// disks[move.disk - 1].moveTo(move.to);
		// wait some time before moving the next disk
		// This technic was taken from Stack Overflow post
		let start = new Date().getTime();
		let end = start;
		while (end < start + 3000) {
			end = new Date().getTime();
		}
	}
}

function moveOneDisk(disk, tower) {
	console.log('moving', disk, 'to', tower);
	// Save the element that is moving
	const el = document.getElementById(disk);
	// remove the disk from its current location
	document.getElementById(disk).remove();
	// add the disk to destination tower
	document.getElementById(tower).prepend(el);
}
// ****** End Work in Progress ****************

// --- Fetch and add quote for end of game ---- //
function fetchQuote(contentEl, authorEl) {
	const apiUrl = 'https://api.quotable.io/random?tags=inspirational';
	fetch(apiUrl)
		.then((response) => response.json())
		.then((response) => {
			authorEl.innerText = '~' + response.author;
			contentEl.innerText = response.content;
		})
		.catch((response) => {
			// console.log('cant get response');
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
	// Start the timer if its not running
	if (!Boolean(timerInterval)) runTimer(true);
	// Log the origin tower
	fromId = ev.target.parentElement.id;
	// console.log('drag start -', ev.target.id, 'from', fromTowerId);
	// get the disk data (html, id)
	ev.dataTransfer.setData('text/html', ev.target.outerHTML);
	ev.dataTransfer.setData('text', ev.target.id);
	ev.dataTransfer.effectAllowed = 'move';
}

function onDragEnter(ev) {
	const toId = ev.target.parentElement.id;
	// IF entering a rod AND it's not the same rod
	if (ev.target.id.includes('rod') && toId !== fromId) {
		// Check the validity of the target
		const validity = checkMoveValidity(fromId, toId);
		console.log(validity);
		// Turn on highligt based on validity
		ev.target.classList.add(`drop-highlight-${validity}`);
	}
}
function onDragLeave(ev) {
	// IF leaving a rod
	if (ev.target.id.includes('rod')) {
		const toId = ev.target.parentElement.id;
		// Check the validity of the target
		const validity = checkMoveValidity(fromId, toId);
		// Turn off highlight
		ev.target.classList.remove(`drop-highlight-${validity}`);
	}
}

function onDrop(ev) {
	// console.log('drop', ev.target.id, 'in: ', ev.target.parentElement.id);
	// IF the target is a rod AND its not the same rod
	if (ev.target.id.includes('rod') && fromId !== ev.target.parentElement.id) {
		ev.preventDefault();
		const toId = ev.target.parentElement.id;
		// Check the validity of the target
		const validity = checkMoveValidity(fromId, toId);
		// Check if its OK to drop (either no disks or the top disk is bigger)
		if (validity === 'green') {
			// Its a valid drop !!
			// update towers state array - move the disk from origin tower to destination tower
			towersState[toId].unshift(towersState[fromId].shift());
			// Remove the hightlight of the rod
			ev.target.classList.remove(`drop-highlight-${validity}`);
			// move the html element
			const data = ev.dataTransfer.getData('text');
			ev.target.parentElement.prepend(document.getElementById(data));
			// Make the bottom disk undraggable (if there is one)
			if (towersState[toId].length > 1) {
				makeDraggable(document.getElementById(towersState[toId][1]), false);
			}
			// Make the top disk in 'from' tower draggable
			if (towersState[fromId].length > 0) {
				makeDraggable(document.getElementById(towersState[fromId][0]), true);
			}
			// Update moves counter
			moveEl.innerText = ++movesCounter;
			// *** check for end of game (all the disks are in the last tower)
			if (towersState[TOWERS[END].id].length === currentLevel) {
				endGame();
				return;
			}
			// display next move
			guidedMode &&
				displayMessage(
					`Move ${movesArray[movesCounter].disk.replace('-', ' ')} to ${
						TOWERS[movesArray[movesCounter].to].label
					}`,
					'keep'
				);
		} else {
			// *** show message
			!guidedMode && displayMessage('Lower disk must be bigger');
			ev.target.classList.remove(`drop-highlight-${validity}`);

			// ev.target.classList.remove('drop-highlight-red');
		}
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
	// add quote contentent and author and fetch a quote
	const qDivEl = document.createElement('div');
	qDivEl.setAttribute('id', 'quote-wrapper');
	const qContentEl = document.createElement('span');
	qContentEl.setAttribute('id', 'quote-content');
	qDivEl.appendChild(qContentEl);
	const qAuthorEl = document.createElement('p');
	qAuthorEl.setAttribute('id', 'quote-author');
	qDivEl.appendChild(qAuthorEl);
	gameEndModalEl.appendChild(qDivEl);
	fetchQuote(qContentEl, qAuthorEl);
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
	// append the modal box to the container
	gameEndEl.appendChild(gameEndModalEl);
	document.body.prepend(gameEndEl);
}

// --- Event Listeners ---

// Click on the window
document.body.addEventListener('click', (event) => {
	// event.preventDefault();
	// console.log(event.target.id, 'was clicked');
	// console.log(event.target.checked);
	// console.log('The parent is:', event.target.parentElement.id);
	switch (event.target.id) {
		case 'reset-btn':
			movesCounter && init(currentLevel);
			break;
		case 'pause-btn':
			runTimer(false);
			break;
		case 'about-btn': // Show 'About' modal
			document.getElementById('about-container').classList.remove('hidden');
			break;
		case 'close-about-btn':
			document.getElementById('about-container').classList.add('hidden');
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
		case 'toggle-switch':
			// console.log(event.target.checked);
			const bg = getComputedStyle(document.documentElement).getPropertyValue(
				'--bg-color'
			);
			const fg = getComputedStyle(document.documentElement).getPropertyValue(
				'--rod-color'
			);
			document.documentElement.style.setProperty('--bg-color', fg);
			document.documentElement.style.setProperty('--rod-color', bg);
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
