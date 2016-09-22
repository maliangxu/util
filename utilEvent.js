/**
 * 通用方法封装  --  事件的通用方法
 */

var utilEvent = {

    /*
      *version:property//     描述版本信息属性

      *getEvent:         //   获取事件对象
      *getTarget:        //   获取事件元素对象
      *preventDefault:   //   取消元素默认行为
      *stopPropagation:  //   阻止事件冒泡
      
      *addHander:function//   添加事件绑定函数
      *removeHander:     //   移除对象事件  

      *bindCusEvt        //   元素自定义事件绑定
      *cusEvtArr         //   元素自定义事件绑定
      *triggerCusEvt     //   触发元素自定义事件

      *addCustomEvt      //   自定义事件绑定（供模块之间调用方法）
      *events            //   模块事件
      *trigger           //   触发模块自定义事件
      *removeCustomEvt   //   移除自定义事件

      *ifctrl            //   判断键盘Ctrl按键
      *ifshift           //   判断键盘Shift按键
      *getButton         //   获取鼠标按键
      *keyDown           //   判断按键
      *getRelatedTarger  //   返回与事件的目标节点相关的节点。
      *getWheelDelta     //   获取鼠标滚轮增量值（delta）
      *getCharCode       //   获取按下的键所代表字符的ASCII编码
      
      *getMouseXY        //   获取鼠标位置坐标
      *getTouchPos       //   获取触点屏幕坐标    
      *launchFullScreen  //   进入全屏
      *cancelFullScreen  //   取消全屏

      *getIEVersion      //   得到当前浏览器版本
      *isMobile          //   判断是否为移动设备
  
      *loadScript        //   延迟加载脚本
      *bindFunction      //   改变执行环境：在指定对象上执行操作
      *debounce          //   按一定时间间隔执行函数

     */








    /**
     *description 获取事件对象
     *跨浏览器
     */
    getEvent: function(event) {
        return event ? event : window.event;
    },
    /**
     *description 获取事件元素对象
     *跨浏览器
     */
    getTarget: function(event) {
        return event.target || event.srcElement;
    },
    /**
     *description 取消元素默认行为
     *跨浏览器，如<a href="" >可以通过在onclick事件中阻止href执行页面跳转的默认行为
     */
    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            window.event.returnValue = false;
        }
    },
    /**
     *description 阻止事件冒泡
     *跨浏览器
     */
    stopPropagation: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            window.event.cancelBubble = true;
        }
    },






    /**
     *description 添加事件绑定函数
     *跨浏览器
     */
    addHander: function(element, type, hander) {
        if (element.addEventListener) {
            element.addEventListener(type, hander, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, hander);
        } else {
            //element.setAttribute("on"+type, hander);
            element['on' + type] = hander;
        }
    },
    /**
     *description 移除对象事件
     *跨浏览器
     */
    removeHander: function(element, type, hander) {
        if (element.removeEventListener) {
            element.removeEventListener(type, hander, false);
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, hander);
        } else {
            element['on' + type] = null;
        }
    },

    /**
     * description 元素自定义事件绑定
     * @param ele
     * @param customEvt
     * @param callback
     */
    bindCusEvt: function(ele, customEvt, callback) {
        var e = document.createEvent('Event'); //创建一个Event对象e
        e.initEvent(customEvt, false, false); //进行事件初始化，第二个参数表示事件是否可以起泡，第三个表示是否可用preventDefault阻止事件
        this.cusEvtArr[customEvt] = e;
        ele.addEventListener(customEvt, callback, false); //绑定监听器
    },
    /**
     * description 元素自定义事件绑定
     */
    cusEvtArr: [],
    /**
     * description 触发元素自定义事件
     */
    triggerCusEvt: function(ele, custom) {
        ele.dispatchEvent(this.cusEvtArr[custom]);
    },



    /**
     * description 自定义事件绑定（供模块之间调用方法）
     * @param evtName
     * @param callback
     */
    addCustomEvt: function(evtName, callback) {
        if (!this.events[evtName]) {
            this.events[evtName] = [callback];
        } else {
            this.events[evtName].push(callback);
        }
    },
    /**
     * description 模块事件
     */
    events: {},
    /**
     * description 触发模块自定义事件
     */
    trigger: function(evtName, argsArr) {
        var callbackArr = this.events[evtName];
        if (callbackArr instanceof Array) {
            var args = arguments.length > 1 ? arguments[1] : [];
            for (var i = 0, len = callbackArr.length; i < len; i++) {
                var fun = callbackArr[i];
                fun.apply(null, args);
            }
        }
    },
    /**
     * description 移除自定义事件
     */
    removeCustomEvt: function(evtName, handler) {
        var callbackArr = this.events[evtName];
        if (callbackArr instanceof Array) {
            for (var i = 0, len = callbackArr.length; i < len; i++) {
                if (callbackArr[i] === handler) {
                    break;
                }
            }
            callbackArr.splice(i, 1);
        }
    },


    /*
     *@description 判断键盘Ctrl按键
     *@param {Object} e  事件对象
     */
    ifctrl: function(e) {
        var nav4 = window.Event ? true : false; //初始化变量
        if (nav4) { //对于Netscape浏览器
            //判断是否按下Ctrl按键
            if ((typeof e.ctrlKey != 'undefined') ? e.ctrlKey : e.modifiers & Event.CONTROL_MASK > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            //对于IE浏览器，判断是否按下Ctrl按键
            if (window.event.ctrlKey) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    },

    /*
     *@description 判断键盘Shift按键
     *@param {Object} e  事件对象
     */
    ifshift: function(e) {
        var nav4 = window.Event ? true : false; //初始化变量
        if (nav4) { //对于Netscape浏览器
            //判断是否按下Ctrl按键
            if ((typeof e.shiftKey != 'undefined') ? e.shiftKey : e.modifiers & Event.SHIFT_MASK > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            //对于IE浏览器，判断是否按下Shift按键
            if (window.event.shiftKey) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    },
    /*
     *@description 获取鼠标按键
     *@param {Object} event  事件对象
     */
    getButton: function(event) {
        event = event || window.event;
        if (!+[1, ]) { // !+[1, ]  判定浏览器是IE浏览器
            switch (event.button) {
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4:
                    return 1;
            }
        } else {
            return event.button;
        }
    },
    /*
     *@description 判断按键
     */
    keyDown: function() {
        document.onkeydown = function(evt) {
            var e = window.event || evt;
            var keycode = getKeyCode(e);
            var isCtrl = ifctrl(evt);
            var isshift = ifshift(evt);
            if (isCtrl && keycode == 83) { //Ctrl+S 
            }
            if (isCtrl && keycode == 90) { //Ctrl+Z
            }
            if (keycode == 46) {}
            if (isshift && keycode == 84) {}
        }
    },
    /*  返回与事件的目标节点相关的节点。
     *对于 mouseover 事件来说，该属性是鼠标指针移到目标节点上时所离开的那个节点。
     *对于 mouseout 事件来说，该属性是离开目标时，鼠标指针进入的节点。
     *对于其他类型的事件来说，这个属性没有用。
     */
    getRelatedTarger: function(event) {
        if (event.relatedTarget) {
            return event.relatedTarget;
        } else if (event.toElement) {
            return event.toElement;
        } else if (event.fromElement) {
            return event.fromElement;
        } else {
            return null;
        }
    },

    /*  获取鼠标滚轮增量值（delta）    */
    getWheelDelta: function(event) {
        if (event.wheelDelta) {
            return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
        } else {
            return -event.detail * 40;
        }
    },

    /*  获取按下的键所代表字符的ASCII编码 */
    getCharCode: function(event) {
        if (typeof event.charCode == 'number') {
            return event.charCode;
        } else {
            return event.keyCode;
        }
    },



    /**
     * description 获取鼠标位置坐标
     * @param e 鼠标事件
     * @returns {{x: number, y: number}}
     */
    getMouseXY: function(ele, e) {
        var x = 0,
            y = 0;

        var obj = e.srcElement ? e.srcElement : e.target;
        if (obj.nodeType != 1) {
            return {
                x: x,
                y: y
            };
        }
        if (!document.attachEvent) {
            //获取事件源
            while (obj && obj != ele) {
                var btw = this.getEleStyle(obj, 'border-top-width') == 'medium' ? 0 : this.delpx(this.getEleStyle(obj, 'border-top-width'));
                var blw = this.getEleStyle(obj, 'border-left-width') == 'medium' ? 0 : this.delpx(this.getEleStyle(obj, 'border-left-width'));
                x += obj.offsetLeft + blw;
                y += obj.offsetTop + btw;
                obj = obj.offsetParent;
            }
            x = e.offsetX + x + document.body.scrollLeft;
            y = e.offsetY + y + document.body.scrollTop;
        } else {
            var btw = this.getEleStyle(obj, 'border-top-width') == 'medium' ? 0 : this.delpx(this.getEleStyle(obj, 'border-top-width'));
            var blw = this.getEleStyle(obj, 'border-left-width') == 'medium' ? 0 : this.delpx(this.getEleStyle(obj, 'border-left-width'));
            x = e.layerX - blw;
            y = e.layerY - btw;
        }
        return {
            x: x,
            y: y
        };
    },
    /**
     * description 获取元素样式计算值
     * @param obj
     * @param attribute
     * @returns {*}
     */
    getEleStyle: function(obj, attribute) {
        // 返回最终样式函数，兼容IE和DOM，设置参数：元素对象、样式特性
        var arr = attribute.split('-');
        var attr = arr[0];
        if (attr.length > 1) {
            for (var i = 1; i < arr.length; i++) {
                attr += arr[i].substring(0, 1).toUpperCase() + arr[i].substring(1);
                //除第一个单词外，其余单词首字母转为大写，并拼接起来
            }
        } else {
            attr = attribute;
        }
        return obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj, false)[attr];
    },
    /**
     * description 去除px字样
     * @param value
     * @returns {*}
     */
    delpx: function(value) {
        if (value == "")
            return 0;
        return parseInt(value.substring(0, value.length - 2));
    },

    /**
     * description 获取触点屏幕坐标
     * @param event
     * @returns {{x: number, y: number}}
     */
    getTouchPos: function(event) {
        var touchxy = {
            'x': 0,
            'y': 0
        };
        try {
            touchxy.x = event.touches[0].screenX;
            touchxy.y = event.touches[0].screenY;
        } catch (e) {
            console.log(e.toString());
        }
        return touchxy;
    },




    /*
     *@description 进入全屏
     *@param {Object} element DOM
     *return {Boolean}
     */
    launchFullScreen: function(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        } else if (element.msRequestFullScreen) {
            element.msRequestFullScreen();
        } else {
            return true;
        }
        return false;
    },
    /*
     *@description 取消全屏
     *return {Boolean}
     */
    cancelFullScreen: function() {
        var de = document;
        if (de.exitFullscreen) {
            de.exitFullscreen();
        } else if (de.mozCancelFullScreen) {
            de.mozCancelFullScreen();
        } else if (de.webkitCancelFullScreen) {
            de.webkitCancelFullScreen();
        } else if (de.msExitFullscreen) {
            de.msExitFullscreen();
        } else {
            return true;
        }
        return false;
    },

    /*
     *@description 得到当前浏览器版本
     */
    getIEVersion: function() {
        var userAgent = window.navigator.userAgent.toLowerCase();
        //if(/msie 10\.0/i.test(userAgent)) return 10;
        //if(/msie 9\.0/i.test(userAgent)) return 9;
        if (/msie 8\.0/i.test(userAgent)) return 8;
        if (/msie 7\.0/i.test(userAgent)) return 7;
        if (/msie 6\.0/i.test(userAgent)) return 6;
        return 0;
    },
    /*
     *@description 判断是否为移动设备
     */
    isMobile: function() {
        var isAndroid = navigator.userAgent.match(/Android/i);
        var isiOS = navigator.userAgent.match(/iPhone|ipad|iPod/i);
        if (isAndroid || isiOS) {
            return true;
        } else {
            return false;
        }
    },






    /*
     * description 延迟加载脚本
     * @param {String} url  加载脚本的url
     * @param {Function} callback  加载完成后的回调函数（可选）
     * 该函数只有在没有同名脚本被加载时才加载上新脚本
     **/
    loadScript: function(url, callback) {
        var sts = document.getElementsByTagName('script');
        for (var i = 0, l = sts.length; i < l; i++) {
            if (sts[i].src == url) {
                alert("已有同名的脚本！");
                return;
            }
        }
        var st = document.createElement('script');
        st.type = "text/javascript";
        if (st.readyState) { //IE 
            if (st.readyState == "loaded" || st.readyState == "complete") {
                st.onreadystatechange = null;
                if (callback) {
                    callback();
                } else {
                    return;
                }
            }
        } else { //Others: Firefox, Safari, Chrome, and Opera 
            st.onload = function() {
                if (callback) {
                    callback();
                } else {
                    return;
                }
            };
        }
        st.src = url;
        document.body.appendChild(st);
    },

    /**
     * 改变执行环境：在指定对象上执行操作
     * @param  {[type]} obj  指定的对象
     * @param  {[type]} func 操作函数
     * @return {[type]}      [description]
     */
    bindFunction: function(obj, func) {
        return function() { //匿名函数改变执行环境 
            func.apply(obj, arguments);
            console.log('util', arguments);
        };
    },

    /**
     * 按一定时间间隔执行函数
     * @param func 欲执行函数
     * @param threshold 时间间隔
     * @param execAsap 在事件初始还是结束时执行
     * @returns {Function}
     */
    debounce: function(func, threshold, execAsap, fun) {
        //console.log("OK");
        var timeout;
        return function debounced() {
            var obj = this,
                args = arguments;

            function delayed() {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            };
            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);
            timeout = setTimeout(delayed, threshold || 100);
            fun();
        };
    },


}

