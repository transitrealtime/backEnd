require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB, {useNewUrlParser:true})

const db = mongoose.connection;

module.exports = db;
