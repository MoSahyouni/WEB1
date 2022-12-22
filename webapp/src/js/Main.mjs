import VerAnlegen from './VerAnlegen.mjs';
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
main.appendChild(btn2);
main.appendChild(btn);
