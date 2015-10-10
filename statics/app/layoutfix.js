define(function (require, exports, module) {
	// 实现getElementsByClassName
	var getElementsByClassName = function (searchClass, node, tag) {
		if (document.getElementsByClassName) {
			var nodes = (node || document).getElementsByClassName(searchClass), result = [];
			for (var i = 0; node = nodes[i++]; ) {
				if (tag !== "*" && node.tagName === tag.toUpperCase()) {
					result.push(node)
				}
			} 
			return result
		} else {
			node = node || document;
			tag = tag || "*";
			var classes = searchClass.split(" "), result = [],
		elements = (tag === "*" && node.all) ? node.all : node.getElementsByTagName(tag),
		patterns = [],
		current,
		match;
			var i = classes.length;
			while (--i >= 0) {
				patterns.push(new RegExp("(^|\\s)" + classes[i] + "(\\s|$)"));
			}
			var j = elements.length;
			while (--j >= 0) {
				current = elements[j];
				match = false;
				for (var k = 0, kl = patterns.length; k < kl; k++) {
					match = patterns[k].test(current.className);
					if (!match) break;
				}
				if (match) result.push(current);
			}
			return result;
		}
	}
	// 获取滚动条宽度并设置表格标题的右侧内边距
	function getScrollbarWidth() {
		var oP = document.createElement('p'),
		styles = {
			width: '100px',
			height: '100px',
			overflowY: 'scroll',
			visibility: 'hidden',
			position: 'fixed'
		}, i, scrollbarWidth;
		for (i in styles) oP.style[i] = styles[i];
	    document.body.appendChild(oP);
		scrollbarWidth = oP.offsetWidth - oP.clientWidth;
		//oP.remove();
		return scrollbarWidth;
	}
	var tableHeader = getElementsByClassName('table-header', document, 'div');
	tableHeader[0].style['padding-right'] = 15 + getScrollbarWidth() + 'px';
	
	// 导航信息栏自适应宽度
	window.onresize = function () {
		getElementsByClassName('nav-info', document, 'div')[0].style.width = getElementsByClassName('nav', document, 'div')[0].offsetWidth - (32+1) * 4 + 'px';
	}
	window.onresize();
});