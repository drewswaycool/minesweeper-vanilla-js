var colors = [['#1abc9c','#16a085'],['#2ecc71','#27ae60'],['#3498db','#2980b9'],['#9b59b6','#8e44ad'],['#34495e','#2c3e50'],['#f1c40f','#f39c12'],['#e67e22','#d35400'],['#e74c3c','#c0392b'],['#ecf0f1','#bdc3c7'],['#95a5a6','#7f8c8d']];


function newGame(difficulty) {
	// hide the menu
	document.querySelector('#menu').style.display = 'none';
	document.querySelector('#game').classList.remove('hidden')
	document.querySelector('#game-cover').classList.remove('hidden')
	document.querySelector('#game-bar').classList.remove('hidden')


	// set the backdrop
	var colorScheme = Math.floor((Math.random() * 10) + 0);
	document.querySelector('body').style.backgroundColor = colors[colorScheme][1];

    // set the gameboard
    var gameBoard = document.querySelector('#game');
    var gameCover = document.querySelector('#game-cover');

    // set globals
    var cellColCounter = 0;
    var cellRowCounter = 1;

    // // start the timer
    // var clock = document.querySelector('#time-count')
    // for (i = 0; i =< 9999; i++) {
    // 	setTimeout(function() {clock.innerHTML = i;}, 1000);
    // }

    // set the gameboard tiles
    for (i = 0; i < 400; i++) {
        // make cells and set attributes
        cell = document.createElement('div');
        cellCover = document.createElement('div');
        cell.setAttribute('class', 'cell cell' + i);
        cellCover.setAttribute('class', 'cover-cell cover-cell' + i);
        cellCover.addEventListener('contextmenu', function(event) {
        	event.preventDefault();
        	flagTile(this);
        });
        cellCover.addEventListener('click', function() {
        	revealTile(this);
        });

        // set col number
        if (cellColCounter < 20) {
            cellColCounter += 1;
            cell.setAttribute('data-col-number', cellColCounter);
            cellCover.setAttribute('data-col-number', cellColCounter);
        } else {
            cellColCounter = 1;
            cell.setAttribute('data-col-number', cellColCounter);
            cellCover.setAttribute('data-col-number', cellColCounter);
        }

        // set row number
        if (cellRowCounter <= 20) {
            cell.setAttribute('data-row-number', cellRowCounter);
            cellCover.setAttribute('data-row-number', cellRowCounter);
            if (cellColCounter == 20) {
                cellRowCounter += 1;
            }
        }
        // add cells
        gameBoard.appendChild(cell);
        gameCover.appendChild(cellCover);
    }

    // set the mines
    for (i = 0; i < 400; i++) {
        // determine amount of mines to generate
        // easy 1.1, normal 1.2, hard 1.3
        random = Math.floor((Math.random() * difficulty) + 0);
        mine = '';
        if (random > 0) {
            random = 'X';
            mine = ' mine fa fa-times';
        } else {
            random = '';
            mine = '';
        }
        cell = document.querySelector('.cell' + i);
        cell.innerHTML = random;
        // refactor this.. adding mine class to mines
        cellClass = cell.className + mine;
        cell.className = cellClass;
    }



    // populate array of all cells
    var cellData = document.querySelectorAll('.cell');
    var mineCount = document.querySelectorAll('.mine').length;
    document.querySelector('#mine-count').innerHTML = mineCount;

    // set surrounding counters
    for (i = 0; i < 400; i++) {

        currentCell = cellData[i];
        prevCell = cellData[i - 1];
        nextCell = cellData[i + 1];

        // set increment number
        number = 0;

        if (currentCell.innerHTML === "X") {
            // if previous cell is not a mine AND on the same row, make it a 1 or add 1 to it
            if ((prevCell != null) && (prevCell.innerHTML != "X" && prevCell.getAttribute('data-row-number') == currentCell.getAttribute('data-row-number'))) {
                prevCell.innerHTML = number += 1;
            }
            number = 0;
            // if next cell is not a mine AND on the same row, make it a 1 or add 1 to it
            if ((nextCell != null) && (nextCell.innerHTML != "X" && nextCell.getAttribute('data-row-number') == currentCell.getAttribute('data-row-number'))) {
                nextCell.innerHTML = number += 1;
            }
            number = 0;
            findVertsAndDiags(currentCell);
        }
    }

    for (i = 0; i < 400; i++) {

        currentCell = cellData[i];
        prevCell = cellData[i - 1];
        nextCell = cellData[i + 1];

        if (currentCell.innerHTML == '1') {
        	howManyMines(currentCell);
        }
    }

    for (i = 0; i < 400; i++) {

        currentCell = cellData[i];
        prevCell = cellData[i - 1];
        nextCell = cellData[i + 1];

        if (currentCell.innerHTML == '0') {
        	fixZeros(currentCell);
        }
    }

    for (i = 0; i < 400; i++) {

        currentCell = cellData[i];

        if (currentCell.innerHTML == '1') {
        	currentCell.style.color = "green";
        }
        if (currentCell.innerHTML == '2') {
        	currentCell.style.color = "blue";
        }
        if (currentCell.innerHTML == '3') {
        	currentCell.style.color = "purple";
        }
        if (currentCell.innerHTML >= '4' && currentCell.innerHTML != 'X') {
        	currentCell.style.color = "#B30000";
        }
    }

    // set vertical and diagonal counters
    function findVertsAndDiags(currentMine) {
    	currentMineLocation = {
    		'row': parseInt(currentMine.getAttribute('data-row-number')), 
    		'col': parseInt(currentMine.getAttribute('data-col-number'))
    	};

    	// set some base cases
    	aboveCell = null;
    	topLeftCell = null;
    	topRightCell = null;
    	belowCell = null;
    	bottomLeftCell = null;
    	bottomRightCell = null;

    	// get row and col of above cell
    	if (currentMineLocation.row - 1 != '0') {
    		aboveCell = document.querySelector('[data-row-number="'+(currentMineLocation.row - 1)+'"][data-col-number="'+currentMineLocation.col+'"]');
    		if (aboveCell.innerHTML != '1') {
    			if (aboveCell.innerHTML != 'X') {
    				aboveCell.innerHTML = 1;
    			}
    		}
    	}
    	// get row and col of below cell
    	if (currentMineLocation.row + 1 != '21') {
    		belowCell = document.querySelector('[data-row-number="'+(currentMineLocation.row + 1)+'"][data-col-number="'+currentMineLocation.col+'"]');
    		if (belowCell.innerHTML != '1') {
    			if (belowCell.innerHTML != 'X') {
    				belowCell.innerHTML = 1;
    			}
    		}
    	}
    	// get row and col of top left cell
    	if (currentMineLocation.row - 1 != '0' && currentMineLocation.col - 1 != '0') {
    		topLeftCell = document.querySelector('[data-row-number="'+(currentMineLocation.row - 1)+'"][data-col-number="'+(currentMineLocation.col - 1)+'"]');
    		if (topLeftCell.innerHTML != '1') {
    			if (topLeftCell.innerHTML != 'X') {
    				topLeftCell.innerHTML = 1;
    			}
    		}
    	}
    	// get row and col of top right cell
    	if (currentMineLocation.row - 1 != '0' && currentMineLocation.col + 1 != '21') {
    		topRightCell = document.querySelector('[data-row-number="'+(currentMineLocation.row - 1)+'"][data-col-number="'+(currentMineLocation.col + 1)+'"]');
    		if (topRightCell.innerHTML != '1') {
    			if (topRightCell.innerHTML != 'X') {
    				topRightCell.innerHTML = 1;
    			}
    		}
    	}
    	// get row and col of bottom left cell
    	if (currentMineLocation.row + 1 != '21' && currentMineLocation.col - 1 != '0') {
    		bottomLeftCell = document.querySelector('[data-row-number="'+(currentMineLocation.row + 1)+'"][data-col-number="'+(currentMineLocation.col - 1)+'"]');
    		if (bottomLeftCell.innerHTML != '1') {
    			if (bottomLeftCell.innerHTML != 'X') {
    				bottomLeftCell.innerHTML = 1;
    			}
    		}
    	}
    	// get row and col of bottom right cell
    	if (currentMineLocation.row + 1 != '21' && currentMineLocation.col + 1 != '21') {
    		bottomRightCell = document.querySelector('[data-row-number="'+(currentMineLocation.row + 1)+'"][data-col-number="'+(currentMineLocation.col + 1)+'"]');
    		if (bottomRightCell.innerHTML != '1') {
    			if (bottomRightCell.innerHTML != 'X') {
    				bottomRightCell.innerHTML = 1;
    			}
    		}
    	}
    }

    // find how many mines surround a number and add 1 to it
    function howManyMines(currentNumberCell) {
    	currentNumberCell.style.backgroundColor = "rgba(255,255,255,.4)";
    	currentNumberLocation = {
    		'row': parseInt(currentNumberCell.getAttribute('data-row-number')), 
    		'col': parseInt(currentNumberCell.getAttribute('data-col-number'))
    	};

    	// set some base cases
    	aboveCell = null;
    	topLeftCell = null;
    	topRightCell = null;
    	leftCell = null;
    	belowCell = null;
    	bottomLeftCell = null;
    	bottomRightCell = null;
    	rightCell = null;

    	connectingMines = 0;

    	// get row and col of above cell
    	if (currentNumberLocation.row - 1 != '0') {
    		aboveCell = document.querySelector('[data-row-number="'+(currentNumberLocation.row - 1)+'"][data-col-number="'+currentNumberLocation.col+'"]');
    		if (aboveCell.innerHTML == 'X') {
    			connectingMines += 1;
    		}
    	}
    	// get row and col of below cell
    	if (currentNumberLocation.row + 1 != '21') {
    		belowCell = document.querySelector('[data-row-number="'+(currentNumberLocation.row + 1)+'"][data-col-number="'+currentNumberLocation.col+'"]');
    		if (belowCell.innerHTML == 'X') {
    			connectingMines += 1;
    		}
    	}
    	// get row and col of top left cell
    	if (currentNumberLocation.row - 1 != '0' && currentNumberLocation.col - 1 != '0') {
    		topLeftCell = document.querySelector('[data-row-number="'+(currentNumberLocation.row - 1)+'"][data-col-number="'+(currentNumberLocation.col - 1)+'"]');
    		if (topLeftCell.innerHTML == 'X') {
    			connectingMines += 1;
    		}
    	}
    	// get row and col of top right cell
    	if (currentNumberLocation.row - 1 != '0' && currentNumberLocation.col + 1 != '21') {
    		topRightCell = document.querySelector('[data-row-number="'+(currentNumberLocation.row - 1)+'"][data-col-number="'+(currentNumberLocation.col + 1)+'"]');
    		if (topRightCell.innerHTML == 'X') {
    			connectingMines += 1;
    		}
    	}
    	// get row and col of bottom left cell
    	if (currentNumberLocation.row + 1 != '21' && currentNumberLocation.col - 1 != '0') {
    		bottomLeftCell = document.querySelector('[data-row-number="'+(currentNumberLocation.row + 1)+'"][data-col-number="'+(currentNumberLocation.col - 1)+'"]');
    		if (bottomLeftCell.innerHTML == 'X') {
    			connectingMines += 1;
    		}
    	}
    	// get row and col of bottom right cell
    	if (currentNumberLocation.row + 1 != '21' && currentNumberLocation.col + 1 != '21') {
    		bottomRightCell = document.querySelector('[data-row-number="'+(currentNumberLocation.row + 1)+'"][data-col-number="'+(currentNumberLocation.col + 1)+'"]');
    		if (bottomRightCell.innerHTML == 'X') {
    			connectingMines += 1;
    		}
    	}

    	// get left cell
    	if (currentNumberLocation.col - 1 != '0') {
    		leftCell = document.querySelector('[data-row-number="'+(currentNumberLocation.row)+'"][data-col-number="'+(currentNumberLocation.col - 1)+'"]');
    		if (leftCell.innerHTML == 'X') {
    			connectingMines += 1;
    		}
    	}
    	// get right cell
    	if (currentNumberLocation.col + 1 != '21') {
    		rightCell = document.querySelector('[data-row-number="'+(currentNumberLocation.row)+'"][data-col-number="'+(currentNumberLocation.col + 1)+'"]');
    		if (rightCell.innerHTML == 'X') {
    			connectingMines += 1;
    		}
    	}

    	currentNumberCell.innerHTML = connectingMines;
    }

    // fix zeroes
    function fixZeros(currentNumberCell) {
    	currentNumberCell.innerHTML = '1';
    }

	var coverCells = document.querySelectorAll('.cover-cell');

	for (i = 0; i < 400; i++) {
		coverCells[i].style.backgroundColor = colors[colorScheme][0];
	}

}

