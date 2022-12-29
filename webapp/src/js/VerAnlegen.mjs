
function VerAnlegen () {
  console.log('Vera');
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
  const userdatatext = document.getElementById('userdata');
  jsonButton.addEventListener('click', function () {
    const user = {
      Veranstaltung: verNameInput.value
    };
    userdatatext.innerHTML = JSON.stringify(user);
  });
}
export default VerAnlegen;
