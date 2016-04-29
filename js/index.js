$(function () {
    //设备的高度
    var viewHeight = $(window).height();
    //开关思想
    var bOk = true;
    //li所有元素
    var $li = $("#list").find(">li");
    //设置main适应设备的高度
    $("#main").css("height", viewHeight);
    //页面场景切换函数的调用
    pageList();
    function pageList() {
        var startY = null;
        var step = 1 / 4;
        var nowIndex = null;
        var nextprevIndex = null;
        //手按下的时候,ev按时触发的事件集合
        $li.on("touchstart", function (ev) {
            if (!bOk) return;
            bOk = false;
            //获取touch下一系列数据
            var touch = ev.originalEvent.changedTouches[0];
            //获取当前索引
            nowIndex = $(this).index();
            //startY 存下按下的距离
            startY = touch.pageY;

            $li.on("touchmove.move", function (ev) {
                var touch = ev.originalEvent.changedTouches[0];
                $(this).siblings().hide();
                if (touch.pageY < startY) {//往上划
                    //下一个元素的索引
                    nextprevIndex = nowIndex == $li.length - 1 ? 0 : nowIndex + 1;
                    //下一个元素往上走
                    $li.eq(nextprevIndex).css("transform", "translate(0," + (viewHeight + touch.pageY - startY) + "px)");
                } else if (touch.pageY > startY) {//往下划
                    //获取上一个元素索引
                    nextprevIndex = nowIndex == 0 ? $li.length - 1 : nowIndex - 1;
                    //上一个元素往下走
                    $li.eq(nextprevIndex).css("transform", "translate(0," + (-viewHeight + touch.pageY - startY) + "px)");
                } else {
                    bOk = true;
                }
                //当前元素位移和缩放
                $(this).css("transform", "translate(0," + (touch.pageY - startY) * step + "px) scale(" + (1 - Math.abs(touch.pageY - startY) / viewHeight * step) + ")");
                //当前元素的下一个元素显示并且层级提高
                $li.eq(nextprevIndex).show().addClass("zIndex");
                ev.preventDefault();
            });
            $li.on("touchend.move", function (ev) {
                var touch = ev.originalEvent.changedTouches[0];
                if (touch.pageY < startY) {//往上走
                    //当前元素到达他的位移终点,比例终点
                    $(this).css("transform", "translate(0, " + (-viewHeight * step) + "px) scale(" + 1 - step + ")");
                } else if (touch.pageY > startY) {//往下走
                    //当前元素到达他的位移终点,比例终点
                    $(this).css("transform", "translate(0, " + (viewHeight * step) + "px) scale(" + 1 - step + ")");
                } else {
                    bOk = true;
                }
                //控制transform,给他加运动
                $(this).css("transition", "0.3s");
                $li.eq(nextprevIndex).css("transition", "0.3s");
                //上一个或下一个元素到达00点
                $li.eq(nextprevIndex).css("transform", "translate(0,0)");
                //用class的思想,解除事件绑定
                $li.off(".move");
            });
        });
        //当运动结束的时候,要重置哪些样式
        $li.on("transitionEnd webkitTransitionEnd", function (ev) {
            resetFn();
        });
        function resetFn() {
            //去掉所有的运动
            $li.css("transition", "");
            //去掉下一个元素的层级
            $li.eq(nextprevIndex).removeClass("zIndex").siblings().hide();
            bOk = true;
        }
    }
});