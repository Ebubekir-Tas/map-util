const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const { parseStringPromise } = require('xml2js');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/saveMap', async (req, res) => {
  const { uName, uPass, mapSlotNum, mapName, mapData, server } = req.body;
  const mapSlot = mapSlotNum - 1;
  let url;

  if (server === 'NA') {
    url = 'http://3.145.15.34/api.php';
  } else if (server === 'EU') {
    url = 'http://18.199.164.171/api.php';
  } else {
    res.status(400).send("Invalid server for saving!");
    return;
  }

  try {
    const response = await axios.post(url, new URLSearchParams({
      method: 'xgen.stickarena.maps.save',
      username: uName,
      password: uPass,
      slot_id: mapSlot,
      name: mapName,
      data: mapData
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    res.send(response.data);
  } catch (error) {
    res.status(500).send("Map Save Failed!");
  }
});

app.get('/loadMap', async (req, res) => {
  const { uName, mapSlotNum, server } = req.query;
  const mapSlot = mapSlotNum - 1;
  let url;

  if (server === 'NA') {
    url = `http://3.145.15.34/api.php/?method=xgen.stickarena.maps.get&username=${uName}&slot_id=${mapSlot}`;
  } else if (server === 'EU') {
    url = `http://18.199.164.171/api.php/?method=xgen.stickarena.maps.get&username=${uName}&slot_id=${mapSlot}`;
  } else if (server === 'XGEN') {
    url = `http://api.xgenstudios.com/?method=xgen.stickarena.maps.get&username=${uName}&slot_id=${mapSlot}`;
  } else {
    res.status(400).send("Invalid server for loading!");
    return;
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    let xmlText = response.data;
    xmlText = xmlText.replace(/&(?!(?:amp|lt|gt|quot|apos);)/g, '&amp;');

    const xmlDoc = await parseStringPromise(xmlText);

    const mapName = xmlDoc.rsp.maps[0].map[0].name[0];
    const mapData = xmlDoc.rsp.maps[0].map[0].data[0];

    res.json({ mapName, mapData });
  } catch (error) {
    console.error('Map Load Failed!', error);
    res.status(500).send("Map Load Failed!");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
