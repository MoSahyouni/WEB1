function gaestelistAnliegen () {
  const Main = document.getElementById('Main');
  Main.setAttribute('class', 'Maingastelisterstellen');
  Main.innerHTML = `
    <div id="listanzeiger1"></div>
    <div id="mainDiv">
    <h3 id = "titel1">Gästeliste: </h3>
    <ul>
    <li>Veranstaltungsname: <br><input id="vaeranstaltungsname", type="text" ></li>
    <li>Name des Gasts: <br><input id="gastname", type="text"  ></li>
    <li>Kind: <br><select name="gastkind" id="gastkind"  multiple>
                    <option>Ja</option>
                    <option>Nein</option>
                  </select>
    </li>
    <li>Einladungsstatus: <br><select name="gasteinladung", id="gasteinladung", multiple>
                    <option>unbekannt</option>
                    <option>eingeladen</option>
                    <option>zugesagt</option>
                    <option>abgesagt</option>
                    </select>
    </li>
    <button id="gastbtn" >Gast hinzufügen</button>
    <br> </ul></div>`;
  Main.setAttribute('align-items', 'inherit');
  const vaeranstaltungsname = document.getElementById('vaeranstaltungsname');
  const gastname = document.getElementById('gastname');
  const gastkind = document.getElementById('gastkind');
  const gaststatus = document.getElementById('gasteinladung');
  const gastBtn = document.getElementById('gastbtn');

  const listanzeiger1 = document.getElementById('listanzeiger1');

  let GaesteList = [];
  function buttonundeventlistenerSpeicherBTN () {
    const gastlisbtn = document.createElement('button');
    gastlisbtn.setAttribute('id', 'gaesterstellen');
    gastlisbtn.innerText = 'Gästeliste erstellen';
    listanzeiger1.appendChild(gastlisbtn);
    gastlisbtn.addEventListener('click', function (event) {
      event.preventDefault();

      let erg = false;
      (async function () {
        const response = await window.fetch('/getveranstaltung');
        const result = await response.json();
        const vers = result;
        let veri = null;
        for (let i = 0; i < vers.length; i++) {
          if (vaeranstaltungsname.value === vers[i].name) {
            erg = true;
            veri = vers[i];
          }
        }

        if (!erg) {
          window.alert('Es existiert keine Veranstaltung mit den gegebenen Namen');
          console.log(vaeranstaltungsname.value);
        } else {
          if (veri.gaestelist != null) { window.alert('Es existiert eine Gästeliste für diese Veranstaltung'); } else {
            (async function () {
              window.fetch('/gaestelisten', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ vname: vaeranstaltungsname.value, Gästelist: GaesteList })
              }).then(response => {
                if (response) { return response.json(); }
              }).catch(error => {
                console.log(error);
              });
            })();
          }
        }
      })();
    });
  }

  let gasteAnzahl = 0;
  gastBtn.addEventListener('click', function () {
    let requiredFields = true;
    if (gastname.value === '') { requiredFields = false; }
    if (vaeranstaltungsname.value === '') { requiredFields = false; }
    if (gastkind.value === '') { requiredFields = false; }
    if (gaststatus.value === '') { requiredFields = false; }
    if (requiredFields === false) { window.alert('Bitte alle Felder ausfüllen'); } else {
      const gast = { name: gastname.value, kind: gastkind.value, status: gaststatus.value };
      GaesteList.push(gast);

      gaestelistPrint(GaesteList, listanzeiger1);
    }

    if (gasteAnzahl === 0 && GaesteList.length !== 0) {
      gasteAnzahl++;
    }

    if (gasteAnzahl === 1) { gastbearbeiten(); gasteAnzahl++; }
  });
  function gastbearbeiten () {
    const gbearbeitendiv = document.createElement('div');
    gbearbeitendiv.setAttribute('id', 'gbearbeitendiv');
    const gbearbeitenMsg = document.createElement('h4');
    gbearbeitenMsg.innerText = 'Gast NR:';
    const gastNrinput = document.createElement('input');
    gastNrinput.setAttribute('id', 'inputbearbeitundloeschen');
    const gastbearbeitenbutton = document.createElement('button');
    gastbearbeitenbutton.innerText = 'Bearbeiten';
    gastbearbeitenbutton.setAttribute('id', 'gastbearbeitenbutton');
    const gastloeschenbutton = document.createElement('button');
    gastloeschenbutton.innerText = 'Löschen';
    gastloeschenbutton.setAttribute('id', 'gastloeschenbutton');
    gbearbeitendiv.appendChild(gbearbeitenMsg);
    gbearbeitendiv.appendChild(gastNrinput);
    gbearbeitendiv.appendChild(document.createElement('br'));
    gbearbeitendiv.appendChild(gastbearbeitenbutton);
    gbearbeitendiv.appendChild(gastloeschenbutton);
    Main.appendChild(gbearbeitendiv);
    gastbearbeitenbutton.addEventListener('click', function () {
      if (gastNrinput.value === '' || isNaN(gastNrinput.value) || gastNrinput.value > GaesteList.length) { window.alert('bitte GastNr. eingeben.'); } else {
        const gastnr = gastNrinput.value;
        gbearbeitenMsg.remove();
        gastNrinput.remove();
        gastbearbeitenbutton.remove();
        gastloeschenbutton.remove();
        const gastinfo = GaesteList[gastnr - 1];
        const gastinfomsg = document.createElement('a');
        gastinfomsg.innerText = 'name: ' + gastinfo.name + ', kind: ' + gastinfo.kind + ', status: ' + gastinfo.status;
        const neuegastinputs = document.createElement('ul');
        neuegastinputs.innerHTML = `
        <li>name: <br><input id="neugastname", type="text"  ></li>
        <li>Kind: <br><select name="neugastkind" id="neugastkind"  multiple>
                        <option>Ja</option>
                        <option>Nein</option>
                      </select>
        </li>
        <li>Einladungsstatus: <br><select name="neugasteinladung", id="neugasteinladung", multiple>
                        <option>unbekannt</option>
                        <option>eingeladen</option>
                        <option>zugesagt</option>
                        <option>abgesagt</option>
                        </select>
        </li>
        <button id="gastspeichern"> Speichern</button>`;
        gbearbeitendiv.appendChild(gastinfomsg);
        gbearbeitendiv.appendChild(neuegastinputs);
        const speichernbutton = document.getElementById('gastspeichern');
        speichernbutton.addEventListener('click', function () {
          const ngastname = document.getElementById('neugastname');
          const ngastkind = document.getElementById('neugastkind');
          const ngaststatus = document.getElementById('neugasteinladung');

          if (ngastname.value !== '' && ngastname !== gastinfo.name) { gastinfo.name = ngastname.value; }
          if (ngastkind.value !== '' && ngastkind !== gastinfo.kind) { gastinfo.kind = ngastkind.value; }
          if (ngaststatus.value !== '' && ngaststatus !== gastinfo.status) { gastinfo.status = ngaststatus.value; }

          GaesteList[gastnr - 1] = gastinfo;
          gbearbeitendiv.remove();

          gaestelistPrint(GaesteList, listanzeiger1);
          gastbearbeiten();
        });
      }
    });
    gastloeschenbutton.addEventListener('click', function () {
      if (gastNrinput.value === '' || isNaN(gastNrinput.value) || gastNrinput.value > GaesteList.length) { window.alert('bitte GastNr. eingeben.'); } else {
        if (GaesteList.length === 1) {
          GaesteList = [];
          // gaestelistPrint(GaesteList, listanzeiger1);
          listanzeiger1.innerHTML = '';
        } else {
          const gastnr = gastNrinput.value;

          GaesteList.splice(gastnr - 1, 1);
          gaestelistPrint(GaesteList, listanzeiger1);
        }
      }
    });
  }
  let aktuellSeiteGL = 1;
  function gaestelistPrint (gl, myDiv) {
    const block = document.createElement('li');
    block.innerHTML = '<li><a>Gast Nr.8: name: 8, </a><a>kind: Ja, </a><a>status: unbekannt</a></li>';

    myDiv.appendChild(block);
    const blockHeight = block.clientHeight + 8;
    block.remove();

    myDiv.innerHTML = '';
    const msg1 = document.createElement('h3');
    msg1.innerText = 'Gäste in der Gästeliste: ';
    myDiv.appendChild(msg1);

    let wHeight = window.innerHeight - 260;
    if (wHeight > 500) {
      wHeight = 500;
    }
    const mylist = document.createElement('ul');
    mylist.setAttribute('id', 'listanzeiger');
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
        paginationPage.innerText = aktuellSeiteGL + '/ ' + anzpages;
        printgl(aktuellSeiteGL, gl, mylist, anzitemproSeite);
      }
    });
    larrow.addEventListener('click', function () {
      if (aktuellSeiteGL !== 1) {
        aktuellSeiteGL--;
        mylist.innerHTML = '';
        paginationPage.innerText = aktuellSeiteGL + '/ ' + anzpages;
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
    function printgl (pageNr, gl, mylist, anzitemproSeite) {
      for (let n = (pageNr - 1) * anzitemproSeite; n < gl.length && n < pageNr * anzitemproSeite; n++) {
        const g = gl[n];
        if (n >= 1 && g.name === gl[n - 1].name && g.kind === gl[n - 1].kind) {
          gl.splice(n, 1); n--;
        } else {
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
    }
    buttonundeventlistenerSpeicherBTN();
  }
  window.addEventListener('resize', function () {
    if (GaesteList.length === 0) {
      gaestelistAnliegen();
    } else {
      gaestelistPrint(GaesteList, listanzeiger1);
    }
  });
}

export default gaestelistAnliegen;
