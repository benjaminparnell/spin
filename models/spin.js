'use strict'

const mongoose = require('mongoose')

let spinSchema = new mongoose.Schema({
  stages: { type: Object, required: true },
  createdDate: { type: Date, default: Date.now }
})

let Spin = mongoose.model('Spin', spinSchema)

module.exports = Spin
