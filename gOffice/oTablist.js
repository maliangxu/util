;(function (){

/*	tab页列表	*/
var Tablist = function(containerId,listData){
	this.containerId = containerId;
	this.listData = listData;
	this._events = {};
	this._customNode = {};
};
Tablist.prototype = {
	constructor: Tablist,

	init: function(){
		
	},
	_exec: function(ifBindEvt){
		var len = this.listData.length;
		if(len){
			var ul = document.createElement('ul');
			// ul.style.overflow='auto';
			for(var i=0; i<len; i++){
				var obj = this.listData[i];
				var li = this._createNode('li');
				if(obj.ifSimple && obj.ifSimple.value == false){
					this._customNode[obj.ifSimple.keyname](li);
				} else {
					var txt = this._createTextNode(obj.value);
					li.appendChild(txt);
				}
				if(obj.option) {this._addAttr(li,obj.option);}
				
				if(obj.mark){
					var a = document.createElement('a');
					a.style.display='none';
					var em = document.createElement('em');
					a.appendChild(em);
					li.appendChild(a);
				}
				if(obj.clickEvt){
					$(li).bind('click',obj.clickEvt);
				}
				ul.appendChild(li);
			}		
		}
		var currentNode = document.getElementById(this.containerId);
		if(currentNode.childNodes.length){
			currentNode.removeChild(currentNode.childNodes[0]);			
		}
		if(ul != undefined){
			document.getElementById(this.containerId).appendChild(ul);
		}
		
		if(ifBindEvt){this._bindEvt(ul);}
	},

	_createNode:function (type){
		var node = document.createElement(type);
		return node;
	},

	_createTextNode: function(text){
		return document.createTextNode(text);
	},

	_addAttr: function(obj,attr){
		if(!this._isEmptyObject(attr)){
			for(key in attr){
				obj.setAttribute(key,attr[key]);
			}
		}
	},

	_bindEvt: function(obj){
		var that = this;
		if(!(obj instanceof jQuery)){
			obj = $(obj);
		}
		for(key in this._events){
			$(obj).children('li').bind(key,this._events[key]);
		}
	},

	_isEmptyObject: function(e){
		var t;
		for (t in e)
			return !1;
		return !0
	},
}


window.oClass.Tablist = Tablist;
})();