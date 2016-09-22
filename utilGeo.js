


/*
 *定义geoserver相关通用方法
 */


var utilGeo = {

    /**
    *  worldToScreen        //地理坐标转屏幕坐标
    *  screenToWorld        //屏幕坐标转地理坐标
    *  getShpBox            //获取最小外接矩形
    *  drawLine             //画线
    *  getPolylineLength    //得到线长度
    *  calcAreaMap          //面积计算
    *  drawCalPolyline      //周长计算

    *  isClockWise          //判断多边形是否是顺时针方向 poly是包括最后一个和首节点重合的节点
    *  getOuterPolyIndex
    *  getArea
    *  isPolyInPoly         //判断多边形在多边形内：即判断每一条边是否在多边形内
    *  isLineInPoly         //判断线段是否在多边形内
    *  sortObj
    *  compareFun
    *  isPtEqualLinept
    *  isLineIntersect      //判断线段与线段相交
    *  isPtOnLine
    *  pointInPoly          //判断点在多边形内:转角和法的改进
    *
    */



    /**
     * 将上海坐标系的要素对象转换成经纬度坐标
     * @param map 地图对象
     * @param wx 地理坐标x
     * @param wy 地理坐标y
     * @returns {{x: number, y: number}}
     */
    transformProj2Geo: function(features) {
        var feaLen = features.length;
        var transPoints = [];
        for (var i = 0; i < feaLen; i++) {
            var curfea = features[i];
            var points = curfea.shape.Points;
            var shpbox = curfea.shape.shpBox;
            var tmprings = curfea._lineRings;
            curfea.shape.Points = this.trans2Geo(points);
            curfea.shape.shpBox = this.transShpbox2Geo(shpbox);
            for (var j = 0, len = tmprings.length; j < len; j++) {
                var tmpPoints = tmprings[j].points;
                curfea._lineRings[j].points = this.trans2Geo(tmpPoints);
            }
        }
        return features;
    },
    trans2Geo: function(points) {
        var len = points.length;
        var ptArr = [];
        for (var i = 0; i < len; i++) {
            var pt = points[i];
            var latlng = this.shToLngLat(pt.x, pt.y);
            var obj = { x: latlng.lng, y: latlng.lat };
            ptArr.push(obj);
        }
        return ptArr;
    },
    transShpbox2Geo: function(shpbox) {
        var xmin = shpbox[0];
        var ymin = shpbox[1];
        var xmax = shpbox[2];
        var ymax = shpbox[3];
        var latlng1 = this.shToLngLat(xmin, ymin);
        var latlng2 = this.shToLngLat(xmax, ymax);
        var lat_min = latlng1.lat;
        var lat_max = latlng2.lat;
        var lng_min = latlng1.lng;
        var lng_max = latlng2.lng;
        var shpBox = [lng_min, lat_min, lng_max, lat_max]; //console.log('shpBox',shpBox);
        return shpBox;
    },



    //将经纬度转换成上海坐标
    transformGeo2Proj: function(features) {
        var feaLen = features.length;
        var transPoints = [];
        for (var i = 0; i < feaLen; i++) {
            var curfea = features[i];
            var points = curfea.shape.Points;
            var shpbox = curfea.shape.shpBox;
            var tmprings = curfea._lineRings;
            curfea.shape.Points = this.trans2Proj(points);
            curfea.shape.shpBox = this.transShpbox2Proj(shpbox);
            for (var j = 0, len = tmprings.length; j < len; j++) {
                var tmpPoints = tmprings[j].points;
                curfea._lineRings[j].points = this.trans2Proj(tmpPoints);
            }
        }
        return features;

    },
    trans2Proj: function(points) {
        var len = points.length;
        var ptArr = [];
        for (var i = 0; i < len; i++) {
            var pt = points[i];
            var shxy = this.lnglatToSh(pt.x, pt.y);
            var obj = { x: shxy.x, y: shxy.y };
            ptArr.push(obj);
        }
        return ptArr;
    },
    transShpbox2Proj = function(shpbox) {
        var xmin = shpbox[0];
        var ymin = shpbox[1];
        var xmax = shpbox[2];
        var ymax = shpbox[3];
        var shxy1 = this.lnglatToSh(xmin, ymin);
        var shxy2 = this.lnglatToSh(xmax, ymax);
        var xmin = shxy1.x;
        var xmax = shxy2.x;
        var ymin = shxy1.y;
        var ymax = shxy2.y;
        var shpBox = [xmin, ymin, xmax, ymax]; //console.log('shpBox',shpBox);
        return shpBox;
    },


    /**
     * 地理坐标转屏幕坐标
     * @param map 地图对象
     * @param wx 地理坐标x
     * @param wy 地理坐标y
     * @returns {{x: number, y: number}}
     */
    worldToScreen = function(wx, wy) {
        var cxy = gSelf.getCenter();
        var wcx = cxy.x;
        var wcy = cxy.y;
        var scx = parseInt(gSelf.w) / 2;
        var scy = parseInt(gSelf.h) / 2;
        var scale = gSelf.zoom / parseInt(gSelf.w);

        var sx = parseFloat(scx) + parseFloat((wx - wcx) / scale) + 0.5;
        var sy = parseFloat(scy) - parseFloat((wy - wcy) / scale) + 0.5;
        return {
            x: sx,
            y: sy
        };
    },
    /**
     * 屏幕坐标转地理坐标
     * @param map 地图对象
     * @param sx 屏幕坐标x
     * @param sy 屏幕坐标y
     * @returns {{x: number, y: number}}
     */
    screenToWorld: function(sx, sy) {
        var cxy = gSelf.getCenter();
        var wcx = cxy.x;
        var wcy = cxy.y;
        var scx = parseInt(gSelf.w) / 2;
        var scy = parseInt(gSelf.h) / 2;
        //要加载过动态图层或切片图层，才能直接获取正确的zoom值，若只有第三方地图图层，则需在前端换算坐标...
        var scale = gSelf.zoom / parseInt(gSelf.w);
        var wx = parseFloat(wcx) + parseFloat((sx - scx) * scale);
        var wy = parseFloat(wcy) - parseFloat((sy - scy) * scale);
        return {
            x: wx,
            y: wy
        };
    },
    worldToScreen_geo: function(wx, wy) {
        var cxy = gSelf.getCenter();
        var wcx = cxy.x;
        var wcy = cxy.y;
        var scx = parseInt(gSelf.w) / 2;
        var scy = parseInt(gSelf.h) / 2;
        var scale = gSelf.zoom / parseInt(gSelf.w);

        if (gSelf.coordsFlag == "GEOGRAPHIC") {
            var lon = cxy.x;
            var lat = cxy.y;
            wcx = lon * 111000 * Math.cos(lat);
            wcy = lat * 111000;
            var actualZoom = gSelf.zoom * 111.31955 * 1000;
            scale = actualZoom / parseInt(gSelf.w);
        }
        var sx = scx + parseFloat(wx - wcx) / scale + 0.5;
        var sy = scy - parseFloat(wy - wcy) / scale + 0.5;
        return {
            x: sx,
            y: sy
        };
    },
    screenToWorld_geo: function(sx, sy) {
        var cxy = gSelf.getCenter();
        var wcx = cxy.x;
        var wcy = cxy.y;
        var scx = parseInt(gSelf.w) / 2;
        var scy = parseInt(gSelf.h) / 2;
        //要加载过动态图层或切片图层，才能直接获取正确的zoom值，若只有第三方地图图层，则需在前端换算坐标...
        var scale = gSelf.zoom / parseInt(gSelf.w);

        if (gSelf.coordsFlag == "GEOGRAPHIC") {
            var lon = cxy.x;
            var lat = cxy.y; //console.log("经纬度",lon,lat);
            wcx = lon * 111000 * Math.cos(lat); //假设此纬线的纬度为α 经度1°对应的实际弧长大约为111cosαkm
            wcy = lat * 111000; //全球各地纬度1°的间隔长度都相等（因为所有经线的长度都相等），大约是111km/1°
            var actualZoom = gSelf.zoom * 111.31955 * 1000;
            scale = actualZoom / parseInt(gSelf.w);
        }
        var wx = wcx + parseFloat(sx - scx) * scale;
        var wy = wcy - parseFloat(sy - scy) * scale;
        return {
            x: wx,
            y: wy
        };
    },
    /**
     * 上海市坐标转经纬度
     * @param x
     * @param y
     * @returns {{lat: number, lng: number}}
     */
    shToLngLat: function(x, y) {
        var A = 95418.0172735741;
        var B = 48.3052839794785;
        var C = -11592069.1853624;
        var D = 63.9932503167748;
        var E = 110821.847990882;
        var F = -3469087.15690168;
        var lat = (D * x - A * y - (C * D - A * F)) / (B * D - A * E);
        var lng = (E * x - B * y - (C * E - B * F)) / (A * E - B * D);
        return {
            lat: lat,
            lng: lng
        };
    },
    /**
     * 经纬度转上海坐标
     * @param lat
     * @param lng
     * @returns {{x: number, y: number}}
     */
    lnglatToSh: function(lng, lat) {
        var A = 95418.0172735741;
        var B = 48.3052839794785;
        var C = -11592069.1853624;
        var D = 63.9932503167748;
        var E = 110821.847990882;
        var F = -3469087.15690168;
        var x = A * lng + B * lat + C - 50 + 470;
        var y = D * lng + E * lat + F - 50 - 235;
        return { x: x, y: y };
    },



    /**
     * 获取最小外接矩形
     * @param event
     * @returns {{x: number, y: number}}
     */
    getShpBox: function(points) {
        var len = points.length;
        if (len >= 1) {
            var shpbox = [];
            var xmin = points[0].x;
            var ymin = points[0].y;
            var xmax = points[0].x;
            var ymax = points[0].y;
            if (len >= 2) {
                for (var j = 1; j < len; j++) {
                    var tmppoint = points[j];
                    if (xmin >= tmppoint.x) {
                        xmin = tmppoint.x;
                    }
                    if (xmax <= tmppoint.x) {
                        xmax = tmppoint.x;
                    }
                    if (ymin >= tmppoint.y) {
                        ymin = tmppoint.y;
                    }
                    if (ymax <= tmppoint.y) {
                        ymax = tmppoint.y;
                    }
                }
            }
            shpbox = [xmin, ymin, xmax, ymax];
            return shpbox;
        } else {
            alert('获取最小外接矩形失败！');
            return;
        }
    },




    drawLine: function(ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.stroke();
    };
    getPolylineLength: function(polyPtArr) {
        var len = polyPtArr.length;
        var totalDis = 0;
        for (var j = 0; j < (len - 1); j++) {
            var mdis = Math.sqrt((polyPtArr[j].x - polyPtArr[j + 1].x) * (polyPtArr[j].x - polyPtArr[j + 1].x) + (polyPtArr[j].y - polyPtArr[j + 1].y) * (polyPtArr[j].y - polyPtArr[j + 1].y));
            totalDis = totalDis + mdis;
        }
        return totalDis;
    },

    /**
     * 面积计算
     * @param PtArr
     * @returns {Number}
     */
    calcAreaMap: function(PtArr) {
        var ta = 0;
        var ax = PtArr;
        for (var i = 0; i < ax.length; i++) {
            ta = ta + (ax[i].x * ax[(i + 1) % ax.length].y - ax[(i + 1) % ax.length].x * ax[i].y);
        }
        var meter2 = parseInt(Math.abs(0.5 * ta));
        return meter2;
    },

    /**
     * 周长计算
     * @param ctx
     * @param ptArr
     */
    drawCalPolyline: function(ctx, ptArr) {
        this.setStyle(ctx);
        var len = ptArr.length;
        ctx.beginPath();
        var sxy = this.worldToScreen(ptArr[0].x, ptArr[0].y);
        if (gSelf.coordsFlag == "GEOGRAPHIC") {
            sxy = this.worldToScreen_geo(ptArr[0].x, ptArr[0].y);
        }
        ctx.moveTo(sxy.x, sxy.y);
        for (var i = 1; i < ptArr.length; i++) {
            sxy = this.worldToScreen(ptArr[i].x, ptArr[i].y);
            if (gSelf.coordsFlag == "GEOGRAPHIC") {
                sxy = this.worldToScreen_geo(ptArr[i].x, ptArr[i].y);
            }
            ctx.lineTo(sxy.x, sxy.y);
        }
        ctx.stroke();
        //ctx.closePath();
    },

    /**
     * 样式设置
     * @param ctx
     * @returns {{fillColor: string, strokeColor: string, lineWeight: number, borderStatus: boolean, fillStatus: boolean, vtxStatus: boolean, vtxRadius: number, tlr: number}}
     */
    setStyle: function(ctx, style) {
        var tmpOpt = {
            'fillColor': 'blue',
            'strokeColor': 'blue',
            'lineWeight': 2,
            'borderStatus': true,
            'fillStatus': true,
            'vtxStatus': false,
            'vtxRadius': 3,
            'tlr': 5,
            'opacity': 1
        }
        if (arguments.length > 1) { tmpOpt = style; }
        ctx.fillStyle = tmpOpt.fillColor;
        ctx.strokeStyle = tmpOpt.strokeColor;
        ctx.lineWidth = tmpOpt.lineWeight;
        ctx.globalAlpha = tmpOpt.opacity;
        return tmpOpt; //无用
    },


    //判断多边形是否是顺时针方向 poly是包括最后一个和首节点重合的节点
    isClockWise: function(poly) {
        var area = 0;
        for (var i = 0, len = poly.length; i < len - 1; i++) {
            var p1 = poly[i];
            var p2 = poly[i + 1];
            var s = (p1.y + p2.y) * (p2.x - p1.x) / 2;
            area += s;
        }
        if (area > 0) {
            return true;
        } else {
            return false;
        }
    },

    getOuterPolyIndex: function(lineRingArr) {
        var index = 0,
            max = 0;
        var polyInfo = {};
        for (var i = 0, l = lineRingArr.length; i < l; i++) {
            var poly = lineRingArr[i].points;
            var s = this.getArea(poly);
            polyInfo[i] = s;
            if (max < s) {
                max = s;
            }
        }

        for (var key in polyInfo) {
            if (max == polyInfo[key]) {
                index = key;
                return index
            }
        }
        return 0;
    },
    getArea: function(poly) {
        var ta = 0;
        var ax = poly;
        for (var i = 0; i < ax.length; i++) { //i<ax.length-1
            ta = ta + (ax[i].x * ax[(i + 1) % ax.length].y - ax[(i + 1) % ax.length].x * ax[i].y);
        }
        var meter2 = parseInt(Math.abs(0.5 * ta));
        return meter2;
    },
    //判断多边形在多边形内：即判断每一条边是否在多边形内
    isPolyInPoly: function(innerPoly, outerPoly) {
        var innerLen = innerPoly.length;
        var outerLen = outerPoly.length;
        var pointSet = [];
        for (var i = 0; i < innerLen - 1; i++) {
            var pt1 = innerPoly[i];
            var pt2 = innerPoly[i + 1];
            var line = [pt1, pt2];
            var isInpoly1 = this.pointInPoly(pt1, outerPoly);
            var isInpoly2 = this.pointInPoly(pt2, outerPoly);

            if (!isInpoly1 || !isInpoly2) { //线段的两个端点不都在多边形内，
                return false;
            }

            //判断每条边是否在多边形内
            var flag = this.isLineInPoly(line, outerPoly);
            if (!flag) {
                return false;
            }
        }

        return true;
    },

    //判断线段是否在多边形内 line[pt1,pt2]

    isLineInPoly: function(linePt, poly) {
        var pointSet = [];
        var start = linePt[0];
        var end = linePt[1];
        // var isStartInPoly = pointInPoly(start, poly);
        // var isEndInPoly = pointInPoly(end, poly);
        // if(!isStartInPoly || !isEndInPoly){  //线段的两个端点不都在多边形内，
        //   return false;
        // }
        for (var i = 0, len = poly.length; i < len - 1; i++) {
            var pt1 = poly[i];
            var pt2 = poly[i + 1];
            var curLine = [pt1, pt2];

            var startOnline = this.isPtEqualLinept(start, curLine);
            var endOnline = this.isPtEqualLinept(end, curLine);

            var pt1Online = this.isPtEqualLinept(pt1, linePt);
            var pt2Online = this.isPtEqualLinept(pt2, linePt);

            if (startOnline || endOnline) { //线段PQ的某个端点在多边形的边S上
                if (startOnline) { pointSet.push(startOnline); }
                if (endOnline) { pointSet.push(endOnline); }
            } else if (pt1Online || pt2Online) { //S的某个端点在线段PQ上
                if (pt1Online) { pointSet.push(pt1Online); }
                if (pt2Online) { pointSet.push(pt2Online); }
            } else if (this.isLineIntersect(linePt, curLine)) { // 线段PQ与S相交,交点不在顶点处
                return false;
            }

        }
        //对交点集合进行排序
        if (pointSet.length > 0) {
            var arr = this.sortObj(pointSet);
            for (var i = 0, ptlen = arr.length; i < ptlen - 1; i++) {
                var p1 = arr[i];
                var p2 = arr[i + 1];
                var cx = (p1.x + p2.x) / 2;
                var cy = (p1.y + p2.y) / 2;
                var center = { x: cx, y: cy };
                if (!this.pointInPoly(center, poly)) {
                    return false;
                }
            }
        }
        return true;
    },

    //对象数组的排序
    sortObj: function(pointArr) {
        pointArr.sort(this.compareFun);
        return pointArr;
    },
    compareFun: function(pt1, pt2) {
        return pt1.x - pt2.x;
    },
    //点与线段的某个端点重合
    isPtEqualLinept: function(pt, line) {
        var pt1 = line[0];
        var pt2 = line[1];
        if (pt.x == pt1.x && pt.y == pt1.y) {
            return pt1;
        }
        if (pt.x == pt2.x && pt.y == pt2.y) {
            return pt2;
        }
        return null;
    },
    //判断线段与线段相交 
    //使用向量的方式：PQ线段中 交点o 满足： Ox = P+r*(Q-P) 0<r<1
    //AB线段中 交点o 满足： Ox = A+s*(B-A) 0<s<1  求解r、s，
    isLineIntersect: function(line1, line2) {
        var line1_pt1 = line1[0];
        var line1_pt2 = line1[1];
        var line2_pt1 = line2[0];
        var line2_pt2 = line2[1];

        var m = (line1_pt2.x - line1_pt1.x) * (line2_pt2.y - line2_pt1.y) - (line1_pt2.y - line1_pt1.y) * (line2_pt2.x - line2_pt1.x);
        var n = (line1_pt1.y - line2_pt1.y) * (line2_pt2.x - line2_pt1.x) - (line1_pt1.x - line2_pt1.x) * (line2_pt2.y - line2_pt1.x);
        if (m == 0) { //两直线平行
            return false;
        }

        var r = ((line1_pt1.y - line2_pt1.y) * (line2_pt2.x - line2_pt1.x) - (line1_pt1.x - line2_pt1.x) * (line2_pt2.y - line2_pt1.y)) / m;
        var s = ((line1_pt1.y - line2_pt1.y) * (line1_pt2.x - line1_pt1.x) - (line1_pt1.x - line2_pt1.x) * (line1_pt2.y - line1_pt1.y)) / m;

        if (r > 0 && r < 1 && s > 0 && s < 1) { //alert('相交了'); //线段相交
            return true;
        }
        return false;
    },

    isPtOnLine: function(pt, line) {
        var pt1 = line[0];
        var pt2 = line[1];
        var x_min = Math.min(pt1.x, pt2.x);
        var x_max = Math.max(pt1.x, pt2.x);
        var y_min = Math.min(pt1.y, pt2.y);
        var y_max = Math.max(pt1.y, pt2.y);
        if (pt1.x == pt2.x) { //斜率不存在
            if (pt.x == pt1.x && pt.y >= y_min && pt.y <= y_max) {
                return true;
            }
        } else if (pt1.y == pt2.y) { //斜率为0
            if (pt.y == pt1.y && pt.x >= x_min && pt.x <= x_max) {
                return true;
            }
        } else { //斜率存在 且非0
            var k = (pt2.y - pt1.y) / (pt2.x - pt1.x);
            var y = k * (pt.x - pt1.x) + pt1.y;
            if (y == pt.y && y >= y_min && y <= y_max) {
                return true;
            }
            return false;
        }
    },



    //判断点在多边形内:转角和法的改进 假设点P 与任意多边形poly （1）做一条水平射线，判断P在各边的左边还是右边；（2）左边+1，右边-1，积累求和，如果最后结果为0 则在多边形外部，否在在多边形内部

    pointInPoly: function(pt, poly) {
        for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
            ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y)) && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) && (c = !c);
        return c;
    },


};
