
import fetch from 'node-fetch';

function veranstaltungenAnzeigen () {
  const veranstaltungenContainer = document.createElement('div');
  const main = document.getElementById('Main');
  main.innerHTML = ' ';
  if (!veranstaltungenContainer) {
    console.error('nicht gefunden');
  }
  (async function () {
    let vers = null;
    const listanzeigerDiv = document.createElement('div');

    try {
      const response = await fetch('/getveranstaltung');
      const veranstaltungen = await response.json();
      vers = veranstaltungen;
    } catch (error) {
      console.error('Error fetching', error);
      throw error;
    }

    veranstaltungenPrint(vers, listanzeigerDiv);
    main.appendChild(listanzeigerDiv);
    window.addEventListener('resize', function () {
      veranstaltungenPrint(vers, listanzeigerDiv);
    });
  })();
}

let aktuellSeiteGL = 1;
function veranstaltungenPrint (veranstaltungen, myDiv) {
  const block = document.createElement('li');
  block.innerHTML = '<li><a>veranstaltung: testttttt, </a><a>Datum 14.12.2222 14:55</li>';

  myDiv.appendChild(block);

  block.remove();
  myDiv.innerHTML = '';

  const wHeight = window.innerHeight - 230;
  const mylist = document.createElement('ul');
  mylist.setAttribute('id', 'listanzeiger');
  const lMsg = document.createElement('a');
  lMsg.innerHTML = '<h2 id = "Text1"> Alle Veranstaltungen:<h2> ';
  mylist.appendChild(lMsg);
  myDiv.appendChild(mylist);
  // creating pagination arrows
  const larrow = document.createElement('span');
  larrow.innerText = '\u2190';
  larrow.setAttribute('id', 'paginationarrow');
  const rarrow = document.createElement('span');
  rarrow.setAttribute('id', 'paginationarrow');
  rarrow.innerText = '\u2192';
  // finding the number of pagenation pages
  let anzitemproSeite = parseInt(wHeight / 20);
  if (anzitemproSeite <= 0) { anzitemproSeite = 1; }
  let anzpages = 0;
  if (parseInt(veranstaltungen.length / anzitemproSeite) <= 0) { anzpages = 1; } else { anzpages = parseInt(veranstaltungen.length / anzitemproSeite); }
  if (anzpages <= 0) { anzpages = veranstaltungen.length; }
  if (isNaN(anzpages)) { anzpages = veranstaltungen.length; }
  if (anzpages * wHeight / 19 < veranstaltungen.length) { anzpages++; }
  if (anzpages > veranstaltungen.length) { anzpages = veranstaltungen.length; }
  if (aktuellSeiteGL > anzpages) { aktuellSeiteGL = anzpages; }
  console.log(anzitemproSeite);
  if (aktuellSeiteGL !== 1) { printgl(aktuellSeiteGL, veranstaltungen, mylist, anzitemproSeite); } else {
    aktuellSeiteGL = 1;
    printgl(aktuellSeiteGL, veranstaltungen, mylist, anzitemproSeite);
  }
  rarrow.addEventListener('click', function () {
    if (!(aktuellSeiteGL === anzpages)) {
      aktuellSeiteGL++;
      mylist.innerHTML = '';
      const glMsg = document.createElement('a');
      glMsg.innerText = 'GästeList';
      paginationPage.innerText = aktuellSeiteGL + '/ ' + anzpages;
      mylist.appendChild(glMsg);
      printgl(aktuellSeiteGL, veranstaltungen, mylist, anzitemproSeite);
    }
  });
  larrow.addEventListener('click', function () {
    if (aktuellSeiteGL !== 1) {
      aktuellSeiteGL--;
      mylist.innerHTML = '';
      const glMsg = document.createElement('a');
      glMsg.innerText = 'GästeList';
      paginationPage.innerText = aktuellSeiteGL + '/ ' + anzpages;
      mylist.appendChild(glMsg);
      printgl(aktuellSeiteGL, veranstaltungen, mylist, anzitemproSeite);
    }
  });
  const paginationPage = document.createElement('a');
  paginationPage.innerText = aktuellSeiteGL + '/ ' + anzpages;
  paginationPage.setAttribute('id', 'paginationPage');
  const paginationInfoDiv = document.createElement('div');
  paginationInfoDiv.setAttribute('id', 'paginationDiv');
  paginationInfoDiv.appendChild(larrow);
  paginationInfoDiv.appendChild(paginationPage);
  paginationInfoDiv.appendChild(rarrow);
  myDiv.appendChild(paginationInfoDiv);
}

function printgl (pageNr, gl, mylist, anzitemproSeite) {
  console.log('gl :', gl);
  for (let n = (pageNr - 1) * anzitemproSeite; n < gl.length && n < pageNr * anzitemproSeite; n++) {
    console.log(n);
    const v = gl[n];

    const obj = document.createElement('li');
    const vname = v.veranstaltung;
    const vDatum = v.datum;
    const objname = document.createElement('a');
    objname.innerText = 'veranstaltung: ' + vname + ', Datum: ' + vDatum + '.';
    obj.appendChild(objname);

    mylist.appendChild(obj);
  }
}

export default veranstaltungenAnzeigen;
