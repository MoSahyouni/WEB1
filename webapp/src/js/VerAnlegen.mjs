import fetch from 'node-fetch';
function VerAnlegen () {
  document.getElementById('Main').innerHTML = `
  <ul id="list">
    <h2>Varanstaltung</h2>
    <li>name: <br><input id="vernname", type="text"></li>
    <br>
    <button id="btnJSON" >Veranstaltung erstellen</button>
  </ul>
  <p id="userdata"></p>`;
  const verNameInput = document.getElementById('vernname');
  const jsonButton = document.getElementById('btnJSON');
  // const userdatatext = document.getElementById('userdata');
  jsonButton.addEventListener('click', function () {
    (async function () {
      fetch('/veranstaltungerzeugen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vername: verNameInput.value })
      }).then(response => {
        if (response) { return response.json(); }
      });
    })();
  });
}
export default VerAnlegen;
