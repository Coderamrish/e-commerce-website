const mongoose = require('mongoose');
const config = require('config');

const dbgr = require("debug")("development:mongoose");

mongoose.connect(`${config.get("MONGODB_URL")}/scatch`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(function() {
      dbgr("connected");
  })
  .catch(function(err) {
      console.log(err);
  });

module.exports = mongoose.connection;
