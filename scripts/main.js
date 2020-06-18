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

// Create helper factory function to determine winner
const Winner = (board, marker) => {
  const markerAr = () => {
    let newAr = board.map(row => { // Create new array with only the marker
      return row.map(place => (place == marker) ? place : '');
    });
    return newAr;
  }
  const winningCase = () => { // Create boolean comparing markerAr to winning case
    // Horizontal rows
    for (let i = 0; i < markerAr().length; i++) {
      if (JSON.stringify(markerAr()[i]) === JSON.stringify([marker, marker, marker])) {return true;}
    }

    // Vertical rows
    for (let i = 0; i < markerAr().length; i++) {
      let vertAr = [];
      for (let j = 0; j < markerAr().length; j++) {
        vertAr.push(markerAr()[j][i])
      }
      if (JSON.stringify(vertAr) === JSON.stringify([marker, marker, marker])) {return true;}
    }

    // Diagonals
    let diag = [];
    for (let i = 0; i < markerAr().length; i++) {
      diag.push(markerAr()[i][i]);
      if (JSON.stringify(diag) === JSON.stringify([marker, marker, marker])) {return true;}
    }

    let revDiag = [];
    for (let i = 0; i < markerAr().length; i++) {
      revDiag.push(markerAr()[i][markerAr().length - 1 - i]);
      if (JSON.stringify(revDiag) === JSON.stringify([marker, marker, marker])) {return true;}
    }

    return false;
  }
  return {
    markerAr,
    winningCase,
  }
}

// Create display controller to render gameBoard
const game = ((boardAr) => { 
  let playerCreated = false // Create boolean determining if any players are created
  let playerOneTurn = true; // Create boolean determining which player's turn it is
  let playerTwoTurn = false;
  let gameOver = false; // Create boolean determining if game is over
  let spotsFilled = 0;// Create counter for spots filled
  
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
        if (spot.textContent || gameOver) {return;}
        spot.textContent = (playerOneTurn) ? 'X' : 'O'; // Add content on click
        row[spot.getAttribute('data-index')] = spot.textContent; // change data in array after adding content
        console.log(boardAr); // log array to console to test
        [playerOneTurn, playerTwoTurn] = [playerTwoTurn, playerOneTurn]; // Switch players' turns

        spotsFilled++;
        console.log(spotsFilled);

        setTimeout(() => {
          if (Winner(boardAr, 'X').winningCase()) { // Check for winner or tie
            alert('player 1 wins');
            gameOver = true;
          } else if (Winner(boardAr, 'O').winningCase()) {
            alert('player 2 wins');
            gameOver = true;
          } else if (spotsFilled === 9) {
            alert('It was a tie!');
          }
        }, 10);
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