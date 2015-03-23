function Piece(initialValue) {
	this.value = initialValue;
	this.row = -1;
	this.col = -1;
	this.getValue = function() {
		return this.value;
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
	this.combine = function(other, grid) { //TO-COMPLETE
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
		console.log("GOING FROM " + this.row + ", " + this.col + " TO " + currRow + ", " +  currCol)
		grid.spaces[this.row][this.col] = null;

		grid.spaces[currRow][currCol] = this;
		this.row = currRow;
		this.col = currCol;
	}


}


function Grid() {
	this.spaces = [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]];
	this.move = function(dir) { //TO-COMPLETE
		var currRow = 0;
		var currCol = 0;
		switch (dir) {
			case "down":
				currRow = 0;
				break;
			case "up":

				currRow = 0;
				for (var col = currCol; col < this.spaces[0].length; col++) {
					for (var row = currRow; row < this.spaces.length; row++) {
						// console.log(this.toString());
						var currPiece = this.spaces[row][col];
						if (currPiece != null) {
							while (currPiece.canMoveOnce(dir, this)) {
								currPiece.moveOnce(dir, this);
							}
							var neighbor = currPiece.getNeighbor(dir, this);
							// console.log(neighbor);
							if (currPiece.canCombine(neighbor)) {
								currPiece.combine(neighbor, this);
							}
						}
					}

				}
				break;
			case "left":
				currCol = this.spaces[0].length - 1;
				break;
			case "right":
				currCol = 0;
				break;
		}

	};

	this.canEndGame = function() { //TO-COMPLETE

	};


	this.canMove = function(dir) { //TO-COMPLETE

	};
	this.canMove = true;

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
		piece.x = randomPos[0];
		piece.y = randomPos[1];
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
		// this.grid.addPiece(new Piece(2));
		// this.grid.addPiece(new Piece(2));
	}
	this.run = function() { //TO-COMPLETE FOR NOW WILL RETURN PRINTED VERSION OF BOARD
		this.configureFromReset();
	}
}

var main = function() {
	var game = new Game();
	game.run();
	// $('.content').text(game.grid.toString());
	//TEST
	var p1 = new Piece(2);
	var p2 = new Piece(2);
	var p3 = new Piece(2);
	var p4 = new Piece(2);
	game.grid.addPieceToPos(p1, 3,0);
	game.grid.addPieceToPos(p2, 2,0);
	game.grid.addPieceToPos(p3, 1,0);
	game.grid.addPieceToPos(p4, 0,0);
	console.log(game.grid.toString());
	game.grid.move("up");
	console.log(game.grid.toString());
}
$(document).ready(main);


