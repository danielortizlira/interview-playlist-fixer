const chalk = require("chalk");

const log = (message, color = "red") => {
  console.log(chalk[color](message));
};

module.exports = log;
