(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/node-fetch/browser.js
  var require_browser = __commonJS({
    "node_modules/node-fetch/browser.js"(exports, module) {
      module.exports = exports = window.fetch;
      exports.Headers = window.Headers;
      exports.Request = window.Request;
      exports.Response = window.Response;
    }
  });

  // src/js/VerAnlegen.mjs
  var import_node_fetch = __toESM(require_browser(), 1);
  function VerAnlegen() {
    document.getElementById("Main").innerHTML = `
  <ul id="list">
  
  
    <h2>Varanstaltung</h2>
    <li>name: <br><input id="vernname", type="text" ></li>
    <br>
    <li>Datum und Uhrzeit: <br><input type="datetime-local", name="meeting-time", id="verZeit">
    <br>
    <ul>
    <li>Anzahl der rechteckigen Tische: <input id="SitzplanTische", type="text" ></li>
    <li>Anzahl der Sitzpl\xE4tze pro Tisch: <input id="plaetzeProTisch", type="text" ></li>
    <li>Bestuhlung aller Tische: <select name="neugasteinladung", id="bestuhlung", multiple>
                        <option>Einseitige</option>
                        <option>zweiseitige</option>
                        </select>
    
    </ul>
    <input type="submit", id="btnJSON", value="Veranstaltung erstellen" >
  </ul>
  <p id="userdata"></p>
  `;
    const verNameInput = document.getElementById("vernname");
    const verTime = document.getElementById("verZeit");
    const tische = document.getElementById("SitzplanTische");
    const plaetzeproTisch = document.getElementById("plaetzeProTisch");
    const bestuhlung = document.getElementById("bestuhlung");
    const jsonButton = document.getElementById("btnJSON");
    jsonButton.addEventListener("click", function() {
      let requiredFields = true;
      if (verNameInput.value === "") {
        requiredFields = false;
      }
      if (verTime.value === "") {
        requiredFields = false;
      }
      if (tische.value === "") {
        requiredFields = false;
      }
      if (plaetzeproTisch.value === "") {
        requiredFields = false;
      }
      if (bestuhlung.value === "") {
        requiredFields = false;
      }
      if (requiredFields === false) {
        window.alert("bitte alle Felder ausf\xFCllen");
      } else {
        let vers = [];
        let altename = false;
        (async function() {
          try {
            const response = await (0, import_node_fetch.default)("/getveranstaltung");
            const result = await response.json();
            vers = result;
            for (let i = 0; i < vers.length; i++) {
              if (verNameInput.value === vers[i].veranstaltung) {
                altename = true;
                window.alert("Veranstaltungsname existiert schon, bitte name \xE4ndern.");
                break;
              }
            }
            if (!altename) {
              (async function() {
                await (0, import_node_fetch.default)("/veranstaltungerzeugen", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    name: verNameInput.value,
                    datum: verTime.value,
                    sitzplan: { recheckigenTische: tische.value, sitzeprotisch: plaetzeproTisch.value, Bestuhlung: bestuhlung.value }
                  })
                }).then((response2) => {
                  if (response2) {
                    return response2.json();
                  }
                });
              })();
              window.alert("Veranstaltung erstellt");
            }
          } catch (error) {
            console.log("Er....");
            console.error(error.message);
          }
        })();
      }
    });
  }
  var VerAnlegen_default = VerAnlegen;

  // src/js/gastliste.mjs
  var import_node_fetch2 = __toESM(require_browser(), 1);
  function gaestelistAnliegen() {
    const Main = document.getElementById("Main");
    Main.innerHTML = `
    <div id="listanzeiger1"></div>
    <div id="mainDiv">
    <h3 id = "titel1">G\xE4steliste </h3>
    <ul>
    <li>vaeranstaltungsname: <br><input id="vaeranstaltungsname", type="text" ><li/>
    <li>Name des Gasts: <br><input id="gastname", type="text"  ></li>
    <li>Name des Kinds: <br><select name="gastkind" id="gastkind"  multiple>
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
    <button id="gastbtn" >Gast hinzuf\xFCgen</button>
    <br> </ul></div>`;
    Main.setAttribute("align-items", "inherit");
    const vaeranstaltungsname = document.getElementById("vaeranstaltungsname");
    const gastname = document.getElementById("gastname");
    const gastkind = document.getElementById("gastkind");
    const gaststatus = document.getElementById("gasteinladung");
    const gastBtn = document.getElementById("gastbtn");
    const gaestelistanzeiger = document.getElementById("gaestelistanzeiger");
    const listanzeiger1 = document.getElementById("listanzeiger1");
    listanzeiger1.setAttribute("id", "listanzeiger");
    const GaesteList = [];
    let gasteAnzahl = 0;
    gastBtn.addEventListener("click", function() {
      let requiredFields = true;
      if (gastname.value === "") {
        requiredFields = false;
      }
      if (vaeranstaltungsname.value === "") {
        requiredFields = false;
      }
      if (gastkind.value === "") {
        requiredFields = false;
      }
      if (gaststatus.value === "") {
        requiredFields = false;
      }
      if (requiredFields === false) {
        window.alert("bitte alle Felder ausf\xFChlen");
      } else {
        const gast = { name: gastname.value, kind: gastkind.value, status: gaststatus.value };
        GaesteList.push(gast);
        gaestelistPrint(GaesteList, listanzeiger1);
      }
      if (gasteAnzahl === 0 && GaesteList.length !== 0) {
        gasteAnzahl++;
        const gastlisbtn = document.createElement("button");
        gastlisbtn.innerText = "G\xE4stelist erstellen";
        gaestelistanzeiger.appendChild(gastlisbtn);
        gastlisbtn.addEventListener("click", function(event) {
          event.preventDefault();
          let erg = false;
          (async function() {
            const response = await (0, import_node_fetch2.default)("/getveranstaltung");
            const result = await response.json();
            const vers = result;
            let veri = null;
            for (let i = 0; i < vers.length; i++) {
              if (vaeranstaltungsname.value === vers[i].veranstaltung) {
                console.log("------");
                erg = true;
                veri = vers[i];
              }
            }
            if (!erg) {
              window.alert("Es existiert keine Veranstaltung mit dem gegebenen Namen");
              console.log(vaeranstaltungsname.value);
            } else {
              if (veri.gaestelist != null) {
                window.alert("Es existiert eine G\xE4steliste f\xFCr diese Veranstaltung");
              } else {
                (async function() {
                  await (0, import_node_fetch2.default)("/gasterzeugen", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ veranvaeranstaltungsname: vaeranstaltungsname.value, G\u00E4stelist: GaesteList })
                  }).then((response2) => {
                    if (response2) {
                      return response2.json();
                    }
                  }).catch((error) => {
                    console.log(error);
                  });
                })();
              }
            }
          })();
        });
      }
      if (gasteAnzahl === 1) {
        gastbearbeiten();
        gasteAnzahl++;
      }
    });
    function gastbearbeiten() {
      const gbearbeitendiv = document.createElement("div");
      gbearbeitendiv.setAttribute("id", "gbearbeitendiv");
      const gbearbeitenMsg = document.createElement("h4");
      gbearbeitenMsg.innerText = "Gast NR.";
      const gastNrinput = document.createElement("input");
      const gastbearbeitenbutton = document.createElement("button");
      gastbearbeitenbutton.innerText = "bearbeiten";
      gastbearbeitenbutton.setAttribute("id", "gastbearbeitenbutton");
      const gastloeschenbutton = document.createElement("button");
      gastloeschenbutton.innerText = "l\xF6schen";
      gastloeschenbutton.setAttribute("id", "gastloeschenbutton");
      gbearbeitendiv.appendChild(gbearbeitenMsg);
      gbearbeitendiv.appendChild(gastNrinput);
      gbearbeitendiv.appendChild(document.createElement("br"));
      gbearbeitendiv.appendChild(gastbearbeitenbutton);
      gbearbeitendiv.appendChild(gastloeschenbutton);
      Main.appendChild(gbearbeitendiv);
      gastbearbeitenbutton.addEventListener("click", function() {
        if (gastNrinput.value === "" || isNaN(gastNrinput.value) || gastNrinput.value > GaesteList.length) {
          window.alert("bitte GastNr. eingeben.");
        } else {
          const gastnr = gastNrinput.value;
          gbearbeitenMsg.remove();
          gastNrinput.remove();
          gastbearbeitenbutton.remove();
          gastloeschenbutton.remove();
          const gastinfo = GaesteList[gastnr - 1];
          const gastinfomsg = document.createElement("a");
          gastinfomsg.innerText = "name: " + gastinfo.name + ", kind: " + gastinfo.kind + ", status: " + gastinfo.status;
          const neuegastinputs = document.createElement("ul");
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
          const speichernbutton = document.getElementById("gastspeichern");
          speichernbutton.addEventListener("click", function() {
            const ngastname = document.getElementById("neugastname");
            const ngastkind = document.getElementById("neugastkind");
            const ngaststatus = document.getElementById("neugasteinladung");
            if (ngastname.value !== "" && ngastname !== gastinfo.name) {
              gastinfo.name = ngastname.value;
            }
            if (ngastkind.value !== "" && ngastkind !== gastinfo.kind) {
              gastinfo.kind = ngastkind.value;
            }
            if (ngaststatus.value !== "" && ngaststatus !== gastinfo.status) {
              gastinfo.status = ngaststatus.value;
            }
            GaesteList[gastnr - 1] = gastinfo;
            gbearbeitendiv.remove();
            gaestelistPrint(GaesteList, listanzeiger1);
            gastbearbeiten();
          });
        }
      });
      gastloeschenbutton.addEventListener("click", function() {
        if (gastNrinput.value === "" || isNaN(gastNrinput.value) || gastNrinput.value > GaesteList.length) {
          window.alert("bitte GastNr. eingeben.");
        } else {
          const gastnr = gastNrinput.value;
          GaesteList.splice(gastnr - 1, 1);
          gaestelistPrint(GaesteList, listanzeiger1);
        }
      });
    }
    let aktuellSeiteGL = 1;
    function gaestelistPrint(gl, myDiv) {
      const block = document.createElement("li");
      block.innerHTML = "<li><a>Gast Nr.8: name: 8, </a><a>kind: Ja, </a><a>status: unbekannt</a></li>";
      myDiv.appendChild(block);
      const blockHeight = block.clientHeight;
      block.remove();
      myDiv.innerHTML = "";
      const msg1 = document.createElement("h3");
      msg1.innerText = "G\xE4ste in der G\xE4steliste: ";
      myDiv.appendChild(msg1);
      const wHeight = window.innerHeight - 230;
      const mylist = document.createElement("ul");
      mylist.setAttribute("id", "listanzeiger");
      myDiv.appendChild(mylist);
      const larrow = document.createElement("span");
      larrow.innerText = "\u2190";
      larrow.setAttribute("id", "paginationarrow");
      const rarrow = document.createElement("span");
      rarrow.setAttribute("id", "paginationarrow");
      rarrow.innerText = "\u2192";
      let anzitemproSeite = parseInt(wHeight / parseInt(blockHeight));
      if (anzitemproSeite <= 0) {
        anzitemproSeite = 1;
      }
      let anzpages = 0;
      if (parseInt(gl.length / anzitemproSeite) <= 0) {
        anzpages = 1;
      } else {
        anzpages = parseInt(gl.length / anzitemproSeite);
      }
      if (anzpages <= 0) {
        anzpages = gl.length;
      }
      if (isNaN(anzpages)) {
        anzpages = gl.length;
      }
      if (anzpages * wHeight / 19 < gl.length) {
        anzpages++;
      }
      if (aktuellSeiteGL > anzpages) {
        aktuellSeiteGL = anzpages;
      }
      if (aktuellSeiteGL !== 1) {
        printgl(aktuellSeiteGL, gl, mylist, anzitemproSeite);
      } else {
        aktuellSeiteGL = 1;
        printgl(aktuellSeiteGL, gl, mylist, anzitemproSeite);
      }
      rarrow.addEventListener("click", function() {
        if (!(aktuellSeiteGL === anzpages)) {
          aktuellSeiteGL++;
          mylist.innerHTML = "";
          const glMsg = document.createElement("a");
          glMsg.innerText = "G\xE4steList";
          paginationPage.innerText = aktuellSeiteGL + "/ " + anzpages;
          mylist.appendChild(glMsg);
          printgl(aktuellSeiteGL, gl, mylist, anzitemproSeite);
        }
      });
      larrow.addEventListener("click", function() {
        if (aktuellSeiteGL !== 1) {
          aktuellSeiteGL--;
          mylist.innerHTML = "";
          const glMsg = document.createElement("a");
          glMsg.innerText = "G\xE4steList";
          paginationPage.innerText = aktuellSeiteGL + "/ " + anzpages;
          mylist.appendChild(glMsg);
          printgl(aktuellSeiteGL, gl, mylist, anzitemproSeite);
        }
      });
      const paginationPage = document.createElement("a");
      paginationPage.innerText = aktuellSeiteGL + "/ " + anzpages;
      paginationPage.setAttribute("id", "paginationPage");
      myDiv.appendChild(larrow);
      myDiv.appendChild(paginationPage);
      myDiv.appendChild(rarrow);
      function printgl(pageNr, gl2, mylist2, anzitemproSeite2) {
        for (let n = (pageNr - 1) * anzitemproSeite2; n < gl2.length && n < pageNr * anzitemproSeite2; n++) {
          const g = gl2[n];
          if (n >= 1 && g.name === gl2[n - 1].name && g.kind === gl2[n - 1].kind) {
            gl2.splice(n, 1);
            n--;
          } else {
            const obj = document.createElement("li");
            const gname = g.name;
            const gkind = g.kind;
            const gstatus = g.status;
            const objname = document.createElement("a");
            objname.innerText = "Gast Nr." + (n + 1) + ": name: " + gname + ", ";
            const objkind = document.createElement("a");
            objkind.innerText = "kind: " + gkind + ", ";
            const objstatus = document.createElement("a");
            objstatus.innerText = "status: " + gstatus;
            obj.appendChild(objname);
            obj.appendChild(objkind);
            obj.appendChild(objstatus);
            mylist2.appendChild(obj);
          }
        }
      }
    }
  }
  var gastliste_default = gaestelistAnliegen;

  // src/js/SitzplanZuordnungAnliegen.mjs
  var import_node_fetch3 = __toESM(require_browser(), 1);
  function GaestePlatzZuordnen() {
    const main2 = document.getElementById("Main");
    main2.innerHTML = `
  <ul id="list">
    <h2>Geben Sie den Namen der zu verarbeitenden Veranstaltung ein:</h2>
    <li>name: <br><input id="vername", type="text" >
    
    </ul>
    <input type="submit", id="btnJSON", value="Veranstaltung bearbeiten" >
  </ul>
  <p id="userdata"></p>`;
    const verName = document.getElementById("vername");
    const jsonButton = document.getElementById("btnJSON");
    jsonButton.addEventListener("click", function() {
      let requiredFields = true;
      if (verName.value === "") {
        requiredFields = false;
      }
      if (requiredFields === false) {
        window.alert("bitte alle Felder ausf\xFChlen");
      } else {
        let vers = [];
        let VerExistieret = false;
        let rTische = 0;
        let sitzeProTisch = 0;
        let bestuhlung = null;
        let plgastordnerlist = null;
        (async function() {
          try {
            const response = await (0, import_node_fetch3.default)("/getveranstaltung");
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
              window.alert("Es existiert keine Veranstaltung mit dem gegebenen Namen");
            } else {
              const gl = ver.gaestelist;
              const veranstalungName = ver.veranstaltung;
              rTische = ver.Sitzplan.recheckigenTische;
              sitzeProTisch = ver.Sitzplan.sitzeprotisch;
              bestuhlung = ver.Sitzplan.Bestuhlung;
              platzlist = new Array(rTische * sitzeProTisch);
              plgastordnerlist = new Array(rTische * sitzeProTisch);
              main2.innerHTML = `<div id="gaestelistanzeiger"></div>
              <div id="sitzplananzeiger"></div>
              <div id="zuordnendiv"></div>`;
              const glanzeiger = document.getElementById("gaestelistanzeiger");
              const zuordnendiv = document.getElementById("zuordnendiv");
              gaestelistPrint(gl, glanzeiger);
              plgastordnerlistPrint(rTische, sitzeProTisch, bestuhlung, plgastordnerlist, verName.value);
              zuordnenFun(platzlist, zuordnendiv, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, gl, veranstalungName);
              window.addEventListener("resize", function() {
                gaestelistPrint(gl, glanzeiger);
                plgastordnerlistPrint(rTische, sitzeProTisch, bestuhlung, plgastordnerlist, verName.value);
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
    function gaestelistPrint(gl, myDiv) {
      const block = document.createElement("li");
      block.innerHTML = "<li><a>Gast Nr.8: name: 8, </a><a>kind: Ja, </a><a>status: unbekannt</a></li>";
      myDiv.appendChild(block);
      const blockHeight = block.clientHeight;
      block.remove();
      myDiv.innerHTML = "";
      const wHeight = window.innerHeight - 230;
      const mylist = document.createElement("ul");
      mylist.setAttribute("id", "listanzeiger");
      const glMsg = document.createElement("a");
      glMsg.innerText = "G\xE4steList";
      mylist.appendChild(glMsg);
      myDiv.appendChild(mylist);
      const larrow = document.createElement("span");
      larrow.innerText = "\u2190";
      larrow.setAttribute("id", "paginationarrow");
      const rarrow = document.createElement("span");
      rarrow.setAttribute("id", "paginationarrow");
      rarrow.innerText = "\u2192";
      let anzitemproSeite = parseInt(wHeight / parseInt(blockHeight));
      if (anzitemproSeite <= 0) {
        anzitemproSeite = 1;
      }
      let anzpages = 0;
      if (parseInt(gl.length / anzitemproSeite) <= 0) {
        anzpages = 1;
      } else {
        anzpages = parseInt(gl.length / anzitemproSeite);
      }
      if (anzpages <= 0) {
        anzpages = gl.length;
      }
      if (isNaN(anzpages)) {
        anzpages = gl.length;
      }
      if (anzpages * wHeight / 19 < gl.length) {
        anzpages++;
      }
      if (aktuellSeiteGL > anzpages) {
        aktuellSeiteGL = anzpages;
      }
      if (aktuellSeiteGL !== 1) {
        printgl(aktuellSeiteGL, gl, mylist, anzitemproSeite);
      } else {
        aktuellSeiteGL = 1;
        printgl(aktuellSeiteGL, gl, mylist, anzitemproSeite);
      }
      rarrow.addEventListener("click", function() {
        if (!(aktuellSeiteGL === anzpages)) {
          aktuellSeiteGL++;
          mylist.innerHTML = "";
          const glMsg2 = document.createElement("a");
          glMsg2.innerText = "G\xE4steList";
          paginationPage.innerText = aktuellSeiteGL + "/ " + anzpages;
          mylist.appendChild(glMsg2);
          printgl(aktuellSeiteGL, gl, mylist, anzitemproSeite);
        }
      });
      larrow.addEventListener("click", function() {
        if (aktuellSeiteGL !== 1) {
          aktuellSeiteGL--;
          mylist.innerHTML = "";
          const glMsg2 = document.createElement("a");
          glMsg2.innerText = "G\xE4steList";
          paginationPage.innerText = aktuellSeiteGL + "/ " + anzpages;
          mylist.appendChild(glMsg2);
          printgl(aktuellSeiteGL, gl, mylist, anzitemproSeite);
        }
      });
      const paginationPage = document.createElement("a");
      paginationPage.innerText = aktuellSeiteGL + "/ " + anzpages;
      paginationPage.setAttribute("id", "paginationPage");
      myDiv.appendChild(larrow);
      myDiv.appendChild(paginationPage);
      myDiv.appendChild(rarrow);
    }
    function printgl(pageNr, gl, mylist, anzitemproSeite) {
      for (let n = (pageNr - 1) * anzitemproSeite; n < gl.length && n < pageNr * anzitemproSeite; n++) {
        const g = gl[n];
        const obj = document.createElement("li");
        const gname = g.name;
        const gkind = g.kind;
        const gstatus = g.status;
        const objname = document.createElement("a");
        objname.innerText = "Gast Nr." + (n + 1) + ": name: " + gname + ", ";
        const objkind = document.createElement("a");
        objkind.innerText = "kind: " + gkind + ", ";
        const objstatus = document.createElement("a");
        objstatus.innerText = "status: " + gstatus;
        obj.appendChild(objname);
        obj.appendChild(objkind);
        obj.appendChild(objstatus);
        mylist.appendChild(obj);
      }
    }
    function plgastordnerlistPrint(rTische, sitzeProTisch, bestuhlung, plgastordnerlist, vername) {
      const header2 = document.getElementById("bodyheader");
      header2.innerHTML = '<h5 id="back">zur\xFCck zur Hauptseite</h5><h2></h2><h5>  f\xFCr die Veranstaltung ' + vername + " gibt es " + rTische + " Tische und " + sitzeProTisch + " Sitzplatz pro Tisch. Tische haben " + bestuhlung + " bestuhlung.";
      const btnBack = document.getElementById("back");
      btnBack.addEventListener("click", () => {
        window.location.reload();
      });
    }
    let aktuellSeitePL = 1;
    function zuordnenFun(pl, myDiv, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, gastelist, veranstalungName) {
      const block = document.createElement("li");
      block.innerHTML = "platz Nr.n: sitzt den Gast Nr.:<input><button>speicher Platz</button>";
      myDiv.appendChild(block);
      const blockHeight = block.clientHeight;
      myDiv.innerHTML = "";
      const wHeight = window.innerHeight - 230;
      const mylist = document.createElement("ul");
      mylist.setAttribute("id", "PLanzeiger");
      const plMsg = document.createElement("a");
      plMsg.innerText = "Bitte geben Sie der Nummer des Gasts ein : ";
      mylist.appendChild(plMsg);
      myDiv.appendChild(mylist);
      const larrow = document.createElement("span");
      larrow.innerText = "\u2190";
      larrow.setAttribute("id", "paginationarrow");
      const rarrow = document.createElement("span");
      rarrow.setAttribute("id", "paginationarrow");
      rarrow.innerText = "\u2192";
      let anzitemproSeite = parseInt(wHeight / blockHeight);
      if (anzitemproSeite <= 0) {
        anzitemproSeite = 1;
      }
      let anzpages = 0;
      if (parseInt(pl.length / anzitemproSeite) <= 0) {
        anzpages = 1;
      } else {
        anzpages = parseInt(pl.length / anzitemproSeite);
      }
      if (anzpages <= 0) {
        anzpages = pl.length;
      }
      if (isNaN(anzpages)) {
        anzpages = pl.length;
      }
      if (anzpages * wHeight / blockHeight < pl.length) {
        anzpages++;
      }
      if (aktuellSeitePL > anzpages) {
        aktuellSeitePL = anzpages;
      }
      if (aktuellSeitePL !== 1) {
        PlatzeInputs(aktuellSeitePL, pl, mylist, anzitemproSeite, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, gastelist, veranstalungName);
      } else {
        aktuellSeitePL = 1;
        PlatzeInputs(aktuellSeitePL, pl, mylist, anzitemproSeite, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, gastelist, veranstalungName);
      }
      rarrow.addEventListener("click", function() {
        if (!(aktuellSeitePL === anzpages)) {
          aktuellSeitePL++;
          mylist.innerHTML = "";
          const plMsg2 = document.createElement("a");
          plMsg2.innerText = "Bitte geben Sie der Nummer des Gasts ein : ";
          paginationPage.innerText = aktuellSeitePL + "/ " + anzpages;
          mylist.appendChild(plMsg2);
          PlatzeInputs(aktuellSeitePL, pl, mylist, anzitemproSeite, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, gastelist, veranstalungName);
        }
      });
      larrow.addEventListener("click", function() {
        if (aktuellSeitePL !== 1) {
          aktuellSeitePL--;
          mylist.innerHTML = "";
          const plMsg2 = document.createElement("a");
          plMsg2.innerText = "Bitte geben Sie der Nummer des Gasts ein : ";
          paginationPage.innerText = aktuellSeitePL + "/ " + anzpages;
          mylist.appendChild(plMsg2);
          PlatzeInputs(aktuellSeitePL, pl, mylist, anzitemproSeite, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, gastelist, veranstalungName);
        }
      });
      const paginationPage = document.createElement("a");
      paginationPage.innerText = aktuellSeitePL + "/ " + anzpages;
      paginationPage.setAttribute("id", "paginationPage");
      myDiv.appendChild(larrow);
      myDiv.appendChild(paginationPage);
      myDiv.appendChild(rarrow);
    }
    function PlatzeInputs(pageNr, pl, mylist, anzitemproSeite, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, gaestelist, veranstalungName) {
      let aktTisch = 1;
      let aktPlatz = 1;
      for (let n = (pageNr - 1) * anzitemproSeite; n < pl.length && n < pageNr * anzitemproSeite; n++) {
        const obj = document.createElement("li");
        const objinput = document.createElement("input");
        objinput.setAttribute("id", "plgsinput" + n);
        if (plgastordnerlist[n] != null) {
          aktTisch = parseInt(n / sitzeProTisch) + 1;
          let aktPlatz2 = parseInt(n + 1 - aktTisch * sitzeProTisch);
          if (aktPlatz2 <= 0) {
            aktPlatz2 += parseInt(sitzeProTisch);
          }
          obj.innerText = "Tisch Nr. " + aktTisch + ", platz Nr. " + aktPlatz2 + " besitzt von Gast Nr. " + plgastordnerlist[n];
          obj.setAttribute("id", "p" + n);
          const gastloschen = document.createElement("button");
          gastloschen.innerText = "Gast l\xF6schen";
          gastloschen.setAttribute("id", "platzptn");
          obj.appendChild(gastloschen);
          gastloschen.addEventListener("click", function() {
            plgastordnerlist[n] = null;
            mylist.innerHTML = "";
            PlatzeInputs(pageNr, pl, mylist, anzitemproSeite, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, gaestelist, veranstalungName);
          });
        } else {
          aktTisch = parseInt(n / sitzeProTisch) + 1;
          aktPlatz = n + 1 - aktTisch * sitzeProTisch;
          if (aktPlatz <= 0) {
            aktPlatz += parseInt(sitzeProTisch);
          }
          obj.innerText = "Tisch Nr. " + aktTisch + ", platz Nr. " + aktPlatz + ": den Gast Nr. setzen:";
          obj.setAttribute("id", "p" + n);
          const platzbtn = document.createElement("button");
          platzbtn.innerText = "speicher Platz";
          platzbtn.setAttribute("id", "platzptn");
          platzbtn.addEventListener("click", function() {
            const val = document.getElementById("plgsinput" + n);
            plgastordnerlist[n] = val.value;
            mylist.innerHTML = "";
            PlatzeInputs(pageNr, pl, mylist, anzitemproSeite, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, gaestelist, veranstalungName);
          });
          obj.appendChild(objinput);
          obj.appendChild(platzbtn);
        }
        mylist.appendChild(obj);
        const saveBtn = document.createElement("button");
        saveBtn.setAttribute("id", "SitzplaetzeZuordnungBTN");
      }
      const SaveZuordnungBTN = document.createElement("button");
      SaveZuordnungBTN.innerText = "Zuordnung Speichern";
      SaveZuordnungBTN.setAttribute("id", "platzptn");
      SaveZuordnungBTN.addEventListener("click", function() {
        fechtGastPlaetzeZuordnung(gaestelist, plgastordnerlist, rTische, sitzeProTisch, bestuhlung, veranstalungName);
      });
      mylist.appendChild(SaveZuordnungBTN);
    }
  }
  async function fechtGastPlaetzeZuordnung(gastelist, plaetzeZuordnung, reTische, platzproTisch, bestuhlung, veranstalungName) {
    const tofetchlist = [];
    for (let i = 0; i < plaetzeZuordnung.length; i++) {
      tofetchlist[i] = gastelist[plaetzeZuordnung[i] - 1];
    }
    const sitzplan = { recheckigenTische: reTische, sitzeprotisch: platzproTisch, Bestuhlung: bestuhlung, g\u00E4stezuordnung: tofetchlist };
    await (0, import_node_fetch3.default)("/gastplaetzezuordnunganliegen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ veranvaeranstaltungsname: veranstalungName, Sitzplan: sitzplan })
    }).then((response) => {
      if (response) {
        return response.json();
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  var SitzplanZuordnungAnliegen_default = GaestePlatzZuordnen;

  // src/js/veranstaltungenAnzeigen.mjs
  var import_node_fetch4 = __toESM(require_browser(), 1);
  function veranstaltungenAnzeigen() {
    const veranstaltungenContainer = document.createElement("div");
    const header2 = document.getElementById("Main");
    header2.innerHTML = "";
    if (!veranstaltungenContainer) {
      console.error("nicht gefunden");
      return;
    }
    fetchVeranstaltungen().then(function(veranstaltungen) {
      for (let i = 0; i < veranstaltungen.length; i++) {
        const veranstaltung = veranstaltungen[i];
        const veranstaltungElement = document.createElement("div");
        veranstaltungElement.innerHTML = "<h3>" + veranstaltung.veranstaltung + "</h3>" + veranstaltung.datum + "</p>";
        veranstaltungenContainer.appendChild(veranstaltungElement);
      }
      header2.appendChild(veranstaltungenContainer);
    }).catch(function(error) {
      console.error(error);
    });
    fetchVeranstaltungen().then(function(veranstaltungen) {
      Anzeigeseite(veranstaltungen, 1);
    }).catch(function(error) {
      console.error(error);
    });
  }
  async function fetchVeranstaltungen() {
    try {
      const response = await (0, import_node_fetch4.default)("/getveranstaltung");
      const veranstaltungen = await response.json();
      return veranstaltungen;
    } catch (error) {
      console.error("Error fetching", error);
      throw error;
    }
  }
  var AnzahlElementeProSeite = 5;
  function Anzeigeseite(Elemente, SeitenNr) {
    const startIndex = (SeitenNr - 1) * AnzahlElementeProSeite;
    const endIndex = startIndex + AnzahlElementeProSeite;
    const aktuelleSeitenElemente = Elemente.slice(startIndex, endIndex);
    const veranstaltungenContainer = document.createElement("div");
    const header2 = document.getElementById("Main");
    header2.innerHTML = "";
    for (const Element of aktuelleSeitenElemente) {
      const veranstaltungElement = document.createElement("div");
      veranstaltungElement.innerHTML = "<h3>" + Element.veranstaltung + "</h3>" + Element.datum + "</p>";
      veranstaltungenContainer.appendChild(veranstaltungElement);
    }
    const paginationContainer = document.createElement("div");
    const Seitenzahl = Math.ceil(Elemente.length / AnzahlElementeProSeite);
    const previousButton = document.createElement("button");
    previousButton.innerHTML = "&larr;";
    if (SeitenNr === 1) {
      previousButton.disabled = true;
    }
    previousButton.addEventListener("click", () => {
      Anzeigeseite(Elemente, SeitenNr - 1);
    });
    paginationContainer.appendChild(previousButton);
    const nextButton = document.createElement("button");
    nextButton.innerHTML = "&rarr;";
    if (SeitenNr === Seitenzahl) {
      nextButton.disabled = true;
    }
    nextButton.addEventListener("click", () => {
      Anzeigeseite(Elemente, SeitenNr + 1);
    });
    paginationContainer.appendChild(nextButton);
    header2.appendChild(veranstaltungenContainer);
    header2.appendChild(paginationContainer);
  }
  var veranstaltungenAnzeigen_default = veranstaltungenAnzeigen;

  // src/js/test.mjs
  function testfun() {
    let aktuellSeite = null;
    const main2 = document.getElementById("Main");
    main2.innerHTML = "<a>monitoring widow size... </a><br>";
    const printBtn = document.createElement("button");
    printBtn.innerText = "print";
    main2.appendChild(printBtn);
    printBtn.addEventListener("click", function() {
      prinlistOf50();
    });
    let changes = 0;
    window.addEventListener("resize", function() {
      changes++;
      main2.innerHTML = "<a>window size changed </a><br>" + changes;
      prinlistOf50();
    });
    function prinlistOf50() {
      const l = [50];
      for (let n = 1; n < 51; n++) {
        l[n - 1] = n;
      }
      const wHeight = window.innerHeight - 200;
      main2.innerHTML = "";
      const myDiv = document.createElement("div");
      const mylist = document.createElement("ul");
      myDiv.appendChild(mylist);
      const larrow = document.createElement("span");
      larrow.innerText = "\u2190";
      larrow.setAttribute("id", "paginationarrow");
      const rarrow = document.createElement("span");
      rarrow.setAttribute("id", "paginationarrow");
      rarrow.innerText = "\u2192";
      let pagesbuttunsAnz = 0;
      const anzitemproSeite = parseInt(wHeight / 19);
      let anzpages = 50 / anzitemproSeite;
      if (anzpages * wHeight / 19 < 50) {
        anzpages++;
      }
      const pagesbuttons = [anzpages];
      if (aktuellSeite != null) {
        printl(aktuellSeite, l);
      }
      for (let x = 0; x < anzpages; x++) {
        if (x === 0) {
          myDiv.appendChild(larrow);
        }
        pagesbuttunsAnz++;
        pagesbuttons[x] = document.createElement("a");
        pagesbuttons[x].setAttribute("id", "paginationbutton");
        pagesbuttons[x].innerText = pagesbuttunsAnz;
        const thisPage = x + 1;
        if (thisPage === 1 && aktuellSeite === null) {
          aktuellSeite = 1;
          printl(thisPage, l);
        }
        pagesbuttons[x].addEventListener("click", function() {
          mylist.innerHTML = "";
          const glMsg = document.createElement("a");
          glMsg.innerText = "G\xE4steList";
          mylist.appendChild(glMsg);
          aktuellSeite = x + 1;
          printl(x + 1, l);
        });
        myDiv.appendChild(pagesbuttons[pagesbuttunsAnz - 1]);
      }
      myDiv.appendChild(rarrow);
      rarrow.addEventListener("click", function() {
        if (!(aktuellSeite === anzpages)) {
          mylist.innerHTML = "";
          const glMsg = document.createElement("a");
          glMsg.innerText = "G\xE4steList";
          mylist.appendChild(glMsg);
          aktuellSeite++;
          printl(aktuellSeite, l);
        }
      });
      larrow.addEventListener("click", function() {
        if (aktuellSeite !== 1) {
          mylist.innerHTML = "";
          const glMsg = document.createElement("a");
          glMsg.innerText = "G\xE4steList";
          mylist.appendChild(glMsg);
          aktuellSeite--;
          printl(aktuellSeite, l);
        }
      });
      main2.appendChild(myDiv);
      function printl(pageNr, l2) {
        console.log(pageNr);
        for (let n = (pageNr - 1) * anzitemproSeite; n < l2.length && n < pageNr * anzitemproSeite; n++) {
          const obj = document.createElement("li");
          obj.innerText = "obj" + n + ": " + l2[n];
          mylist.appendChild(obj);
        }
      }
    }
  }
  var test_default = testfun;

  // src/js/Main.mjs
  var verAn = VerAnlegen_default;
  var header = document.getElementById("bodyheader");
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
  function ButtonBack() {
    const header2 = document.getElementById("bodyheader");
    header2.innerHTML = '<h5 id="back">zur\xFCck zur Hauptseite</h5><h2></h2>';
    const btnBack = document.getElementById("back");
    btnBack.addEventListener("click", () => {
      window.location.reload();
    });
  }
  var main = document.getElementsByClassName("Main")[0];
  var mainDiv = document.createElement("div");
  mainDiv.setAttribute("id", "mainSeiteDiv");
  var btn = document.createElement("button");
  btn.textContent = " meine Veransaltungen";
  btn.setAttribute("id", "btn");
  btn.addEventListener("click", () => {
    ButtonBack();
    veranstaltungenAnzeigen_default();
  });
  var btn2 = document.createElement("button");
  btn2.textContent = "neue Veranstaltung";
  btn2.setAttribute("id", "btn2");
  btn2.addEventListener("click", () => {
    ButtonBack();
    verAn();
  });
  var gastlistErstellen = document.createElement("button");
  gastlistErstellen.textContent = "Gaestelist erstellen";
  gastlistErstellen.setAttribute("id", "gserstellen");
  gastlistErstellen.addEventListener("click", () => {
    ButtonBack();
    gastliste_default();
  });
  var gaesteplaetzeZuordnen = document.createElement("button");
  gaesteplaetzeZuordnen.textContent = "Sitzpl\xE4tze zuordnen";
  gaesteplaetzeZuordnen.setAttribute("id", "Sitzpl\xE4tzezuordnen");
  gaesteplaetzeZuordnen.addEventListener("click", () => {
    ButtonBack();
    SitzplanZuordnungAnliegen_default();
  });
  var testb = document.createElement("button");
  testb.textContent = "window size Monitor";
  testb.addEventListener("click", () => {
    ButtonBack();
    test_default();
  });
  main.appendChild(mainDiv);
  mainDiv.appendChild(btn2);
  mainDiv.appendChild(btn);
  mainDiv.appendChild(gastlistErstellen);
  mainDiv.appendChild(gaesteplaetzeZuordnen);
  mainDiv.appendChild(testb);
})();
