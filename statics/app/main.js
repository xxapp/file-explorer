define(function (require, exports, module) {
	require('app/layoutfix');
	require('vendor/avalon/avalon');
	require('vendor/avalon/mmRouter');
	
	// 关闭avalonjs自带加载器
	avalon.config({
	    loader: false
	});
	var fileExplorer = require('app/file-explorer/file-explorer');
});