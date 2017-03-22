#!/usr/bin/env node
"use strict";

const fs = require("fs");
const request = require("request");
const rp = require("request-promise");
const chalk = require('chalk');
const argv = require("minimist")(process.argv.slice(2));
const COLORS = require("open-color");

const log = console.log;

if (!argv._.length > 0) {
  log(chalk.red("Please pass in an icon name. Eg: reddit"));
  process.exit(1);
}

const handleColor = str => {
  const [color, number] = str.split(/(\d+)/).filter(Boolean);
  let hex = COLORS[color];
  if (!hex) return color;

  if (number > 9) {
    log(chalk.red("Please select a number between 0 and 9"));
    process.exit(1);
  }

  if (hex) {
    hex = hex[number || 0];
  }

  return hex;
};

const getUrl = name => `https://simpleicons.org/icons/${name}.svg`;

const CLI_ARGS = {
  iconName: argv._[0],
  color: handleColor(argv.c),
};

rp({
  uri: getUrl(CLI_ARGS.iconName)
}).then(response => {
  const coloredSvg = response.replace(
    /(circle|ellipse|path)/g,
    `$1 fill="${CLI_ARGS.color}"`
  );
  fs.writeFile(`${CLI_ARGS.iconName}.svg`, coloredSvg, (err, done) => {
    log(chalk.green("Done!"));
    process.exit();
  });
});
