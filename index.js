const express = require('express')
const app = express()
const mongoose = require('mongoose');

const port = 3131;

// DATABASE CONNECTION
mongoose.connect('mongodb://localhost:27017/cr', { useNewUrlParser: true, useUnifiedTopology: true });
const meebitSchema = new mongoose.Schema({
  llid: String,
  name: String,
  description: String,
  image: String,
  attributes: Array,
});

const Meebit = mongoose.model('Meebit', meebitSchema);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
let dbConnected = false;
db.once('open', function () {
  console.log('connected to db');
  dbConnected = true;
});

// larva labs ID
app.get('/meebit/:llid', (req, res) => {
  const { llid } = req.params;
  Meebit.find({ llid })
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => handleError(res, err))
})

// filter by attributes
/** attributes shape
 * {
      "trait_type": "Type",
      "value": "Elephant"
    }
 */
app.get('/meebits', (req, res) => {
  const { Type } = req.query;
  Meebit.find({ 'attributes.trait_type': 'Type', 'attributes.value': Type }, (err, results) => {
    if (err) return handleError(res, err);
    console.log(results.length);
    res.status(200).send(results);
  })
});

app.listen(port, () => {
  console.log(`Meebits API listening at http://localhost:${port}`)
})

function handleError(res, err) {
  res.status(400).send(err);
}