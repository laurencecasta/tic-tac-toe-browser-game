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
  
    return {
        // toggleControlVisibilty is not meant for public use, don't include
        toggleLobbyControlVisibility,
        toggleBoardGameVisibility,
        getLobbyPlayerName
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

const gameCoord = ((lobby, ui) => {

  const toggleBetweenLobbyAndBoardGame = () => {
    ui.toggleLobbyControlVisibility();
    ui.toggleBoardGameVisibility();  
  };

  const beginMatch = () => {
      let players = lobby.getPlayers();
      // set up board
      toggleBetweenLobbyAndBoardGame();
  };

  const quitMatch = () =>
  {
      toggleBetweenLobbyAndBoardGame();
  };
    
  return {
      // toggleBetweenLobbyAndBoardGame not meant for public use, don't include
      beginMatch,
      quitMatch
  };
})(lobby, ui);


// wire up UI elements to game coordinator
document.querySelector('#submitNames')
  .addEventListener('click', (e) => {
    gameCoord.beginMatch();
});

document.querySelector('#quitMatch')
  .addEventListener('click', (e) => {
    gameCoord.quitMatch();
});

