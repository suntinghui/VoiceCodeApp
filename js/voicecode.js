function AppInit() {
	mui.plusReady(function() {
		plus.screen.lockOrientation("landscape"); // 横屏正方向或反方向，根据设备重力感应器自动调整
	});
}

// 查看用户信息，如果没有则查询，但是直接返回否，不阻塞界面使用。
function isVip() {
	var userInfo = JSON.parse(storageGetItem(kUserInfo));
	if(userInfo == null) {
		queryUserInfo(false);
		return false;
	}

	return(userInfo.outTime != '' && userInfo.vipState != '-1');
}

// 直接查询用户信息。一般在登录后和从购买VIP返回后直接调用。
// 程序在退出登录时将用户信息删除，不是置空。
function queryUserInfo(showWaitDialog, success, failure) {
	console.log('正在查询用户信息...');

	mui.plusReady(function() {
		if(showWaitDialog) {
			showProgressDialog("正在查询请稍候...");
		}

		var arg = {
			machineCode: plus.device.uuid,
			phone: storageGetItem(kUserName)
		}

		var url = getHost() + "/VoiceCodeService.asmx/GetUserInfo";

		mui.ajax(url, {
			dataType: 'json',
			data: JSON.stringify(arg),
			type: 'post',
			timeout: TIMEOUT,
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(data) {
				hideProgressDialog();

				// 保存用户信息
				storageSetItem(kUserInfo, data.d.respObj);

				if(typeof success == 'function') {
					success(JSON.parse(data.d.respObj));
				}
			},
			error: function(xhr, type, errorThrown) {
				hideProgressDialog();
				
				if(typeof failure == 'function') {
					failure();
				}
			}
		});
	})
}

function loadTheme() {
	try {
		var themeCss = document.getElementById('themeCss');
		var themeName = storageGetItem(kTheme);
		if(themeName == null) {
			themeCss.setAttribute('href', '../css/theme/red.css');
		} else {
			themeCss.setAttribute('href', themeName);
		}
	} catch(e) {
		console.log('加载主题出错：' + e.message);
	}
}

// 通过ID查找保存在本地的课程信息
function getCourseById(courseId) {
	var courseList = JSON.parse(storageGetItem(kCourseList));
	for(var i = 0; i < courseList.length; i++) {
		if(courseList[i].id == courseId) {
			return courseList[i];
		}
	}

	return null;
}

// mp3的命名方式
var ROLES_CN = ['哥哥', '姐姐', '爸爸', '妈妈', '爷爷', '奶奶'];
// 根据人物角色序号找出mp3的名称
function getRoleName(peopleNum) {
	if(peopleNum > 5)
		return ROLES_CN[0];

	return ROLES_CN[peopleNum];
}

// roleName表示爸爸或哥哥，通过名字取得mp3的文件。
function getMP3ByRoleName(courseId, wordName, peopleNum, languageType) {
	var path = getCourseDict() + courseId + '/' + wordName + '/';
	var fileName = wordName + '-0' + (peopleNum+1) + '.mp3';
	return(path + fileName);
}

var BACK_COLOR_CLASS = ['button-primary', 'button-action', 'button-caution', 'button-highlight', 'button-royal', 'button-inverse'];

function getCourseBackColorClassName(index) {
	return BACK_COLOR_CLASS[index % BACK_COLOR_CLASS.length];
}

// 没有数据的控件Div
function getNoDataView(tip) {
	var noDataDiv = document.createElement('div');
	noDataDiv.className = 'mui-text-center';
	if(typeof tip == 'string') {
		noDataDiv.innerHTML = '<img src="../img/icon-nothing.png" style="width:20%; max-width:200px;"><p class="padding">' + tip + '</p>';
	} else {
		noDataDiv.innerHTML = '<img src="../img/icon-nothing.png" style="width:20%; max-width:200px;"><p class="padding">没有查询到数据</p>';
	}

	return noDataDiv;
}

// 得到课程控件Div
// index 显示序号，用于取得背景色，一般是for循环中的i
// course 课程信息
// isDownloaded表示课程是否已经下载
// 如果用户是VIP用户，则只判断下载与未下载。如果用户不是VIP，首先判断已下载，然后如果课程是免费的则显示未下载，如果课程是收费的，则显示VIP。
function getCourseView(index, course, isDownloaded, isDelete) {
	var userVIP = isVip();

	var rootDiv = document.createElement('div');
	rootDiv.className = 'mui-col-sm-6 download-course-list';
	rootDiv.id = JSON.stringify(course);

	var a = document.createElement('a');
	a.className = 'button button-3d button-jumbo button-rounded';
	if(isDownloaded) {
		a.classList.add(getCourseBackColorClassName(index));
	}

	var imgUrl;
	if(isDownloaded) {
		imgUrl = getImgAbsolute(getCourseDict() + course.id + '.png');
	} else {
		imgUrl = getCourseImgUrl(course.id);
	}

	var aContentStr = '<h3>' + course.title + '</h3><h5>' + course.titlee + '</h5><img src="' + imgUrl + '" alt="" />';
	if(userVIP) {
		if(!isDownloaded) {
			aContentStr += '<span class="icon-download"><i class="iconfont icon-xiazai"></i></span>';
		}
	} else {
		if(!isDownloaded) {
			// IsCharged 是否收费课程 1收费 0免费
			if(course.IsCharged == '0') {
				aContentStr += '<span class="icon-download"><i class="iconfont icon-xiazai"></i></span>';
			} else {
				aContentStr += '<span class="icon-download"><i class="iconfont icon-suo"></i></span>';
			}
		}
	}

	// 课程管理中用于删除
	if(isDelete) {
		aContentStr += '<span class="icon-download"><i class="iconfont icon-shanchu"></i></span>';
	}

	a.innerHTML = aContentStr;

	rootDiv.appendChild(a);

	return rootDiv;
}

function logout() {
	storageSetItem(kLoginState, 'false');
	storageRemoveItem(kUserInfo);

	// 获取所有Webview窗口
	var curr = plus.webview.currentWebview();
	var wvs = plus.webview.all();
	for(var i = 0, len = wvs.length; i < len; i++) {
		//关闭除setting页面外的其他页面
		if(wvs[i].getURL() == curr.getURL())
			continue;
		plus.webview.close(wvs[i]);
	}
	//打开login页面后再关闭
	plus.webview.open('login.html');
	curr.close();
}