// game.js
// Lap Yan Cheung (lyc286@nyu.edu)

//access all util functions
const tic = require('./tic-tac-toe.js');

//bring in readline-sync module
const readlineSync = require('readline-sync');


function scriptedMovesToString(arrOfMoves){
  let scriptedMoves = "";
  for (let i=0; i<arrOfMoves.length; i++) {
    scriptedMoves+="[";
    scriptedMoves+=arrOfMoves[i];
    scriptedMoves+="]";
  }
  return scriptedMoves;
}

if (process.argv[2]!=null){ //scripted game
  //greeting line
  console.log("Let's play: Tic-Tac-Toe! - Scripted Edition\n");
  //read input into array
  const arrMoves = process.argv[2] ? JSON.parse(process.argv[2]) : undefined;
  const pcMoves = arrMoves[0];
  const pcMovesString = scriptedMovesToString(pcMoves); //creates string rep. of moves for user
  const userMoves = arrMoves[1];
  const userMovesString = scriptedMovesToString(userMoves);
  //console.log("PC Move #1- "+pcMoves[0]);
  console.log("Computer will make the following moves: "+pcMovesString);
  console.log("User will make the following moves: "+userMovesString);

  //ask user for board dimensons - check for errors
  let boardLength = 0;
  while (true){
    boardLength = readlineSync.question("How wide do you want the board to be? (1 - 26)\n>> ");
    if (!isNaN(boardLength)&&boardLength>=1&&boardLength<=26){
      break;
    }
  }
  let user = {
    id: "User",
    //moves: userMoves;
  };
  let pc = {
    id: "Computer",
    //moves: pcMoves;
  };
  while (true){
    //ask user for symbol choice X/O - check for errors
    userSymbol = readlineSync.question("Pick your symbol: X or O\n>> ");
    if (userSymbol=='X'||userSymbol=='O'){
      if (userSymbol=='X'){
        user.symbol = 'X';
        pc.symbol = 'O';
      } else{
        pc.symbol = 'X';
        user.symbol = 'O';
      }
      break;
    }
  }
  //determine who goes first
  let orderList = [];
  if (userSymbol=='X'){
    orderList = [user,pc];
  } else {
    orderList = [pc,user];
  }
  // print out basic settings
  console.log("---------\nYour symbol: "+user.symbol+"\nComputer's symbol: "+pc.symbol+"\n**"+orderList[0].id+" goes first");

  // initialize board
  let gameBoard = tic.board(boardLength,boardLength);
  console.log(tic.boardToString(gameBoard));

  //the game
  let winner = false;
  while(!winner&&!tic.isBoardFull(gameBoard)){
    //x goes first - according to orderList
    for (let p of orderList){
      if (p.id=="User"){
        //console.log("USer reached");
        let move;

        // do we have an Array of scripted moves and are there moves left?
        if(userMoves && userMoves.length > 0) {
          const arr = userMoves.splice(0, 1)[0];
          // make sure it's a valid move!
          if(tic.isValidMove(gameBoard, arr[0], arr[1])) {
            move = {'row':arr[0], 'col':arr[1]};
            readlineSync.question("Press <ENTER> for your move");
          }
          // if it's not valid, move remains undefined
          // if we still don't have a valid move, just get a random empty square
          if(move === undefined) {
            console.log("***User scripted move is invalid "+scriptedMovesToString(arr)+" - random move is generated")
            move = tic.toRowCol(gameBoard, tic.getRandomEmptyCellIndex(gameBoard));
          }
          //gameBoard = tic.placeLetters(gameBoard,p.symbol,move);
        } else if (userMoves.length==0){ //if scripted moves are exhausted - ask user for move
         console.log("***User scripted moves exhausted - Type your move!");
         //let move = "";
         while (true){
           const tempUsrInput = readlineSync.question("Make your move\n(move has to be the the format if 'row''col.' eg. B2, and in an empty cell):\n>> ");
           if (tic.isValidMoveAlgebraicNotation(gameBoard, tempUsrInput)){
             move = tic.algebraicToRowCol(tempUsrInput);
             //make the move and return updated board
             break;
           }
         }
       }
       //input the move to the board
       gameBoard = tic.setBoardCell(gameBoard,p.symbol, move.row, move.col);
       console.log(tic.boardToString(gameBoard)); //output updated board
       //check for winner or if board is filled
       if (checkWinner(gameBoard)){
         winner=true;
         console.log("User won! :)");
         break;
       } else if (tic.isBoardFull(gameBoard)){
         console.log("Board is full: It's a draw :|");
         break;
       }
     } else {
        // the move the computer will make
        let move;
        // do we have an Array of scripted moves and are there moves left?
        if(pcMoves && pcMoves.length > 0) {
            const arr = pcMoves.splice(0, 1)[0];
            // make sure it's a valid move!
            if(tic.isValidMove(gameBoard, arr[0], arr[1])) {
                move = {'row':arr[0], 'col':arr[1]};
            }
        	// if it's not valid, move remains undefined
          // if we still don't have a valid move, just get a random empty square
          if(move === undefined) {
              console.log("***Computer scripted moves "+scriptedMovesToString(arr)+" is invalid: Random move is generated");
              move = tic.toRowCol(gameBoard, tic.getRandomEmptyCellIndex(gameBoard));
          }
        } else if (pcMoves.length == 0){
          console.log("***Computer scripted moves exhausted: Random moves generated")
          move = tic.toRowCol(gameBoard, tic.getRandomEmptyCellIndex(gameBoard));
        }
        //Put computer's move to board
        readlineSync.question("Press <ENTER> to show computer's move");
        gameBoard = tic.setBoardCell(gameBoard, p.symbol, move.row, move.col);
        console.log(tic.boardToString(gameBoard));
        //check result
        if (checkWinner(gameBoard)){
          winner=true;
          console.log("Computer won! :(");
          break;
        } else if (tic.isBoardFull(gameBoard)){
          console.log("Board is full: It's a draw :|");
          break;
        }
     }
    }
  }


} else { //random game
  //greeting line
  console.log("Let's play: Tic-Tac-Toe! - Freestyle Edition\n");
  //ask user for board dimensons - check for errors
  let boardLength = 0;
  while (true){
    boardLength = readlineSync.question("How wide do you want the board to be? (1 - 26)\n>> ");
    if (!isNaN(boardLength)&&boardLength>=1&&boardLength<=26){
      break;
    }
  }

  //ask user for symbol choice X/O - check for errors
  let user = {
    id: "User",
  };
  let pc = {
    id: "Computer",
  };
  while (true){
    userSymbol = readlineSync.question("Pick your symbol: X or O\n>> ");
    if (userSymbol=='X'||userSymbol=='O'){
      if (userSymbol=='X'){
        user.symbol = 'X';
        pc.symbol = 'O';
      } else{
        pc.symbol = 'X';
        user.symbol = 'O';
      }
      break;
    }
  }
  //determine who goes first
  let orderList = [];
  if (userSymbol=='X'){
    orderList = [user,pc];
  } else {
    orderList = [pc,user];
  }
  // print out basic settings
  console.log("---------\nYour symbol: "+user.symbol+"\nComputer's symbol: "+pc.symbol+"\n**"+orderList[0].id+" goes first");

  // initialize board
  let gameBoard = tic.board(boardLength,boardLength);
  console.log(tic.boardToString(gameBoard));

  //the game
  let winner = false;
  while (!winner&&!tic.isBoardFull(gameBoard)){
    //console.log("top******isBoardFull: "+tic.isBoardFull(gameBoard)+"\nisWinner: "+winner+"\n********");
    //console.log("Game running: "+gameContinue);
    /*if (winner||tic.isBoardFull(gameBoard)){
      gameContinue = false;
      //console.log("Game ended: "+gameContinue);
    }*/
    //take turns x goes first
    for (let p of orderList){
      //user's turn
      if (p.id=="User"){
        //error check for valid algebraic notation input
        let usrMove = "";
        while (true){
          usrMove = readlineSync.question("Make your move\n(move has to be the the format if 'row''col.' eg. B2, and in an empty cell):\n>> ");
          if (tic.isValidMoveAlgebraicNotation(gameBoard, usrMove)){
            //make the move and return updated board
            gameBoard = tic.placeLetters(gameBoard,p.symbol,usrMove);
            break;
          }
        }
        //print out new board
        console.log(tic.boardToString(gameBoard));
        //check if there's any winner
        //console.log("mid******isBoardFull: "+tic.isBoardFull(gameBoard)+"\nisWinner: "+winner+"\n********");
        if (checkWinner(gameBoard)){
          //console.log("evaluated");
          winner=true;
          console.log("User won! :)");
          break;
        } else if (tic.isBoardFull(gameBoard)){
          console.log("Board is full: It's a draw:|");
          break;
        }
      } else {
        //computer's turn
        readlineSync.question('Press <ENTER> to show computer\'s move...');
        const pcMove = tic.toRowCol(gameBoard, tic.getRandomEmptyCellIndex(gameBoard));
        //place move to board
        //gameBoard[pcMove]=p.symbol;
        gameBoard = tic.setBoardCell(gameBoard, p.symbol, pcMove.row, pcMove.col);
        //print out new board
        console.log(tic.boardToString(gameBoard));
        //console.log("mid******isBoardFull: "+tic.isBoardFull(gameBoard)+"\nisWinner: "+winner+"\n********");
        if (checkWinner(gameBoard)){
          winner=true;
          console.log("Computer won! :(");
          break;
        } else if (tic.isBoardFull(gameBoard)){
          console.log("Board is full: It's a draw :|");
          break;
        }
      }
    }
  }
}
//mini function to check for winner
function checkWinner(board){
  for (let i=0;i<3;i++){
    if (tic.getWinnerRows(board)!=undefined){
      console.log("rows determined winner");
      return true;
    } else if (tic.getWinnerCols(board)!=undefined){
      console.log("cols determined winner");
      return true;
    } else if ((tic.getWinnerDiagonals(board)!=undefined)){
      console.log("diagonals determined winner");
      return true;
    } else {
      return false;
    }
  }
}
