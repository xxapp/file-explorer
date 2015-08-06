/// <reference path="../typings/node/node.d.ts"/>
var express = require('express');

var file = express();

/**
 * 根据文件夹路径获取文件信息
 * 
 * @param {string} path
 * @response {array} path下文件的信息
 * @api public
 */
 
 
 
/**
 * 修改文件名
 * 
 * @param {string} path
 * @response {object} 修改结果，包含修改过的文件信息
 * @api public
 */
  
  
  
/**
 * 删除文件
 * 
 * @param {array} paths
 * @response {object} 删除结果，包含删除情况
 * @api public
 */
 
 
 
/**
 * 创建文件
 * 
 * @param {string} path
 * @response {object} 创建结果，包含创建的文件信息
 * @api public
 */



/**
 * 上传文件
 * 
 * @param {string} path
 * @response {object} 上传结果，包含上传的文件信息
 * @api public
 */
 
 
module.exports = file;