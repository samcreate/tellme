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
	var _div_L = document.createElement("div");
	var _div_T = document.createElement("div");
	var _div_R = document.createElement("div");
	var _div_B = document.createElement("div");
	var _screen_holder = document.createElement("div");
	var _overlay = document.createElement("div");
	var _cur_el;
	var _def;
	var _pause = false;
	var _canvas;
	var modal_template;
	var $_modal = null;

	// =================================================
	// = public functions                              =
	// =================================================
	var self = {
		
		init : function(){
	
				debug.group("# [app.js]");
				
				debug.log('- initialized');

				//--> sof private functions
					_addPlugins(
						[
						"https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js",
						"http://tellme.biz/lib/js/plugins/html2canvas.min.js",
						"http://tellme.biz/lib/js/plugins/bootstrap.js",
						"http://tellme.biz/lib/js/plugins/handlebars-1.0.rc.1.js"
						],
						_run);
					
				//--> eof private functions

				debug.groupEnd();

		}
		
	};
	
	return self;
	
	// ================================================
	// = Private functionse (function _private() {} ) =
	// ================================================

	function _run(){
		debug.log("_run() called");

		_setup_styles();

		$.getJSON('http://tellme.biz/api/html/modal?callback=?',function(res){
			
			modal_template = Handlebars.compile(res.template);
			
		});

		
		_overlay.id = "zzTopOverlay";
		_overlay.style.width = window.innerWidth+"px";
		_overlay.style.height = window.innerHeight+"px";
		_overlay.style.backgroundColor = "black";
		_overlay.style.opacity = "0.7";
		_overlay.style.position = "fixed";
		_overlay.style.zIndex = "99999998";
		_overlay.style.top = "0px";
		_overlay.style.left = "0px";
		_div_L.id = "zzTopHighlighter_LEFT";
		_div_T.id = "zzTopHighlighter_TOP";
		_div_B.id = "zzTopHighlighter_BOTTOM";
		_div_R.id = "zzTopHighlighter_RIGHT";
		_screen_holder.id = "zzTopScreenHolder";
		_d.body.appendChild(_div_L);
		_d.body.appendChild(_div_T);
		_d.body.appendChild(_div_B);
		_d.body.appendChild(_div_R);
		_d.body.appendChild(_screen_holder);

		$('*').on('click',function(e){e.preventDefault();});
		
		_d.body.onmousemove = function(e){
			
			
			if(e.target != _d.body && e.target.id != "zzTopHighlighter" && _pause !== true){
				_cur_el = e.target;
				_def = _get_TOP_LEFT(_cur_el);
				_highlight( _cur_el, _def);
			}
		
		};
		_d.body.onclick = function(e){
			// _div.style.display = "none";
			if(_pause) return;
			_pause = true;

			//
			
	
			_unhighlight();

			html2canvas( [ document.body ], {

				onrendered: function( canvas ) {

					_canvas = canvas;
					var ctx=_canvas.getContext("2d");
					var _padding = 20;
					var _image_data = ctx.getImageData(_def.x,_def.y,_def.width+_padding,_def.height+_padding);
					_canvas.width = _def.width+_padding;
					_canvas.height = _def.height+_padding;
					ctx.putImageData(_image_data,0+(_padding/2),0+(_padding/2));
					_showScreenshot(_canvas,_def.width,_def.height);
				},
				proxy: ""
			});



		};
		
		return false;
	}

	function _showScreenshot (p_canvas,p_w, p_h) {


		var _data_url = p_canvas.toDataURL();

		debug.log(_data_url )

		var context = {title: "Tell me when: "+window.location.host+" updates!", body: "There's your selection!",src:_data_url};
			$_modal = $(modal_template(context));
			$('body').append($_modal);
		$_modal.modal('show');

		return;
		
		_screen_holder.appendChild( p_canvas );
		_screen_holder.style.position = "fixed";
		_screen_holder.style.border = "1px solid blue";
		_screen_holder.style.top = "35%";
		_screen_holder.style.left = (window.innerWidth/2)-(p_canvas.width/2)+"px";
		_screen_holder.style.boxShadow = "0px 0px 15px 5px rgba(50, 176, 203, .75)";
		_screen_holder.style.zIndex = "99999999";
		_screen_holder.style.backgroundColor = "white";
		_screen_holder.style.width = p_canvas.width+"px";
		_screen_holder.style.height = p_h;
		_d.body.appendChild(_overlay);


		
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

	function _addPlugins(p_src, p_callback) {
		for (var i = 0; i < p_src.length; i++) {
			debug.log(p_src[i]);

		}
		var _script_index = 0;
		var _script_length = p_src.length;
		(function(){

			var done = false;
			var script = _d.createElement("script");
			var _scope = arguments.callee;
			script.src = p_src[_script_index];
			script.className = 'zzTop_script_'+_script_index;
			script.onload = script.onreadystatechange = function(){
				if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
					done = true;
					if(_script_index < _script_length){
						_script_index++;

						if(_script_index >= _script_length){
							if(p_callback !== undefined) {
								debug.log("--> Finished Loading plugins.");
								p_callback();
							}
						}else{
							_scope.call();
						}
						
					}
					

					
				}
			};
			_d.getElementsByTagName("head")[0].appendChild(script);
		}());
		
		

	}

	function _highlight(p_obj, p_def){

		var def = p_def, _padding =5, _thickness = 2;



		// left;
		_div_L.style.display = "block";
		_div_L.style.width = _thickness+"px";
		_div_L.style.background = "#32b0cb";
		_div_L.style.position="absolute";
		_div_L.style.opacity = "0.6";
		_div_L.style.height = (def.height+(_padding*2))+"px";
		_div_L.style.top = (def.y-_padding)+"px";
		_div_L.style.left = (def.x-_padding)+"px";
		_div_L.style.zIndex = "99999999";
		
		// top;
		_div_T.style.display = "block";
		_div_T.style.background = "#32b0cb";
		_div_T.style.position="absolute";
		_div_T.style.opacity = "0.6";
		_div_T.style.top = (def.y-_padding)+"px";
		_div_T.style.height = _thickness+"px";
		_div_T.style.left = (def.x-_padding)+"px";
		_div_T.style.width = (def.width+(_padding*2))+"px";
		_div_T.style.zIndex = "99999999";
		// right;
		_div_R.style.display = "block";
		_div_R.style.background = "#32b0cb";
		_div_R.style.position="absolute";
		_div_R.style.opacity = "0.6";
		_div_R.style.left = ((def.x+def.width)+_padding)+"px";
		_div_R.style.top = (def.y-_padding)+"px";
		_div_R.style.height = (def.height+(_padding*2))+"px";
		_div_R.style.width = (_thickness)+"px";
		_div_R.style.zIndex = "99999999";

		// bottom;
		_div_B.style.display = "block";
		_div_B.style.background = "#32b0cb";
		_div_B.style.position="absolute";
		_div_B.style.opacity = "0.6";
		_div_B.style.top = ((def.y + def.height )+_padding)+"px";
		_div_B.style.height = _thickness+"px";
		_div_B.style.left = (def.x-_padding)+"px";
		_div_B.style.width = (def.width+(_padding*2)+_thickness)+"px";
		_div_B.style.zIndex = "99999999";


		
	}

	function _unhighlight () {
		
		_div_L.style.opacity = 0;

		// top
		_div_T.style.opacity = 0;

		// rig
		_div_R.style.opacity = 0;

		// bot
		_div_B.style.opacity = 0;

	}

	function _setup_styles () {
		$('body').addClass('zzTopBody');
		$("head").append("<link>");
		css = $("head").children(":last");
		css.attr({
			rel:  "stylesheet",
			type: "text/css",
			href: "http://tellme.biz/styles/bootstrap.css"
		});
	}
	
}();




tellme.app.init();