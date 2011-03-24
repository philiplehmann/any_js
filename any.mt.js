//     any.mt.js @VERSION@
//     (c) 2011 Philip Lehmann, Lukas Westermann, at-point ag
//     any.js is freely distributable under the MIT license.
//     Portions of any.js are inspired or borrowed from Underscore.js,
//     Prototype and jQuery.
//     For all details and documentation:
//     TODO: gh-pages

(function($a) {
	var root = this;
	
	var $mt = {};
	
	root.$mt = root._anyMtNoConflict = $mt;
	
	$mt.VERSION = '0.0.1';
	
	$mt.bindHandler = {};
	$mt.registerBindHandler = function(handler, browser) {
		this.bindHandler[browser] = handler;
	};
	
	$mt.unregsiterBindHandler = function(browser) {
		delete this.bindHandler[browser];
	}
	
	$mt.bind = function(node, event, callback, useCapture, data) {
		var browser = $a.browserDetection();
		if( ! $a.isArr(node) && ! $a.isCol(node)) {
			node = [node];
		}
		for(var i=0; i < node.length; i++) {
			if(this.bindHandler[browser]) {
				this.bindHandler[browser].bind(node[i], event, callback, useCapture, data);
			} else {
				EmulateTouch.bind(node[i], event, callback, useCapture, data);
			}
		}
	};
	
	$mt.unbind = function(node, event, callback, useCapture, data) {
		var browser = $a.browserDetection();
		if( ! $a.isArr(node) && ! $a.isCol(node)) {
			node = [node];
		}
		for(var i=0; i < node.length; i++) {
			if(this.bindHandler[browser]) {
				this.bindHandler[browser].unbind(node[i], event, callback, useCapture, data);
			} else {
				EmulateTouch.unbind(node[i], event, callback, useCapture, data);
			}
		}
	};
	
	/**
	 * swipe a node
	 * obj {
	 * 	 node - HTMLElement 
	 *   type - horizontal | vertical
	 *   onSwipeStart - 
	 *   startAfter - default 20px
	 *   onSwipeMove, 
	 *   onSwipeEnd
	 * }
	 */
	$mt.swipe = function(obj) {
		
	}
	
	$mt.escapeElement = function(element) {
		/*
		$a.bind(element, 'click', function(event){return false;});
		$a.bind(element, 'mousedown', function(event){$a.id('focusmaker').focus();console.debug(event);return false;});
		$a.bind(element, 'mousemove', function(event){return false;});
		$a.bind(element, 'mouseup', function(event){return false;});
		$a.bind(element, 'mouseover', function(event){return false;});
		$a.bind(element, 'mouseout', function(event){return false;});
		$a.bind(element, 'mouseenter', function(event){return false;});
		$a.bind(element, 'mouseleave', function(event){return false;});
		*/
		element.onclick = function(event){return false;};
		element.onmousedown = function(event){document.getElementById('focusmaker').focus();return false;};
		element.onmousemove = function(event){return false;};
		element.onmouseup = function(event){return false;};
		element.onmouseover = function(event){return false;};
		element.onmouseout = function(event){return false;};
		element.onmouseenter = function(event){return false;};
		element.onmouseleave = function(event){return false;};
	};
	
	var EmulateTouch = {
		_mapping: {touch: 'click', touchstart: 'mousedown', touchmove: 'mousemove', touchend: 'mouseup'},
		bind: function(node, event, callback, useCapture, data) {
			if(this._mapping[event] !== undefined) {
				return $a.bind(node, this._mapping[event], callback, useCapture, data);
			} else {
				return $a.bind(node, event, callback, useCapture, data);
			}
		},
		
		unbind: function(node, event, callback, useCapture, data) {
			if(this._mapping[event] !== undefined) {
				return $a.unbind(node, this._mapping[event], callback, useCapture, data);
			} else {
				return $a.unbind(node, event, callback, useCapture, data);
			}
		}
	};
	
})(this._anyNoConflict);