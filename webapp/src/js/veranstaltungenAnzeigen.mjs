function veranstaltungenAnzeigen () {
  const veranstaltungenContainer = document.createElement('div');
  veranstaltungenContainer.setAttribute('id', 'alleVeranstaltungen');
  const main = document.getElementById('Main');
  main.setAttribute('class', 'alleVerMain');
  main.innerHTML = ' ';
  if (!veranstaltungenContainer) {
    console.error('nicht gefunden');
  }
  (async function () {
    let vers = null;
    const listanzeigerDiv = document.createElement('div');
    listanzeigerDiv.setAttribute('id', 'listanzeigerDiv');
    const loschenDiv = document.createElement('div');
    loschenDiv.setAttribute('id', 'loschenDiv');

    try {
      const response = await window.fetch('/getveranstaltung');
      const veranstaltungen = await response.json();
      vers = veranstaltungen;
    } catch (error) {
      console.error('Error fetching', error);
      throw error;
    }

    veranstaltungenPrint(vers, listanzeigerDiv);
    veranstaltunglöschenUndLoschenBtn(vers, loschenDiv);
    main.appendChild(listanzeigerDiv);
    main.appendChild(loschenDiv);
    window.addEventListener('resize', function () {
      veranstaltungenPrint(vers, listanzeigerDiv);
      veranstaltunglöschenUndLoschenBtn(vers, loschenDiv);
    });
  })();
}
let verId = null;
let aktuellSeiteGL = 1;
function veranstaltungenPrint (veranstaltungen, myDiv) {
  const block = document.createElement('li');
  block.innerHTML = '<a>veranstaltung: testttttt, </a><a>Datum 14.12.2222 14:55';

  myDiv.appendChild(block);
  block.remove();
  myDiv.innerHTML = '';

  let wHeight = window.innerHeight - 260;
  if (wHeight > 500) {
    wHeight = 500;
  }
  const mylist = document.createElement('ul');
  mylist.setAttribute('id', 'listanzeiger');
  const lMsg = document.createElement('a');
  lMsg.innerHTML = '<h2 id = "Text1"> Alle Veranstaltungen:<h2> ';
  mylist.appendChild(lMsg);
  myDiv.appendChild(mylist);

  const larrow = document.createElement('span');
  larrow.innerText = '\u2190';
  larrow.setAttribute('id', 'paginationarrow');
  const rarrow = document.createElement('span');
  rarrow.setAttribute('id', 'paginationarrow');
  rarrow.innerText = '\u2192';

  let anzitemproSeite = parseInt(wHeight / 25);
  if (window.innerWidth <= 750) { anzitemproSeite = parseInt(anzitemproSeite / 2); }
  if (anzitemproSeite <= 0) { anzitemproSeite = 1; }
  let anzpages = 0;
  if (parseInt(veranstaltungen.length / anzitemproSeite) <= 0) { anzpages = 1; } else { anzpages = parseInt(veranstaltungen.length / anzitemproSeite); }
  if (anzpages <= 0) { anzpages = veranstaltungen.length; }
  if (isNaN(anzpages)) { anzpages = veranstaltungen.length; }
  if (anzpages * anzitemproSeite < veranstaltungen.length) { anzpages++; }
  if (anzpages > veranstaltungen.length) { anzpages = veranstaltungen.length; }
  if (aktuellSeiteGL > anzpages) { aktuellSeiteGL = anzpages; }
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

function printgl (pageNr, vl, mylist, anzitemproSeite) {
  for (let n = (pageNr - 1) * anzitemproSeite; n < vl.length && n < pageNr * anzitemproSeite; n++) {
    const v = vl[n];

    const obj = document.createElement('li');
    const vname = v.name;
    const vDatum = v.datum;

    const objname = document.createElement('a');
    objname.innerText = 'Veranstaltung: ' + vname + ', Am: ' + vDatum;
    obj.appendChild(objname);
    mylist.appendChild(obj);
  }
}

function veranstaltunglöschenUndLoschenBtn (verlist, htmlspace) {
  htmlspace.innerHTML = '';
  htmlspace.setAttribute('id', 'divVL');
  const msg = document.createElement('a');
  msg.setAttribute('id', 'loschenvMsgVL');
  msg.innerText = ' Veranstaltung löschen: ';
  const verName = document.createElement('input');
  verName.setAttribute('id', 'loschenInputVA');
  htmlspace.appendChild(msg);
  htmlspace.appendChild(verName);
  const loschenBtn = document.createElement('button');
  loschenBtn.innerText = 'loeschen';
  loschenBtn.setAttribute('id', 'verLoschenVA');
  htmlspace.appendChild(loschenBtn);
  loschenBtn.addEventListener('click', async function () {
    const vername = verName.value;
    for (let i = 0; i < verlist.length; i++) {
      const elem = verlist[i];
      if (elem.name === vername) {
        verId = JSON.stringify(elem._id).substring(1, JSON.stringify(elem._id).length - 1);
      }
    }
    if (verId === null) { window.alert('Name nicht richtig'); } else {
      await (async function () {
        await window.fetch(`/veranstaltungen/${verId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: vername })
        }).then(response => {
          if (response) { return response.json(); }
        }).catch(error => {
          console.log(error);
        });
      })();
      veranstaltungenAnzeigen();
    }
  });
}

export default veranstaltungenAnzeigen;
