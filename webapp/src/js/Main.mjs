import VerAnlegen from './VerAnlegen.mjs';
import gaestelistAnliegen from './gastliste.mjs';
import GaestePlatzZuordnen from './SitzplanZuordnungAnliegen.mjs';
import veranstaltungenAnzeigen from './veranstaltungenAnzeigen.mjs';
import EinladungStatusBearbeiten from './einladungsstatus.mjs';
const verAn = VerAnlegen;
const header = document.getElementById('bodyheader');
header.innerHTML = '<h2 id = "hauptTitel">Veranstaltungsplanner</h2>';

function ButtonBack () {
  const header = document.getElementById('bodyheader');
  header.innerHTML = '<h5 id="back">zurück zur Hauptseite</h5><h2></h2>';
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
  veranstaltungenAnzeigen();
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
const gaesteplaetzeZuordnen = document.createElement('button');
gaesteplaetzeZuordnen.textContent = 'Sitzplätze zuordnen';
gaesteplaetzeZuordnen.setAttribute('id', 'Sitzplätzezuordnen');
gaesteplaetzeZuordnen.addEventListener('click', () => {
  ButtonBack();
  GaestePlatzZuordnen();
});

const einladungstatusaendern = document.createElement('button');
einladungstatusaendern.textContent = 'Einladung status bearbeiten';
einladungstatusaendern.setAttribute('id', 'einladungstatusaendern');
einladungstatusaendern.addEventListener('click', () => {
  ButtonBack();
  EinladungStatusBearbeiten();
});

main.appendChild(mainDiv);
mainDiv.appendChild(btn2);
mainDiv.appendChild(btn);

mainDiv.appendChild(gastlistErstellen);
mainDiv.appendChild(gaesteplaetzeZuordnen);
mainDiv.appendChild(einladungstatusaendern);
