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

// Create form object
const playerForm = ((board, gameOver) => {
  const startStop = document.forms['startStop'];// Retrieve form
  let mainBtn = document.getElementById('submitNames'); // Retrieve button
  let resetBtn = document.getElementById('resetContainer')// Retrieve reset button
  let spotsFilled = 0;
  let playerOne;
  let playerTwo;
  startStop.addEventListener('submit', (e) => { // Create event listener for submit
    e.preventDefault(); // Prevent automatic refresh
    e.target.toggleAttribute('hidden'); // hide form
    playerOne = Player(startStop.querySelector('input[id="playerOneInput"]').value); // create player object with name input
    playerTwo = Player(startStop.querySelector('input[id="playerOneInput"]').value);
    resetBtn.toggleAttribute('hidden'); // Reveal reset button
  });
})(gameBoard.board, gameBoard.gameOver);

// Create factory function for players
const Player = (name) => {
  const marker  = () => (game.playerCreated) ? 'O': 'X'; // Add property indicating player's marker (X vs O)
  const number = () => (game.playerCreated) ? 2 : 1;
  return {
    name,
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
const game = ((boardAr, form) => { 
  let playerCreated = false // Create boolean determining if any players are created
  let playerOneTurn = true; // Create boolean determining which player's turn it is
  let playerTwoTurn = false;
  let gameStarted = false;
  let gameOver = false; // Create boolean determining if game is over
  let spotsFilled = 0;
  let result = document.createElement('h3'); // Create DOM node to display result
  result.toggleAttribute('hidden');
  document.querySelector('body').appendChild(result); // Append result to body

  const start = document.querySelector('#submitNames') // Create event listener for start button
  start.addEventListener('click', (e) => {
    gameStarted = true;
  });

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
        if (spot.textContent || !gameStarted || gameOver) {return;}
        spot.textContent = (playerOneTurn) ? 'X' : 'O'; // Add content on click
        row[spot.getAttribute('data-index')] = spot.textContent; // change data in array after adding content
        spot.classList.toggle((playerOneTurn) ? 'cross' : 'naught');
        console.log(boardAr); // log array to console to test
        [playerOneTurn, playerTwoTurn] = [playerTwoTurn, playerOneTurn]; // Switch players' turns

        setTimeout(() => {
          if (Winner(boardAr, 'X').winningCase()) { // Check for winner or tie
            let playerOne = document.querySelector('input[id="playerOneInput"]').value || 
                            document.querySelector('input[id="playerOneInput"]').placeholder;
            result.textContent = `${playerOne} wins.`; // Set text content to player one victory
            result.classList.toggle('pOneResult');
            result.toggleAttribute('hidden');
            gameOver = true;
          } else if (Winner(boardAr, 'O').winningCase()) {
            let playerTwo = document.querySelector('input[id="playerTwoInput"]').value || 
                            document.querySelector('input[id="playerTwoInput"]').placeholder;
            result.textContent = `${playerTwo} wins.`; // Set text content to player one victory
            result.classList.toggle('pTwoResult');
            result.toggleAttribute('hidden');
            gameOver = true;
          } else if (spotsFilled === 9) {
            result.textContent = `It was a tie.`; // Set text content to player one victory
            result.toggleAttribute('hidden');
            gameOver = true;
          }
        }, 10);
        spotsFilled++;
        console.log(spotsFilled);
      });

      placeIndex++;
    });
    board.appendChild(gameBoardRow); // Append row to table
  });
  container.appendChild(board); // Append table to container

  // Add reset event listener
  let resetBtn = document.getElementById('resetContainer'); // Retrieve reset button
  resetBtn.addEventListener('click', (e) => { // Create event listener to reset game
    boardAr.forEach(row => { // Empty out gameboard array
      let placeIndex = 0;
      row.forEach(place => {
        row[placeIndex] = '';
        placeIndex++;
      });
    });
    console.log(board);
    let domPlaces = document.querySelectorAll('td'); // Empty DOM board
    domPlaces.forEach(place=> {
      place.textContent = '';
      if (Array.from(place.classList)[0] === 'cross') { // Remove cross and naught classes
        place.classList.toggle('cross');
      } else if (Array.from(place.classList)[0] === 'naught') {
        place.classList.toggle('naught');
      }
    });

    if (Array.from(result.classList)[0] === 'pOneResult') { // Remove result styling classes
      result.classList.toggle('pOneResult');
    } else if (Array.from(result.classList)[0] === 'pTwoResult') {
      result.classList.toggle('pTwoResult');
    }
    
    playerOneTurn = true; // Set player one's turn
    playerTwoTurn = false;
    spotsFilled = 0; // Reset spotsfilled
    gameOver = false; // set gameOver to false

    if (!result.hasAttribute('hidden')) {result.toggleAttribute('hidden');}; // If game is over hide result node
  });
  return {
    playerCreated,
    gameOver,
  };
})(gameBoard.board, playerForm);