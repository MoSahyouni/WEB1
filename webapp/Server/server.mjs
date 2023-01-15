import express from 'express';

import { MongoClient } from 'mongodb';
const server = express();

let port = 8080;
const maxPort = 65535;
if (process.argv.length >= 3) {
  const argument = process.argv;
  if (!isNaN(argument[2]) && argument[2] < maxPort + 1) { port = argument[2]; } else {
    console.log('invaild input, server will be listening on port 8080');
  }
}

server.use(express.json({ extended: true, limit: '1mb' }));
server.use(express.static('dist'));
server.get('/', (request, response) => {
});

server.get('/json', (request, response) => {
  response.json({
    message: 'JSON',
    success: true
  });
});

/* server.post('/veranstaltungerzeugen', (req, res) => {
  MongoClient.connect('mongodb://localhost:27017', function (err, db) {
    if (err) throw err;
    const dbo = db.db('DatenBank');
    dbo.collection('veranstaltungen').insertOne({
      veranstaltung: req.body.vername
    },
    function (err, result) {
      if (err) throw err;
      res.json(result);
      db.close();
    });
  });
}); */

server.post('/veranstaltungerzeugen', async (req, res) => {
  const client = new MongoClient('mongodb://localhost:27017');
  try {
    await client.connect();
    const db = client.db('DatenBank');
    const veranstaltungen = db.collection('veranstaltungen');
    const result = await veranstaltungen.insertOne({
      veranstaltung: req.body.vername
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occured while creating the event' });
  } finally {
    client.close();
  }
});

server.listen(port, console.log('server listening on port ' + port));
