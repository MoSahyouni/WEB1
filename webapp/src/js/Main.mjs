import VerAnlegen from './VerAnlegen.mjs';
import gaestelistAnliegen from './gastliste.mjs';
const verAn = VerAnlegen;
const header = document.getElementById('bodyheader');
header.innerHTML = '<h2>Veranstaltungsplanner</h2>';

function ButtonBack () {
  const header = document.getElementById('bodyheader');
  header.innerHTML = '<h5 id="back">zurück</h5><h2>Veranstaltungsplanner</h2>';
  const btnBack = document.getElementById('back');
  btnBack.addEventListener('click', () => {
    window.location.reload();
  });
}
const main = document.getElementsByClassName('Main')[0];
const mainDiv = document.createElement('div');
mainDiv.setAttribute('id', 'mainSeiteDiv');
const btn = document.createElement('button');
btn.textContent = ' meine Veransaltungen';
btn.setAttribute('id', 'btn');
btn.addEventListener('click', () => {
  ButtonBack();
  main.innerHTML = '<h4> Es gibt aktuell keine Veranstaltungen.</h4>';
});
const btn2 = document.createElement('button');
btn2.textContent = 'neue Veranstaltung';
btn2.setAttribute('id', 'btn2');
btn2.addEventListener('click', () => {
  ButtonBack();
  verAn();
});
const gastlistErstellen = document.createElement('button');
gastlistErstellen.textContent = 'Gaestelist erstellen';
gastlistErstellen.setAttribute('id', 'gserstellen');
gastlistErstellen.addEventListener('click', () => {
  ButtonBack();
  gaestelistAnliegen();
});

// const br = document.createElement('br');
main.appendChild(mainDiv);
mainDiv.appendChild(btn2);
mainDiv.appendChild(btn);
// main.appendChild(br);
mainDiv.appendChild(gastlistErstellen);
