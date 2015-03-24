function Piece(initialValue) {
	this.value = initialValue;
	this.row = -1;
	this.col = -1;
	this.getValue = function() {
		return this.value;
	}
	this.color = function() {

	}
	this.getX = function() {
		return this.x;
	}
	this.getY = function() {
		return this.y;
	}
	this.addValue = function(other) {
		other.value += this.value;
	}
	this.combine = function(other, grid) {
		this.addValue(other);
		grid.spaces[this.row][this.col] = null;

	};

	this.canCombine = function(other) {
		return other != null && other != -1 && this.value === other.getValue();

	};

	this.getNeighbor = function(dir, grid) {
		var inBounds = function(row, col) {
			return row < grid.spaces.length && row >= 0 && col < grid.spaces[row].length && col >= 0;
		}
		switch (dir) {
			case "down":
				var currRow = this.row + 1;
				var currCol = this.col;
				break;
			case "up":
				var currRow = this.row - 1;
				var currCol = this.col;
				break;
			case "left":
				var currRow = this.row;
				var currCol = this.col - 1;
				break;
			case "right":
				var currRow = this.row;
				var currCol = this.col + 1;
				break;
		}
		if (!inBounds(currRow, currCol)) {
			return -1;
		}

		return grid.spaces[currRow][currCol];

	}
	this.canMoveOnce = function(dir, grid) {
		return this.getNeighbor(dir, grid) == null;
	}

	this.moveOnce = function(dir, grid) {
		switch (dir) {
			case "down":
				var currRow = this.row + 1;
				var currCol = this.col;
				break;
			case "up":
				var currRow = this.row - 1;
				var currCol = this.col;
				break;
			case "left":
				var currRow = this.row;
				var currCol = this.col - 1;
				break;
			case "right":
				var currRow = this.row;
				var currCol = this.col + 1;
				break;
		}
		// console.log("GOING FROM " + this.row + ", " + this.col + " TO " + currRow + ", " +  currCol)
		grid.spaces[this.row][this.col] = null;

		grid.spaces[currRow][currCol] = this;
		this.row = currRow;
		this.col = currCol;
	}


}


