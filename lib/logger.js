const colors = require("colors");

const loggerColors = [
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
  "gray"
];

let colorIndex = 0;
const colorMapping = {};
let table;

const getColorForName = name => {
  if (colorMapping[name]) {
    return colorMapping[name];
  } else {
    colorMapping[name] = loggerColors[colorIndex++];
    return colorMapping[name];
  }
};

module.exports = {
  info: message => {
    console.log(message);
  },
  logQueryResult: queryResult => {
    queryResult.forEach(result => {
      const color = getColorForName(result._index);
      console.log(`[${colors[color](result._index)}]`, result._source);
    });
  },
  logIndexName: name => {
    console.log(name);
  }
};
