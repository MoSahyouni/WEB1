
function VerAnlegen () {
  console.log('Vera');
  document.getElementById('Main').innerHTML = `
<ul id="list">
    <li>Veranstaltung: <br><input id="vernin", type="text"></li>
    <li>Raum Nr.: <br><input id="raumnr", type="text"></li>
    <br>
    <button id="btnJSON" >Veranstaltung erstellen</button>
  </ul>
  <p id="userdata"></p>`;
  const verNameInput = document.getElementById('vernin');
  const raumNr = document.getElementById('raumnr');
  const jsonButton = document.getElementById('btnJSON');
  /* const nname = document.getElementById('nname');
  const pass = document.getElementById('passw'); */
  const userdatatext = document.getElementById('userdata');
  jsonButton.addEventListener('click', function () {
    const user = {
      Veranstaltung: verNameInput.value,
      RaumNr: raumNr.value
    };
    userdatatext.innerHTML = JSON.stringify(user);
  });
}
export default VerAnlegen;
