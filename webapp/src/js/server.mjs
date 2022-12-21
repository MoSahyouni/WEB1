import express from 'express';
const server = express();

let port = 8080;
if (process.argv.length >= 3) {
  const argument = process.argv;
  if (!isNaN(argument[2]) && argument[2] < 65536) { port = argument[2]; } else {
    console.log('invaild input, server will be listening on port 8080');
  }
}

server.use(express.static('dist'));
server.get('/', (request, response) => {
  response.send('hi');
});

server.get('/anmelden', (request, response) => {
  response.send(`
  <ul id="list", style="color: rgb(85, 26, 1)">
    <li>Vorname: <input id="vname", type="text"></li>
    <li>Nachname: <input id="nname", type="text"></li>
    <li>passwort: <input id="passw", type="text"></li>
    <br>
    <button id="btnJSON" >Nutzer erstellen</button>
  </ul>
  <p id="userdata"></p> 
  <script>
  const vname = document.getElementById('vname');
  const nname = document.getElementById('nname');
  const pass = document.getElementById('passw');
  const btnJSN = document.getElementById('btnJSON');
  const userdatatext = document.getElementById("userdata");
  btnJSN.addEventListener("click", function(){
    var user = {
      "Vorname": vname.value,
      "Nachname": nname.value,
      "Passwort": pass.value
    }
    userdatatext.innerHTML= JSON.stringify(user);
  })
  </script>
  `);
});

server.get('/neueVeranstaltung', (request, response) => {
  response.send('Neue Veranstaltung anlegen');
});

server.get('/json', (request, response) => {
  response.json({
    message: 'Hello, World!',
    success: true
  });
});

server.listen(port, console.log('server listening on port ' + port.toString()));
