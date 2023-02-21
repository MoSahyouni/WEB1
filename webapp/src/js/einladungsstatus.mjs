
function EinladungStatusBearbeiten () {
  const Main = document.getElementById('Main');
  Main.innerHTML = `
    <div id="mainInZuordnen">
    <ul id="list">
      <h2 id= "Text_zuordnen" >Geben Sie den Namen der zu verarbeitenden Veranstaltung ein:</h2>
      <li>name: <br><input id="vername", type="text" >
      
      </ul>
      <input type="submit", id="btnJSON", value="Veranstaltung bearbeiten" >
    </ul>
    <p id="userdata"></p>
    </div>`;
  Main.setAttribute('align-items', 'inherit');
  const vaeranstaltungsname = document.getElementById('vername');
  let versitzplan = null;
  let GaesteList = null;
  let listSpace = null;
  let verId = null;
  let GLId = null;
  const checkBtn = document.getElementById('btnJSON');
  checkBtn.addEventListener('click', function () {
    (async function () {
      const response = await
      window.fetch('/getveranstaltung');
      const result = await response.json();
      const vers = await result;
      let veri = null;
      let existiert = false;
      for (let i = 0; i < vers.length; i++) {
        if (vaeranstaltungsname.value === vers[i].name) {
          existiert = true;
          veri = vers[i];
          versitzplan = veri.Sitzplan;
          GaesteList = veri.gaestelist;
          // if (veri.gaestelist == null) { window.alert('Es existiert keine Gästeliste für diese Veranstaltung'); }
          verId = JSON.stringify(veri._id).substring(1, JSON.stringify(veri._id).length - 1);
        }
      }
      const glsReq = await window.fetch('/gaestelisten');
      const gls = await glsReq.json();
      console.log(gls);
      /* Array.from(gls).map(element => async function (element) {
        if (element.vaeranstaltungsname === veri.name) {
          const e = await window.fetch(element.href);
          GLId = JSON.stringify(e._id).substring(1, JSON.stringify(e._id).length - 1);
        }
      }); */
      const glList = gls.gaestelisten;
      console.log(glList);
      glList.map(element => (async function () {
        if (element.veranstaltungsname === veri.name) {
          const ef = await window.fetch(element.href);
          const e = await ef.json();
          console.log('ee ', e);
          GLId = JSON.stringify(e.gaestelisten._id).substring(1, JSON.stringify(e.gaestelisten._id).length - 1);
        }
      })());
      if (!existiert) {
        window.alert('Es existiert keine Veranstaltung mit dem Namen ' + vaeranstaltungsname.value);
        EinladungStatusBearbeiten();
      } else {
        if (GaesteList === null || GaesteList === undefined) { window.alert('Diese veranstaltung hat Keine Gästelist'); } else {
          Main.innerHTML = '<div id="gaestelistanzeiger"></div>';
          listSpace = document.getElementById('gaestelistanzeiger');
          GaesteList = veri.gaestelist;

          gaestelistPrint(GaesteList, listSpace);
          gastbearbeiten();
        }
      }
    })();
  });

  function buttonundeventlistenerSpeicherBTN (listSpace2) {
    const gastlisbtn = document.createElement('button');
    gastlisbtn.setAttribute('id', 'gaesterstellen');
    gastlisbtn.innerText = 'Gästeliste speichern';
    listSpace2.appendChild(gastlisbtn);
    gastlisbtn.addEventListener('click', function (event) {
      event.preventDefault();
      const sitzplanZuordnung = versitzplan.gästezuordnung;
      if (sitzplanZuordnung !== undefined) {
        for (let i = 0; i < sitzplanZuordnung.length; i++) {
          const inZuoudnung = sitzplanZuordnung[i];
          if (inZuoudnung === null) { continue; }
          for (let n = 0; n < GaesteList.length; n++) {
            const neueDaten = GaesteList[n];
            if (inZuoudnung.name === neueDaten.name && inZuoudnung.status !== neueDaten.status) {
              inZuoudnung.status = neueDaten.status;
            }
          }
        }
      }
      versitzplan.gästezuordnung = sitzplanZuordnung;
      console.log(verId);
      /* (async function () {
        window.fetch('/gastelisteAktualisieren', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ vname: vaeranstaltungsname.value, Gästelist: GaesteList, sitzplan: versitzplan })
        }).then(response => {
          if (response) { return response.json(); }
        }).catch(error => {
          console.log(error);
        });
      })(); */
      const fetchbody = JSON.stringify({ Gastelist: GaesteList, sitzplan: versitzplan });
      (async function () {
        window.fetch(`/gaestelisten/${GLId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: fetchbody
        }).then(response => {
          if (response) { return response.json(); }
        }).catch(error => {
          console.log(error);
        });
      })();
      /* const fetchbody = JSON.stringify({ Gastelist: GaesteList, sitzplan: versitzplan });
      const fetchMethode = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: fetchbody
      };
      (async function () {
        const url = `/gaestelisten/${verId}`;
        await window.fetch(url, fetchMethode).then(response => {
          if (response) { return response.json(); }
        }).catch(error => {
          console.log(error);
        });
      })(); */
    });
  }
  function gastbearbeiten () {
    const gbearbeitendiv = document.createElement('div');
    gbearbeitendiv.setAttribute('id', 'gbearbeitendiv2');
    const gbearbeitenMsg = document.createElement('h4');
    gbearbeitenMsg.innerText = 'Gast NR:';
    const gastNrinput = document.createElement('input');
    gastNrinput.setAttribute('id', 'inputbearbeitundloeschen');
    const gastbearbeitenbutton = document.createElement('button');
    gastbearbeitenbutton.innerText = 'Bearbeiten';
    gastbearbeitenbutton.setAttribute('id', 'gastbearbeitenbutton');
    gbearbeitendiv.appendChild(gbearbeitenMsg);
    gbearbeitendiv.appendChild(gastNrinput);
    gbearbeitendiv.appendChild(document.createElement('br'));
    gbearbeitendiv.appendChild(gastbearbeitenbutton);
    Main.appendChild(gbearbeitendiv);
    gastbearbeitenbutton.addEventListener('click', function () {
      if (gastNrinput.value === '' || isNaN(gastNrinput.value) || gastNrinput.value > GaesteList.length) { window.alert('bitte GastNr. eingeben.'); } else {
        const gastnr = gastNrinput.value;
        gbearbeitenMsg.remove();
        gastNrinput.remove();
        gastbearbeitenbutton.remove();
        const gastinfo = GaesteList[gastnr - 1];
        const neuegastinputs = document.createElement('ul');
        neuegastinputs.innerHTML = `
        <li>name: <a id="gastname" >` + GaesteList[gastNrinput.value - 1].name + `</li>
        <li>Kind: <a name="neugastkind" id="gastkind" >` + GaesteList[gastNrinput.value - 1].kind + `</li> 
        <li>Alte Einladungsstatus: <a id="gaststatus" >` + GaesteList[gastNrinput.value - 1].status + `</li>              
        <li>Neue Einladungsstatus: <br><select name="neugasteinladung", id="neugasteinladung", multiple>
                        <option>unbekannt</option>
                        <option>eingeladen</option>
                        <option>zugesagt</option>
                        <option>abgesagt</option>
                        </select>
        </li>
        <button id="gastspeichern"> speichern</button>`;
        gbearbeitendiv.appendChild(neuegastinputs);
        const speichernbutton = document.getElementById('gastspeichern');
        speichernbutton.addEventListener('click', function () {
          const ngaststatus = document.getElementById('neugasteinladung');

          if (ngaststatus.value !== '' && ngaststatus !== gastinfo.status) { gastinfo.status = ngaststatus.value; }

          GaesteList[gastnr - 1] = gastinfo;
          gbearbeitendiv.remove();

          gaestelistPrint(GaesteList, listSpace);
          gastbearbeiten();
        });
      }
    });
  }
  let aktuellSeiteGL = 1;
  function gaestelistPrint (gl, myDiv) {
    const block = document.createElement('li');
    block.innerHTML = '<li><a>Gast Nr.8: name: 8, </a><a>kind: Ja, </a><a>status: unbekannt</a></li>';

    myDiv.appendChild(block);
    let blockHeight = block.clientHeight + 8;
    blockHeight = 2144 / window.innerWidth * blockHeight;
    block.remove();

    myDiv.innerHTML = '';
    const msg1 = document.createElement('h3');
    msg1.innerText = 'Gäste in der Gästeliste: ';
    myDiv.appendChild(msg1);
    const wHeight = window.innerHeight - 230;

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
    if (anzitemproSeite >= 16) { anzitemproSeite = 15; }
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
    buttonundeventlistenerSpeicherBTN(listSpace);
  }
  window.addEventListener('resize', function () {
    gaestelistPrint(GaesteList, listSpace);
  });
}

export default EinladungStatusBearbeiten;
