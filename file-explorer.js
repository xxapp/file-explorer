/// <reference path="typings/node/node.d.ts"/>
var path = require('path');
var express = require('express');
var handlebars = require('express-handlebars').create({ extname: '.hbs' });
var bodyParser = require('body-parser');

var home = require('./controllers/home');
var file = require('./controllers/file');

var app = express();

// 配置服务器环境
app.disable('x-powered-by');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: true }));

// 配置模板
app.set('views', path.join(__dirname + '/views'));
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

// 分配控制器路由
app.use('/', home);
app.use('/home', home);
app.use('/file', file);

// 开启web服务
app.listen(app.get('port'), function () {
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl+C to terminate.');
});

require('child_process').exec('start http://localhost:' + app.get('port') + '/');