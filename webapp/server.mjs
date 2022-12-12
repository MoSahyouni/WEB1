import express from 'express';
import path from 'path';
const server = express();

server.use(express.static(path.join(path.dirname(process.argv[1]), 'dist')));

server.get('/', (request, response) => {
  response.send('Hello, World!');
});

server.get('/json', (request, response) => {
  response.json({
    message: 'Hello, World!',
    success: true
  });
});

server.listen(8080, console.log('server listing on port 8080'));