function Grid() {
	this.spaces = [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]];
	var moved = false;
	this.move = function(dir) { //TO-COMPLETE
		var currRow = 0;
		var currCol = 0;
		var moveHelper = function(piece, grid) {
			if (currPiece != null) {
				while (currPiece.canMoveOnce(dir, grid)) {
					currPiece.moveOnce(dir, grid);
					moved = true;
				}
				var neighbor = currPiece.getNeighbor(dir, grid);
				if (currPiece.canCombine(neighbor)) {
					currPiece.combine(neighbor, grid);
					moved = true;
				}
			}
		}
		switch (dir) {
			case "down":
				currRow = this.spaces.length - 1;
				for (var col = currCol; col < this.spaces[0].length; col++) {
					for (var row = currRow; row >= 0; row--) {
						var currPiece = this.spaces[row][col];
						moveHelper(currPiece, this);
					}
				}
				break;
			case "up":
				currRow = 0;
				for (var col = currCol; col < this.spaces[0].length; col++) {
					for (var row = currRow; row < this.spaces.length; row++) {
						var currPiece = this.spaces[row][col];
						moveHelper(currPiece, this);
					}
				}
				break;
			case "left":
				currCol = 0;
				for (var row = currRow; row < this.spaces.length; row++) {
					for (var col = currCol; col < this.spaces[0].length; col++) {
						var currPiece = this.spaces[row][col];
						moveHelper(currPiece, this);
					}
				}
				break;
			case "right":
				currCol = this.spaces[0].length - 1;
				for (var row = currRow; row < this.spaces.length; row++) {
					for (var col = currCol; col >= 0; col--) {
						var currPiece = this.spaces[row][col];
						moveHelper(currPiece, this);
					}
				}
				break;
		}
		if (moved) {
			this.addPiece(new Piece(2)); //CHANGE: ADD RANDOM PIECE
		}
		moved = false;

	};

	this.canEndGame = function() {
		var g = this;
		var canEndGameHelper = function(piece) {
			if (piece === -1) {
				return true;
			} else if (piece == null) {
				return false;
			} else {
				var rightNeighbor = piece.getNeighbor("right", g);
				var downNeighbor = piece.getNeighbor("down", g);
				return !piece.canCombine(rightNeighbor) && !piece.canCombine(downNeighbor)
						&& canEndGameHelper(rightNeighbor) && canEndGameHelper(downNeighbor);
			}
		}
		return canEndGameHelper(this.spaces[0][0]);

	};

	this.addPiece = function(piece) {
		var emptyPositions = [];
		for (var i = 0; i < this.spaces.length; i++) {
			for (var j = 0; j < this.spaces[i].length; j++) {
				if (this.spaces[i][j] == null) {
					emptyPositions.push([i, j]);
				}
			}
		}
		var randomPos = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
		this.spaces[randomPos[0]][randomPos[1]] = piece;
		piece.row = randomPos[0];
		piece.col = randomPos[1];
	};
	this.addPieceToPos = function(piece, row, col) { //TESTING PURPOSES ONLY
		this.spaces[row][col] = piece;
		piece.row = row;
		piece.col = col;
	}
	this.toString = function() {
		var returned = "";
		for (var row = 0; row < this.spaces.length; row++) {
			for (var col = 0; col < this.spaces[row].length; col++) {
				var currPiece = this.spaces[row][col];
				if (currPiece == null) {
					returned = returned + "0"
				} else {
					returned = returned + currPiece.getValue();
				}
				returned = returned + " ";
			}
			returned = returned + "\n";
		}
		return returned;

	}

}

function Game() {
	this.score = 0;
	this.grid = new Grid();
	this.configureFromReset = function() {
		this.grid = new Grid();
		this.score = 0;
		this.grid.addPiece(new Piece(2));
		this.grid.addPiece(new Piece(2));
	}
	this.run = function() { //TO-COMPLETE FOR NOW WILL RETURN PRINTED VERSION OF BOARD
		this.configureFromReset();
		var grid = this.grid;
		$(document).keydown(function(e) {
    		switch(e.which) {
        		case 37: // left
        			grid.move("left");
        			break;

        		case 38: // up
        			grid.move("up");
        			break;

        		case 39: // right
        			grid.move("right");
        			break;

        		case 40: // down
        			grid.move("down");
        			break;

        		default: return; // exit this handler for other keys
    		}
    		console.log(grid.toString());
    		console.log(grid.canEndGame());
   			e.preventDefault(); // prevent the default action (scroll / move caret)
   		});
	};
	this.updateGridUI = function() {
		//get corresponding elements
		//update style features


	};
	this.resetGridUI = function() {
		//remove all existing elements
		//add all new elements with appropriate height and width
		var size = this.grid.spaces.length;
		var grid = document.getElementsByClassName("grid");
		console.log(grid[0].style.width);
		console.log()
		var blockSize = grid[0].style.width / size;
		console.log(blockSize);
	};

}

var main = function() {
	var game = new Game();
	game.run();
	// $('.content').text(game.grid.toString());
	//TEST
	// var p1 = new Piece(2);
	// var p2 = new Piece(2);
	// var p3 = new Piece(2);
	// var p4 = new Piece(2);
	// game.grid.addPieceToPos(new , 3,3);
	// game.grid.addPieceToPos(p2, 3,2);
	// game.grid.addPieceToPos(p3, 3,1);
	// game.grid.addPieceToPos(p4, 3,0);
	
	// console.log(game.grid.toString());
	// game.grid.move("left");
	console.log(game.grid.toString());
	console.log(game.grid.canEndGame());
	game.resetGridUI();
}
$(document).ready(main);


