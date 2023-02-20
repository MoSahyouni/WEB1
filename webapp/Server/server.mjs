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
const BASE_URI = `http://localhost:${port}`;
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

server.post('/veranstaltungloschen', (req, res) => {
  (async function () {
    const client5 = new MongoClient('mongodb://localhost:27017');
    try {
      await client5.connect();
      const dbo = client5.db('DatenBank');
      const collection = dbo.collection('veranstaltungen');
      await collection.deleteOne({ name: req.body.name });
      const sp = dbo.collection('Sitzpläne');
      const gl = dbo.collection('GästeListen');
      await sp.deleteOne({ veranstaltungsname: req.body.name });
      await gl.deleteOne({ veranstaltungsname: req.body.name });
    } catch (error) {
      console.error(error);
    } finally {
      client5.close();
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
      veranstaltungsname: req.body.vname,
      gaestelist: req.body.Gästelist

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
server.post('/gastelisteAktualisieren', async (req, res) => {
  console.log(req.body.vname);

  const client4 = new MongoClient('mongodb://localhost:27017');
  try {
    await client4.connect();
    const db = client4.db('DatenBank');
    const gl = db.collection('GästeListen');

    const Ver = { name: req.body.vname };
    const newvalues = { $set: { gaestelist: req.body.Gästelist, Sitzplan: req.body.sitzplan } };
    db.collection('veranstaltungen').updateOne(Ver, newvalues, function (err, res) {
      if (err) throw err;
    });
    const VerSitzplan = { veranstaltungsname: req.body.vname };
    const newvaluesSitzplan = { $set: { Sitzplan: req.body.sitzplan } };
    db.collection('Sitzpläne').updateOne(VerSitzplan, newvaluesSitzplan, function (err, res) {
      if (err) throw err;
    });
    const ver2 = { veranstaltungsname: req.body.vname };
    const newvalues2 = { $set: { gaestelist: req.body.Gästelist } };
    const result = await gl.updateOne(ver2, newvalues2, function (err, res) {
      if (err) throw err;
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occured while creating the event' });
  } finally {
    client4.close();
  }
});
const router = express.Router();
server.use(router);
router.get('/R', (req, res) => {
  res.json({
    _links: {
      self: { href: `${BASE_URI}` },
      veranstaltungen: { href: `${BASE_URI}/veranstaltungen` },
      sitzplane: { href: `${BASE_URI}/Sitzplaäne` },
      gastelisten: { href: `${BASE_URI}/GästeListen` }

    }
  });
});

let veranstaltungen = null;
const versId = [];

async function getAllVeranstaltunegn () {
  let client = null;
  try {
    client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
  } catch (error) {
    console.error(error);
    process.exit(-1);
  }

  const dbo = client.db('DatenBank');
  veranstaltungen = await dbo.collection('veranstaltungen').find().toArray();
  veranstaltungen.forEach(Element => {
    Object.entries(Element).forEach(([keys, values]) => {
      if (keys === '_id') {
        const id = JSON.stringify(values);
        versId.push(id.substring(1, id.length - 1));
      }
    });
  });

  return {
    veranstaltungen: veranstaltungen,
    veranstaltungenid: versId
  }
  ;
}
(async function () { await getAllVeranstaltunegn(); })();

router.get('/veranstaltungen', (request, response) => {
  (async function () {
    await getAllVeranstaltunegn();
  })();
  if (veranstaltungen) {
    response.json(createVerListeBody());
  }
});
function createVerListeBody () {
  (async function () {
    await getAllVeranstaltunegn();
  })();
  return {
    veranstaltungen: veranstaltungen.map(obj => {
      return {
        name: obj.name,
        href: `${BASE_URI}/veranstaltungen/${obj._id}`
      };
    }),
    _links: {
      self: {
        href: `${BASE_URI}/veranstaltungen`
      },
      create: {
        method: 'POST',
        href: `${BASE_URI}/veranstaltungen`
      }
    }
  };
}

router.get('/veranstaltungen/:id', (request, response) => {
  const id = request.params.id;

  if (!versId.includes(id)) {
    response.sendStatus(404);
  } else {
    response.json(createVerBody(id));
  }
});

function createVerBody (id) {
  (async function () {
    await getAllVeranstaltunegn();
  })();
  let ver = null;
  for (let i = 0; i < veranstaltungen.length; i++) {
    const element = veranstaltungen[i];
    const elemid = JSON.stringify(element._id).substring(1, JSON.stringify(element._id).length - 1);
    if (elemid === id) {
      ver = element;
    }
  }
  return {
    veranstaltung: ver,
    _links: {
      self: {
        href: `${BASE_URI}/veranstaltungen/${id}`
      },
      update: {
        method: 'PUT',
        href: `${BASE_URI}/veranstaltungen/${id}`
      },
      delete: {
        method: 'DELETE',
        href: `${BASE_URI}/veranstaltungen/${id}`
      },
      list: {
        href: `${BASE_URI}/veranstaltungen`
      }
    }
  };
}

server.delete('/veranstaltungen/:id', (request, response) => {
  const id = request.params.id;
  if (!versId.includes(id)) {
    response.sendStatus(404);
  } else {
    let vername = '';
    versId.filter(function (e) { return !(e === id); });
    for (let i = 0; i < veranstaltungen.length; i++) {
      const element = veranstaltungen[i];
      const elemid = JSON.stringify(element._id).substring(1, JSON.stringify(element._id).length - 1);
      if (elemid === id) {
        vername = element.name;
        veranstaltungen.splice(i, 1);
        console.log(vername);
      }
    }
    (async function () {
      const mongo = new MongoClient('mongodb://localhost:27017');
      try {
        await mongo.connect();
        const dbo = mongo.db('DatenBank');
        await dbo.collection('veranstaltungen').deleteOne({ name: vername });
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'An error occured while creating the event' });
      } finally {
        mongo.close();
      }
    })();
    response.json(createVerListeBody());
  }
});

server.listen(port, console.log('server listening on port ' + port));
