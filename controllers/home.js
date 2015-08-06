/// <reference path="../typings/node/node.d.ts"/>
var express = require('express');

var home = express();

home.get('/', function (req, res) {
	res.render('index');
});

module.exports = home;