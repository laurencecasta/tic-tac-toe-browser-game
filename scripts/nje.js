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

    const resultHeaderId = "resultHeader";
    const showHeader = (text, style) => {
      result = document.getElementById(resultHeaderId);
      result.className = style;
      result.textContent = text;
      result.hidden = false;
    };

    const hideHeader = () => {
      document.getElementById(resultHeaderId).hidden = true;
    };

    const markSpot = (rowClicked, colClicked, markChar, markClass) => {
        let td = document.querySelector(`td[data-index-row='${rowClicked}'][data-index-col='${colClicked}']`);        
        td.classList.toggle(markClass);
        td.textContent = markChar;
    };
      
    return {
      // toggleControlVisibilty is not meant for public use, don't include
      toggleLobbyControlVisibility,
      toggleBoardGameVisibility,
      getLobbyPlayerName,
      renderBoard,
      markSpot,
      showHeader,
      hideHeader
    };
})();

const lobby = ((ui) => {
  const makePlayer = (playerNum, spotChar, spotClass, resultClass, name) => {
    return {
        playerNum, 
        spotChar,
        spotClass,
        resultClass,
        name,
    };
  };
     
  let getPlayers = () =>
  {
      let p1 = makePlayer(1, "X", "cross", "pOneResult",  ui.getLobbyPlayerName(1));
      let p2 = makePlayer(2, "O", "naught", "pTwoResult", ui.getLobbyPlayerName(2));
      return [p1, p2];
  };

  return {
      // makePlayer not intended for public use, don't include
      getPlayers
  }
})(ui);

const board = ((ui) => {
  let pGameState = 0;
  let pBoardSize = 0;
  let pBoard = new Array(0);
  let pPlayers = new Array(0);
  let pCurrPlayerIx = 0;
  let pMovesMade = 0;

  const initialize = (boardSize, players) => {
    pGameState = 0;
    pBoardSize = boardSize;
    pBoard = new Array(boardSize).fill('').map(() => new Array(boardSize).fill(''));
    pPlayers = players;
    pCurrPlayerIx = 0;
    pMovesMade = 0;
  };

  const detectLeftToRightDiagonalWin = (rowClicked, colClicked, currPlayNum) => {
    if (rowClicked !== colClicked) return false;     
    
    let n = 0;    
    while (n < pBoardSize)
    {
        if (pBoard[n][n] === currPlayNum)
          n +=1;            
        else
          return false;
    }
    return true;
  }

  const detectRightToLeftDiagonalWin = (rowClicked, colClicked, currPlayNum) => {
    const baseZeroBoardSize = pBoardSize - 1;
    if (rowClicked + colClicked !== baseZeroBoardSize) return false;
    
    let n = 0;
    while (n < pBoardSize)
    {
        if (pBoard[n][baseZeroBoardSize-n] === currPlayNum)
          n +=1;
        else return false;
    }
    return true;
  }

  // 0 = game in progress
  // 1 = current player won
  // 2 = tie game
  const evaluateGameState = (rowClicked, colClicked) => {
    // nobody can win faster than turns needed to make a straight line
    if (pMovesMade < (pBoardSize * pPlayers.length) -1) return 0;

    // check for win
    let currPlayNum = pPlayers[pCurrPlayerIx].playerNum;

    let rowWin = pBoard[rowClicked].every( (val) => val === currPlayNum);
    if (rowWin) return 1;

    let colWin = pBoard.every( (col) => col[colClicked] === currPlayNum);
    if (colWin) return 1;

    if (detectLeftToRightDiagonalWin(rowClicked, colClicked, currPlayNum)) return 1;
    
    if (detectRightToLeftDiagonalWin(rowClicked, colClicked, currPlayNum)) return 1;

    // if not a win and the board is full, it's a tie
    if (pMovesMade === pBoardSize * pBoardSize) return 2;
        
    return 0;
  }

  const onSpotClick = (rowClicked, colClicked) => {
    // Ignore if game is over
    if (pGameState !== 0) return;

    rowClicked = parseInt(rowClicked, 10);
    colClicked = parseInt(colClicked, 10);    
    let currPlayer = pPlayers[pCurrPlayerIx];

    // Can't move into spot a player has already claimed
    if (Number.isInteger(pBoard[rowClicked][colClicked])) return;

    // Claim the spot, draw on the screen
    pBoard[rowClicked][colClicked] = currPlayer.playerNum;
    pMovesMade += 1;
    ui.markSpot(rowClicked, colClicked, currPlayer.spotChar, currPlayer.spotClass);

    // Is the game now over?
    pGameState = evaluateGameState(rowClicked, colClicked);

    if (pGameState === 1) {
        ui.showHeader(`${currPlayer.name} wins!`, currPlayer.resultClass);
        return;
    }
    else if (pGameState === 2) {
        ui.showHeader(`It was a tie`);
        return;
    }
    
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
  const desiredBoardSize = 3;

  const toggleBetweenLobbyAndBoardGame = () => {
    ui.toggleLobbyControlVisibility();
    ui.toggleBoardGameVisibility();  
  };

  const resetBoard = () => {
    ui.hideHeader();
    let players = lobby.getPlayers();      
    board.initialize(desiredBoardSize, players);
    ui.renderBoard(desiredBoardSize, board.onSpotClick);
  };

  const onBeginMatch = () => {
    resetBoard();
    toggleBetweenLobbyAndBoardGame();
  };

  const onResetGame = () =>
  {
    resetBoard();
  };
    
  const onQuitMatch = () =>
  {
    resetBoard();
    toggleBetweenLobbyAndBoardGame();
  };
    
  return {
    // toggleBetweenLobbyAndBoardGame and resetBoard not meant for public use, don't include
    onBeginMatch,
    onResetGame,
    onQuitMatch
  };
})(lobby, board, ui);


// wire up UI elements to game coordinator
document.querySelector('#submitNames')
  .addEventListener('click', (e) => {
    gameCoord.onBeginMatch();
});

document.querySelector('#resetGame')
  .addEventListener('click', (e) => {
    gameCoord.onResetGame();
});

document.querySelector('#quitMatch')
  .addEventListener('click', (e) => {
    gameCoord.onQuitMatch();
});

