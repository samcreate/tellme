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
	var _div = document.createElement("div");
	var _overlay = document.createElement("div");
	var _cur_el;
	var _def;
	var _pause = false;

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
		_overlay.id = "zzTopOverlay";
		_overlay.style.width = window.innerWidth+"px";
		_overlay.style.height = window.innerHeight+"px";
		_overlay.style.backgroundColor = "black";
		_overlay.style.opacity = "0.7";
		_overlay.style.position = "fixed";
		_overlay.style.zIndex = "99999998";
		_overlay.style.top = "0px";
		_overlay.style.left = "0px";
		_div.id = "zzTopHighlighter";
		_d.body.appendChild(_div);
		_d.body.onmousemove = function(e){
			
			
			if(e.target != _d.body && e.target.id != "zzTopHighlighter" && _pause !== true){
				_cur_el = e.target;
				_def = _get_TOP_LEFT(_cur_el);
				_highlight( _cur_el, _def);
			}
		
		};
		_d.body.onclick = function(e){
			_div.style.display = "none";
			_pause = true;
			var _clone = _cur_el.cloneNode(true);
			_clone.style.position = "absolute";
			_clone.style.border = "1px solid blue";
			_clone.style.top = _def.y+"px";
			_clone.style.left = _def.x+"px";
			_clone.style.boxShadow = "0px 0px 15px 5px rgba(50, 176, 203, .75)";
			_clone.style.zIndex = "99999999";
			_clone.style.background = "white";
			_clone.style.width = _cur_el.offsetWidth;
			_clone.style.height = _cur_el.offsetWidth;
			_cur_el.parentNode.appendChild(_clone);
			_d.body.appendChild(_overlay);
			debug.log(_cur_el.outerHTML);
		};
		

	}

	function _get_TOP_LEFT(obj) {
		var left, top, h, w;
		w = obj.offsetWidth;
		h = obj.offsetHeight;
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
			width : w,
			height: h
		};
	};

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

	function _highlight(p_obj, p_def){

		var def = p_def;
		_div.style.display = "block";
		_div.style.width = def.width+"px";
		_div.style.height = def.height+"px";
		_div.style.background = "#32b0cb";
		_div.style.position="absolute";
		_div.style.top = def.y+"px";
		_div.style.left = def.x+"px";
		_div.style.opacity = "0.6";

		
	};
	
}();




tellme.app.init();