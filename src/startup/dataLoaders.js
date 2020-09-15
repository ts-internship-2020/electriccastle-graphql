
const { getUserDataLoaders } = require("../features/user/dataLoaders");
const { getConferenceLoaders } = require('../features/conference/dataLoaders');

module.exports = dbInstance => ({
  ...getUserDataLoaders(dbInstance),
  ...getConferenceLoaders(dbInstance)});
