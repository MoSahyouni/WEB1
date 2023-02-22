import express from 'express';
import { MongoClient } from 'mongodb';
const server = express();

let port = 8080;
const maxPort = 65535;
if (process.argv.length >= 3) {
  const argument = process.argv;
  if (!isNaN(argument[2]) && argument[2] < maxPort + 1) { port = argument[2]; } else {
    console.log('ungültige Eingabe, der Server lauscht auf Port 8080');
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

const router = express.Router();
server.use(router);
router.get('/REST', (req, res) => {
  res.json({
    _links: {
      self: { href: `${BASE_URI}` },
      veranstaltungen: { href: `${BASE_URI}/veranstaltungen` },
      sitzplane: { href: `${BASE_URI}/sitzplaene` },
      gastelisten: { href: `${BASE_URI}/gaestelisten` }

    }
  });
});

let veranstaltungen = null;
let versId = [];

router.post('/veranstaltungen', async (req, res) => {
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

router.post('/gaestelisten', async (req, res) => {
  const client = new MongoClient('mongodb://localhost:27017');
  try {
    await client.connect();
    const db = client.db('DatenBank');
    const gäste = db.collection('GästeListen');

    const Ver = { name: req.body.vname };
    const newvalues = { $set: { gaestelist: req.body.Gästelist } };
    db.collection('veranstaltungen').updateOne(Ver, newvalues, function (err, res) {
      if (err) throw err;
    });
    const result = await gäste.insertOne({
      veranstaltungsname: req.body.vname,
      gaestelist: req.body.Gästelist

    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erorr' });
  } finally {
    client.close();
  }
});

async function getAllVeranstaltunegn () {
  let client = null;
  try {
    client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    const dbo = client.db('DatenBank');
    veranstaltungen = await dbo.collection('veranstaltungen').find().toArray();
    versId = [];
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
  } catch (error) {
    console.error(error);
    process.exit(-1);
  } finally {
    client.close();
  }
}

let gaestelisten = [];
let gaestelistenid = [];

async function getAllGästelisten () {
  let client = null;
  try {
    client = new MongoClient('mongodb://localhost:27017');
    await client.connect();

    const dbo = client.db('DatenBank');
    gaestelisten = await dbo.collection('GästeListen').find().toArray();
    gaestelistenid = [];
    gaestelisten.forEach(Element => {
      Object.entries(Element).forEach(([keys, values]) => {
        if (keys === '_id') {
          const id = JSON.stringify(values);

          gaestelistenid.push(id.substring(1, id.length - 1));
        }
      });
    });

    return {
      GästeListen: veranstaltungen,
      GasteListen_id: gaestelistenid
    }
    ;
  } catch (error) {
    console.error(error);
    process.exit(-1);
  } finally {
    client.close();
  }
}
let sitzplaene = [];
let sitzplaeneid = [];
async function getAllSitzpläne () {
  let client = null;
  try {
    client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    const dbo = client.db('DatenBank');
    sitzplaene = await dbo.collection('Sitzpläne').find().toArray();
    sitzplaeneid = [];
    sitzplaene.forEach(Element => {
      Object.entries(Element).forEach(([keys, values]) => {
        if (keys === '_id') {
          const id = JSON.stringify(values);

          sitzplaeneid.push(id.substring(1, id.length - 1));
        }
      });
    });
    return {
      Sitzpläne: sitzplaene,
      Sitzpläne_id: sitzplaeneid
    };
  } catch (error) {
    console.error(error);
    process.exit(-1);
  } finally {
    client.close();
  }
}
(async function () { await getAllGästelisten(); })();
(async function () { await getAllVeranstaltunegn(); })();
(async function () { await getAllSitzpläne(); })();
router.get('/veranstaltungen', (request, response) => {
  (async function () {
    await getAllVeranstaltunegn();

    if (veranstaltungen) {
      response.json(createVerListeBody());
    }
  })();
});
function createVerListeBody () {
  (async function () { await getAllVeranstaltunegn(); })();

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

router.put('/gaestelisten/:id', (request, response) => {
  const id = request.params.id;
  if (!gaestelistenid.includes(id)) {
    response.sendStatus(404);
  } else {
    let gl = null;
    for (let i = 0; i < gaestelisten.length; i++) {
      const element = gaestelisten[i];
      const elemid = JSON.stringify(element._id).substring(1, JSON.stringify(element._id).length - 1);
      if (elemid === id) {
        gl = element;
      }
    }
    let client = null;
    (async function () {
      const vname = gl.veranstaltungsname;
      try {
        client = new MongoClient('mongodb://localhost:27017');
        await client.connect();
        const db = client.db('DatenBank');
        const glcollection = db.collection('GästeListen');

        const Ver = { name: vname };
        const newvalues = { $set: { gaestelist: request.body.Gastelist, Sitzplan: request.body.sitzplan } };
        db.collection('veranstaltungen').updateOne(Ver, newvalues, function (err, res) {
          if (err) throw err;
        });
        const VerSitzplan = { veranstaltungsname: vname };
        const newvaluesSitzplan = { $set: { Sitzplan: request.body.sitzplan } };
        db.collection('Sitzpläne').updateOne(VerSitzplan, newvaluesSitzplan, function (err, res) {
          if (err) throw err;
        });
        const ver2 = { veranstaltungsname: vname };
        const newvalues2 = { $set: { gaestelist: request.body.Gastelist } };
        await glcollection.updateOne(ver2, newvalues2, function (err, res) {
          if (err) throw err;
        });
        getAllGästelisten();
        getAllSitzpläne();
        getAllVeranstaltunegn();
      } catch (error) {
        console.error(error);
        process.exit(-1);
      } finally {
        client.close();
      }
    })();
    response.json(createglBody(id));
  }
});

router.get('/gaestelisten', (request, response) => {
  (async function () {
    await getAllGästelisten();

    if (gaestelisten) {
      response.json(createglListBody());
    }
  })();
});
function createglListBody () {
  (async function () {
    await getAllGästelisten();
  })();
  return {
    gaestelisten: gaestelisten.map(obj => {
      return {
        veranstaltungsname: obj.veranstaltungsname,
        href: `${BASE_URI}/gaestelisten/${obj._id}`
      };
    }),
    _links: {
      self: {
        href: `${BASE_URI}/gaestelisten`
      },
      create: {
        method: 'POST',
        href: `${BASE_URI}/gaestelisten`
      }
    }
  };
}

router.get('/sitzplaene', (request, response) => {
  (async function () {
    await getAllSitzpläne();
    if (sitzplaene) {
      const res = await createSPListBody();
      response.json(res);
    }
  })();
});
async function createSPListBody () {
  (async function () {
    await getAllSitzpläne();
  })();
  return {
    Sitzpläne: sitzplaene.map(obj => {
      return {
        veranstaltungsname: obj.veranstaltungsname,
        href: `${BASE_URI}/sitzplaene/${obj._id}`
      };
    }),
    _links: {
      self: {
        href: `${BASE_URI}/sitzplaene`
      },
      create: {
        method: 'POST',
        href: `${BASE_URI}/sitzplaene`
      }
    }
  };
}

router.get('/veranstaltungen/:id', async (request, response) => {
  await getAllVeranstaltunegn();
  const id = request.params.id;

  if (!versId.includes(id)) {
    response.sendStatus(404);
  } else {
    response.json(await createVerBody(id));
  }
});
async function createVerBody (id) {
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
router.get('/gaestelisten/:id', (request, response) => {
  const id = request.params.id;

  if (!gaestelistenid.includes(id)) {
    response.sendStatus(404);
  } else {
    response.json(createglBody(id));
  }
});
function createglBody (id) {
  (async function () {
    await getAllVeranstaltunegn();
  })();
  let gl = null;
  for (let i = 0; i < gaestelisten.length; i++) {
    const element = gaestelisten[i];
    const elemid = JSON.stringify(element._id).substring(1, JSON.stringify(element._id).length - 1);
    if (elemid === id) {
      gl = element;
    }
  }
  return {
    gaestelisten: gl,
    _links: {
      self: {
        href: `${BASE_URI}/gaestelisten/${id}`
      },
      update: {
        method: 'PUT',
        href: `${BASE_URI}/gaestelisten/${id}`
      },
      delete: {
        method: 'DELETE',
        href: `${BASE_URI}/gaestelisten/${id}`
      },
      list: {
        href: `${BASE_URI}/gaestelisten`
      }
    }
  };
}
router.get('/sitzplaene/:id', async (request, response) => {
  const id = request.params.id;
  await getAllSitzpläne();

  if (!sitzplaeneid.includes(id)) {
    response.sendStatus(404);
  } else {
    response.json(await createSPBody(id));
  }
});
async function createSPBody (id) {
  (async function () {
    await getAllSitzpläne();
  })();
  let sp = null;
  for (let i = 0; i < sitzplaene.length; i++) {
    const element = sitzplaene[i];
    const elemid = JSON.stringify(element._id).substring(1, JSON.stringify(element._id).length - 1);
    if (elemid === id) {
      sp = element;
    }
  }
  return {
    Sitzplan: sp,
    _links: {
      self: {
        href: `${BASE_URI}/sitzplaene/${id}`
      },
      update: {
        method: 'PUT',
        href: `${BASE_URI}/sitzplaene/${id}`
      },
      delete: {
        method: 'DELETE',
        href: `${BASE_URI}/sitzplaene/${id}`
      },
      list: {
        href: `${BASE_URI}/sitzplaene`
      }
    }
  };
}

server.delete('/veranstaltungen/:id', async (request, response) => {
  const id = request.params.id;
  await getAllVeranstaltunegn();
  if (!versId.includes(id)) {
    console.log('hier');
    console.log(versId);
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
      }
    }
    (async function () {
      const mongo = new MongoClient('mongodb://localhost:27017');
      try {
        await mongo.connect();
        const dbo = mongo.db('DatenBank');
        await dbo.collection('veranstaltungen').deleteOne({ name: vername });
        await dbo.collection('GästeListen').deleteOne({ veranstaltungsname: vername });
        await dbo.collection('Sitzpläne').deleteOne({ veranstaltungsname: vername });
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

server.delete('/gaestelisten/:id', (request, response) => {
  const id = request.params.id;
  if (!gaestelistenid.includes(id)) {
    response.sendStatus(404);
  } else {
    let vername = '';
    gaestelistenid.filter(function (e) { return !(e === id); });
    for (let i = 0; i < gaestelisten.length; i++) {
      const element = gaestelisten[i];
      const elemid = JSON.stringify(element._id).substring(1, JSON.stringify(element._id).length - 1);
      if (elemid === id) {
        vername = element.veranstaltungsname;
        gaestelisten.splice(i, 1);
      }
    }
    (async function () {
      const mongo = new MongoClient('mongodb://localhost:27017');
      try {
        await mongo.connect();
        const dbo = mongo.db('DatenBank');
        let newvalues = null;
        await veranstaltungen.forEach(elem => {
          if (elem.name === vername) {
            newvalues = elem.Sitzplan;
            newvalues.gästezuordnung = null;
          }
        });

        await dbo.collection('veranstaltungen').updateOne({ name: vername }, { $set: { gaestelist: null, Sitzplan: newvalues } }, function (err, res) {
          if (err) throw err;
        });
        await dbo.collection('GästeListen').deleteOne({ veranstaltungsname: vername });

        await dbo.collection('Sitzpläne').updateOne({ veranstaltungsname: vername }, { $set: { Sitzplan: newvalues } }, function (err, res) {
          if (err) throw err;
        });
        (async function () { await getAllGästelisten(); })();
        (async function () { await getAllVeranstaltunegn(); })();
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'An error occured while creating the event' });
      } finally {
        mongo.close();
      }
    })();
    response.json(createglListBody());
  }
});

server.delete('/sitzplaene/:id', (request, response) => {
  const id = request.params.id;
  if (!sitzplaeneid.includes(id)) {
    response.sendStatus(404);
  } else {
    let vername = '';
    sitzplaeneid.filter(function (e) { return !(e === id); });
    for (let i = 0; i < sitzplaene.length; i++) {
      const element = sitzplaene[i];
      const elemid = JSON.stringify(element._id).substring(1, JSON.stringify(element._id).length - 1);
      if (elemid === id) {
        vername = element.veranstaltungsname;
        sitzplaene.splice(i, 1);
      }
    }
    (async function () {
      const mongo = new MongoClient('mongodb://localhost:27017');
      try {
        await mongo.connect();
        const dbo = mongo.db('DatenBank');
        let newvalues = null;
        await veranstaltungen.forEach(elem => {
          if (elem.name === vername) {
            newvalues = elem.Sitzplan;
            newvalues.gästezuordnung = null;
          }
        });

        await dbo.collection('veranstaltungen').updateOne({ name: vername }, { $set: { Sitzplan: newvalues } }, function (err, res) {
          if (err) throw err;
        });
        await dbo.collection('Sitzpläne').updateOne({ veranstaltungsname: vername }, { $set: { Sitzplan: newvalues } }, function (err, res) {
          if (err) throw err;
        });
        (async function () { await getAllSitzpläne(); })();
        (async function () { await getAllVeranstaltunegn(); })();
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'An error occured while creating the event' });
      } finally {
        mongo.close();
      }
    })();
    response.json(createSPListBody());
  }
});

router.put('/sitzplaene/:id', (req, res) => {
  getAllSitzpläne();
  const id = req.params.id;
  if (!sitzplaeneid.includes(id)) {
    res.sendStatus(404);
  } else {
    let sp = null;
    for (let i = 0; i < sitzplaene.length; i++) {
      const element = sitzplaene[i];
      const elemid = JSON.stringify(element._id).substring(1, JSON.stringify(element._id).length - 1);
      if (elemid === id) {
        sp = element;
      }
    }
    let client = null;
    (async function () {
      const vname = sp.veranstaltungsname;
      client = new MongoClient('mongodb://localhost:27017');
      try {
        await client.connect();
        const db = client.db('DatenBank');
        const spl = db.collection('Sitzpläne');

        const Ver = { name: vname };
        const newvalues = { $set: { Sitzplan: req.body.Sitzplan } };
        db.collection('veranstaltungen').updateOne(Ver, newvalues, function (err, res) {
          if (err) throw err;
        });
        const ver2 = { _id: sp._id };
        const newvalues2 = { $set: { Sitzplan: req.body.Sitzplan } };
        await spl.updateOne(ver2, newvalues2, function (err, res) {
          if (err) throw err;
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occured while creating the event' });
      } finally {
        client.close();
      }
    })();
    res.json(createSPBody(id));
  }
});

server.listen(port, console.log('server listening on port ' + port));
