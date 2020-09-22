const gameCoord = (() => {
  let beginMatch = () =>
  {
      alert('beginning match');
  };
    
  return {
      beginMatch
  };
})();

document.querySelector('#submitNames')
  .addEventListener('click', (e) => {
    gameCoord.beginMatch();
});
