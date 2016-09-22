
var utilDOM = {

 /*
    *createDiv            //   创建div
    *createTextArea       //   创建textarea
    *createCanvas         //   创建canvas
    *dragDiv              //   拖动元素
    *confirmDiv           //   弹出框
	  *insertAfter_cust     //   inserAfter实现
	  *showTipWin           //   提示框

   */




/**
 * 创建div
 * @param id
 * @param w
 * @param h
 * @param pos
 * @returns {HTMLElement}
 */

createDiv: function (id, w, h, pos) {
	var div = document.createElement('div');
	div.id = id;
	div.style.width = w + 'px';
	div.style.height = h + 'px';
	if (pos) {
		div.style.position = "absolute";
	}
	div.style.zIndex = 1;
	return div;
},
/**
 * 创建textarea
 * @param id
 * @param w
 * @param h
 * @param pos
 * @returns {HTMLElement}
 */

createTextArea: function (id, w, h, pos) {
	var div = document.createElement('textarea');
	div.id = id;
	div.style.width = w + 'px';
	div.style.height = h + 'px';
	if (pos) {
		div.style.position = "absolute";
	}
	div.style.zIndex = 1;
	return div;
},

/**
 * 创建canvas
 * @param id
 * @param w
 * @param h
 * @param pos
 * @returns {HTMLElement}
 */
createCanvas : function (id, w, h, pos) {
	var canvas = document.createElement('canvas');
	if(this.getIEVersion()!=0){
        canvas=window.G_vmlCanvasManager.initElement(canvas);
    }
	canvas.id = id;
	canvas.width = w;
	canvas.height = h;
	canvas.style.width = w + 'px';
	canvas.style.height = h + 'px';
	if (pos) {
		canvas.style.position = "absolute";
	}
	return canvas;
},


/**
 * 拖动元素
 * @param  {[type]} divId      要拖动的元素的id
 * @param  {[type]} dragzoneId 拖动区域的id
 */
dragDiv:function(divId,dragzoneId){
  var odiv=document.getElementById(divId);
  var dragZone=document.getElementById(dragzoneId);
  dragZone.style.cursor='move';

  var odivWid_Px=odiv.currentStyle ? odiv.currentStyle['width'] : document.defaultView.getComputedStyle(odiv, null)['width'];
  var odivheignt_Px=odiv.currentStyle ? odiv.currentStyle['height'] : document.defaultView.getComputedStyle(odiv, null)['height'];
  var odivWid=odivWid_Px.substring(0,odivWid_Px.length-2);
  var odivh=odivheignt_Px.substring(0,odivheignt_Px.length-2);
  dragZone.onmousedown=function (e){  
    var dltx=e.clientX-odiv.offsetLeft;
    var dlty=e.clientY-odiv.offsetTop;
    document.onmousemove=function (e){  //绑定到document上
      var left=e.clientX-dltx;
      var top=e.clientY-dlty;
      if(left<0){
       left=0;
      }else if(left>document.body.clientWidth-odivWid){  
        left=document.body.clientWidth-odivWid;
       }

      if(top<0){
        top=0;
      }else if(top>document.body.clientHeight-odivh){
        top=document.body.clientHeight-odivh;
      }

        odiv.style.left=left+'px';
        odiv.style.top=top+'px';
    };
    document.onmouseup=function (e){
      document.onmousemove=null;
      document.onmouseup=null;
    };
  };
},

    /*
    *删除框
    *注意：删除框的logo标志需要重新写
    *strmsg	删除框的文本文字
    *titlename 删除框标题
    *confirmName 确认按钮的文字
    *failName 取消按钮的文字
    *Success_callback 确认后回调函数
    *ifclose是否在右上角添加关闭按钮
    */
    confirmDiv:function(strmsg,titlename,confirmName,failName,Success_callback,ifclose){
        var tmpdoc=document;
        var div=tmpdoc.createElement('div');
        var bckdiv=div.cloneNode(false);
        bckdiv.id="confirm_wode";
        bckdiv.style.position="absolute";
        bckdiv.style.width="100%";
        bckdiv.style.height="100%";
        bckdiv.style.left="0px";
        bckdiv.style.top="0px";
        bckdiv.style.background="rgba(0,14,12,0.3)";
        bckdiv.style.zIndex=200000000000;
        var frontdiv=div.cloneNode(false);
        frontdiv.style.width="375px";
        frontdiv.style.height="180px";
        frontdiv.style.position="absolute";
        frontdiv.style.left="50%";
        frontdiv.style.top="50%";
        frontdiv.style.marginLeft="-190px";
        frontdiv.style.marginTop="-140px";
        frontdiv.style.zIndex=200000000001;
        frontdiv.style.background="#FFFFFF";
        frontdiv.style.borderRadius="2px";
        frontdiv.style.boxShadow="2px 5px 7px #676a6c";
        frontdiv.style.border="1px solid #d8d6d8";
        
        var fronttitle=div.cloneNode(false);
        fronttitle.style.backgroundColor="#448ed8";
        fronttitle.style.position="relative";
        fronttitle.style.borderBottom="1px solid #E5E5E5";
        fronttitle.style.borderTopLeftRadius="1px";
        fronttitle.style.borderTopRightRadius="1px";
        fronttitle.style.height="30px";
        fronttitle.style.lineHeight="30px";
        fronttitle.style.width="100%";
        fronttitle.style.border="1px solid #448ed8";
        fronttitle.style.marginLeft="-1px";
        fronttitle.style.marginTop="-1px";
        fronttitle.style.color="#fff";
        fronttitle.style.fontSize="12px";
        fronttitle.style.fontFamily='微软雅黑'; 
        fronttitle.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;"+titlename;
        if(ifclose){
           var closeDiv=div.cloneNode(false);
           closeDiv.style.position="absolute";
           closeDiv.style.right="10px";
           closeDiv.style.top="2px";
           closeDiv.innerHTML="<img src='modules/usermge/imgs/pop_close.png'>";
           closeDiv.style.cursor="pointer";
           closeDiv.onclick=function(){
              var obj=tmpdoc.getElementById('confirm_wode');
              obj.parentNode.removeChild(obj);
           };
           fronttitle.appendChild(closeDiv);
        }
        frontdiv.appendChild(fronttitle);
    
        var contentDiv=div.cloneNode(false);
        contentDiv.style.backgroundColor="#FFFFFF";
        contentDiv.style.height="80px";
        contentDiv.style.width="100%";
    
    
        var imgalert=tmpdoc.createElement('img');
        imgalert.style.marginLeft="30px";
        imgalert.style.marginTop="25px";
        imgalert.style.height="60px";
        imgalert.style.width="60px";
        imgalert.src="modules/usermge/imgs/help.png";
        var pmsg=tmpdoc.createElement('p');
        /*pmsg.style.paddingLeft="10px";*/
        pmsg.style.width="280px";
        pmsg.style.fontSize="14px";
        pmsg.style.fontFamily='微软雅黑'; 
        pmsg.style.textIndent="2em";
        pmsg.style.lineHeight="40px";
        pmsg.style.color="#333";
        pmsg.style.display="inline-block";
        pmsg.style.verticalAlign="bottom";
        pmsg.innerHTML=strmsg;
        contentDiv.appendChild(imgalert);
        contentDiv.appendChild(pmsg);
        frontdiv.appendChild(contentDiv);
        
        
        var footerDiv=div.cloneNode(false);
        footerDiv.style.position="relative";
        footerDiv.style.backgroundColor="#fff";
        //footerDiv.style.borderBottom="1px solid #E5E5E5";
        footerDiv.style.borderBottomLeftRadius="2px";
        footerDiv.style.borderBottomRightRadius="2px";
        footerDiv.style.height="30px";
        footerDiv.style.lineHeight="30px";
        footerDiv.style.width="100%";
        footerDiv.style.textAlign="center";
        var btnConfirm=div.cloneNode(false);
        btnConfirm.style.background="#448ed8";
        btnConfirm.style.background="-webkit-gradient(linear, left top, left bottom, color-stop(0%,#448ed8), color-stop(100%,#448ed8))";
        btnConfirm.style.background="-webkit-linear-gradient(top, #448ed8 0%,#448ed8 100%)";
        btnConfirm.style.border="1px solid #448ed8";
        btnConfirm.style.color="#FFFFFF";
        btnConfirm.style.fontWeight="bold";
        btnConfirm.style.textAlign="center";
        btnConfirm.style.width="90px";
        btnConfirm.style.height="25px";
        btnConfirm.style.borderRadius="2px";
        btnConfirm.style.border="1px solid #bab9b9";
        btnConfirm.style.fontSize="12px";
        btnConfirm.style.fontFamily='微软雅黑'; 
        btnConfirm.style.position="absolute";
        btnConfirm.style.left="150px";
        btnConfirm.style.top="3px";
        btnConfirm.style.lineHeight="25px";
        btnConfirm.style.marginTop="30px";
        btnConfirm.style.cursor="pointer";
        btnConfirm.innerHTML=confirmName;
        btnConfirm.onclick=function(){
           var obj=tmpdoc.getElementById('confirm_wode');
           obj.parentNode.removeChild(obj);
           Success_callback();
        };
    
        var btnCancle=div.cloneNode(false);
        btnCancle.style.background="#448ed8";
        btnCancle.style.background="-webkit-linear-gradient(top, #448ed8 0%,#448ed8 100%)";
        btnCancle.style.background="linear-gradient(top, #448ed8 0%,#dfdede 100%)";
        btnCancle.style.border="1px solid #448ed8";
        btnCancle.style.color="#FFFFFF";
        btnCancle.style.textAlign="center";
        btnCancle.style.width="90px";
        btnCancle.style.height="25px";
        btnCancle.style.borderRadius="2px";
        btnCancle.style.border="1px solid #bab9b9";
        btnCancle.style.fontSize="12px";
        btnCancle.style.fontFamily='微软雅黑'; 
        btnCancle.style.position="absolute";
        btnCancle.style.right="20px";
        btnCancle.style.top="33px";
        btnCancle.style.lineHeight="25px";
        btnCancle.style.cursor="pointer";
        btnCancle.innerHTML=failName;
        btnCancle.onclick=function(){
           var obj=tmpdoc.getElementById('confirm_wode');
           obj.parentNode.removeChild(obj);
           //Fail_callback();
        };
        footerDiv.appendChild(btnConfirm);
        footerDiv.appendChild(btnCancle);
        frontdiv.appendChild(footerDiv);
    
        bckdiv.appendChild(frontdiv);
        tmpdoc.body.appendChild(bckdiv);
    },

	//inserAfter实现：  DOM中未提供
	insertAfter_cust : function (newElement,targetElement){
	   var parent = targetElement.parentNode;  
	    if(parent.lastChild == targetElement){  
	        parent.appendChild(newElement);  
      	}else{  
      	  parent.insertBefore(newElement,targetElement.nextSibling);  
      	}  
	},

   /*
    *提示框
    *tipmsg	提示框的文本文字
    */
    showTipWin: function (tipmsg){
    	var tmpdoc=document;
     	var div=tmpdoc.createElement('div');
      	div.style.zIndex=100000;
     	div.id="tipWinID";
     	tmpdoc.body.appendChild(div);
  	    $('#tipWinID').html(tipmsg);
  	    $('#tipWinID').css({
            'position':'absolute',
            'width':'200px',
            'height':'40px',
            'left':'50%',
            'top':'50%',
  	    	  'margin-left':'-100px',
            'margin-top':'-20px',
  	    	  'border-radius':'20px',
            'background-color':'#757575',
            'text-align':'center',
            'line-height':'40px',
  	    	  'font-size':'15px',
            'color':'#fff'
        });
        $("#tipWinID").css({'margin-top':-20+document.body.scrollTop});
  	    $('#tipWinID').fadeIn(200).delay(500).fadeOut(200);
  	    setTimeout(function(){
  	    	tmpdoc.body.removeChild(div);
  	    },900);  	    
  	},









}