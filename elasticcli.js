const repl = require("repl");
const program = require("commander");
const elastic = require("./lib/elastic");
const logger = require("./lib/logger");

const start = async () => {
  program
    .version("0.1.0")
    .option("-s --host <host>", "Host")
    .option("-p --port [port]", "Port if other than 9200", 9200)
    .parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit();
  }

  try {
    await elastic.init(program.host, program.port);
  } catch (e) {
    logger.info("error initializing elasticsearch", e);
    process.exit(1);
  }

  logger.info(
    `connected to elasticsearch cluster ${program.host}:${program.port}`
  );

  const listIndices = async () => {
    const indices = await elastic.listIndices();
    if (!indices.length) {
      logger.info("cluster has no indices");
    } else {
      indices.forEach(indexObj => {
        logger.logIndexName(indexObj.index);
      });
    }
  };

  let indexPattern;

  const setIndexPattern = _indexPattern => {
    indexPattern = _indexPattern;
    logger.info(`switched to index pattern ${indexPattern}`);
  };

  const query = async query => {
    if (!indexPattern) {
      logger.info("no index pattern selected");
    } else {
      logger.info(`query elasticsearch for index pattern ${indexPattern}`);
      const queryResult = await elastic.search(indexPattern, query);
      if (!queryResult.hits.total) {
        logger.info("no hits for query");
      } else {
        logger.logQueryResult(queryResult.hits.hits);
      }
    }
  };

  const outputHelp = () => {
    const output = [
      "possible commands:",
      "",
      "\tlist indices",
      "\tuse <indexPattern>",
      ""
    ];
    logger.info(output.join("\n"));
  };

  const extractArg = cmd => {
    return cmd.split(" ")[1];
  };

  const elasticcli = async (cmd, context, filename, callback) => {
    if (cmd.indexOf("list indices") !== -1) {
      await listIndices();
    } else if (cmd.indexOf("use") !== -1) {
      setIndexPattern(extractArg(cmd));
    } else if (cmd.indexOf("query") !== -1) {
      await query(extractArg(cmd));
    } else {
      outputHelp();
    }
    callback();
  };

  repl.start({ prompt: "> ", eval: elasticcli });
};

if (require.main === module) {
  start();
}

module.exports = {
  start: start
};
