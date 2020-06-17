// Create gameboard object
const gameBoard = (() => {
  let board = [];
  for (let i = 0; i < 3; i++) {
    board.push([]);
    for (let j = 0; j < 3; j++) {
      board[i].push('_');
    }
  }
  return {
    board,
  };
})();

// Create factory function for players
const Player = (name) => {
  const getName = () => name;
  return {getName};
};

// Create display controller to render gameBoard
const game = ((boardAr) => {
  // Create DOM elements from gameBoard array
  let container = document.querySelector('.boardContainer') // Add reference to gameBoard container node
  let board = document.createElement('table'); // Create table element for board
  let count = 0;
  boardAr.forEach(row => {
    let gameBoardRow = document.createElement('tr'); // Create table row DOM node
    row.forEach(place => { // Create a data cell for each spot
      let spot = document.createElement('td');
      spot.textContent = (count % 2 == 0) ? 'X' : 'O'; // Create placeholders
      gameBoardRow.appendChild(spot); // Append spot to row
      count++;
    });
    board.appendChild(gameBoardRow); // Append row to table
  });
  container.appendChild(board); // Append table to container
})(gameBoard.board);

// Test gameBoard display