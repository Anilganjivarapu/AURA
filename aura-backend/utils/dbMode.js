const mongoose = require("mongoose");

const isDatabaseReady = () =>
  Boolean(global.__AURA_DB_READY__) && mongoose.connection.readyState === 1;

module.exports = { isDatabaseReady };
