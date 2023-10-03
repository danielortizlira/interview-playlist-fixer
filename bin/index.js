#!/usr/bin/env node

const argv = require("yargs")(process.argv.slice(2))
  .usage("playlist-fixer <input-file> <changes-file> <output-file>")
  .help(true)
  .demandCommand(3).argv;

const [inputFilePath, changesFilePath, outputFilePath] = argv._;
