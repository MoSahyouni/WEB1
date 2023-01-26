import fetch from 'node-fetch';
function GaestePlatzZuordnen () {
  const main = document.getElementById('Main');
  main.innerHTML = `
  <ul id="list">
    <h2>Geben Sie den Namen der zu verarbeitenden Veranstaltung ein:</h2>
    <li>name: <br><input id="vername", type="text" >
    
    </ul>
    <input type="submit", id="btnJSON", value="Veranstaltung bearbeiten" >
  </ul>
  <p id="userdata"></p>`;
  const verName = document.getElementById('vername');
  const jsonButton = document.getElementById('btnJSON');

  jsonButton.addEventListener('click', function () {
    let requiredFields = true;
    if (verName.value === '') { requiredFields = false; }
    if (requiredFields === false) { window.alert('bitte alle Felder ausfühlen'); } else {
      let vers = [];
      let VerExistieret = false;
      let rTische = 0;
      let sitzeProTisch = 0;
      let bestuhlung = null;
      let plgastordnerlist = null;

      (async function () {
        try {
          const response = await
          fetch('/getveranstaltung');
          const result = await response.json();
          vers = result;
          let ver = null;
          let platzlist = null;
          for (let i = 0; i < vers.length; i++) {
            if (verName.value === vers[i].veranstaltung) {
              VerExistieret = true;
              ver = vers[i];
              break;
            }
          }
          if (!VerExistieret) {
            window.alert('Es existiert keine Veranstaltung mit dem gegebenen Namen');
          } else {
            const gl = ver.gaestelist;
            rTische = ver.Sitzplan.recheckigenTische;
            sitzeProTisch = ver.Sitzplan.sitzeprotisch;
            bestuhlung = ver.Sitzplan.Bestuhlung;
            platzlist = new Array(rTische * sitzeProTisch);
            plgastordnerlist = new Array(rTische * sitzeProTisch);
            /* for (let i = 0; i < rTische * sitzeProTisch; i++) {
              platzlist.push(null);
              plgastordnerlist.push(null);
            } */
            console.log(rTische);
            console.log(bestuhlung);
            console.log(platzlist);
            // const sp = ver.Sitzplan;
            main.innerHTML = `<div id="gaestelistanzeiger"></div>
              <div id="sitzplananzeiger"></div>
              <div id="zuordnendiv"></div>`;
            const glanzeiger = document.getElementById('gaestelistanzeiger');
            const zuordnendiv = document.getElementById('zuordnendiv');

            gaestelistPrint(gl, glanzeiger);
            // plgastordnerlistPrint(rTische, sitzeProTisch, bestuhlung, plgastordnerlist);
            zuordnenFun(platzlist, zuordnendiv, plgastordnerlist);
            window.addEventListener('resize', function () {
              gaestelistPrint(gl, glanzeiger);
              // plgastordnerlistPrint(rTische, sitzeProTisch, bestuhlung, plgastordnerlist);
              zuordnenFun(platzlist, zuordnendiv, plgastordnerlist);
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
    // pagination aktuelle Seite
    // let aktuellSeite = 1;
    myDiv.innerHTML = '';
    const wHeight = window.innerHeight - 200;
    const mylist = document.createElement('ul');
    mylist.setAttribute('id', 'listanzeiger');
    const glMsg = document.createElement('a');
    glMsg.innerText = 'GästeList';
    mylist.appendChild(glMsg);
    myDiv.appendChild(mylist);
    // creating pagination arrows
    const larrow = document.createElement('span');
    larrow.innerText = '\u2190';
    larrow.setAttribute('id', 'paginationarrow');
    const rarrow = document.createElement('span');
    rarrow.setAttribute('id', 'paginationarrow');
    rarrow.innerText = '\u2192';
    // finding the number of pagenation pages
    let anzitemproSeite = parseInt(wHeight / 19);
    if (anzitemproSeite <= 0) { anzitemproSeite = 1; }
    let anzpages = 0;
    if (parseInt(gl.length / anzitemproSeite) <= 0) { anzpages = 1; } else { anzpages = parseInt(gl.length / anzitemproSeite); }
    if (anzpages <= 0) { anzpages = gl.length; }
    if (isNaN(anzpages)) { anzpages = gl.length; }
    if (anzpages * wHeight / 19 < gl.length) { anzpages++; }
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
    myDiv.appendChild(larrow);
    myDiv.appendChild(paginationPage);
    myDiv.appendChild(rarrow);
  }

  function printgl (pageNr, gl, mylist, anzitemproSeite) {
    for (let n = (pageNr - 1) * anzitemproSeite; n < gl.length && n < pageNr * anzitemproSeite; n++) {
      // const listanzeigerChildren = listanzeiger.children.length;

      const g = gl[n];
      // if (n >= 1 && g.name === gl[n - 1].name && g.kind === gl[n - 1].kind) {
      //  gl.splice(n, 1); n--;
      // } else {
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
      // obj.appendChild(br);
      obj.appendChild(objkind);
      // obj.appendChild(br);
      obj.appendChild(objstatus);
      mylist.appendChild(obj);
    }
    /* for (let n = 0; n < gl.length; n++) {
      // const listanzeigerChildren = listanzeiger.children.length;
      const g = gl[n];
      //if (n >= 1 && g.name === gl[n - 1].name && g.kind === gl[n - 1].kind) {
      //  gl.splice(n, 1); n--;
      //} else {
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
        // obj.appendChild(br);
        obj.appendChild(objkind);
        // obj.appendChild(br);
        obj.appendChild(objstatus);
        console.log(listanzeiger.children[n]);
        listanzeiger.appendChild(obj);
        elements++;

        // if (n >= listanzeigerChildren) { listanzeiger.appendChild(obj); }
      //} */
  }

  /* function plgastordnerlistPrint (rTische, sitzeProTisch, bestuhlung,plgastordnerlist) {
    const spDiv = document.getElementById('sitzplananzeiger');
    spDiv.innerHTML = '';
    const splist = document.createElement('ul');
    function allePlatze () {
      const obj = document.createElement('li');
      obj.innerText = 'Es gibt ' + rTische + ' Tische.';
      const obj2 = document.createElement('li');
      obj2.innerText = 'jede Tishe hat ' + sitzeProTisch + ' Plätze und hat ' + bestuhlung + ' Bestuhlung.';
      for(int i = 0 ; i < plgastordnerlist.length; i++)
      {

      }
      splist.append(obj);
      splist.appendChild(obj2);
    }
    allePlatze();
    spDiv.appendChild(splist);
  } */
  let aktuellSeitePL = 1;
  function zuordnenFun (pl, myDiv, plgastordnerlist) {
    const block = document.createElement('li');
    block.innerHTML = 'platz Nr.n: sitzt den Gast Nr.:<input><button>speicher Platz</button>';

    myDiv.appendChild(block); const blockHeight = block.clientHeight;
    console.log(blockHeight);
    // pagination aktuelle Seite
    // let aktuellSeite = 1;
    myDiv.innerHTML = '';
    const wHeight = window.innerHeight - 200;
    const mylist = document.createElement('ul');
    mylist.setAttribute('id', 'PLanzeiger');
    const plMsg = document.createElement('a');
    plMsg.innerText = 'Bitte geben Sie der Nummer des Gasts ein : ';
    mylist.appendChild(plMsg);
    myDiv.appendChild(mylist);
    // creating pagination arrows
    const larrow = document.createElement('span');
    larrow.innerText = '\u2190';
    larrow.setAttribute('id', 'paginationarrow');
    const rarrow = document.createElement('span');
    rarrow.setAttribute('id', 'paginationarrow');
    rarrow.innerText = '\u2192';
    // finding the number of pagenation pages
    let anzitemproSeite = parseInt(wHeight / blockHeight);
    if (anzitemproSeite <= 0) { anzitemproSeite = 1; }
    let anzpages = 0;
    if (parseInt(pl.length / anzitemproSeite) <= 0) { anzpages = 1; } else { anzpages = parseInt(pl.length / anzitemproSeite); }
    if (anzpages <= 0) { anzpages = pl.length; }
    if (isNaN(anzpages)) { anzpages = pl.length; }
    if (anzpages * wHeight / blockHeight < pl.length) { anzpages++; }
    if (aktuellSeitePL > anzpages) { aktuellSeitePL = anzpages; }
    if (aktuellSeitePL !== 1) { PlatzeInputs(aktuellSeitePL, pl, mylist, anzitemproSeite, plgastordnerlist); } else {
      aktuellSeitePL = 1;
      PlatzeInputs(aktuellSeitePL, pl, mylist, anzitemproSeite, plgastordnerlist);
    }
    rarrow.addEventListener('click', function () {
      if (!(aktuellSeitePL === anzpages)) {
        aktuellSeitePL++;
        mylist.innerHTML = '';
        const plMsg = document.createElement('a');
        plMsg.innerText = 'Bitte geben Sie der Nummer des Gasts ein : ';
        paginationPage.innerText = aktuellSeitePL + '/ ' + anzpages;
        mylist.appendChild(plMsg);
        PlatzeInputs(aktuellSeitePL, pl, mylist, anzitemproSeite, plgastordnerlist);
      }
    });
    larrow.addEventListener('click', function () {
      if (aktuellSeitePL !== 1) {
        aktuellSeitePL--;
        mylist.innerHTML = '';
        const plMsg = document.createElement('a');
        plMsg.innerText = 'Bitte geben Sie der Nummer des Gasts ein : ';
        paginationPage.innerText = aktuellSeitePL + '/ ' + anzpages;
        mylist.appendChild(plMsg);
        PlatzeInputs(aktuellSeitePL, pl, mylist, anzitemproSeite, plgastordnerlist);
      }
    });
    const paginationPage = document.createElement('a');
    paginationPage.innerText = aktuellSeitePL + '/ ' + anzpages;
    paginationPage.setAttribute('id', 'paginationPage');
    myDiv.appendChild(larrow);
    myDiv.appendChild(paginationPage);
    myDiv.appendChild(rarrow);
  }
  function PlatzeInputs (pageNr, pl, mylist, anzitemproSeite, plgastordnerlist) {
    for (let n = (pageNr - 1) * anzitemproSeite; n < pl.length && n < pageNr * anzitemproSeite; n++) {
      // const listanzeigerChildren = listanzeiger.children.length;

      // const g = pl[n];
      // if (n >= 1 && g.name === gl[n - 1].name && g.kind === gl[n - 1].kind) {
      //  gl.splice(n, 1); n--;
      // } else {
      const obj = document.createElement('li');
      const objinput = document.createElement('input');
      objinput.setAttribute('id', 'plgsinput' + n);
      if (plgastordnerlist[n] != null) {
        obj.innerText = 'platz Nr. ' + (n + 1) + ' besitzt von Gast Nr. ' + plgastordnerlist[n];
        obj.setAttribute('id', 'p' + n);
        const gastloschen = document.createElement('button');
        gastloschen.innerText = 'Gast löschen';
        gastloschen.setAttribute('id', 'platzptn');
        obj.appendChild(gastloschen);
        gastloschen.addEventListener('click', function () {
          plgastordnerlist[n] = null;
          mylist.innerHTML = '';
          PlatzeInputs(pageNr, pl, mylist, anzitemproSeite, plgastordnerlist);
        });
      } else {
        obj.innerText = 'platz Nr.' + (n + 1) + ': den Gast Nr. setzen:';
        obj.setAttribute('id', 'p' + n);
        const platzbtn = document.createElement('button');
        platzbtn.innerText = 'speicher Platz';
        platzbtn.setAttribute('id', 'platzptn');
        platzbtn.addEventListener('click', function () {
          const val = document.getElementById('plgsinput' + n);
          console.log('id  ' + 'p' + n + '     ' + val.value);
          plgastordnerlist[n] = val.value;
          console.log(plgastordnerlist[n]);
          mylist.innerHTML = '';
          PlatzeInputs(pageNr, pl, mylist, anzitemproSeite, plgastordnerlist);
        });
        obj.appendChild(objinput);
        obj.appendChild(platzbtn);
      }

      // obj.appendChild(br);

      mylist.appendChild(obj);
    }
  }
}

export default GaestePlatzZuordnen;