// the game over function
function gameOver() {
	var mines = document.querySelectorAll('.mine');
	var mineCount = mines.length;
	for (i = 0; i < mineCount; i++) {
		var currentMineLocation = mines[i].getAttribute('class').split(' ')[1];
		document.querySelector('.cover-' + currentMineLocation +'').style.visibility = 'hidden';
		mines[i].innerHTML = '';
		mines[i].classList.add('mine-visible');
	}
}

// reveal all surrounding empty cells for as long as possible
function unleash(coverCell) {
	baseCellLocation = {
		'row': parseInt(coverCell.getAttribute('data-row-number')), 
		'col': parseInt(coverCell.getAttribute('data-col-number'))
	};

	coverCell.style.visibility = 'hidden';

	// set some base cases
    var aboveCell = null;
    var topLeftCell = null;
    var topRightCell = null;
    var leftCell = null;
    var belowCell = null;
    var bottomLeftCell = null;
    var bottomRightCell = null;
    var rightCell = null;
    var aboveCoverCell = null;
    var topLeftCoverCell = null;
    var topRightCoverCell = null;
    var leftCoverCell = null;
    var belowCoverCell = null;
    var bottomLeftCoverCell = null;
    var bottomRightCoverCell = null;
    var rightCoverCell = null;
	
		// get row and col of above cell
    	if (baseCellLocation.row - 1 != '0') {
    		aboveCoverCell = document.querySelector('.cover-cell[data-row-number="'+(baseCellLocation.row - 1)+'"][data-col-number="'+baseCellLocation.col+'"]');
    		aboveCell = document.querySelector('.cell[data-row-number="'+(baseCellLocation.row - 1)+'"][data-col-number="'+baseCellLocation.col+'"]');

    		if (!aboveCell.hasAttribute('data-skip')) {
	    		if (aboveCell.innerHTML === '') {
	    			aboveCell.setAttribute('data-skip', 'true');
	    			setTimeout(function() {unleash(aboveCoverCell);}, 0);
	    		} else if (aboveCell.innerHTML >= 1) {
	    			aboveCoverCell.style.visibility = 'hidden';
	    			aboveCell.style.visibility = 'visible';
	    		}
    		}
    	}

    	// get row and col of below cell
    	if (baseCellLocation.row + 1 != '21') {
    		belowCoverCell = document.querySelector('.cover-cell[data-row-number="'+(baseCellLocation.row + 1)+'"][data-col-number="'+baseCellLocation.col+'"]');
    		belowCell = document.querySelector('.cell[data-row-number="'+(baseCellLocation.row + 1)+'"][data-col-number="'+baseCellLocation.col+'"]');

    		if (!belowCell.hasAttribute('data-skip')) {
	    		if (belowCell.innerHTML === '') {
	    			belowCell.setAttribute('data-skip', 'true');
	    			setTimeout(function() {unleash(belowCoverCell);}, 0);
	    		} else if (belowCell.innerHTML >= 1) {
	    			belowCoverCell.style.visibility = 'hidden';
	    			belowCell.style.visibility = 'visible';
	    		}
    		}
    	}

    	// get row and col of top left cell
    	if (baseCellLocation.row - 1 != '0' && baseCellLocation.col - 1 != '0') {
    		topLeftCoverCell = document.querySelector('.cover-cell[data-row-number="'+(baseCellLocation.row - 1)+'"][data-col-number="'+(baseCellLocation.col - 1)+'"]');
    		topLeftCell = document.querySelector('.cell[data-row-number="'+(baseCellLocation.row - 1)+'"][data-col-number="'+(baseCellLocation.col - 1)+'"]');

    		if (!topLeftCell.hasAttribute('data-skip')) {
	    		if (topLeftCell.innerHTML === '') {
	    			topLeftCell.setAttribute('data-skip', 'true');
	    			setTimeout(function() {unleash(topLeftCoverCell);}, 0);
	    		} else if (topLeftCell.innerHTML >= 1) {
	    			topLeftCoverCell.style.visibility = 'hidden';
	    			topLeftCell.style.visibility = 'visible';
	    		}
    		}
    	}

    	// get row and col of top right cell
    	if (baseCellLocation.row - 1 != '0' && baseCellLocation.col + 1 != '21') {
    		topRightCoverCell = document.querySelector('.cover-cell[data-row-number="'+(baseCellLocation.row - 1)+'"][data-col-number="'+(baseCellLocation.col + 1)+'"]');
    		topRightCell = document.querySelector('.cell[data-row-number="'+(baseCellLocation.row - 1)+'"][data-col-number="'+(baseCellLocation.col + 1)+'"]');

    		if (!topRightCell.hasAttribute('data-skip')) {
	    		if (topRightCell.innerHTML === '') {
	    			topRightCell.setAttribute('data-skip', 'true');
	    			setTimeout(function() {unleash(topRightCoverCell);}, 0);
	    		} else if (topRightCell.innerHTML >= 1) {
	    			topRightCoverCell.style.visibility = 'hidden';
	    			topRightCell.style.visibility = 'visible';
	    		}
    		}
    	}

    	// get row and col of bottom left cell
    	if (baseCellLocation.row + 1 != '21' && baseCellLocation.col - 1 != '0') {
    		bottomLeftCoverCell = document.querySelector('.cover-cell[data-row-number="'+(baseCellLocation.row + 1)+'"][data-col-number="'+(baseCellLocation.col - 1)+'"]');
    		bottomLeftCell = document.querySelector('.cell[data-row-number="'+(baseCellLocation.row + 1)+'"][data-col-number="'+(baseCellLocation.col - 1)+'"]');

    		if (!bottomLeftCell.hasAttribute('data-skip')) {
	    		if (bottomLeftCell.innerHTML === '') {
	    			bottomLeftCell.setAttribute('data-skip', 'true');
	    			setTimeout(function() {unleash(bottomLeftCoverCell);}, 0);
	    		} else if (bottomLeftCell.innerHTML >= 1) {
	    			bottomLeftCoverCell.style.visibility = 'hidden';
	    			bottomLeftCell.style.visibility = 'visible';
	    		}
    		}
    	}

    	// get row and col of bottom right cell
    	if (baseCellLocation.row + 1 != '21' && baseCellLocation.col + 1 != '21') {
    		bottomRightCoverCell = document.querySelector('.cover-cell[data-row-number="'+(baseCellLocation.row + 1)+'"][data-col-number="'+(baseCellLocation.col + 1)+'"]');
    		bottomRightCell = document.querySelector('.cell[data-row-number="'+(baseCellLocation.row + 1)+'"][data-col-number="'+(baseCellLocation.col + 1)+'"]');

    		if (!bottomRightCell.hasAttribute('data-skip')) {
	    		if (bottomRightCell.innerHTML === '') {
	    			bottomRightCell.setAttribute('data-skip', 'true');
	    			setTimeout(function() {unleash(bottomRightCoverCell);}, 0);
	    		} else if (bottomRightCell.innerHTML >= 1) {
	    			bottomRightCoverCell.style.visibility = 'hidden';
	    			bottomRightCell.style.visibility = 'visible';
	    		}
    		}
    	}

    	// get left cell
    	if (baseCellLocation.col - 1 != '0') {
    		leftCoverCell = document.querySelector('.cover-cell[data-row-number="'+(baseCellLocation.row)+'"][data-col-number="'+(baseCellLocation.col - 1)+'"]');
    		leftCell = document.querySelector('.cell[data-row-number="'+(baseCellLocation.row)+'"][data-col-number="'+(baseCellLocation.col - 1)+'"]');

    		if (!leftCell.hasAttribute('data-skip')) {
	    		if (leftCell.innerHTML === '') {
	    			leftCell.setAttribute('data-skip', 'true');
	    			setTimeout(function() {unleash(leftCoverCell);}, 0);
	    		} else if (leftCell.innerHTML >= 1) {
	    			leftCoverCell.style.visibility = 'hidden';
	    			leftCell.style.visibility = 'visible';
	    		}
    		}
    	}
    	// get right cell
    	if (baseCellLocation.col + 1 != '21') {
    		rightCoverCell = document.querySelector('.cover-cell[data-row-number="'+(baseCellLocation.row)+'"][data-col-number="'+(baseCellLocation.col + 1)+'"]');
    		rightCell = document.querySelector('.cell[data-row-number="'+(baseCellLocation.row)+'"][data-col-number="'+(baseCellLocation.col + 1)+'"]');

    		if (!rightCell.hasAttribute('data-skip')) {
	    		if (rightCell.innerHTML === '') {
	    			rightCell.setAttribute('data-skip', 'true');
	    			setTimeout(function() {unleash(rightCoverCell);}, 0);
	    		} else if (rightCell.innerHTML >= 1) {
	    			rightCoverCell.style.visibility = 'hidden';
	    			rightCell.style.visibility = 'visible';
	    		}
    		}
    	}
}

function revealTile(coverCell) {
	var coverCellNumber = coverCell.getAttribute('class').split('cell')[2];
	var actualCell = document.querySelector('.cell'+coverCellNumber+'');

	actualCell.style.visibility = 'visible';

	if (actualCell.innerHTML === '') {
	   unleash(coverCell);
    } else if (actualCell.innerHTML >= 1) {
        coverCell.style.visibility = 'hidden';
    } else {
    	actualCell.style.backgroundColor = 'red';
        gameOver();
    }
}

function flagTile(element) {
	var coverCell = element;
	switch(coverCell.innerHTML) {
		case '':
			coverCell.innerHTML = 'F';
			mineCountElement.innerHTML -= mineCount;
		break;
		case 'F':
			coverCell.innerHTML = '?';
		break;
		case '?':
			coverCell.innerHTML = '';
		break;
	}
}