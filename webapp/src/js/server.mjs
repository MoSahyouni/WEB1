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
  response.send('ih');
});

server.get('/anmelden', (request, response) => {
  response.send('Anmelden');
});

server.get('/json', (request, response) => {
  response.json({
    message: 'Hello, World!',
    success: true
  });
});

server.listen(port, console.log('server listening on port ' + port.toString()));
