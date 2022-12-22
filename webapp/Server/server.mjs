import express from 'express';
const server = express();

let port = 8080;
const maxPort = 65535;
if (process.argv.length >= 3) {
  const argument = process.argv;
  if (!isNaN(argument[2]) && argument[2] < maxPort + 1) { port = argument[2]; } else {
    console.log('invaild input, server will be listening on port 8080');
  }
}

server.use(express.static('dist'));
server.get('/', (request, response) => {
  response.send('hi');
});

server.get('/anmelden', (request, response) => {
  response.send('anmelden_data');
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
