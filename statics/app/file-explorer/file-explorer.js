define(function (require, exports, module) {
	var avalon = require('vendor/avalon/avalon');
	require('vendor/avalon/mmRequest');
	
	// 路径分隔符
	var sep = '/';
	
	// 对后端结果式响应值进行判断
	function isSuccess(result) {
		if (result.success) {
			feVM.load(feVM.curPath);
		} else {
			alert(result.msg);
		}
	}
	
	// 无刷新上传文件
	document.getElementById('upload').onchange = function () {
		if (!this.value) return ;
		this.form.submit();
	}
	document.getElementById('parasitic_frame').onload = function () {
		var data = this.contentWindow.document.body.innerText;
		data = avalon.parseJSON(data);
		isSuccess(data);
	}
	
	// 配置前端路由
	avalon.router.get('/*path', function () {
		feVM.load('/' + this.params.path);
	});
	
    avalon.history.start({
        basepath: "/home"
    });
	
	// 文件管理器vm
	var feVM = avalon.define({
		$id: 'fileExplorer',		
		curDir: 'home',							// 当前目录
		curPath: '/',							// 当前路径
		abovePath: '',							// 上级路径
		files: [],								// 当前目录所有文件信息
		curFile: {								// 当前编辑文件
			filename: '',
			isFile: true,
			lastModify: Date.now(),
			size: 0,
			isEditing: true,
			dirty: true
		},
		
		isOneEditing: false,					// 是否有一条记录处于编辑状态
		$oldFilaname: '',						// 未修改前的文件名
		$sep: '/',								// 路径分隔符
		
		load: function (path) {					// 获取当前目录下的所有文件信息
			// 去掉多余的斜杠
			path = path.replace(/\/\//g, '/');
			avalon.post('file/getFiles', {
				path: path
			}).done(function (data) {
				if (data.success != void 0) {
					isSuccess(data);
					if (data.success) {
						feVM.go(-1);
					}
					return ;
				}
				feVM.curDir = data.curDir.length ? data.curDir : 'home';
				feVM.curPath = data.curPath;
				feVM.abovePath = data.abovePath;
				feVM.files.clear();
				for (var i in data.files) {
					data.files[i].isEditing = false;
				}
				feVM.files.pushArray(data.files);
			});
		},
		go: function (offset) {					// 导航
			if (offset == 0) {
				feVM.load(feVM.curPath);
			} else {
				window.history.go(offset);
			}
		},
		add: function (isFile) {				// 添加一条记录
			if (!feVM.isOneEditing) {
				feVM.curFile.isFile = isFile;
				feVM.files.unshift(feVM.curFile);
			}
			feVM.isOneEditing = true;
		},
		edit: function (file) {					// 编辑一条记录
			if (!feVM.isOneEditing) {
				file.isEditing = true;
				feVM.$oldFilaname = file.filename;
			}
			feVM.isOneEditing = true;
		},
		save: function (file) {					// 保存添加
			feVM.cancel(file);
			if (file.dirty) {
				avalon.post('file/createFile', {
					path: feVM.curPath,
					filename: file.filename,
					isFile: file.isFile
				}).done(function (data) {
					isSuccess(data);
				});
			} else {
				avalon.post('file/renameFile', {
					path: feVM.curPath + sep + feVM.$oldFilaname,
					newPath: feVM.curPath + sep + file.filename
				}).done(function (data) {
					isSuccess(data);
				});
			}
		},
		cancel: function (file) {				// 取消添加
			file.isEditing = false;
			feVM.isOneEditing = false;
			if (file.dirty) {
				feVM.files.shift();
				feVM.curFile = {
					filename: '',
					isFile: true,
					lastModify: Date.now(),
					size: 0,
					isEditing: true,
					dirty: true
				}
			}
		},
		del: function (file) {					// 删除文件
			if (confirm('确实要删除此' + (file.isFile ? '文件' : '文件夹') + '吗？\n文件名：' + file.filename)) {
				avalon.post('file/deleteFile', {
					path: feVM.curPath + sep + file.filename
				}).done(function (data) {
					isSuccess(data);
				});
			}
		}
	});
	
	avalon.scan();
	
	exports.laod = feVM.load;
});