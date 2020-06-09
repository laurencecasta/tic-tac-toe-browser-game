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

console.log(gameBoard.board);