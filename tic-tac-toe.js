// tic-tac-toe.js
// Lap Yan Cheung (lyc286@nyu.edu)
const tic = {
  //board function to generate an array of defined rows x cols.
  //and filled with custom initial value
  board: function(r, c = 1, initValue = ""){
    return Array(r*c).fill(initValue);
  },

  //translates a row and col into an index in array
  toIndex: function(board, r, c){
    return (Math.sqrt(board.length))*r+c;
  },

  //translates an array index into [row,col]
  toRowCol: function(board, i){
    let rowColPair = {};
    rowColPair.row = Math.floor(i/Math.sqrt(board.length));
    rowColPair.col = i%(Math.sqrt(board.length));
    return rowColPair;
  },

  //sets an element in board to a user letter
  setBoardCell: function(board, letter, r, c){
    const indexToSet = this.toIndex(board, r, c);
    const elementsBeforeIndex = board.slice(0,indexToSet);
    const elementsAfterIndex = board.slice(indexToSet+1,board.length);
    return [...elementsBeforeIndex,letter,...elementsAfterIndex];
  },

  //express the algebraic notation of a cell in rows and columns
  algebraicToRowCol: function(algebraicNotation){
    const inputStr = algebraicNotation.split("");
    if (inputStr.length<2||inputStr.length>3){ //check if string length is in range
      return undefined;
    }
    if (typeof inputStr[0]!='string') { //check if row character is correct
      return undefined;
    }
    for (let i = 1; i<inputStr.length; i++){ //check if col. characters are correct
      if (isNaN(inputStr[i])||inputStr[i]===" "){
        return undefined;
      }
    }
    let rowColPair = {};
    rowColPair.row = inputStr[0].charCodeAt(0) - 65; //get row number
    if (inputStr.length===2){ //get col. number
      rowColPair.col = parseInt(inputStr[1])-1;
    } else {
      rowColPair.col = inputStr[1]+inputStr[2];
      rowColPair.col = parseInt(rowColPair.col)-1;
    }
    return rowColPair;
  },

  //place user letter into board according to algebraicNotation
  placeLetters: function(...boardInput){
    /*organize the array of input
    1) check if array is even, else pop last element
    skip moves with invalid notations
    skip moves that overwrite a board cell
    */
    let boardUpdate = boardInput[0];
    const refinedInput = [];
    if ((boardInput.length-1)%2==1){
      newBoardInput = boardInput.pop();
    } else {
      newBoardInput = boardInput;
    }
    for (let i = 1; i<boardInput.length; i+=2){
      const nextMv = this.algebraicToRowCol(boardInput[i+1]);
      if (nextMv != undefined){
        const indexToSet = this.toIndex(boardUpdate, nextMv.row, nextMv. col);
        if (boardUpdate[indexToSet]===""){
          boardUpdate = this.setBoardCell(boardUpdate, boardInput[i], nextMv.row, nextMv.col);
        }
      }
    }
    return boardUpdate;
  },

  //creates a graphical board
  boardToString: function(board){
    let boardInterface = "  ";
    const boardLength = Math.sqrt(board.length);
    //create col. labels 1-26
    for (let i=0;i<boardLength;i++){
      boardInterface+="   ";
      boardInterface+=(i+1);
    }
    boardInterface+="  \n";
    /*nested for loop makes:
      1 - top grid line
      2 - row label + in-between grid line
    */

    let charCounter=0; //counter to for row labels
    //->One top grid
    let boardIndex = 0; //track board array index
    for (let h=0;h<boardLength;h++){
      boardInterface+="   ";
      for (let i=0;i<boardLength;i++){
        if (i<9)
          boardInterface+="+---";
        else
          boardInterface+="+----";
      }
      boardInterface+="+\n ";
      //->One row
      boardInterface+=String.fromCharCode(65+(charCounter++));
      boardInterface+=" ";
      for (let i=0;i<boardLength;i++){
        if (board[boardIndex]===""){
          if (i<9)
            boardInterface+="|   "; //*print element if cell is not empty
          else
            boardInterface+="|    ";
        }
        else {
          if (i<9)
            boardInterface+=("| "+board[boardIndex]+" "); //*print element if cell is not empty
          else
            boardInterface+=("| "+board[boardIndex]+"  ");
        }
        boardIndex++;
      }
      boardInterface+="|\n";
   }
   //make last bottom grid line
   boardInterface+="   ";
   for (let i=0;i<boardLength;i++){
     if (i<9)
       boardInterface+="+---";
     else
       boardInterface+="+----";
   }
   boardInterface+="+\n";
   return boardInterface;
 },

 //check if there's a winner considering only rows
 getWinnerRows: function(board){
   const boardLength = Math.sqrt(board.length);
   /*for-loop to go through each row
     set a ref for each row - first element
     if all elements are same symbol - return winner
     else -go to next row
     --if not rows have a winner - return undef.
   */
   let boardIndex = 0;
   for (let i=0;i<boardLength;i++){
     if (board[boardIndex]===""){
       boardIndex+=boardLength;
       continue; //if element if empty skip to next row
     } else {
       let prevSymbol = board[boardIndex];
       for (let j=1;j<boardLength;j++){
         if (board[boardIndex+j]!=prevSymbol){
           boardIndex+=boardLength;
           break;
         } else {
           prevSymbol = board[boardIndex+j];
           if (j==boardLength-1&&board[boardIndex+j]==prevSymbol){
             return prevSymbol;
         }
        }
       }
     }
   }
   return undefined;
 },

 getWinnerCols: function(board){
   const boardLength = Math.sqrt(board.length);
   /*for-loop to go through each col. (every element in-b/w board length)
     set a ref for each col - first element
     if all elements are same symbol - return winner
     else -go to next col
     --if no cols have a winner - return undef.
   */
   let boardIndex = 0;
   for (let i=0;i<boardLength;i++){
     if (board[boardIndex]===""){
       boardIndex++;
       continue; //if element if empty skip to next col.
     } else {
       //let winCount = 1;
       let prevSymbol = board[boardIndex];
       let initColIndex = boardIndex;
       boardIndex+=boardLength;
       for (let j=1;j<boardLength;j++){
         if (board[boardIndex]!=prevSymbol){
           boardIndex=initColIndex+1; //reset array index
           break;
         } else {
           //winCount++;
           prevSymbol = board[boardIndex];
           if (j==boardLength-1&&board[boardIndex]==prevSymbol){
             return board[boardIndex];
           }
           boardIndex+=boardLength;
         }
       }
     }
   }
   return undefined;
 },

 getWinnerDiagonals: function(board){
   const boardLength = Math.sqrt(board.length);
   /*for-loop to go through 1 diagonal
     set a ref for each element in diagonal
     --> ele1, ele2: ele1+(rowLength+1), ele3: ele2+(rowLength+1)...end
     if all elements are same symbol - return winner
     else -go to next diagonal
     for-loop...
     --if no diagonals have a winner - return undef.
   */
   let boardIndex = 0;
   //diagonal 1
   for (let i=0;i<boardLength;i++){
     if (board[boardIndex]===""){
       //boardIndex+=(boardLength-1);
       break; //if element if empty skip to next diagonal.
     } else {
       //let winCount = 1;
       let prevSymbol = board[boardIndex];
       for (let j=1;j<boardLength;j++){
         boardIndex+=boardLength+1;
         if (board[boardIndex]!=prevSymbol){
           break;
         } else {
           if (j==boardLength-1){
             if (board[boardIndex]==prevSymbol)
              return prevSymbol;
           }
           prevSymbol = board[boardIndex];
         }
       }
     }
   }
   //diagonal 2
   boardIndex = boardLength-1;
   for (let i=0;i<boardLength;i++){
     if (board[boardIndex]===""){
       break; //if element if empty skip to end.
     } else {
       //let winCount = 1;
       let prevSymbol = board[boardIndex];
       for (let j=1;j<boardLength;j++){
         boardIndex+=boardLength-1;
         if (board[boardIndex]!=prevSymbol){
           break;
         } else {
           //winCount++;
           if (j==boardLength-1){
             if (board[boardIndex]==prevSymbol)
              return prevSymbol;
           }
           prevSymbol = board[boardIndex];

         }
       }
     }
   }
   return undefined;
 },

 //return true/false if there are empty spaces in board
 isBoardFull: function(board){
   for (let ele of board){
     if (ele===""){
       return false;
     }
   }
   return true;
 },

 //return true/false if a move is valid (to a cell that's empty)
 isValidMove: function(board, r, c){
   const boardIndexIntent = this.toIndex(board,r,c);
   if (boardIndexIntent>=board.length){
     return false;
   } else if (board[boardIndexIntent]!==""){
     return false;
   } else{
     return true;
   }
 },

 //return true/false if algebraic notation is valid
 isValidMoveAlgebraicNotation: function(board, algeNota){
   const move = this.algebraicToRowCol(algeNota);
   if (move!==undefined){
     return this.isValidMove(board,move.row,move.col);
   } else {
     return false;
   }
 },

 //return first random index of empty cell if there's any
 getRandomEmptyCellIndex: function(board){
   if (this.isBoardFull(board)){
     return undefined;
   } else {
     while (true){
       const randomIndex = Math.floor(Math.random() * Math.floor(board.length));
       if (board[randomIndex]===""){
         return randomIndex;
       }
     }
   }
 },


}

module.exports = tic;
