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

server.post('/veranstaltungerzeugen', async (req, res) => {
  const client = new MongoClient('mongodb://localhost:27017');
  try {
    await client.connect();
    const db = client.db('DatenBank');
    const veranstaltungen = db.collection('veranstaltungen');
    const Splan = db.collection('Sitzpläne');
    await Splan.insertOne({
      veranstaltungsname: req.body.name,
      Sitzplan: req.body.sitzplan
    });
    const result = await veranstaltungen.insertOne({
      name: req.body.name,
      datum: req.body.datum,
      Sitzplan: req.body.sitzplan
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error while creating the event' });
  } finally {
    client.close();
  }
});

server.get('/getveranstaltung', (req, res) => {
  (async function () {
    const client2 = new MongoClient('mongodb://localhost:27017');
    try {
      await client2.connect();
      const dbo = client2.db('DatenBank');
      const collection = dbo.collection('veranstaltungen');
      const vers = await collection.find().toArray();

      const result = vers;

      res.json(result);
    } catch (error) {
      console.error(error);
    } finally {
      client2.close();
    }
  })();
});

server.post('/gasterzeugen', async (req, res) => {
  const client = new MongoClient('mongodb://localhost:27017');
  try {
    await client.connect();
    const db = client.db('DatenBank');
    const gäste = db.collection('GästeListen');

    const Ver = { name: req.body.vname };
    const newvalues = { $set: { gaestelist: req.body.Gästelist } };
    db.collection('veranstaltungen').updateOne(Ver, newvalues, function (err, res) {
      if (err) throw err;
      console.log('veranstaltung updated');
    });
    const result = await gäste.insertOne({
      veranvaeranstaltungsname: req.body.vname,
      gästeliste: req.body.Gästelist

    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occured while creating the event' });
  } finally {
    client.close();
  }
});

server.post('/gastplaetzezuordnunganliegen', async (req, res) => {
  console.log(req.body.veranstaltungsname);

  const client3 = new MongoClient('mongodb://localhost:27017');
  try {
    await client3.connect();
    const db = client3.db('DatenBank');
    const spl = db.collection('Sitzpläne');

    const Ver = { name: req.body.veranstaltungsname };
    const newvalues = { $set: { Sitzplan: req.body.Sitzplan } };
    db.collection('veranstaltungen').updateOne(Ver, newvalues, function (err, res) {
      if (err) throw err;
    });
    const ver2 = { veranstaltungsname: req.body.veranstaltungsname };
    const newvalues2 = { $set: { Sitzplan: req.body.Sitzplan } };
    const result = await spl.updateOne(ver2, newvalues2, function (err, res) {
      if (err) throw err;
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occured while creating the event' });
  } finally {
    client3.close();
  }
});

server.listen(port, console.log('server listening on port ' + port));
