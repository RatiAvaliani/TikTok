const Main = require('../controllers/Main');
const express = require('express');
const Router = express();

Router.get('/', Main.index);

module.exports.rout = {'path' : '/', 'router' : Router};
