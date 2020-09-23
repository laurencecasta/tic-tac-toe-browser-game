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
      let boardContainer = document.querySelector('.boardContainer');
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
          spot.setAttribute('data-index', squareNumber++)
          gameBoardRow.appendChild(spot);
          spot.addEventListener('click', (e) => {
            let squareId = spot.getAttribute('data-index');
            spotClickCallback(`spot clicked on ${squareId}`);
          });      
        }
      }
    };
  
    return {
      // toggleControlVisibilty is not meant for public use, don't include
      toggleLobbyControlVisibility,
      toggleBoardGameVisibility,
      getLobbyPlayerName,
      renderBoard
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
  let boardSize = 0;
  let board = new Array(boardSize);

  const initialize = (boardSize) => {
    boardSize = boardSize;
    board = new Array(boardSize).fill('').map(() => new Array(boardSize).fill(''));
  };

  const onSpotClick = (spotClicked) => {
    alert(spotClicked);
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
    board.initialize(3);
    let players = lobby.getPlayers();      
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

