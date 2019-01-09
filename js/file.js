/*
  下载文件的组织结构说明
  
  1、登录成功后选择语言界面用户头像
  _downloads/VoiceCode/sellang/en.jpg  // 学英语的人物头像
  _downloads/VoiceCode/sellang/cn.jpg  // 学汉语的人物头像
  
  2、下载课程
	不区分语言
  _downloads/course/en/
 
 截屏图片
 _downloads/app/capture/capture.jpg
 
 */

// 得到本应用内容的根目录
function getRootDict() {
	return '_downloads/VoiceCode/';
}

// 得到本应用语言头像界面的目录
function getSelLanguageImgDict() {
	return '_downloads/VoiceCode/sellang/';
}

// 课程根目录
function getCourseDict() {
	return '_downloads/VoiceCode/course/';
}

// 取得截屏分享图片的地址
function getCaptureImgUrl() {
	return '_downloads/VoiceCode/capture/capture.jpg';
}

// 取得课程下每一个单词图片的绝对地址。
function getWordImgAbsolute(id, wordName) {
	var str = getCourseDict() + id + '/' + wordName + '/' + wordName + '.jpg';
	var path = plus.io.convertLocalFileSystemURL(str);
	return path;
}

function getImgAbsolute(imgUrl) {
	var path = plus.io.convertLocalFileSystemURL(imgUrl);
	return path;
}

// 跟后台约定好的，每个课程图片的地址
function getCourseImgUrl(id) {
	var url = getHost() + '/ClassFiles/' + id + '/' + id + '.png';
	return url;
}

// 跟后台约定好 的，每个课程zip的地址
function getCourseZipUrl(id) {
	var url = getHost() + '/ClassFiles/' + id + '/' + id + '.zip';
	return url;
}

// 根据课程ID下载课程的首页图片
// 为简化逻辑，只有当用户选择下载课程的时候才保存课程图片
// 显示的时候先将已下载的课程和图片从本地遍历出来，然后从网络取课程列表，然后将课程中未下载的显示到后面
// 如果遇到过期的课程则删除已经下载的文件并将其从已下载的列表中删除
function downloadCourseImg(id, success, failure) {
	// 先删除一下图片，以防图片已经存在
	var fileUrl = 'VoiceCode/course/' + id + '.png';

	// 无论删除成功还是失败（文件不存在也是失败），都是直接去下载
	deleteFile(fileUrl, function() {
		downloadCourseImgAction(getCourseImgUrl(id), (getCourseDict() + id + '.png'), success, failure);
	}, function() {
		downloadCourseImgAction(getCourseImgUrl(id), (getCourseDict() + id + '.png'), success, failure);
	});
}

// 下载图片
function downloadCourseImgAction(url, filename, success, failure) {
	var option = {
		filename: filename,
		timeout: 30,
		retry: 3,
		retryInterval: 30
	};
	var dtask = plus.downloader.createDownload(url, option, function(download, status) {
		if(status == 200) {
			console.log('已成功保存图片：' + filename);

			if(typeof success == 'function') {
				success();
			}

		} else {
			console.log('保存图片失败：' + filename);

			if(typeof failure == 'function') {
				failure(e);
			}
		}
	});

	dtask.start();
}

function downloadCourseZip(id, success, failure) {
	// 先删除一下zip，以防zip已经存在
	var fileUrl = 'VoiceCode/course/' + id + '.zip';

	deleteFile(fileUrl, function() {
		downloadCourseZipAction(id, success, failure);
	}, function() {
		downloadCourseZipAction(id, success, failure);
	});
}

// 下载课程的zip文件
function downloadCourseZipAction(id, success, failure) {
	var url = getCourseZipUrl(id);
	var option = {
		filename: getCourseDict() + id + '.zip',
		timeout: 30,
		retry: 3,
		retryInterval: 30
	};
	var dtask = plus.downloader.createDownload(url, option, function(download, status) {
		if(status == 200) {
			console.log('已成功保存Zip：' + id);

			unzipCourseZip(id, success, failure);

		} else {
			// 下载失败
			console.log('保存Zip失败：' + id);

			if(typeof failure == 'function') {
				failure(e);
			}
		}
	});
	dtask.start();
}

function unzipCourseZip(id, success, failure) {
	var zipfile = getCourseDict() + id + '.zip';
	var target = getCourseDict() + 'temp/';
	plus.zip.decompress(zipfile, target, function() {
		console.log('解压成功 ' + id);

		renameCourse(id, success, failure);

		// 解压成功后删除zip文件
		deleteZipFile(id);

	}, function(e) {
		console.log('解压失败 ' + id + '  ' + e.message);

		if(typeof failure == 'function') {
			failure(e);
		}
	});
}

