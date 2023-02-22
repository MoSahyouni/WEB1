function GaestePlatzZuordnen () {
  let ver = null;
  let spId = null;
  const main = document.getElementById('Main');
  main.setAttribute('class', 'mainzuoednen');
  main.innerHTML = `
  <div id="mainInZuordnen">
  <div id = "firstDivZuord">
  <ul id="list">
    <h2 id= "Text_zuordnen" >Geben Sie den Namen der zu verarbeitenden Veranstaltung ein:</h2>
    <li>name: <br><input id="vername", type="text" >
    
    </ul>
    <input type="submit", id="btnJSON", value="Veranstaltung bearbeiten" >
  </ul>
  <p id="userdata"></p>
  </div></div>`;
  const verName = document.getElementById('vername');
  verName.setAttribute('id', 'vernameZordnen');
  const jsonButton = document.getElementById('btnJSON');
  jsonButton.setAttribute('id', 'btnJSON_Zuordnen');

  jsonButton.addEventListener('click', function () {
    let requiredFields = true;
    if (verName.value === '') { requiredFields = false; }
    if (requiredFields === false) { window.alert('bitte alle Felder ausfüllen!'); } else {
      let vers = [];
      let VerExistieret = false;
      let rTische = 0;
      let sitzeProTisch = 0;
      let bestuhlung = null;
      let plgastordnerlist = null;

      (async function () {
        try {
          const response = await window.fetch('/getveranstaltung');
          const result = await response.json();
          vers = result;
          let platzlist = null;
          for (let i = 0; i < vers.length; i++) {
            if (verName.value === vers[i].name) {
              VerExistieret = true;
              ver = vers[i];
              break;
            }
          }
          if (!VerExistieret) {
            window.alert('Es existiert keine Veranstaltung mit den gegebenen Namen');
          } else {
            const SpsReq = await window.fetch('/sitzplaene');
            const sps = await SpsReq.json();
            const spList = sps.Sitzpläne;
            spList.map(element => (async function () {
              if (element.veranstaltungsname === ver.name) {
                const ef = await window.fetch(element.href);
                const e = await ef.json();

                spId = JSON.stringify(e.Sitzplan._id).substring(1, JSON.stringify(e.Sitzplan._id).length - 1);
              }
            })());
            const gl = ver.gaestelist;

            const veranstalungName = ver.name;
            rTische = ver.Sitzplan.recheckigenTische;
            sitzeProTisch = ver.Sitzplan.sitzeprotisch;
            bestuhlung = ver.Sitzplan.Bestuhlung;
            platzlist = new Array(rTische * sitzeProTisch);
            plgastordnerlist = new Array(rTische * sitzeProTisch);
            const bishierigeZuord = ver.Sitzplan.gästezuordnung;
            if (bishierigeZuord != null) {
              for (let n = 0; n < bishierigeZuord.length; n++) {
                const plObj = bishierigeZuord[n];
                if (plObj === null) { continue; }
                for (let x = 0; x < gl.length; x++) {
                  const element = gl[x];
                  if (element.name === plObj.name) {
                    plgastordnerlist[n] = x + 1;
                  }
                }
              }
            }
            main.innerHTML = `<div id="gaestelistanzeiger"></div>
              <div id="sitzplananzeiger"></div>
              <div id="zuordnendiv"></div>`;
            const glanzeiger = document.getElementById('gaestelistanzeiger');
            const zuordnendiv = document.getElementById('zuordnendiv');

            gaestelistPrint(gl, glanzeiger);
            plgastordnerlistPrint(rTische, sitzeProTisch, bestuhlung, verName.value);
            zuordnenFun(platzlist, zuordnendiv, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, gl, veranstalungName);

            window.addEventListener('resize', function () {
              gaestelistPrint(gl, glanzeiger);
              plgastordnerlistPrint(rTische, sitzeProTisch, bestuhlung, verName.value);
              zuordnenFun(platzlist, zuordnendiv, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, gl, veranstalungName);
            });
          }
        } catch (error) {
          console.error(error.message);
        }
      })();
    }
  });
  let aktuellSeiteGL = 1;
  function gaestelistPrint (gl, myDiv) {
    if (gl === null || gl === undefined) {
      window.alert('Diese veranstaltung hat Keine Gästeliste');
      GaestePlatzZuordnen();
    } else {
      const block = document.createElement('li');
      block.innerHTML = '<li><a>Gast Nr.8: name: 8, </a><a>kind: Ja, </a><a>status: unbekannt</a></li>';
      myDiv.appendChild(block); let blockHeight = block.clientHeight + 12;
      block.remove();
      myDiv.innerHTML = '';

      let wHeight = window.innerHeight - 260;
      if (wHeight > 500) {
        wHeight = 500;
      }
      blockHeight = 2144 / window.innerWidth * blockHeight;
      const mylist = document.createElement('ul');
      mylist.setAttribute('id', 'listanzeiger');
      const glMsg = document.createElement('a');
      glMsg.innerText = 'GästeList';
      mylist.appendChild(glMsg);
      myDiv.appendChild(mylist);

      const larrow = document.createElement('span');
      larrow.innerText = '\u2190';
      larrow.setAttribute('id', 'paginationarrow');
      const rarrow = document.createElement('span');
      rarrow.setAttribute('id', 'paginationarrow');
      rarrow.innerText = '\u2192';
      let anzitemproSeite = parseInt(wHeight / parseInt(blockHeight));
      if (anzitemproSeite <= 0) { anzitemproSeite = 1; }
      let anzpages = 0;
      if (parseInt(gl.length / anzitemproSeite) <= 0) { anzpages = 1; } else { anzpages = parseInt(gl.length / anzitemproSeite); }
      if (anzpages <= 0) { anzpages = gl.length; }
      if (isNaN(anzpages)) { anzpages = gl.length; }
      if (anzpages * anzitemproSeite < gl.length) { anzpages++; }
      if (anzpages > gl.length) { anzpages = gl.length; }
      if (aktuellSeiteGL > anzpages) { aktuellSeiteGL = anzpages; }
      if (aktuellSeiteGL !== 1) { printgl(aktuellSeiteGL, gl, mylist, anzitemproSeite); } else {
        aktuellSeiteGL = 1;
        printgl(aktuellSeiteGL, gl, mylist, anzitemproSeite);
      }
      rarrow.addEventListener('click', function () {
        if (!(aktuellSeiteGL === anzpages)) {
          aktuellSeiteGL++;
          mylist.innerHTML = '';
          const glMsg = document.createElement('a');
          glMsg.innerText = 'GästeList';
          paginationPage.innerText = aktuellSeiteGL + '/ ' + anzpages;
          mylist.appendChild(glMsg);
          printgl(aktuellSeiteGL, gl, mylist, anzitemproSeite);
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
          printgl(aktuellSeiteGL, gl, mylist, anzitemproSeite);
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
  }

  function printgl (pageNr, gl, mylist, anzitemproSeite) {
    for (let n = (pageNr - 1) * anzitemproSeite; n < gl.length && n < pageNr * anzitemproSeite; n++) {
      const g = gl[n];

      const obj = document.createElement('li');
      const gname = g.name;
      const gkind = g.kind;
      const gstatus = g.status;
      const objname = document.createElement('a');
      objname.innerText = 'Gast Nr.' + (n + 1) + ': name: ' + gname + ', ';
      const objkind = document.createElement('a');
      objkind.innerText = 'kind: ' + gkind + ', ';
      const objstatus = document.createElement('a');
      objstatus.innerText = 'status: ' + gstatus;
      obj.appendChild(objname);
      obj.appendChild(objkind);
      obj.appendChild(objstatus);
      mylist.appendChild(obj);
    }
  }
  function plgastordnerlistPrint (rTische, sitzeProTisch, bestuhlung, vername) {
    const header = document.getElementById('bodyheader');
    header.setAttribute('class', 'zuordnenHeader');
    header.innerHTML = '<h5 id="back">zurück zur Hauptseite</h5><h2></h2>' + '<h4 id="infoMsgheader">  Für diese Veranstaltung ' + vername + ' gibt es ' + rTische +
    ' Tische und ' + sitzeProTisch + ' Sitzplätze pro Tisch. Tische haben ' + bestuhlung + ' bestuhlung.';
    const btnBack = document.getElementById('back');
    btnBack.addEventListener('click', () => {
      window.location.reload();
    });
  }
  let aktuellSeitePL = 1;
  function zuordnenFun (pl, myDiv, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, gastelist, veranstalungName) {
    const block = document.createElement('li');
    block.innerHTML = 'platz Nr.n: sitzt die Gast Nr.:<input><button>speicher Platz</button>';

    myDiv.appendChild(block); let blockHeight = block.clientHeight;
    myDiv.innerHTML = '';
    let wHeight = window.innerHeight - 260;
    if (wHeight > 500) {
      wHeight = 500;
    }
    blockHeight = 2144 / window.innerWidth * blockHeight;
    const mylist = document.createElement('ul');
    mylist.setAttribute('id', 'PLanzeiger');
    const plMsg = document.createElement('a');
    plMsg.innerText = 'Bitte geben Sie der Nummer des Gasts ein : ';
    mylist.appendChild(plMsg);
    myDiv.appendChild(mylist);
    const larrow = document.createElement('span');
    larrow.innerText = '\u2190';
    larrow.setAttribute('id', 'paginationarrow');
    const rarrow = document.createElement('span');

    rarrow.setAttribute('id', 'paginationarrow');
    rarrow.innerText = '\u2192';
    let anzitemproSeite = parseInt(wHeight / blockHeight);
    if (anzitemproSeite <= 0) { anzitemproSeite = 1; }
    let anzpages = 0;
    if (parseInt(pl.length / anzitemproSeite) <= 0) { anzpages = 1; } else { anzpages = parseInt(pl.length / anzitemproSeite); }
    if (anzpages <= 0) { anzpages = pl.length; }
    if (isNaN(anzpages)) { anzpages = pl.length; }
    if (anzpages * wHeight / blockHeight < pl.length) { anzpages++; }
    if (aktuellSeitePL > anzpages) { aktuellSeitePL = anzpages; }
    if (aktuellSeitePL !== 1) { PlatzeInputs(aktuellSeitePL, pl, mylist, anzitemproSeite, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, gastelist, veranstalungName); } else {
      aktuellSeitePL = 1;
      PlatzeInputs(aktuellSeitePL, pl, mylist, anzitemproSeite, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, gastelist, veranstalungName);
    }
    rarrow.addEventListener('click', function () {
      if (!(aktuellSeitePL === anzpages)) {
        aktuellSeitePL++;
        mylist.innerHTML = '';
        const plMsg = document.createElement('a');
        plMsg.innerText = 'Bitte geben Sie die Nummer des Gasts ein : ';
        paginationPage.innerText = aktuellSeitePL + '/ ' + anzpages;
        mylist.appendChild(plMsg);
        PlatzeInputs(aktuellSeitePL, pl, mylist, anzitemproSeite, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, gastelist, veranstalungName);
      }
    });
    larrow.addEventListener('click', function () {
      if (aktuellSeitePL !== 1) {
        aktuellSeitePL--;
        mylist.innerHTML = '';
        const plMsg = document.createElement('a');
        plMsg.innerText = 'Bitte geben Sie die Nummer des Gasts ein : ';
        paginationPage.innerText = aktuellSeitePL + '/ ' + anzpages;
        mylist.appendChild(plMsg);
        PlatzeInputs(aktuellSeitePL, pl, mylist, anzitemproSeite, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, gastelist, veranstalungName);
      }
    });
    const paginationPage = document.createElement('a');
    paginationPage.innerText = aktuellSeitePL + '/ ' + anzpages;
    paginationPage.setAttribute('id', 'paginationPage');
    const paginationInfoDiv = document.createElement('div');
    paginationInfoDiv.setAttribute('id', 'paginationDiv');
    paginationInfoDiv.appendChild(larrow);
    paginationInfoDiv.appendChild(paginationPage);
    paginationInfoDiv.appendChild(rarrow);
    myDiv.appendChild(paginationInfoDiv);
  }
  function PlatzeInputs (pageNr, pl, mylist, anzitemproSeite, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, gaestelist, veranstalungName) {
    let aktTisch = 1;
    let aktPlatz = 1;
    for (let n = (pageNr - 1) * anzitemproSeite; n < pl.length && n < pageNr * anzitemproSeite; n++) {
      const obj = document.createElement('li');
      const objinput = document.createElement('input');
      objinput.setAttribute('id', 'plgsinput' + n);
      if (plgastordnerlist[n] != null) {
        aktTisch = parseInt(n / sitzeProTisch) + 1;
        let aktPlatz = parseInt((n + 1) - (aktTisch * sitzeProTisch));
        if (aktPlatz <= 0) { aktPlatz += parseInt(sitzeProTisch); }
        const objtext = document.createElement('a');
        objtext.innerText = 'Tisch Nr. ' + aktTisch + ', platz Nr. ' + aktPlatz + ' besitzt von Gast Nr. ' + plgastordnerlist[n];
        obj.setAttribute('id', 'p' + n);
        const gastloschen = document.createElement('button');
        gastloschen.innerText = 'Gast löschen';
        gastloschen.setAttribute('id', 'platzptnloschen');

        obj.appendChild(gastloschen);
        obj.appendChild(objtext);
        gastloschen.addEventListener('click', function () {
          plgastordnerlist[n] = null;
          mylist.innerHTML = '';
          PlatzeInputs(pageNr, pl, mylist, anzitemproSeite, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, gaestelist, veranstalungName);
        });
      } else {
        aktTisch = parseInt(n / sitzeProTisch) + 1;
        aktPlatz = (n + 1) - (aktTisch * sitzeProTisch);
        if (aktPlatz <= 0) { aktPlatz += parseInt(sitzeProTisch); }
        obj.innerText = 'Tisch Nr. ' + aktTisch + ', platz Nr. ' + aktPlatz + ': den Gast Nr. setzen:';
        obj.setAttribute('id', 'p' + n);
        const platzbtn = document.createElement('button');
        platzbtn.innerText = 'speicher Platz';
        platzbtn.setAttribute('id', 'platzptn');
        platzbtn.addEventListener('click', function () {
          const val = document.getElementById('plgsinput' + n);
          if (isNaN(val.value)) { window.alert('bitte  tragen Sie die Nummer des Gastes ein.'); } else {
            if (parseInt(val.value) > gaestelist.length) {
              window.alert('Nummer ist zu Groß.');
            } else {
              plgastordnerlist[n] = val.value;
              mylist.innerHTML = '';
              PlatzeInputs(pageNr, pl, mylist, anzitemproSeite, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, gaestelist, veranstalungName);
            }
          }
        });
        obj.appendChild(objinput);
        obj.appendChild(platzbtn);
      }

      mylist.appendChild(obj);
      const saveBtn = document.createElement('button');
      saveBtn.setAttribute('id', 'SitzplaetzeZuordnungBTN');
    }
    const SaveZuordnungBTN = document.createElement('button');
    SaveZuordnungBTN.innerText = 'Zuordnung Speichern';
    SaveZuordnungBTN.setAttribute('id', 'zuordSpeichern');
    SaveZuordnungBTN.addEventListener('click', async function () {
      await fechtGastPlaetzeZuordnung(gaestelist, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, veranstalungName);
    });
    mylist.appendChild(SaveZuordnungBTN);
  }

  async function fechtGastPlaetzeZuordnung (gastelist, plaetzeZuordnung, reTische, platzproTisch, bestuhlung, veranstalungName) {
    const tofetchlist = [];
    for (let i = 0; i < plaetzeZuordnung.length; i++) {
      tofetchlist[i] = gastelist[plaetzeZuordnung[i] - 1];
    }
    const sitzplan = { recheckigenTische: reTische, sitzeprotisch: platzproTisch, Bestuhlung: bestuhlung, gästezuordnung: tofetchlist };

    await window.fetch(`/sitzplaene/${spId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ veranstaltungsname: veranstalungName, Sitzplan: sitzplan })
    }).then(response => {
      if (response) { return response.json(); }
    }).catch(error => {
      console.log(error);
    });
  }
}

export default GaestePlatzZuordnen;
