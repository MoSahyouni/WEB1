
import fetch from 'node-fetch';

function veranstaltungenAnzeigen () {
  const veranstaltungenContainer = document.createElement('div');
  const main = document.getElementById('Main');
  main.innerHTML = '';
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
  // const blockHeight = block.clientHeight;
  block.remove();
  myDiv.innerHTML = '';
  // pagination aktuelle Seite
  // let aktuellSeite = 1;
  const wHeight = window.innerHeight - 230;
  const mylist = document.createElement('ul');
  mylist.setAttribute('id', 'listanzeiger');
  const lMsg = document.createElement('a');
  lMsg.innerText = 'alle Veranstaltungen';
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
  myDiv.appendChild(larrow);
  myDiv.appendChild(paginationPage);
  myDiv.appendChild(rarrow);
}

function printgl (pageNr, gl, mylist, anzitemproSeite) {
  console.log('gl :', gl);
  for (let n = (pageNr - 1) * anzitemproSeite; n < gl.length && n < pageNr * anzitemproSeite; n++) {
    // const listanzeigerChildren = listanzeiger.children.length;
    console.log(n);
    const v = gl[n];
    // if (n >= 1 && g.name === gl[n - 1].name && g.kind === gl[n - 1].kind) {
    //  gl.splice(n, 1); n--;
    // } else {
    const obj = document.createElement('li');
    const vname = v.veranstaltung;
    const vDatum = v.datum;
    const objname = document.createElement('a');
    objname.innerText = 'veranstaltung: ' + vname + ', Datum: ' + vDatum + '.';
    obj.appendChild(objname);
    // obj.appendChild(br);
    mylist.appendChild(obj);
  }
}

/* const AnzahlElementeProSeite = 5;

 function Anzeigeseite (Elemente, SeitenNr) {
  const startIndex = (SeitenNr - 1) * AnzahlElementeProSeite;
  const endIndex = startIndex + AnzahlElementeProSeite;
  const aktuelleSeitenElemente = Elemente.slice(startIndex, endIndex);

  const veranstaltungenContainer = document.createElement('div');
  const header = document.getElementById('Main');
  header.innerHTML = '';

  for (const Element of aktuelleSeitenElemente) {
    const veranstaltungElement = document.createElement('div');
    veranstaltungElement.innerHTML = '<h3>' + Element.veranstaltung + '</h3>' + Element.datum + '</p>';
    veranstaltungenContainer.appendChild(veranstaltungElement);
  }

  const paginationContainer = document.createElement('div');
  const Seitenzahl = Math.ceil(Elemente.length / AnzahlElementeProSeite);

  const previousButton = document.createElement('button');
  previousButton.innerHTML = '&larr;';
  if (SeitenNr === 1) {
    previousButton.disabled = true;
  }
  previousButton.addEventListener('click', () => {
    Anzeigeseite(Elemente, SeitenNr - 1);
  });
  paginationContainer.appendChild(previousButton);

  const nextButton = document.createElement('button');
  nextButton.innerHTML = '&rarr;';
  if (SeitenNr === Seitenzahl) {
    nextButton.disabled = true;
  }
  nextButton.addEventListener('click', () => {
    Anzeigeseite(Elemente, SeitenNr + 1);
  });
  paginationContainer.appendChild(nextButton);

  header.appendChild(veranstaltungenContainer);
  header.appendChild(paginationContainer);
} */

export default veranstaltungenAnzeigen;
