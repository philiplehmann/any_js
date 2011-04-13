//     any.mt.js @VERSION@
//     (c) 2011 Philip Lehmann, Lukas Westermann, at-point ag
//     any.js is freely distributable under the MIT license.
//     Portions of any.js are inspired or borrowed from Underscore.js,
//     Prototype and jQuery.
//     For all details and documentation:
//     TODO: gh-pages

// touchevent documentation from apple
// http://developer.apple.com/library/safari/#documentation/UserExperience/Reference/TouchEventClassReference/TouchEvent/TouchEvent.html#//apple_ref/javascript/cl/TouchEvent

// Touch documentation from apple
// http://developer.apple.com/library/safari/#documentation/UserExperience/Reference/TouchClassReference/Touch/Touch.html#//apple_ref/javascript/cl/Touch

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
	 *   length
	 *   startAfter - default 20px
	 *   onSwipeStart
	 *   onSwipeMove, 
	 *   onSwipeEnd
	 * }
	 */
	$mt.swipe = function(obj) {
		if(obj.node == undefined) throw 'no node defined';
		if(obj.length == undefined) throw 'no length defined';
		if(obj.type == undefined) obj.type = 'horizontal';
		if(obj.speed == undefined) obj.speed = 20;
		
		$mt.bind(obj.node, 'touchstart', $mt.swipeStart);
		$mt.bind(obj.node, 'touchmove', $mt.swipeMove);
		$mt.bind(ojb.node, 'touchend', $mt.swipeEnd);
	};
	
	$mt.unswipe = function(node, type) {
		$mt.unbind(obj.node, 'touchstart', $mt.swipeStart);
		$mt.unbind(obj.node, 'touchmove', $mt.swipeMove);
		$mt.unbind(obj.node, 'touchend', $mt.swipeEnd);
	}
	
	$mt.swipeStart = function(event, data) {
		var el = event.currentTarget;
		if(el._swipe == undefined) el._swipe = {};
		var swipe = el._swipe;
		swipe.tsStart = Date.now();
	};
	
	$mt.swipeMove = function(event, data) {
		
	};
	
	$mt.swipeEnd = function(event, data) {
		
	};
	
	$mt.draw = {};
	$mt.draw.items = [];
	$mt.draw.called = false;
	$mt.draw.set = function(element) {
		if($mt.draw.items.indexOf(element) === -1) {
			$mt.draw.items.push(element);
		}
		$mt.draw.called = true;
		$a.requestAnimationFrame($mt.draw.run);
	};
	
	$mt.draw.run = function(ts) {
		$mt.draw.items.forEach(function(element, i) {
			var style = $a.transform(element);
			element.style.mozTransform = style;
			element.style.webkitTransform = style;
			element.style.oTransform = style;
			element.style.transform = style;
		});
		$mt.draw.called = false;
	};
	
	// handlers: touchStartCallbackStart, touchStartCallbackEnd, touchMoveCallbackStart, touchMoveCallbackEnd, touchEndCallbackStart, touchEndCallbackEnd
	// $mt.moveGesture(element, {gestureMoveCallbackEnd: function(event) {alert(event.rotation;)}});
	$mt.registerMove = function(element, handlers) {
		if(element._move_handlers != undefined) return;
		element._move_handlers = handlers;
		$mt.bind(element, 'touchstart', $mt.touchStart, false, handlers);
		$mt.bind(element, 'touchmove', $mt.touchStart, false, handlers);
		$mt.bind(element, 'touchend', $mt.touchStart, false, handlers);
	};
	
	$mt.unregisterMove = function(element) {
		$mt.unbind(element, 'touchstart', $mt.touchStart, false, element._move_handlers);
		$mt.unbind(element, 'touchmove', $mt.touchStart, false, element._move_handlers);
		$mt.unbind(element, 'touchend', $mt.touchStart, false, element._move_handlers);
		delete element._move_handlers;
	};
	
	$mt.touchStart = function(event, data) {
		if($a.isFunc(data.touchStartCallbackStart)) {
			data.touchStartCallbackStart(event);
		}
		
		event.preventDefault();
		var el = event.currentTarget;
		el.style.zIndex = ProjectCount += 1;
		el.touchX = event.pageX;
	  el.touchY = event.pageY;
		el.touchSID = event.streamId;
		
		if($a.isFunc(data.touchStartCallbackEnd)) {
			data.touchStartCallbackEnd(event);
		}
	};
	
	$mt.touchMove = function(event, data) {
		if($a.isFunc(data.touchMoveCallbackStart)) {
			data.touchMoveCallbackStart(event);
		}
		
		var el = event.currentTarget;
		if(el.gesture || el.touchSID != event.streamId || (isNaN(el.touchX) || isNaN(el.touchY)) || el.touchX == undefined || el.touchY == undefined) {
			return;
		}

		var translate = $a.transform(el, 'translate');
		var translateX = translate.x + (event.pageX - el.touchX);
		var translateY = translate.y + (event.pageY - el.touchY);
		$a.requestAnimationFrame(function() {
			$a.transform(el, 'translate', translateX, translateY);
		});
		
		el.touchX = event.pageX;
		el.touchY = event.pageY;
		
		if($a.isFunc(data.touchMoveCallbackEnd)) {
			data.touchMoveCallbackEnd(event);
		}
	};
	
	$mt.touchEnd = function(event, data) {
		if($a.isFunc(data.touchEndCallbackStart)) {
			data.touchEndCallbackStart(event);
		}
		
		var el = event.currentTarget;
		if(event.streamId != el.touchSID) return;
		delete el.touchX;
		delete el.touchY;
		delete el.touchSID;
		
		if($a.isFunc(data.touchEndCallbackEnd)) {
			data.touchEndCallbackEnd(event);
		}
	};
	
	// handlers: gestureStartCallbackStart, gestureStartCallbackEnd, gestureMoveCallbackStart, gestureMoveCallbackEnd, gestureEndCallbackStart, gestureEndCallbackEnd
	// $mt.registerGesture(element, {gestureMoveCallbackEnd: function(event) {alert(event.rotation;)}});
	$mt.registerGesture = function(element, handlers) {
		
	};
	
	$mt.unregisterGesture = function(element, rotate, scale, handlers) {
		if(handlers == undefined) handlers = {};
		handlers.rotate = rotate || false;
		handlers.scale = scale || false;
	};
	
	$mt.gestureStart = function(event, data) {
		if($a.isFunc(data.gestureStartCallbackStart)) {
			data.gestureStartCallbackStart(event);
		}
		
		var el = event.currentTarget;
		el.scale = $a.transform(el, 'scale').x || 1;
		el.rotation = $a.transform(el, 'rotate').x || 0;
		el.gesture = true;
		
		if($a.isFunc(data.gestureStartCallbackEnd)) {
			data.gestureStartCallbackEnd(event);
		}
	};
	
	$mt.gestureMove = function(event, data) {
		if($a.isFunc(data.gestureStartCallbackStart)) {
			data.gestureStartCallbackStart(event);
		}
		
		var el = event.currentTarget;
		if(el.running === true) return;
		el.running = true;

		var change = false;
		var rot = 0;
		if(data.rotate && el.rotation !== undefined) {
			rot = (el.rotation + event.rotation) % 360;
			change = true;
			$a.transform(el, 'rotate', rot, undefined, undefined, true);
		}
		var scaleRes = 0;
		if(data.scale && el.scale !== undefined) {
			scaleRes = el.scale * event.scale;
			change = true;
			$a.transform(el, 'scale', scaleRes, undefined, undefined, true);
		}
		
		if(change) {
			$mt.draw.set(el);
		}
		
		if($a.isFunc(data.gestureStartCallbackEnd)) {
			data.gestureStartCallbackEnd(event, rot, scaleRes);
		}
		el.running = false;
	};
	
	$mt.gestureEnd = function(event, data) {
		if($a.isFunc(data.gestureEndCallbackStart)) {
			data.gestureEndCallbackStart(event);
		}
		
		var el = event.currentTarget;
		el.scale = undefined;
		el.rotation = undefined;
		delete el.gesture;
		
		if($a.isFunc(data.gestureEndCallbackEnd)) {
			data.gestureEndCallbackEnd(event);
		}
	};
	
	$mt.escapeElement = function(element) {
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