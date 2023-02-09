import VerAnlegen from './VerAnlegen.mjs';
import gaestelistAnliegen from './gastliste.mjs';
import GaestePlatzZuordnen from './SitzplanZuordnungAnliegen.mjs';
import veranstaltungenAnzeigen from './veranstaltungenAnzeigen.mjs';
import testfun from './test.mjs';

const verAn = VerAnlegen; // verAn verweist auf Funktion VerAnlagen
const header = document.getElementById('bodyheader');
header.innerHTML = `


<div id="slide">
<div class="slide active">
  <img src="../background/image1.jpg" alt="Image 1">
</div>
<div class="slide">
  <img src="../background/image2.png" alt="Image 2">
</div>
<div class="slide">
  <img src="image3.jpg" alt="Image 3">
</div>
</div>


`;

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
  // main.innerHTML = '<h4> Es gibt aktuell keine Veranstaltungen.</h4>';
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

const testb = document.createElement('button');
testb.textContent = 'window size Monitor';
testb.addEventListener('click', () => {
  ButtonBack();
  testfun();
});

main.appendChild(mainDiv);
mainDiv.appendChild(btn2);
mainDiv.appendChild(btn);

mainDiv.appendChild(gastlistErstellen);
mainDiv.appendChild(gaesteplaetzeZuordnen);
mainDiv.appendChild(testb);
/*
const slides = document.querySelectorAll('.slide');

let currentSlide = 0;

function changeSlide () {
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove('active');
  }
  slides[currentSlide].classList.add('active');
}

setInterval(function () {
  currentSlide = (currentSlide + 1) % slides.length;
  changeSlide();
}, 3000);
*/
