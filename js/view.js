// 生成左右分栏name-value的形式
function createInfoItem(nameParam, value) {
	// 标题后面都加上：
	var name = nameParam + ':';

	var div = document.createElement('div');
	div.className = "item-div";
	div.innerHTML = '<div class="item-name">' + name + '</div><div class="item-value">' + value + '</div>';
	return div;
}

function createDownloadItem(nameParam, value, url, type, htmlContent, size) {
	// 标题后面都加上：
	var name = nameParam + ':';

	var div = document.createElement('div');
	div.className = "item-div";
	if(size == 0) {
		div.innerHTML = '<div class="item-name">' + name + '</div><div class="item-value" style="color: #6699FF;">' + value + '</div>';
	} else {
		div.innerHTML = '<div class="item-name">' + name + '</div><div class="item-value" style="color: #6699FF;">' + value + '</br><p style="margin-top: 1px; color: #666666;">' + getFileSizeStr(size) + '</p></div>';
	}

	div.addEventListener('tap', function() {
		openContent(url, type, htmlContent);
	}, false);

	return div;
}

function createDownloadItem(nameParam, value, url, type, htmlContent, size) {
	// 标题后面都加上：
	var name = nameParam + ':';

	var div = document.createElement('div');
	div.className = "item-div";
	if(size == 0) {
		div.innerHTML = '<div class="item-name">' + name + '</div><div class="item-value" style="color: #6699FF;">' + value + '</div>';
	} else {
		div.innerHTML = '<div class="item-name">' + name + '</div><div class="item-value" style="color: #6699FF;">' + value + '</br><p style="margin-top: 1px; color: #666666;">' + getFileSizeStr(size) + '</p></div>';
	}

	div.addEventListener('tap', function() {
		openContent(url, type, htmlContent);
	}, false);

	return div;
}

// 关闭页面一直到九宫格界面
function closeToMain() {
	var webview = plus.webview.getWebviewById('main_tab_home.html');
	var list = webview.children();
	for(var i = 0; i < list.length; i++) {
		list[i].close();
	}
}

// 返回当前功能的首页
function closeToList() {
	var main_tab_home = plus.webview.getWebviewById('main_tab_home.html');
	var list = main_tab_home.children();
	//console.log('closeToList children : ' + list.length);
	for(var i = 0; i < list.length; i++) {
		//console.log(i + ' -- ' + list[i].id);
		if(arrayContains(firstViewArr, list[i].id)) {
			//console.log('continue');
			// 重新刷新列表界面
			list[i].reload();
			continue;
		}

		list[i].close();
	}
}

// 控制字体大小
function getFontSize(size) {
	var increment = storageGetItem(FONT_SIZE);
	return(increment - 0 + size) + 'px';
}

function resizeFont(classOrElement, defaultFontsize) {
	var classes = document.body.querySelectorAll(classOrElement);
	for(var i = 0; i < classes.length; i++) {
		classes[i].style.fontSize = getFontSize(defaultFontsize);
	};
}

var firstViewArr = ['docManager_list.html', 'memo_list.html', 'flowManager_list.html', 'passReadRecord_list.html', 'flowNotify_list.html', 'noticeManager_list.html', 'projectManager_list.html', 'fundManager_list.html'];

function arrayContains(array, str) {
	var i = array.length;
	while(i--) {
		if(array[i] == str) {
			return true;
		}
	}
	return false;
}

function backAndRefreshBadge() {
	var catalog = plus.webview.getWebviewById("main_tab_home.html");
	mui.fire(catalog, 'requestBadge');
}

function showProgressDialog(msg) {
	mui.plusReady(function() {
		plus.nativeUI.showWaiting(msg, {
			padlock: true
		});
	});
}

function hideProgressDialog() {
	mui.plusReady(function() {
		plus.nativeUI.closeWaiting();
	})
}