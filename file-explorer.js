/// <reference path="typings/node/node.d.ts"/>
var path = require('path');
var express = require('express');
var c = require('child_process');
var handlebars = require('express-handlebars').create({ defaultLayout: 'main', extname: '.hbs' });
var bodyParser = require('body-parser');

var app = express();

// 配置服务器环境
app.disable('x-powered-by');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 配置模板
app.set('views', path.join(__dirname + '/views'));
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
	res.set('Content-Type', 'text/plain');
	var s = '';
	for (var name in req.headers) {
		s += name += ': ' + req.headers[name] + '\n';
	}
	res.send(s);
});

app.listen(app.get('port'), function () {
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl+C to terminate.');
});

c.exec('start http://localhost:' + app.get('port') + '/');