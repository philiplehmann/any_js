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
	
	root.$mt = $mt;
	
	$mt.VERSION = '0.0.1';
	
	$mt.bindHandler = {};
	$mt.registerBindHandler = function(handler, browser) {
		this.bindHandler[browser] = handler;
	};
	
	$mt.unregsiterBindHandler = function(browser) {
		delete this.bindHandler[browser];
	}
	
	$mt.bind = function(node, event, callback, useCapture, data) {
		if($a.isArr(node) || $a.isCol(node)) {
			for(var i=0; i < node.length; i++) {
				this.bind(node[i], event, callback, useCapture, data);
			}
			return;
		}
		var browser = $a.browserDetection();
		if(this.bindHandler[browser]) {
			return this.bindHandler[browser].bind(node, event, callback, useCapture, data);
		} else {
			return EmulateTouch.bind(node, event, callback, useCapture, data);
		}
	};
	
	$mt.unbind = function(node, event, callback, useCapture) {
		if($a.isArr(node) || $a.isCol(node)) {
			for(var i=0; i < node.length; i++) {
				this.unbind(node[i], event, callback, useCapture);
			}
			return;
		}
		var browser = $a.browserDetection();
		if(this.bindHandler[browser]) {
			return this.bindHandler[browser].bind(node, event, callback, useCapture);
		} else {
			return EmulateTouch.bind(node, event, callback, useCapture);
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
	
	var EmulateTouch = {
		_mapping: {touch: 'click', touchstart: 'mousedown', touchmove: 'mousemove', touchend: 'mouseup'},
		bind: function(node, event, callback, useCapture, data) {
			if(this._mapping[event] !== undefined) {
				return $a.bind(node, this._mapping[event], callback, useCapture, data);
			} else {
				return $a.bind(node, event, callback, useCapture, data);
			}
		},
		
		unbind: function(node, event, callback, useCapture) {
			if(this._mapping[event] !== undefined) {
				return $a.unbind(node, this._mapping[event], callback, useCapture, data);
			} else {
				return $a.unbind(node, event, callback, useCapture, data);
			}
		}
	};
	
})(this._anyNoConflict);