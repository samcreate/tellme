/*! app class
 * Put javascript plugin depedencies below (see main.js for an exmaple)
 * @depends jquery/jquery-1.8.0.min.js
 */
window.debug=(function(){var i=this,b=Array.prototype.slice,d=i.console,h={},f,g,m=9,c=["error","warn","info","debug","log"],l="assert clear count dir dirxml exception group groupCollapsed groupEnd profile profileEnd table time timeEnd trace".split(" "),j=l.length,a=[];while(--j>=0){(function(n){h[n]=function(){m!==0&&d&&d[n]&&d[n].apply(d,arguments)}})(l[j])}j=c.length;while(--j>=0){(function(n,o){h[o]=function(){var q=b.call(arguments),p=[o].concat(q);a.push(p);e(p);if(!d||!k(n)){return}d.firebug?d[o].apply(i,q):d[o]?d[o](q):d.log(q)}})(j,c[j])}function e(n){if(f&&(g||!d||!d.log)){f.apply(i,n)}}h.setLevel=function(n){m=typeof n==="number"?n:9};function k(n){return m>0?m>n:c.length+m<=n}h.setCallback=function(){var o=b.call(arguments),n=a.length,p=n;f=o.shift()||null;g=typeof o[0]==="boolean"?o.shift():false;p-=typeof o[0]==="number"?o.shift():n;while(p<n){e(a[p++])}};return h})(); 
var tellme = tellme || {};
tellme.app = function(){
	// =================================================
	// = Private variables (example: var _foo = bar; ) =
	// =================================================
	var _d=document;

	// =================================================
	// = public functions                              =
	// =================================================
	var self = {
		
		init : function(){
	
				debug.group("# [app.js]");
				
				debug.log('- initialized');

				//--> sof private functions
					_run();
				//--> eof private functions

				debug.groupEnd();

		}
		
	};
	
	return self;
	
	// ================================================
	// = Private functionse (function _private() {} ) =
	// ================================================

	function _run(){

		this.onmousemove = function(e){
			debug.log("ELEMENT: ", e.target);
		}
		return;
		var _objs = _d.getElementsByTagName("*");

		for (var i = 0; i < _objs.length; i++) {

			new HoverElement(_objs[i]);
	
		}

	}

	function _addPlugin(p_src, p_callback) {

		var done = false,
			script = _d.createElement("script");
		script.src = p_src;
		script.className = 'holify_script';
		script.onload = script.onreadystatechange = function(){
			if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
				done = true;
				if(p_callback !== undefined) {

					p_callback();
				}
			}
		};
		_d.getElementsByTagName("head")[0].appendChild(script);

	}
	
}();



(function(window) {

	HoverElement = function(p_el){

		var _temp = this.extend(p_el, this);
		
		_temp.onmouseover = this.mouseover;
		_temp.onmouseout = this.mouseout;
		_temp.onclick = this.mouseclick;

		return _temp;
	};

	var _pt = HoverElement.prototype;

	_pt.mouseover = function(e){
		e.stopPropagation();
		this._oldbgc = this.style.backgroundColor || this._oldbgc;
		debug.log("COLOR: ",this._oldbgc);
		this.style.backgroundColor = "#FDFF47";
		//this.highlight();
	};

	_pt.mouseout = function(e){
		e.stopPropagation();
		this.style.backgroundColor = this._oldbgc || "";
		this._removeElement();
		
		debug.log("remove!: ",this.div);
	};

	_pt.mouseclick = function(e){
		e.stopPropagation();
			e.preventDefault();
			debug.log("Click");
			debug.log(this.outerHTML);
	};

	_pt.highlight = function(){

		var def = this._get_TOP_LEFT();
		this.div = document.createElement("div") || this.div;
		this.div.style.width = def.width+"px";
		this.div.style.height = def.height+"px";
		this.div.style.background = "red";
		this.div.style.position="absolute";
		this.div.style.top = def.y+"px";
		this.div.style.left = def.x+"px";

		document.body.appendChild(this.div);
	};

	_pt.extend = function(p_el, p_opt){
		for(var name in p_opt) {
			p_el[name] = p_opt[name];
		}
		return p_el;
	};


	_pt._get_TOP_LEFT = function () {
		var left, top, obj = this;
		left = top = 0;
		if (obj.offsetParent) {
			do {
				left += obj.offsetLeft;
				top  += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}
		return {
			x : left,
			y : top,
			width : this.offsetWidth,
			height: this.offsetHeight
		};
	};

	_pt._removeElement = function(){
		this.div.parentNode.removeChild(this.div);
	};

	window.HoverElement = HoverElement;

}(window));


tellme.app.init();