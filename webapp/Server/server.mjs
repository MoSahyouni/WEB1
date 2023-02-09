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
    const Splan = db.collection('Sitzpläne');
    await Splan.insertOne({
      verastaltungsname: req.body.name,
      Sitzplan: req.body.sitzplan
    });
    const result = await veranstaltungen.insertOne({
      veranstaltung: req.body.name,
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
// const router = express.Router();
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

/* server.post('/gasterzeugen', async (req, res) => {
  const client = new MongoClient('mongodb://localhost:27017');
  try {
    await client.connect();
    const db = client.db('DatenBank');
    const gäste = db.collection('Gäste');
    const result = await gäste.insertMany({
      name: req.body.name,
      kind: req.body.kind,
      status: req.body.status
    });
    console.log(req.body);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occured while creating the event' });
  } finally {
    client.close();
  }
}); */
server.post('/gasterzeugen', async (req, res) => {
  const client = new MongoClient('mongodb://localhost:27017');
  try {
    await client.connect();
    const db = client.db('DatenBank');
    const gäste = db.collection('GästeListen');
    const result = await gäste.insertOne({
      veranvaeranstaltungsname: req.body.veranvaeranstaltungsname,
      gästeliste: req.body.Gästelist
    });

    MongoClient.connect('mongodb://localhost:27017', function (err, db) {
      if (err) throw err;
      const dbo = db.db('DatenBank');
      const Ver = { veranstaltung: req.body.veranvaeranstaltungsname };
      const newvalues = { gaestelist: req.body.Gästelist };
      dbo.collection('veranstaltungen').updateOne(Ver, newvalues, function (err, res) {
        if (err) throw err;
        console.log('veranstaltung updated');
        db.close();
      });
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
  MongoClient.connect('mongodb://localhost:27017', function (err, db) {
    if (err) throw err;
    const dbo = db.db('DatenBank');
    const Ver = { verastaltungsname: req.body.veranvaeranstaltungsname };
    const newvalues = { Sitzplan: req.body.Sitzplan };
    dbo.collection('veranstaltungen').updateOne({ veranstaltung: req.body.veranvaeranstaltungsname }, newvalues, function (err, res) {
      if (err) throw err;
      console.log('veranstaltung updated');
      db.close();
    });
    dbo.collection('Sitzpläne').updateOne(Ver, newvalues, function (err, res) {
      if (err) throw err;
      console.log('veranstaltung updated');
      db.close();
    });
  });
  /*
  const client = new MongoClient('mongodb://localhost:27017');
  let Collection;

  async function connectToMongo () {
    try {
      await client.connect();
      Collection = client.db('DatenBank').collection('veranstaltungen');
    } catch (error) {
      console.error('Error connecting', error);
    }
  }

  connectToMongo();

  server.get('/veranstaltungenAnzeigen', async (req, res) => {
    try {
      const veranstaltungen = await Collection.find({}).toArray();
      res.json(veranstaltungen);
    } catch (error) {
      console.error('Error :', error);
      res.sendStatus(500);
    }
  });
*/
  /* const client = new MongoClient('mongodb://localhost:27017');
  try {
    await client.connect();
    const db = client.db('DatenBank');
    const sitzplaene = db.collection('Sitzpläne');
    const newValues = { $set: { Sitzplan: req.body.Sitzplan } };
    const result = await sitzplaene.updateOne({ verastaltungsname: req.body.veranvaeranstaltungsname }, newValues, function (err, res) {
      if (err) throw err;
      console.log('veranstaltung updated');
    });

     MongoClient.connect('mongodb://localhost:27017', function (err, db) {
      if (err) throw err;
      const dbo = db.db('DatenBank');
      const Ver = { veranstaltung: req.body.veranvaeranstaltungsname };
      const newvalues = { $set: { gaestelist: req.body.Gästelist } };
      dbo.collection('veranstaltungen').updateOne(Ver, newvalues, function (err, res) {
        if (err) throw err;
        console.log('veranstaltung updated');
        db.close();
      });
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occured while creating the event' });
  } finally {
    client.close();
  } */
});

server.listen(port, console.log('server listening on port ' + port));
