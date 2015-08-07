/// <reference path="../typings/node/node.d.ts"/>
var fs = require('fs');
var path = require('path');
var Q = require('q');

/**
 * 根据文件夹路径获取文件信息
 * 
 * @param {string} path
 * @return {array:promise}
 * @api public
 */
exports.getFiles = function (path) {
	var deferred = Q.defer();
	// 获取文件夹下的所有文件信息
	fs.readdir(path, function (err, files) {
	    if (!err) {
			// 遍历文件名数组，补全文件详细信息
			var statsArray = [];
			for (var i in files) {
				try {
					var stats = fs.statSync(path + '/' + files[i]);
					statsArray.push({
						filename: files[i],
						isFile: stats.isFile(),
						lastModify: stats.mtime
					});
				} catch (err) {}
			}
	        deferred.resolve(statsArray);
	    } else {
	        deferred.reject(err);
	    }
	});
	return deferred.promise;
};

/**
 * 判断路径是否存在
 * 
 * @param {string} path
 * @return {boolean:promise}
 * @api public
 */
exports.isPathExist = function (path) {
	var deferred = Q.defer();
	// 判断路径是否存在
	fs.exists(path, function (exists) {
		deferred.resolve(exists);
	});
	return deferred.promise;
};