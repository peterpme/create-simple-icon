#!/usr/bin/env node
"use strict";

const fs = require("fs");
const request = require("request");
const rp = require("request-promise");
const chalk = require("chalk");
const open = require("open");
const COLORS = require("open-color");
const argv = require("minimist")(process.argv.slice(2));
const log = console.log;

if (!argv._.length > 0) {
  log(chalk.red("Please pass in an icon name. Eg: reddit"));
  process.exit(1);
}

const ARGS = {
  iconName: argv._[0],
  color: argv.c,
  preview: !!argv.p || !!argv.preview
};

const getUrl = name => `https://simpleicons.org/icons/${name}.svg`;

function handleColor(str) {
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
}

if (ARGS.preview) {
  const url = getUrl(ARGS.iconName);
  open(url);

  log(chalk.green(`Opening ${ARGS.iconName}.svg in your browser...`));
  process.exit(0);
}

const getIcon = (uri, iconName, iconColor) => {
  rp({
    uri
  })
    .then(response => {
      const coloredSvg = response.replace(
        /(circle|ellipse|path)/g,
        `$1 fill="${iconColor}"`
      );

      fs.writeFile(`${iconName}.svg`, coloredSvg, (err, done) => {
        log(chalk.green("Done!"));
        process.exit();
      });
    })
    .catch(error => {
      log(chalk.red("Ooops!", error));
    });
};

getIcon(getUrl(ARGS.iconName), ARGS.iconName, handleColor(ARGS.color));
