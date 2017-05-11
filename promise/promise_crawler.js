var http = require("http");
var Promise = require("bluebird");
var cheerio = require("cheerio"); // cheerio模块 功能类似 jQuery
var baseUrl = "http://www.imooc.com/learn/"
var videoIds = [348, 637, 259, 728, 134, 75, 197];

function filterChapters(html) {
	var $ = cheerio.load(html, {
		ignoreWhitespace: true
	});
	var chapters = $(".chapter");
	var title = $(".clearfix h2").text();
	var hour = $($(".static-item")[2]).find(".meta-value").text();// ?????????

	// courseData = {
	// 	title: title,  // 课程标签
	// 	hour: hour,// 学习该课程的人数
	// 	videos: [{
	// 		chapterTitle: "",
	// 		videos: [{
	// 			title: "",
	// 			id:""
	// 		}]
	// 	}]
	// }

	var courseData = {
		title: title,
		hour: hour,
		videos: []
	};

	chapters.each(function(item) {
		var chapter = $(this);
		var chapterTitle = chapter.find("strong").text();
		var videos =  chapter.find(".video").children("li");
		var chapterData = {
			chapterTitle: chapterTitle,
			videos: []
		}

		videos.each(function(item) {
			var video = $(this).find(".J-media-item");
			var videoTitle = video.text();
			var id = video.attr("href").split("video/")[1];

			chapterData.videos.push({
				title: videoTitle,
				id: id
			})
		});

		courseData.videos.push(chapterData);

	})
	
	return courseData
};

function printCourseInfo(coursesData) {
	coursesData.forEach(function(courseData) {
		console.log("课程名称：" + courseData.title + " 课程时长：" + courseData.hour+  "\n");
	})

	coursesData.forEach(function(courseData) {
		console.log("### " + courseData.title +"\n");
		courseData.videos.forEach(function(item) {
			var chapterTitle = item.chapterTitle;

			console.log(chapterTitle + "\n");

			item.videos.forEach(function(video) {
				console.log("	【" + video.id + "】" + video.title + "\n");
			})
		})
	})
}

function getPageAsync(url) {
	return new Promise(function(resolve, reject) {
		console.log("正在爬取 " + url);

		http.get(url, function(res) {
			var html = "";
			res.on("data", function(data) {
				html += data;
			});
			res.on("end", function() {
				resolve(html);
			}); 
		}).on("error", function() {
			reject(e);
			console.log("获取课程数据出错");
		})
	})
}

var fetchCourseArray = [];

videoIds.forEach(function(id) {
	fetchCourseArray.push(getPageAsync(baseUrl + id));
})

Promise
	.all(fetchCourseArray)
	.then(function(pages) {
		var coursesData = [];

		pages.forEach(function(html) {
			var course = filterChapters(html);
			coursesData.push(course);
		});

		printCourseInfo(coursesData);
	})