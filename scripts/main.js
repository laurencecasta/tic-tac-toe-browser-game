// Create gameboard object
const gameBoard = (() => {
  let board = [];
  for (let i = 0; i < 3; i++) {
    board.push([]);
    for (let j = 0; j < 3; j++) {
      board[i].push('');
    }
  }
  return {
    board,
  };
})();

// Create factory function for players
const Player = (name) => {
  const getName = () => name;
  const marker  = () => (game.playerCreated) ? 'O': 'X'; // Add property indicating player's marker (X vs O)
  const number = () => (game.playerCreated) ? 2 : 1;
  return {
    getName,
    marker,
    number,
  };
};

// Manually create players with the factory function

// Create helper factory function to determine winner
const Winner = (board, marker) => {
  const winningCases = () => {
    /* let newAr = [];
    let rowIndex = 0;
    board.forEach(row => { // Create new array with all other markers removed
      newAr.push([]);
      row.forEach(spot => {
        if (spot == marker) {
          newAr[rowIndex].push(marker);
        } else {
          newAr[rowIndex].push('');
        }
      });
      rowIndex++;
    }); */


    let newAr = board.map(row => {
      return row.map(place => (place == marker) ? place : '');
    });
    return newAr;
  }

  return {
    winningCases,
  }
}

// Create display controller to render gameBoard
const game = ((boardAr) => { 
  let playerCreated = false // Create boolean determining if any players are created
  let playerOneTurn = true; // Create boolean determining which player's turn it is
  let playerTwoTurn = false;
  
  // Create DOM elements from gameBoard array
  let container = document.querySelector('.boardContainer') // Add reference to gameBoard container node
  let board = document.createElement('table'); // Create table element for board
  let count = 0;
  boardAr.forEach(row => {
    let gameBoardRow = document.createElement('tr'); // Create table row DOM node
    let rowIndex = boardAr.indexOf(row); // record index of row in variable
    console.log(rowIndex);
    let placeIndex = 0;
    row.forEach(place => { // Create a data cell for each spot
      let spot = document.createElement('td');
      spot.setAttribute('data-index', placeIndex)// Add data attribute to the DOM spot
      gameBoardRow.appendChild(spot); // Append spot to row

      spot.addEventListener('click', (e) => { // Add event listener for each spot tied to the data attribute
        if (spot.textContent) {return;}
        spot.textContent = (playerOneTurn) ? 'X' : 'O'; // Add content on click
        row[spot.getAttribute('data-index')] = spot.textContent; // change data in array after adding content
        console.log(boardAr); // log array to console to test
        [playerOneTurn, playerTwoTurn] = [playerTwoTurn, playerOneTurn]; // Switch players' turns
      });

      placeIndex++;
    });
    board.appendChild(gameBoardRow); // Append row to table
  });
  container.appendChild(board); // Append table to container

  return {
    playerCreated,
  };
})(gameBoard.board);

// Test gameBoard display