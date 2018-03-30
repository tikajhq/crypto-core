const root = require('express').Router();
const currency = require('./currency');
const wallet = require('./wallet');

root.use('/currencies', currency);
root.use('/wallet', wallet);

module.exports = root;