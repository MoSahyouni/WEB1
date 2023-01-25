
import fetch from 'node-fetch';
function gaestelistAnliegen () {
  const Main = document.getElementById('Main');
  Main.innerHTML = `
    <form id="gaestelistanzeiger"></form>
    <h3>Gästeliste: </h3>
    <ul id="list2">
    <input id="vaeranstaltungsname", type="text" >
    <li><h4>Gast: </h4></li>
    <li>name: <br><input id="gastname", type="text"  ></li>
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
    <button id="gastbtn" >Gast erstellen</button>
    <br> </ul>`;
  Main.setAttribute('align-items', 'inherit');
  const vaeranstaltungsname = document.getElementById('vaeranstaltungsname');
  const gastname = document.getElementById('gastname');
  const gastkind = document.getElementById('gastkind');
  const gaststatus = document.getElementById('gasteinladung');
  const gastBtn = document.getElementById('gastbtn');
  const gaestelistanzeiger = document.getElementById('gaestelistanzeiger');
  const msg1 = document.createElement('h3');
  msg1.innerText = 'Gäste in der Gästeliste: ';
  gaestelistanzeiger.appendChild(msg1);
  const listanzeiger = document.createElement('ul');
  listanzeiger.setAttribute('id', 'listanzeiger');
  gaestelistanzeiger.appendChild(listanzeiger);
  const GaesteList = [];
  // const br = document.createElement('br');
  let gasteAnzahl = 0;
  gastBtn.addEventListener('click', function () {
    let requiredFields = true;
    if (gastname.value === '') { requiredFields = false; }
    if (vaeranstaltungsname.value === '') { requiredFields = false; }
    if (gastkind.value === '') { requiredFields = false; }
    if (gaststatus.value === '') { requiredFields = false; }
    if (requiredFields === false) { window.alert('bitte alle Felder ausfühlen'); } else {
      const gast = { name: gastname.value, kind: gastkind.value, status: gaststatus.value };
      GaesteList.push(gast);
      if (listanzeiger.children.length > 0) { removeListanzigerchildren(); }
      gaestelistPrint(GaesteList);
    }
    if (gasteAnzahl === 0 && GaesteList.length !== 0) {
      gasteAnzahl++;
      const gastlisbtn = document.createElement('button');
      gastlisbtn.innerText = 'Gästelist erstellen';
      gaestelistanzeiger.appendChild(gastlisbtn);
      gastlisbtn.addEventListener('click', function (event) {
        event.preventDefault();
        // Check if the event exists
        let erg = false;
        (async function () {
          const response = await
          fetch('/getveranstaltung');
          const result = await response.json();
          const vers = result;
          let veri = null;
          for (let i = 0; i < vers.length; i++) {
            if (vaeranstaltungsname.value === vers[i].veranstaltung) {
              console.log('------');
              erg = true;
              veri = vers[i];
            }
          }
          // Veranstaltung fetching to Server
          if (!erg) {
            window.alert('Es existiert keine Veranstaltung mit dem gegebenen Namen');
            console.log(vaeranstaltungsname.value);
          } else {
            if (veri.gaestelist != null) { window.alert('Es existiert eine Gästeliste für diese Veranstaltung'); } else {
              (async function () {
                await fetch('/gasterzeugen', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ veranvaeranstaltungsname: vaeranstaltungsname.value, Gästelist: GaesteList })
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

    if (gasteAnzahl === 1) { gastbearbeiten(); gasteAnzahl++; }
  });
  function gastbearbeiten () {
    const gbearbeitendiv = document.createElement('div');
    gbearbeitendiv.setAttribute('id', 'gbearbeitendiv');
    const gbearbeitenMsg = document.createElement('h4');
    gbearbeitenMsg.innerText = 'Gast NR.';
    const gastNrinput = document.createElement('input');
    const gastbearbeitenbutton = document.createElement('button');
    gastbearbeitenbutton.innerText = 'bearbeiten';
    gastbearbeitenbutton.setAttribute('id', 'gastbearbeitenbutton');
    const gastloeschenbutton = document.createElement('button');
    gastloeschenbutton.innerText = 'löschen';
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
        <button id="gastspeichern"> speichern</button>`;
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
          removeListanzigerchildren();
          // hier
          gaestelistPrint(GaesteList);
          gastbearbeiten();
        });
      }
    });
    gastloeschenbutton.addEventListener('click', function () {
      if (gastNrinput.value === '' || isNaN(gastNrinput.value) || gastNrinput.value > GaesteList.length) { window.alert('bitte GastNr. eingeben.'); } else {
        const gastnr = gastNrinput.value;

        // hier
        removeListanzigerchildren();
        GaesteList.splice(gastnr - 1, 1);
        console.log('sli');
        console.log('_____________________');
        console.log(GaesteList);
        gaestelistPrint(GaesteList);
      // gastbearbeiten();
      }
    });
  }
  /* async function VerExis (name) {
    let erg = false;

    const response = await
    fetch('/getveranstaltung');
    const result = await response.json();
    const vers = result;
    for (let i = 0; i < vers.length; i++) {
      if (name === vers[i].veranstaltung) {
        console.log('------');
        erg = true;
      }
    }
    console.log(erg);
    return erg;
  } */
  function gaestelistPrint (gl) {
    for (let n = 0; n < gl.length; n++) {
      // const listanzeigerChildren = listanzeiger.children.length;
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
        // obj.appendChild(br);
        obj.appendChild(objkind);
        // obj.appendChild(br);
        obj.appendChild(objstatus);
        console.log(listanzeiger.children[n]);
        listanzeiger.appendChild(obj);

        // if (n >= listanzeigerChildren) { listanzeiger.appendChild(obj); }
      }
    }
  }
  function removeListanzigerchildren () {
    listanzeiger.innerHTML = '';
  }
}

export default gaestelistAnliegen;
