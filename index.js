#!/usr/bin/env node
"use strict";

const fs = require("fs");
const request = require("request");
const rp = require("request-promise");
const chalk = require("chalk");
const open = require("open");
const ora = require("ora");
const argv = require("minimist")(process.argv.slice(2));
const log = console.log;

const isValidHex = str => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(str);
const isValidString = str => str && str.length > 2;
const getUrl = name => `https://simpleicons.org/icons/${name}.svg`;
const spinner = ora("Generating your Icon...");
spinner.color = "yellow";

const handleError = errMsg => {
  log(chalk.red(errMsg));
  process.exitCode = 1;
  process.exit();
};

const ERRORS = {
  missingIcon: "Please pass in an icon name. Eg: reddit",
  wrongColorNumber: "Please enter a number between 0 and 9",
  writeFile: "Something went wrong writing file to disk, try again!",
  missingColor: `
  Please pass in a color either as:
    - hex format: #333, #eeeeee,
    - Open color (https://github.com/yeun/open-color)
  `
};

const ARGS = {
  iconName: argv._[0],
  iconColor: argv._[1],
  iconOpacity: argv.o,
  color: argv.c,
  preview: !!argv.p || !!argv.preview,
  browse: !!argv.b || !!argv.browse
};

if (!argv._.length > 0 && !ARGS.browse) {
  handleError(ERRORS.missingIcon);
}

if (ARGS.browse) {
  open('https://simpleicons.org');
  process.exit();
}

if (ARGS.preview && ARGS.iconName) {
  const url = getUrl(ARGS.iconName);
  open(url);

  log(chalk.green(`Opening ${ARGS.iconName}.svg in your browser...`));
  process.exit();
}

const getSvg = (uri, iconName, iconColor, opacity) => {
  rp({
    uri
  })
    .then(response => {
      const coloredSvg = response.replace(
        /(circle|ellipse|path)/g,
        `$1 fill="${iconColor}" fill-opacity="${opacity}"`
      );

      fs.writeFile(`${iconName}.svg`, coloredSvg, (err, done) => {
        spinner.succeed(`Done! Look for ${iconName}.svg`);
        process.exit();
      });
    })
    .catch(err => handleError("writeFile"));
};

const getIconDetails = (
  iconName,
  uri = "https://raw.githubusercontent.com/danleech/simple-icons/develop/_data/simple-icons.json"
) => {
  return rp({ uri, json: true }).then(json =>
    json.icons.find(icon => icon.title.toLowerCase() === iconName.toLowerCase())
  );
};

const handleIconColor = str => str;

const getColoredIcon = (iconName, iconColor, iconOpacity = 1) => {
  spinner.start();
  getIconDetails(iconName).then(icon => {
    const uri = getUrl(iconName);
    const color = iconColor ? handleIconColor(iconColor) : `#${icon.hex}`;

    getSvg(uri, iconName, color, iconOpacity);
  });
};

getColoredIcon(ARGS.iconName, ARGS.iconColor, ARGS.iconOpacity);
