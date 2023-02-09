import fetch from 'node-fetch';
function VerAnlegen () {
  document.getElementById('Main').innerHTML = `
  <ul id="list">
  
  
    <h2>Varanstaltung</h2>
    <li>name: <br><input id="vernname", type="text" ></li>
    <br>
    <li>Datum und Uhrzeit: <br><input type="datetime-local", name="meeting-time", id="verZeit">
    <br>
    <ul>
    <li>Anzahl der rechteckigen Tische: <input id="SitzplanTische", type="text" ></li>
    <li>Anzahl der Sitzplätze pro Tisch: <input id="plaetzeProTisch", type="text" ></li>
    <li>Bestuhlung aller Tische: <select name="neugasteinladung", id="bestuhlung", multiple>
                        <option>Einseitige</option>
                        <option>zweiseitige</option>
                        </select>
    
    </ul>
    <input type="submit", id="btnJSON", value="Veranstaltung erstellen" >
  </ul>
  <p id="userdata"></p>
  `;

  const verNameInput = document.getElementById('vernname');
  const verTime = document.getElementById('verZeit');
  const tische = document.getElementById('SitzplanTische');
  const plaetzeproTisch = document.getElementById('plaetzeProTisch');
  const bestuhlung = document.getElementById('bestuhlung');
  const jsonButton = document.getElementById('btnJSON');
  // Sitz Plan kann leer gelasen !!!!!!!!
  jsonButton.addEventListener('click', function () {
    let requiredFields = true;
    if (verNameInput.value === '') { requiredFields = false; }
    if (verTime.value === '') { requiredFields = false; }
    if (tische.value === '') { requiredFields = false; }
    if (plaetzeproTisch.value === '') { requiredFields = false; }
    if (bestuhlung.value === '') { requiredFields = false; }
    if (requiredFields === false) { window.alert('bitte alle Felder ausfüllen'); } else {
      let vers = [];
      let altename = false;

      (async function () {
        try {
          const response = await
          fetch('/getveranstaltung');
          const result = await response.json();
          vers = result;
          for (let i = 0; i < vers.length; i++) {
            if (verNameInput.value === vers[i].veranstaltung) {
              altename = true;
              window.alert('Veranstaltungsname existiert schon, bitte name ändern.');

              break;
            }
          }
          if (!altename) {
            (async function () {
              await fetch('/veranstaltungerzeugen', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  name: verNameInput.value,
                  datum: verTime.value,
                  sitzplan: { recheckigenTische: tische.value, sitzeprotisch: plaetzeproTisch.value, Bestuhlung: bestuhlung.value }
                })
              }).then(response => {
                if (response) { return response.json(); }
              });
            })();
            window.alert('Veranstaltung erstellt');
          }
        } catch (error) {
          console.log('Er....');
          console.error(error.message);
        }
      })();
    }
  });
}

export default VerAnlegen;
