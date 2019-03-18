/*  
    正常权限,无需动态申请:  
        ACCESS_LOCATION_EXTRA_COMMANDS  
        ACCESS_NETWORK_STATE  
        ACCESS_NOTIFICATION_POLICY  
        ACCESS_WIFI_STATE  
        BLUETOOTH  
        BLUETOOTH_ADMIN  
        BROADCAST_STICKY  
        CHANGE_NETWORK_STATE  
        CHANGE_WIFI_MULTICAST_STATE  
        CHANGE_WIFI_STATE  
        DISABLE_KEYGUARD  
        EXPAND_STATUS_BAR  
        GET_PACKAGE_SIZE  
        INSTALL_SHORTCUT  
        INTERNET  
        KILL_BACKGROUND_PROCESSES  
        MODIFY_AUDIO_SETTINGS  
        NFC  
        READ_SYNC_SETTINGS  
        READ_SYNC_STATS  
        RECEIVE_BOOT_COMPLETED  
        REORDER_TASKS  
        REQUEST_INSTALL_PACKAGES  
        SET_ALARM  
        SET_TIME_ZONE  
        SET_WALLPAPER  
        SET_WALLPAPER_HINTS  
        TRANSMIT_IR  
        UNINSTALL_SHORTCUT  
        USE_FINGERPRINT  
        VIBRATE  
        WAKE_LOCK  
        WRITE_SYNC_SETTINGS  

    2)危险权限,需要动态申请:  
    group:android.permission-group.STORAGE  
         READ_EXTERNAL_STORAGE   
         WRITE_EXTERNAL_STORAGE  

    group:android.permission-group.CONTACTS   
         WRITE_CONTACTS   
         GET_ACCOUNTS   
         READ_CONTACTS  

    group:android.permission-group.PHONE  
         READ_CALL_LOG   
         READ_PHONE_STATE   
         CALL_PHONE   
         WRITE_CALL_LOG   
         USE_SIP   
         PROCESS_OUTGOING_CALLS   
        com.android.voicemail.permission.ADD_VOICEMAIL  

    group:android.permission-group.CALENDAR  
         READ_CALENDAR   
         WRITE_CALENDAR  

    group:android.permission-group.CAMERA  
         CAMERA  

    group:android.permissiongroup.SENSORS  
         BODY_SENSORS  

    group:android.permission-group.LOCATION  
         ACCESS_FINE_LOCATION   
         ACCESS_COARSE_LOCATION  

    group:android.permission-group.MICROPHONE  
         RECORD_AUDIO  

    group:android.permission-group.SMS  
         READ_SMS   
         RECEIVE_WAP_PUSH   
         RECEIVE_MMS   
         RECEIVE_SMS   
         SEND_SMS   
         READ_CELL_BROADCASTS  
*/

/**  
 * Me:   
 *    cnscn <214363570@qq.com>  
 *  
 * 参考:  
 *    https://blog.csdn.net/lvyoujt/article/details/52826556  
 *    https://developer.android.com/reference/android/Manifest.permission  
 *    https://developer.android.com/reference/android/os/Build.VERSION  
 */

function check() {
	var Build = plus.android.importClass("android.os.Build");
	var Manifest = plus.android.importClass("android.Manifest");
	var MainActivity = plus.android.runtimeMainActivity();
	//var context=main.getApplicationContext(); //未用到,在此仅供参考  

	var ArrPermissions = [
		Manifest.permission.READ_EXTERNAL_STORAGE,
		Manifest.permission.WRITE_EXTERNAL_STORAGE,
		Manifest.permission.CAMERA
	];

	function PermissionCheck(permission) {
		if(Build.VERSION.SDK_INT >= 23) {
			if(MainActivity.checkSelfPermission(permission) == -1) {
				return false;
			}
		}
		return true;
	}

	function PermissionChecks(Arr) {
		var HasPermission = true;
		for(var index in Arr) {
			var permission = Arr[index];
			//如果此处没有权限,则是用户拒绝了  
			if(!PermissionCheck(permission)) {
				HasPermission = false;
				break;
			}
		}
		return HasPermission;
	}

	function PermissionRequest(Arr) {
		var REQUEST_CODE_CONTACT = 101;
		if(Build.VERSION.SDK_INT >= 23) {
			MainActivity.requestPermissions(Arr, REQUEST_CODE_CONTACT);
		}
	}

	//如果没有权限，则申请  
	if(!PermissionChecks(ArrPermissions)) {
		PermissionRequest(ArrPermissions);
	} else { //如果拥有权限，那么干点啥吧^_^  
		//.......  
	}
	
} // end plusready

if(window.plus) {
	check();
} else {
	document.addEventListener('plusready', check, false);
}