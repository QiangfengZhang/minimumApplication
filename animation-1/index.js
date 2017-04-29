window.onload = function() {
	var divs = document.getElementsByName("son");
	var lis = document.getElementsByName("item");
	// 绑定鼠标事件
	for(var i = 0; i < divs.length; i++) {
		// divs[i].timer = null;
		divs[i].onmouseover = function() {
			startMove(this, 600);
		};
		divs[i].onmouseout = function() {
			startMove(this, 200);
		};
	}

	for(var i = 0; i < lis.length; i++) {
		// lis[i].timer = null;
		lis[i].onmouseover = function() {
			startMove(this, 580);
		};
		lis[i].onmouseout = function() {
			startMove(this, 180);
		};
	}
};

// 定义移动函数
function startMove(obj, target) {
	clearInterval(obj.timer);
	obj.timer = setInterval(function() {
		var speed = (target - obj.offsetWidth) / 8;
		speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
		if(obj.offsetWidth == target) {
			clearInterval(obj.timer);
		}else {
			obj.style.width = obj.offsetWidth + speed + "px";
		}
	}, 30);
}