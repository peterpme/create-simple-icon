# 🎨 🔧 Create Simple Icon

<img src="example.gif" width="550">

Download and colorize branded svg icons in a snap!
`Create Simple Icon` leverages the power of [Simple Icons](https://simpleicons.org) and then colorizes them anyway you'd like.

[![npm version](https://badge.fury.io/js/create-simple-icon.svg)](https://badge.fury.io/js/create-simple-icon)

## Installation

```bash
$ yarn global add create-simple-icon
```

If you're not using Yarn yet:

```bash
$ npm install -g create-simple-icon
```

## Usage, Options and Examples

```bash
Usage
  $ csi <icon-name> <icon-color> <icon-opacity>

Examples
  csi twitter red
  csi facebook '#eee' (zsh requires quotes)
  csi reddit (returns default color)
  csi facebook -o 0.5 (returns default color with opacity 0.5)
  csi reddit -p (opens reddit in your browser)
  csi -b (opens simpleicons.org in your browser)
```

## Requirements
- Node 6+
