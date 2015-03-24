function Piece(initialValue) {
	this.value = initialValue;
	this.row = -1;
	this.col = -1;
	this.getValue = function() {
		return this.value;
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
	this.getColor = function() {
		switch(this.value) {
			case 2:
				return "gold";
			case 4:
				return "orange";
			case 8:
				return "green";
			case 16:
				return "red";
			case 32:
				return "pink";
			case 64:
				return "maroon";
			case 128:
				return "blue";
			case 256:
				return "#20B2AA";
			case 512:
				return "purple";
			case 1024:
				return "magenta";
			case 2048:
				return "black";
			return "#ccc0b3;";


		}
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
			if (Math.random() < 0.5) {
				this.addPiece(new Piece(2)); 
			} else {
				this.addPiece(new Piece(4)); 
			}
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
		this.updateGridUI();
	}
	this.run = function() { 
		this.configureFromReset();
		var grid = this.grid;
		var game = this;
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
    		game.updateGridUI();
   			e.preventDefault(); // prevent the default action (scroll / move caret)
   		});
	};
	this.updateGridUI = function() {
		for (var i = 0; i < this.grid.spaces.length; i++) {
			for (var j = 0; j < this.grid.spaces[i].length; j++) {
				var currPiece = this.grid.spaces[i][j];
				var idString = "#position-" + i + "-" + j;
				if (currPiece == null) {
					$(idString + " .label").html("&nbsp;");
					$(idString).css("background-color", "#ccc0b3");
				} else {
					$(idString + " .label").html("" + currPiece.getValue());
					$(idString).css("background-color", currPiece.getColor());
				}
				
			}
		}

	};

}


var main = function() {
	var game = new Game();
	game.run();
}
$(document).ready(main);


