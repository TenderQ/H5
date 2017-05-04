/* 雷达图组件对象 */

var H5ComponentRadar = function (name, config) {
    var component = new H5ComponentBase(name, config);

    var w = config.width;
    var h = config.height;
    // 加入画布
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = ctx.width = w;
    canvas.height = ctx.height = h;
    component.append(canvas);

    var r = w / 2;
    var step = config.data.length;

    // 计算多边形顶点坐标
    // 已知：圆心坐标(a,b),半径r；角度deg
    // rad = (2*Math.PI / 360) *(360 / step) * i;
    // x = a + Math.sin(rad) * r;
    // y = b + Math.cos(rad) *r;
    // 绘制网格背景(分面绘制，10份)
    var striped = false;
    for (var s = 10; s > 0; s--) {
        ctx.beginPath();
        for (var i = 0; i < step; i++) {
            var rad = (2 * Math.PI / 360) * (360 / step) * i;
            var x = r + Math.sin(rad) * r * (s / 10);
            var y = r + Math.cos(rad) * r * (s / 10);
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = (striped = !striped) ? '#99c0ff' : '#f1f9ff';
        ctx.fill();
    }
    // 绘制伞骨
    for (var i = 0; i < step; i++) {
        var rad = (2 * Math.PI / 360) * (360 / step) * i;
        var x = r + Math.sin(rad) * r;
        var y = r + Math.cos(rad) * r;
        ctx.moveTo(r, r);
        ctx.lineTo(x, y);

        // 项目名称
        var text = $('<div class="text">');
        text.text(config.data[i][0]);

        text.css('transition', 'all .5s ' + i * .1 + 's');

        if (x > w / 2) {
            text.css('left', x + 5);
        } else {
            text.css('right', (w - x) + 5);
        }
        if (y > h / 2) {
            text.css('top', y + 5);
        } else {
            text.css('bottom', (h - y) + 5);
        }
        if (config.data[i][2]) {
            text.css('color', config.data[i][2]);
        }
        text.css('opacity', 0);
        component.append(text);
    }
    ctx.strokeStyle = '#e0e0e0';
    ctx.stroke();

    // 数据层的开发
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = ctx.width = w;
    canvas.height = ctx.height = h;
    component.append(canvas);
    ctx.strokeStyle = '#f00';
    var draw = function (per) {
        if (per >= 1) {
            component.find('.text').css('opacity', 1);
        };
        if (per <= 0) {
            component.find('.text').css('opacity', 0);
        }
        ctx.clearRect(0, 0, w, h);
        // 输出数据的折线
        ctx.beginPath();
        for (var i = 0; i < step; i++) {
            var rad = (2 * Math.PI / 360) * (360 / step) * i;
            var rate = config.data[i][1] * per;
            var x = r + Math.sin(rad) * r * rate;
            var y = r + Math.cos(rad) * r * rate;
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        //rgba(73,184,153,0.6)
        ctx.fillStyle = 'rgba(255, 118, 118, 0.6)';
        ctx.fill();
        ctx.stroke();
        // 输出数据的点
        ctx.fillStyle = 'rgb(255, 118, 118';
        for (var i = 0; i < step; i++) {
            var rad = (2 * Math.PI / 360) * (360 / step) * i;
            var rate = config.data[i][1] * per;
            var x = r + Math.sin(rad) * r * rate;
            var y = r + Math.cos(rad) * r * rate;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
    }
    component.on('onLoad', function () {
        var s = 0;
        for (var i = 0; i < 100; i++) {
            setTimeout(function () {
                s += 0.01;
                draw(s);
            }, i * 10 + 500);
        }
    });
    component.on('onLeave', function () {
        var s = 1;
        for (var i = 0; i < 100; i++) {
            setTimeout(function () {
                s -= 0.01;
                draw(s);
            }, i * 10 + 500);
        }
    });
    return component;
}