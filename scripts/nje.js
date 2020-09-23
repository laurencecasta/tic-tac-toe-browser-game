// abstract UI out of domain logic modules
// if this were more complicated, we might need a ui module per logic module,
// but a single shared module is OK for a small demo
const ui = (() => {
    const toggleControlVisibility = (id) => {
      document.getElementById(id).toggleAttribute('hidden');
    };
    
    const toggleLobbyControlVisibility = () => {
      toggleControlVisibility("startStop");    
    };
  
    const toggleBoardGameVisibility = () => {
      toggleControlVisibility("boardGameContainer");    
    };
  
    const getLobbyPlayerName = (playerNumber) => {
      const inputId = `player${playerNumber}Input`;
      return document.querySelector(`input[id="${inputId}"]`).value || 
                  document.querySelector(`input[id="${inputId}"]`).placeholder;
    };

    const renderBoard = (boardSize, spotClickCallback) => {      
      let boardContainer = document.getElementById('boardContainer');
      if (boardContainer.hasChildNodes) {
          boardContainer.removeChild(boardContainer.firstChild)
      }
      let board = document.createElement('table');
      boardContainer.appendChild(board);
      
      let squareNumber = 0;    
      for (let currRow = 0; currRow < boardSize; currRow++) {
        let gameBoardRow = document.createElement('tr');
        board.appendChild(gameBoardRow);
        for (let currCol = 0; currCol < boardSize; currCol++) {
          let spot = document.createElement('td');
          spot.dataset.indexRow = currRow;
          spot.dataset.indexCol = currCol;
          gameBoardRow.appendChild(spot);
          spot.addEventListener('click', (e) => {
            spotClickCallback(spot.dataset.indexRow, spot.dataset.indexCol);
          });      
        }
      }
    };

    const markSpot = (rowClicked, colClicked, markChar) => {
        let td = document.querySelector(`td[data-index-row='${rowClicked}'][data-index-col='${colClicked}']`);
        td.textContent = markChar;
    };
      
    return {
      // toggleControlVisibilty is not meant for public use, don't include
      toggleLobbyControlVisibility,
      toggleBoardGameVisibility,
      getLobbyPlayerName,
      renderBoard,
      markSpot
    };
})();

const lobby = ((ui) => {
  const makePlayer = (playerNum, moveChar, name) => {
    return {
        playerNum, 
        moveChar,
        name,
    };
  };
     
  let getPlayers = () =>
  {
      let p1 = makePlayer(1, "X", ui.getLobbyPlayerName(1));
      let p2 = makePlayer(2, "O", ui.getLobbyPlayerName(2));
      return [p1, p2];
  };

  return {
      // makePlayer not intended for public use, don't include
      getPlayers
  }
})(ui);

const board = ((ui) => {
  let pBoardSize = 0;
  let pBoard = new Array(0);
  let pPlayers = new Array(0);
  let pCurrPlayerIx = 0;

  const initialize = (boardSize, players) => {
    pBoardSize = boardSize;
    pBoard = new Array(boardSize).fill('').map(() => new Array(boardSize).fill(''));
    pPlayers = players;
    pCurrPlayerIx = 0;
  };

  const onSpotClick = (rowClicked, colClicked) => {
    let currPlayer = pPlayers[pCurrPlayerIx];

    if (Number.isInteger(pBoard[rowClicked][colClicked])) {
      alert("can't move here, it's already claimed!");
      return;
    }
    else {
      pBoard[rowClicked][colClicked] = currPlayer.playerNum;
      ui.markSpot(rowClicked, colClicked, currPlayer.moveChar);
    }
    //alert(`it is player ${currPlayer.playerNum} turn. Go ${currPlayer.name}!`);

    // will increment current index, with a reset back to 0 (beginning of array) once it reaches 2 (end of array).
    // Google 'modulo operator'.
    pCurrPlayerIx = (pCurrPlayerIx + 1) % 2;
  };
  
  return {
    initialize,
    onSpotClick
  }; 

})(ui);

const gameCoord = ((lobby, board, ui) => {

  const toggleBetweenLobbyAndBoardGame = () => {
    ui.toggleLobbyControlVisibility();
    ui.toggleBoardGameVisibility();  
  };

  const onBeginMatch = () => {
    let players = lobby.getPlayers();      
    board.initialize(3, players);
    ui.renderBoard(3, board.onSpotClick);
    toggleBetweenLobbyAndBoardGame();
  };

  const onQuitMatch = () =>
  {
    toggleBetweenLobbyAndBoardGame();
  };
    
  return {
    // toggleBetweenLobbyAndBoardGame not meant for public use, don't include
    onBeginMatch,
    onQuitMatch
  };
})(lobby, board, ui);


// wire up UI elements to game coordinator
document.querySelector('#submitNames')
  .addEventListener('click', (e) => {
    gameCoord.onBeginMatch();
});

document.querySelector('#quitMatch')
  .addEventListener('click', (e) => {
    gameCoord.onQuitMatch();
});

