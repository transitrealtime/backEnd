const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://Tommy:transitapi@cluster0-73bzh.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser:true})

const db = mongoose.connection;

module.exports = db;
