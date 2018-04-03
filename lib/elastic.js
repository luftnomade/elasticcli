const elasticsearch = require("elasticsearch");

let client;

module.exports = {
  init: (host, port) => {
    client = new elasticsearch.Client({
      host: `${host}:${port}`,
      log: null
    });
    return client.ping();
  },
  listIndices: () => {
    return client.cat.indices({ h: ["index"], format: "json" });
  },
  search: (indexPattern, query) => {
    return client.search({
      index: indexPattern,
      q: query
    });
  }
};
