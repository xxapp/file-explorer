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

/**
 * 修改文件名称
 * 
 * @param {string} path
 * @param {string} newPath
 * @return {object:promise}
 * @api public
 */
exports.renameFile = function (path, newPath) {
	var deferred = Q.defer();
	// 重命名文件
	fs.rename(path, newPath, function (err) {
	    if (!err) {
	        deferred.resolve({
				success: true,
				msg: '重命名成功'
			});
	    } else {
	        deferred.reject(err);
	    }
	});
	return deferred.promise;
};

/**
 * 删除文件
 * 
 * @param {string} path
 * @return {object:promise}
 * @api public
 */
exports.deleteFile = function (path) {
	var deferred = Q.defer();
	// 删除文件
	if (fs.statSync(path).isDirectory()) {
		// 如果是文件夹类型就递归删除
		try {
			deleteFolderRecursive(path);
	        deferred.resolve({
				success: true,
				msg: '删除成功'
			});
		} catch (err) {
	        deferred.reject(err);
		}
	} else {
		// 如果是文件类型就直接删除
		fs.unlink(path, function (err) {
		    if (!err) {
		        deferred.resolve({
					success: true,
					msg: '删除成功'
				});
		    } else {
		        deferred.reject(err);
		    }
		});
	}
	return deferred.promise;
};


/**
 * 递归删除文件
 * 
 * @param {string} path
 * @api private
 */
var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach(function(file) {
        var curPath = path + "/" + file;
          if(fs.statSync(curPath).isDirectory()) { 
              deleteFolderRecursive(curPath);
          } else { 
              fs.unlinkSync(curPath);
          }
      });
      fs.rmdirSync(path);
    }
};


/**
 * 创建文件
 * 
 * @param {string} path
 * @param {boolean} isFile
 * @return {object:promise}
 * @api public
 */
exports.createFile = function (path, isFile) {
	var deferred = Q.defer();
	// 创建文件
	if (isFile) {
		// 如果是文件类型，则创建一个文件
		fs.open(path, 'a', '0666', function (err, fd) {
		    if (!err) {
		        deferred.resolve({
					success: true,
					msg: '创建成功'
				});
		    } else {
		        deferred.reject(err);
		    }
			fs.close(fd);
		});
	} else {
		// 如果是文件夹类型，则创建一个文件夹
		fs.mkdir(path, '0666', function (err) {
		    if (!err) {
		        deferred.resolve({
					success: true,
					msg: '创建成功'
				});
		    } else {
		        deferred.reject(err);
		    }
		})
	}
	return deferred.promise;
};

/**
 * 上传文件
 * 
 * @param {string} path
 * @param {object} file
 * @return {object:promise}
 * @api public
 */
exports.uploadFile = function (path, file) {
	var deferred = Q.defer();
	// 上传文件
	fs.link(file.path, path, function (err) {
	    if (!err) {
	        deferred.resolve({
				success: true,
				msg: '上传成功'
			});
	    } else {
	        deferred.reject(err);
	    }
	});
	return deferred.promise;
};