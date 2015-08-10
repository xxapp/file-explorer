define(function (require, exports, module) {
	// 获取滚动条宽度并设置表格标题的右侧内边距
	function getScrollbarWidth() {
		var oP = document.createElement('p'),
		styles = {
			width: '100px',
			height: '100px',
			overflowY: 'scroll',
			visibility: 'hidden'
		}, i, scrollbarWidth;
		for (i in styles) oP.style[i] = styles[i];
	    document.body.appendChild(oP);
		scrollbarWidth = oP.offsetWidth - oP.clientWidth;
		//oP.remove();
		return scrollbarWidth;
	}
	var tableHeader = document.getElementsByClassName('table-header');
	tableHeader[0].style['padding-right'] = 15 + getScrollbarWidth() + 'px';
	
	// 导航信息栏自适应宽度
	window.onresize = function () {
		document.getElementsByClassName('nav-info')[0].style.width = document.getElementsByClassName('nav')[0].offsetWidth - (32+1) * 4 + 'px';
	}
	window.onresize();
});