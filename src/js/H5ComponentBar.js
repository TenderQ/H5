/* 柱图组件对象 */
// 分为水平柱状图和垂直柱状图，默认水平
var H5ComponentBar = function (name, config) {
    config = $.extend({
        direction: 'horizontal',
    }, config); // 默认为base类型组件 
    if(config.direction === 'vertical'){
        config.type += '_v';
    }
    var component = new H5ComponentBase(name, config);

    $.each(config.data, function(index, item){
        var line = $('<div class="line">');
        var name = $('<div class="name">');
        var rate = $('<div class="rate">');
        var per = $('<div class="per">');
        var percent = item[1]*100 + '%';

        var bgStyle = '';
        if (item[2]) { //颜色
             bgStyle = 'style="background-color:'+item[2]+'"';
        } else {
            bgStyle = 'style="background-color:'+config.data[0][2]+'"';
        }
        rate.html('<div class="bg" '+bgStyle+'></div>');
        if(config.direction === 'vertical'){
            rate.height(percent);
        } else {
            rate.width(percent);
        }
        
        name.text(item[0]);
        per.text(percent);
        line.append(name).append(rate);
        rate.append(per);
        component.append(line);
    });

    return component;
}