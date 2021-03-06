/// <reference path="../typings/node/node.d.ts"/>
var express = require('express');
var pathHandler = require('path');
var multer = require('multer');
var configReader = require('../utils/config');
var fileModel = require('../models/file');

var file = express();
var upload = multer({ dest: 'uploads/' })

/**
 * path参数验证
 * @param {string} path
 */
var validator = function (req, res, next, val) {
	var basePath = configReader.getBasePath();
	// 过滤试图访问父级目录的路径内容
	console.log('before filter', val);
	req.query.path = val = val.replace(/\.\.\//g, '');
	console.log('aftert filter', val);
	var path = pathHandler.join(basePath, pathHandler.sep, val);
	console.log(path);
	fileModel.isPathExist(path)
		.done(function (exists) {
			if (exists) {
				next();
			} else {
				var errMsg = '找不到路径：' + path
				console.error(errMsg);
				res.type('.html').json({
					success: false,
					msg: errMsg
				});
			}
		});
};
file.use('*', function (req, res, next) {
	var path = req.body.path || req.query.path;
	if (path) {
		validator(req, res, next, path)
	} else {
		next();
	}
});


/**
 * 根据文件夹路径获取文件信息
 * 
 * @param {string} path
 * @response {array} path下文件的信息
 * @api public
 */
file.get('/getFiles', function (req, res) {
	var basePath = configReader.getBasePath();
	var path = pathHandler.join(basePath, pathHandler.sep, req.query.path);
	fileModel.getFiles(path)
		.then(function (data) {
			res.type('.html').json({
				curDir: pathHandler.basename(req.query.path),
				curPath: req.query.path,
				abovePath: pathHandler.dirname(req.query.path),
				files: data
			});
		})
		.catch(function (err) { 
			console.error('找不到路径：' + err.path);
			res.type('.html').json([]); 
		});
 });
 
 
/**
 * 修改文件名
 * 
 * @param {string} path
 * @param {string} newPath
 * @response {object} 修改结果，包含修改过的文件信息
 * @api public
 */
file.post('/renameFile', function (req, res) {
	var basePath = configReader.getBasePath();
	var path = pathHandler.join(basePath, pathHandler.sep, req.body.path);
	var newPath = pathHandler.join(basePath, pathHandler.sep, req.body.newPath);
	fileModel.isPathExist(newPath)
		.done(function (exists) {
			if (exists) {
				var errMsg = '路径：' + newPath + '已经存在，请使用其他名字';
				console.error(errMsg);
				res.type('.html').json({
					success: false,
					msg: errMsg
				}); 
			} else {
				fileModel.renameFile(path, newPath)
					.then(function (data) {
						res.type('.html').json(data);
					})
					.catch(function (err) { 
						var errMsg = '找不到路径：' + err.path;
						console.error(errMsg);
						res.type('.html').json({
							success: false,
							msg: errMsg
						}); 
					});
			}
		});
});
  
  
/**
 * 删除文件
 * 
 * @param {array} paths
 * @response {object} 删除结果，包含删除情况
 * @api public
 */
file.post('/deleteFile', function (req, res) {
	var basePath = configReader.getBasePath();
	var path = pathHandler.join(basePath, pathHandler.sep, req.body.path);
	fileModel.deleteFile(path)
		.then(function (data) {
			res.type('.html').json(data);
		})
		.catch(function (err) { 
			var errMsg = '找不到路径：' + err.path;
			console.error(errMsg);
			res.type('.html').json({
				success: false,
				msg: errMsg
			}); 
		});
});
 
 
/**
 * 创建文件
 * 
 * @param {string} path
 * @param {string} filename
 * @param {string} isFile
 * @response {object} 创建结果，包含创建的文件信息
 * @api public
 */
file.post('/createFile', function (req, res) {
	var basePath = configReader.getBasePath();
	var path = pathHandler.join(basePath, pathHandler.sep, req.body.path, pathHandler.sep, req.body.filename);
	var isFile = (req.body.isFile == 'true');
	fileModel.isPathExist(path)
		.done(function (exists) {
			if (exists) {
				var errMsg = '路径：' + path + '已经存在，请使用其他名字';
				console.error(errMsg);
				res.type('.html').json({
					success: false,
					msg: errMsg
				}); 
			} else {
				fileModel.createFile(path, isFile)
					.then(function (data) {
						res.type('.html').json(data);
					})
					.catch(function (err) { 
						var errMsg = '找不到路径：' + err.path;
						console.error(errMsg);
						res.type('.html').json({
							success: false,
							msg: errMsg
						}); 
					});
			}
		});
});


/**
 * 上传文件
 * 
 * @param {string} path
 * @param {file} file
 * @response {object} 上传结果，包含上传的文件信息
 * @api public
 */
file.post('/uploadFile', upload.single('file'), function (req, res) {
	var basePath = configReader.getBasePath();
	var file = req.file;
	var path = pathHandler.join(basePath, pathHandler.sep, req.body.path + pathHandler.sep + file.originalname);
	fileModel.isPathExist(path)
		.done(function (exists) {
			if (exists) {
				var errMsg = '路径：' + path + '已经存在，请先删除原文件再上传';
				console.error(errMsg);
				res.type('.html').json({
					success: false,
					msg: errMsg
				}); 
			} else {
				fileModel.uploadFile(path, file)
					.then(function (data) {
						res.type('.html').json(data);
					})
					.catch(function (err) { 
						var errMsg = '找不到路径：' + err.path;
						console.error(errMsg);
						res.type('.html').json({
							success: false,
							msg: errMsg
						}); 
					});
			}
		});
});
 
module.exports = file;