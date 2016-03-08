'use strict'

const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Spin = require('./models/spin')
const configury = require('configury')
const config = configury('./config.json')(process.env.NODE_ENV || 'development')

mongoose.connect(config.dbUrl)

let app = express()
let port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json())

app.post('/api/spin', (req, res) => {
  let spin = new Spin({
    stages: req.body.stages
  })

  spin.save((err) => {
    if (err) {
      return res.status(400).json({ message: err.message || err })
    }

    res.status(201).json(spin)
  })
})

app.get('/api/spin/:id', (req, res) => {
  Spin.findById(req.params.id, (err, spin) => {
    if (err) {
      return res.status(500).json({ message: err.message || err })
    } else if (!spin) {
      return res.sendStatus(404)
    }

    res.status(200).json(spin)
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(port, () => {
  console.log('spin listening on 3000')
})