// 将zip解压后的文件夹前提一步
function renameCourse(id, success, failure) {
	var folderName;
	plus.io.resolveLocalFileSystemURL(getCourseDict() + 'temp', function(entry) {
		var directoryReader = entry.createReader();
		directoryReader.readEntries(function(entries) {
			for(var i = 0; i < entries.length; i++) {
				var item = entries[i];
				if(item.name == '__MACOSX') {
					continue;
				}

				folderName = item.name;
				break;
			}

			// folderName 取得zip解压后的文件夹的名字
			var fileUrl = 'VoiceCode/course/temp/' + folderName;
			plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, function(fs) {
				fs.root.getDirectory(fileUrl, {
					create: true,
					exclusive: false
				}, function(de1) {
					plus.io.resolveLocalFileSystemURL(getCourseDict(), function(de2) {
						de1.moveTo(de2, '/' + id, function(entry) {
							console.log('移动成功');

							deleteTempFolder();

							if(typeof success == 'function') {
								success();
							}

						}, function(e) {
							console.log(e.message);

							if(typeof failure == 'function') {
								failure(e);
							}
						})
					}, function(e) {
						console.log(e.message);

						if(typeof failure == 'function') {
							failure(e);
						}
					})

				}, function(e) {
					console.log(e.message);

					if(typeof failure == 'function') {
						failure(e);
					}
				})
			}, function(e) {
				console.log(e.message);

				if(typeof failure == 'function') {
					failure(e);
				}
			});

		}, function(e) {
			console.log(e.message);
			if(typeof failure == 'function') {
				failure(e);
			}
		});
	}, function(e) {
		console.log(e.message);

		if(typeof failure == 'function') {
			failure(e);
		}
	})
}

// 删除课程，包括删除图片和删除课程目录及其内部所有文件
function deleteCourse(id, success, failure) {
	var fileUrl = 'VoiceCode/course/' + id + '.png';
	deleteFile(fileUrl);

	// 删除已下载的课程信息
	storageRemoveItem('COURSE' + id);

	deleteCourseFolder(id, success, failure);
}

// 删除temp
function deleteTempFolder() {
	deleteCourseFolder('temp');
}

// 删除zip文件
function deleteZipFile(id, success, failure) {
	var fileUrl = 'VoiceCode/course/' + id + '.zip';
	plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, function(fs) {
		fs.root.getFile(fileUrl, {}, function(fileEntry) {
			fileEntry.remove(function(entry) {
				console.log('删除Zip成功 ' + id);

				if(typeof success == 'function') {
					success();
				}

			}, function(e) {
				console.log('删除Zip失败 ' + id + ' - ' + e.message);

				if(typeof failure == 'function') {
					failure(e);
				}
			});
		});
	});
}

// 删除指定的文件夹及其本身
function deleteCourseFolder(id, success, failure) {
	var fileUrl = 'VoiceCode/course/' + id;

	plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, function(fs) {
		fs.root.getDirectory(fileUrl, {
			create: true,
			exclusive: false
		}, function(de) {
			de.removeRecursively(function(entry) {
				console.log('删除目录文件成功 ' + id);

				if(typeof success == 'function') {
					success();
				}

			}, function(e) {
				console.log('删除目录文件失败 ' + id + '  ' + e.message);

				if(typeof failure == 'function') {
					failure(e);
				}
			});
		});
	});
}

// 删除文件，文件路径如：'VoiceCode/course/10.png'
// 如果文件不存在，则执行的是删除失败，错误信息为 '文件没有发现'
function deleteFile(fileUrl, success, failure) {
	mui.plusReady(function() {
		plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, function(fs) {
			fs.root.getFile(fileUrl, {}, function(fileEntry) {
				fileEntry.remove(function(entry) {
					console.log('删除文件成功 ' + fileUrl);

					if(typeof success == 'function') {
						success();
					}

				}, function(e) {
					console.log('删除文件失败 ' + fileUrl + ' - ' + e.message);

					if(typeof failure == 'function') {
						failure(e);
					}
				});
			}, function(e) {
				console.log(e.message);

				if(typeof failure == 'function') {
					failure(e);
				}
			});
		});
	})
}

// 判断该课程是否已经下载
function judgeHasDownload(id, success, failure) {
	queryAllDownloadedCourse(function(arr) {
		if(typeof success == 'function') {
			success(contains(arr, id));
		}

	}, function(e) {
		if(typeof failure == 'function') {
			failure(e);
		}
	});
}

// 查询所有已经下载的课程
function queryAllDownloadedCourse(success, failure) {
	var arr = new Array();

	mui.plusReady(function() {
		plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, function(fs) {
			fs.root.getDirectory('VoiceCode/course', {
				create: true,
				exclusive: false
			}, function(entry) {
				var directoryReader = entry.createReader();
				directoryReader.readEntries(function(entries) {
					for(var i = 0; i < entries.length; i++) {
						var item = entries[i];
						if(item.isDirectory) {
							arr.push(item.name);
						}
					}

					if(typeof success == 'function') {
						success(arr);
					}

				}, function(e) {
					console.log(e.message);

					if(typeof failure == 'function') {
						failure(e);
					}
				});

			}, function(e) {
				console.log('==' + e.message);
			});
		});
	})
}

// 查询课程下所有的单词
function queryCourseWords(id, success, failure) {
	var url = getCourseDict() + id;
	console.log(url);

	var arr = new Array();
	plus.io.resolveLocalFileSystemURL(url, function(entry) {
		var directoryReader = entry.createReader();
		directoryReader.readEntries(function(entries) {
			for(var i = 0; i < entries.length; i++) {
				var item = entries[i];
				if(item.isDirectory) {
					arr.push(item.name);
				}
			}

			if(typeof success == 'function') {
				success(arr);
			}

		}, function(e) {
			console.log(e.message);

			if(typeof failure == 'function') {
				failure(e);
			}
		});
	}, function(e) {
		console.log(e.message);

		if(typeof failure == 'function') {
			failure(e);
		}
	})

}