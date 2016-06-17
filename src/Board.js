// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var row = this.get(rowIndex);
      var piecesInRow = _.reject(row, function(piece) {
        return piece === 0;
      });

      if (piecesInRow.length > 1) {
        return true;
      } else {
        return false;
      }
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var board = this.rows();
      for (var i = 0; i < board.length; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // grab the board
      var board = this.rows();
      var result = 0;
      for (var i = 0; i < board.length; i++) {
        if (board[i][colIndex] !== 0) {
          result++;
        }
      }

      if (result > 1) {
        return true;
      } else {
        return false;
      }
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var board = this.rows();
      for (var i = 0; i < board.length; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        } 
      }    
      return false;
    },



    // Major Diagonals - go from top-lef   t to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var size = this.get('n');
      var count = 0;
      var row = 0;
      var index = majorDiagonalColumnIndexAtFirstRow;

      for ( ; row < size && index < size; row++, index++) {
        if (index >= 0) {
          var tempRow = this.get(row);
          count += tempRow[index];
        }
      }

      return count > 1;



      // var board = this.rows();
      // var flattened = _.flatten(board);
      // var result = 0;
      // var n = this.get('n');

      // var index = majorDiagonalColumnIndexAtFirstRow;

      // // iterate over flattened array
      // for (var i = index; i < flattened.length; i = i + n + 1) {
      //   // if i has a 1 , add to result
      //   if (flattened[i] === 1) {
      //     result++;
      //   }
      // }

      // if (result > 1) {
      //   return true;
      // } else {
      //   return false;
      // } 

    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var size = this.get('n');

      for (var i = 1 - size; i < size; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      };

      return false;



      // NOTE: could possibly return error when row has more than 1 piece
      // var board = this.rows();
      // var flattened = _.flatten(board);
      // var n = this.get('n');

      // var startingNums = _.range(0, n - 1);
      // for (var i = 1; i < board.length; i++) {
      //   startingNums.push(i * n);
      // }

      // for (var j = 0; j < startingNums.length; j++) {
      //   if (this.hasMajorDiagonalConflictAt(startingNums[j])) {
      //     return true;
      //   }
      // }

      // return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var size = this.get('n');
      var count = 0;
      var row = 0;
      var index = minorDiagonalColumnIndexAtFirstRow;

      // no intial starting value, acts more like a while look. as long as row is less than size and index is greater than or equal to zero, keep looping.
      // row and index will increase
      for ( ; row < size && index >= 0; row++, index--) {
        // if index we're iterating on is less than size (think: [0,0,1],[0,1,0],[1,0,0] where index = 2 and size equals 3)
        if (index < size) {
          // set row equal to array
          var currentRow = this.get(row);
          // add value of row to count (whether it be zero or one)
          count += currentRow[index];
        }
      }

      return count > 1;

      // var board = this.rows();
      // var result = 0;
      // var flattened = _.flatten(board);
      // var n = this.get('n');
      // // flattened = [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
      // var index = minorDiagonalColumnIndexAtFirstRow;

      // // need to create an array of valid starting numbers --- if the index given is not in the valid starting number array, return false
      // var startingNums = _.range(1, n);
      // for (var i = 1; i < board.length; i++) {
      //   startingNums.push(i * n - 1);
      // }
      // console.log(startingNums);
      // if (startingNums.indexOf(index) === -1) {
      //   return false;
      // }

      // for (var i = index; i < flattened.length; i = i + n - 1) {
      //   if (flattened[i] === 1 && startingNums.indexOf(flattened[i]) >= -1) {
      //     result++;
      //   }
      // }

      // return result > 1 ? true : false;

    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {

      var size = this.get('n');

      // start at 3x size - 1 (this will be last element of 2nd to last row)
      for (var i = (size * (size - 1)) - 1; i >= 0; i--) {
        // iterate over each index to check for diagonal conflict
        if (this.hasMinorDiagonalConflictAt(i)) {
          // break out and return true
          return true;
        }
      }

      return false;



      // // NOTE: could possibly return error when row has more than 1 piece
      // var board = this.rows();
      // var flattened = _.flatten(board);
      // var n = this.get('n');
      // var result = 0;

      // var startingNums = _.range(1, n);

      // for (var i = 1; i < board.length; i++) {
      //   startingNums.push(i * n - 1);
      // }

      // startingNums = _.uniq(startingNums);
 
      // for (var j = 0; j < startingNums.length; j++) {
      //   if (this.hasMinorDiagonalConflictAt(startingNums[j])) {
      //     return true;
      //   }
      // }
     
      // return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
