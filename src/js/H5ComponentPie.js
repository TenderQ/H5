/* 饼图组件对象 */
var H5ComponentPie = function(name, config) {
    var component = new H5ComponentBase(name, config);

    var w = config.width;
    var h = config.height;
    // 加入画布
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = ctx.width = w;
    canvas.height = ctx.height = h;
    $(canvas).css({ 'zIndex': '1' });
    component.append(canvas);

    var r = w / 2;
    var step = config.data.length;
    // 加入底图层
    ctx.beginPath();
    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    ctx.arc(r, r, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // 绘制数据层
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = ctx.width = w;
    canvas.height = ctx.height = h;
    $(canvas).css({ 'zIndex': '2' });
    component.append(canvas);

    var colors = ['#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#7cb5ec', '#334b5c']; // 默认颜色
    var sAngle = 1.5 * Math.PI; // 设置其实角度在12点位置
    var eAngle = 0; // 结束角度
    var aAngle = Math.PI * 2; // 100%的圆结束的角度 2PI = 360 

    for (var i = 0; i < step; i++) {
        var item = config.data[i];
        var color = item[2] || (item[2] = colors.shift());
        eAngle = sAngle + aAngle * item[1];

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = .1;
        ctx.moveTo(r, r); // 移动到圆心
        ctx.arc(r, r, r, sAngle, eAngle);
        ctx.fill();
        ctx.stroke();

        sAngle = eAngle;

        // 加入文本及占比
        var text = $('<div class="text">');
        text.text(item[0]);
        var per = $('<div class="per">');
        per.text(item[1] * 100 + '%');

        var x = r + Math.sin(0.5 * Math.PI - sAngle) * r;
        var y = r + Math.cos(0.5 * Math.PI - sAngle) * r;

        if (x > w / 2) {
            text.css('left', x);
        } else {
            text.css('right', w - x);
        }
        if (y > h / 2) {
            text.css('top', y);
        } else {
            text.css('bottom', h - y);
        }
        if (item[2]) {
            text.css('color', color);
        }
        text.css('opacity', 0);
        text.append(per);
        component.append(text);
    }

    // 加入蒙版层
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = ctx.width = w;
    canvas.height = ctx.height = h;
    $(canvas).css({ 'zIndex': '3' });
    component.append(canvas);

    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;

    var draw = function(per) {
        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();
        ctx.moveTo(r, r);

        if (per <= 0) {
            ctx.arc(r, r, r, 0, 2 * Math.PI);
            component.find('.text').css('opacity', 0)
        } else {
            ctx.arc(r, r, r, sAngle, sAngle + 2 * Math.PI * per, true);
        }

        ctx.fill();
        ctx.stroke();

        if (per >= 1) {
        	component.find('.text').css('transition','all 0s');
        	H5ComponentPie.resort(component.find('.text'));
        	component.find('.text').css('transition','all 1s');
            component.find('.text').css('opacity', 1);
        }
    }
    draw(0);
    component.on('onLoad', function() {
        var s = 0;
        for (var i = 0; i < 100; i++) {
            setTimeout(function() {
                s += 0.01;
                draw(s);
            }, i * 10 + 500);
        }
    });
    component.on('onLeave', function() {
        var s = 1;
        for (var i = 0; i < 100; i++) {
            setTimeout(function() {
                s -= 0.01;
                draw(s);
            }, i * 10 + 500);
        }
    });
    return component;
}

H5ComponentPie.resort = function(list){
	// 检测相交
	var compare = function(domA, domB){
		var offsetA = $(domA).offset();
		var positionA_x = [offsetA.left,offsetA.left+$(domA).width()];
		var positionA_y = [offsetA.top,offsetA.top+$(domA).height()];
		var offsetB = $(domB).offset();
		var positionB_x = [offsetB.left,offsetB.left+$(domB).width()];
		var positionB_y = [offsetB.top,offsetB.top+$(domB).height()];
		var intersect_x = (positionA_x[0] > positionB_x[0] && positionA_x[0] < positionB_x[1]) || (positionA_x[1] < positionB_x[1] && positionA_x[1] > positionB_x[0]);
		var intersect_Y = (positionA_y[0] > positionB_y[0] && positionA_y[0] < positionB_y[1]) || (positionA_y[1] < positionB_y[1] && positionA_y[1] > positionB_y[0]);
		return intersect_x && intersect_y;
	}
	var reset = function(domA, domB){
		if($(domA).css('top') != 'auto'){
			$(domA).css('top',parseInt($(domA).css('top')) + $(domB).height());
		}
		if($(domA).css('bottom') != 'auto'){
			$(domA).css('bottom',parseInt($(domA).css('bottom')) + $(domB).height());
		}
		
	}
	var willReset = [list[0]];

	$.each(list, function(i,item){
		if(compare(willReset[willReset.length-1], item)){
			willReset.push(item);
		}
	});

	if(willReset.length > 1) {
		$.each(willReset, function(i, item){
			if(willReset[i+1]){
				reset(item, willReset[i+1]);
			}
		})
		H5ComponentPie.resort(willReset);
	}

}