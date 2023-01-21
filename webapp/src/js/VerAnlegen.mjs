import fetch from 'node-fetch';
function VerAnlegen () {
  document.getElementById('Main').innerHTML = `
  <ul id="list">
    <h2>Varanstaltung</h2>
    <li>name: <br><input id="vernname", type="text" ></li>
    <br>
    <li>Datum und Uhrzeit: <br><input type="datetime-local", name="meeting-time", id="verZeit">
    <br>
    <li>Sitzplan: <br><input id="verSitzplan", type="text" ></li>
    <input type="submit", id="btnJSON", value="Gästeliste für diese Veranstaltung erstellen" >
  </ul>
  <p id="userdata"></p>`;

  const verNameInput = document.getElementById('vernname');
  const verTime = document.getElementById('verZeit');
  const jsonButton = document.getElementById('btnJSON');
  // Sitz Plan kann leer gelasen !!!!!!!!
  jsonButton.addEventListener('click', function () {
    let requiredFields = true;
    if (verNameInput.value === '') { requiredFields = false; }
    if (verTime.value === '') { requiredFields = false; }
    if (requiredFields === false) { window.alert('bitte alle Felder ausfühlen'); } else {
      (async function () {
        await fetch('/veranstaltungerzeugen', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: verNameInput.value, datum: verTime.value })
        }).then(response => {
          if (response) { return response.json(); }
        });
      })();
    }
  });
}

export default VerAnlegen;
