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

        if (per >= 1) {
            component.find('.text').css('opacity', 1);
        }
        if (per <= 0) {
            ctx.arc(r, r, r, 0, 2 * Math.PI);
            component.find('.text').css('opacity', 0)
        } else {
            ctx.arc(r, r, r, sAngle, sAngle + 2 * Math.PI * per, true);
        }

        ctx.fill();
        ctx.stroke();
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