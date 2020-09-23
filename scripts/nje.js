// const LobbyPlayer = (playerNum, moveChar, inputId) => {
//     let name = document.querySelector(`input[id="${inputId}"]`).value || 
//                 document.querySelector(`input[id="${inputId}"]`).placeholder;
//     return {
//         playerNum, 
//         name,
//         moveChar
//     }
// };

// const lobby = (() => {
//   let getPlayers = () =>
//   {
//       let p1 = new LobbyPlayer(1, "X", "playerOneInput");
//       let p2 = new LobbyPlayer(2, "O", "playerTwoInput");

//       return [p1, p2];
//   }
// })();

// const boardGame = (() => {

// })();

const ui = (() => {
  let toggleLobbyControlVisibility = () =>
  {
    document.getElementById('startStop').toggleAttribute('hidden');
  };

  let toggleBoardGameVisibility = () =>
  {
    document.getElementById('boardGameContainer').toggleAttribute('hidden');  
  };

  return {
      toggleLobbyControlVisibility,
      toggleBoardGameVisibility
  }
})();

const gameCoord = ((ui) => {
  let beginMatch = () =>
  {
    ui.toggleLobbyControlVisibility();
    ui.toggleBoardGameVisibility();
  };

  let quitMatch = () =>
  {
    ui.toggleLobbyControlVisibility();
    ui.toggleBoardGameVisibility();
  };
    
  return {
      beginMatch,
      quitMatch
  };
})(ui);



document.querySelector('#submitNames')
  .addEventListener('click', (e) => {
    gameCoord.beginMatch();
});

document.querySelector('#quitMatch')
  .addEventListener('click', (e) => {
    gameCoord.quitMatch();
});

