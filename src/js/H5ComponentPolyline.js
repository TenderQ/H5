/* 柱图组件对象 */

var H5ComponentPolyline = function (name, config) {
    var component = new H5ComponentBase(name, config);

    var w = config.width;
    var h = config.height;

    // 网格背景
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = ctx.width = w;
    canvas.height = ctx.height = h;
    component.append(canvas);
    // 水平网格线
    var step = 10;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#aaa';

    // 绘制水平网格线
    for (var i = 0; i < step + 1; i++) {
        var y = (h / step) * i;
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
    }

    // 垂直网格线 （根据项目的个数分）
    step = config.data.length + 1;
    var text_w = w / step >> 0;
    for (var i = 0; i < step + 1; i++) {
        var x = (w / step) * i;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);

        if (config.data[i]) {
            var text = $('<div class="text">');
            text.text(config.data[i][0]);
            text.css('width', text_w).css('left', x + text_w / 2);
            component.append(text);
        }
    }
    ctx.stroke();

    // 绘制折线数据
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = ctx.width = w;
    canvas.height = ctx.height = h;
    component.append(canvas);

    var draw = function (per) {
        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ff8878';

        var x = 0;
        var y = 0;
        step = config.data.length + 1;
        var row_w = w / step;
        // 画点 
        for (var i in config.data) {
            if (config.data.hasOwnProperty(i)) {
                var item = config.data[i];
                x = row_w * i + row_w;
                y = h - (item[1] * h * per);
                ctx.moveTo(x, y);
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fillStyle = 'rgb(255,118,118)';
                ctx.fill();
            }
        }
        // 连线
        ctx.moveTo(row_w, h - (config.data[0][1] * h * per));
        for (var i in config.data) {
            var item = config.data[i];
            x = row_w * i + row_w;
            y = h - (item[1] * h * per);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255,118,118,0)';
        // 绘制阴影
        ctx.lineTo(x, h);
        ctx.lineTo(row_w, h);
        ctx.fillStyle = 'rgba(255,118,118,0.4)';
        ctx.fill();

        // 填充数据
        for (var i in config.data) {
            var item = config.data[i];
            x = row_w * i + row_w;
            y = h - (item[1] * h * per);
            ctx.moveTo(x, y);
            ctx.fillStyle = item[2] ? item[2] : '#595959';
            ctx.fillText(((item[1] * 100) >> 0) + '%', x - 10, y - 10);
        }
        ctx.stroke();
    }

    component.on('onLoad', function () {
        var s = 0;
        for (var i = 0; i < 100; i++) {
            setTimeout(function () {
                s += 0.01;
                draw(s);
            }, i * 10 + 500)
        }
    });

    component.on('onLeave', function () {
        var s = 1;
        for (var i = 0; i < 100; i++) {
            setTimeout(function () {
                s -= 0.01;
                draw(s);
            }, i * 10)
        }
    });


    return component;
}