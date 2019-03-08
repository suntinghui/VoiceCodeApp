function getHost() {
	return 'http://47.105.205.21:8999';
}

var kLanguage = 'kLanguage'; // en英文  cn中文

var TIMEOUT = 20000; // 联网超时时间

var kLoginState = 'kLoginState'; // 当前登录状态
var kUserName = 'kUserName'; // 同手机号
var kUserInfo = 'kUserInfo'; // 用户信息，VIP信息等
var kCourseList = 'kCourse'; // 保存响应的报文
var kTheme = 'kTheme'; // 主题
// var kCourseId = 'COURSE'+id; // 该值不确定，由ID来定义。每个课程定义一个key，用于保存其信息。

var FIR_APP_ID = '5a263a38959d6941ae00070f';
var FIR_API_TOKEN = 'b466e4ea1d74d418b79837f4fd6302a8';
var FIR_CHECK_URL = 'http://api.fir.im/apps/latest/' + FIR_APP_ID + '?api_token=' + FIR_API_TOKEN;

var FIR_LINK_Android = 'http://fir.im/vlub';
var FIR_LINK_IOS = "http://fir.im/5exn";

var READ_INTERVAL = 2200; // 朗读单词频率

var PLAY_STATE_STOP = 'STOP'; // 停止播放
var PLAY_STATE_PLAY_RANDOM = 'PLAY_RANDOM'; // 随机播放中
var PLAY_STATE_PLAY_LOOP = 'PLAY_LOOP'; //  循环播放中