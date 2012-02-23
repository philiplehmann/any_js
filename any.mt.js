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
	$mt.registerBindHandler = function(handler, browser, os) {
		if(this.bindHandler[browser] == undefined) this.bindHandler[browser] = {};
		this.bindHandler[browser][os] = handler;
	};
	
	$mt.unregsiterBindHandler = function(browser, os) {
		if(this.bindHandler[browser]) delete this.bindHandler[browser][os];
	}
	
	$mt.bind = function(node, event, callback, useCapture, data) {
		var browser = $a.browserDetection();
		var os = $a.osDetection();
		if( ! $a.isArr(node) && ! $a.isCol(node)) {
			node = [node];
		}
		for(var i=0; i < node.length; i++) {
			if(this.bindHandler[browser] && this.bindHandler[browser][os]) {
				this.bindHandler[browser][os].bind(node[i], event, callback, useCapture, data);
			} else {
				EmulateTouch.bind(node[i], event, callback, useCapture, data);
			}
		}
	};
	
	$mt.unbind = function(node, event, callback, useCapture, data) {
		var browser = $a.browserDetection();
		var os = $a.osDetection();
		if( ! $a.isArr(node) && ! $a.isCol(node)) {
			node = [node];
		}
		for(var i=0; i < node.length; i++) {
			if(this.bindHandler[browser] && this.bindHandler[browser][os]) {
				this.bindHandler[browser][os].unbind(node[i], event, callback, useCapture, data);
			} else {
				EmulateTouch.unbind(node[i], event, callback, useCapture, data);
			}
		}
	};
	
	/**
	 * scroll a node subnode
	 * obj {
	 * 	 node - HTMLElement 
	 *   type - horizontal | vertical - default vertical
	 *   onScrollStart
	 *   onScrollMove, 
	 *   onScrollEnd
	 * }
	 */
	$mt.scroll = function(attrs) {
		if( ! attrs.node instanceof HTMLElement) throw 'no node defined';
		if(attrs.type == undefined) attrs.type = 'vertical';
		
		var node = attrs.node;
		if(node._scroll == undefined) node._scroll = {};
		if(node._scroll[attrs.type] == undefined) node._scroll[attrs.type] = attrs;

		$mt.bind(node, 'touchstart', $mt.scrollStart, true, attrs.type);
		$mt.bind(node, 'touchmove', $mt.scrollMove, true, attrs.type);
		$mt.bind(node, 'touchend', $mt.scrollEnd, true, attrs.type);
		$mt.bind(node, 'touchcancel', $mt.scrollEnd, true, attrs.type);
	};
	
	$mt.unscroll = function(node, type) {
		$mt.unbind(node, 'touchstart', $mt.scrollStart, true, type);
		$mt.unbind(node, 'touchmove', $mt.scrollMove, true, type);
		$mt.unbind(node, 'touchend', $mt.scrollEnd, true, type);
		$mt.unbind(node, 'touchcancel', $mt.scrollEnd, true, type);
	};
	
	$mt.scrollStart = function(event, type) {
		var el = event.currentTarget;
		var scroll = el._scroll[type];
		scroll.positionY = event.pageY;
		scroll.positionX = event.pageX;
		scroll.sid = event.streamId;
		if($a.isFunc(scroll.onScrollStart)) {
			scroll.onScrollStart(event);
		}
	};
	
	$mt.scrollMove = function(event, type) {
		var el = event.currentTarget;
		var scroll = el._scroll[type];
		var node = el.children[0];
		if(scroll.sid != event.streamId) return;
		
		var diff = 0;
		if(type == 'vertical') {
			diff = scroll.positionY - event.pageY;
		} else {
			diff = scroll.positionX - event.pageX;
		}
		if(diff == 0) {
			return;
		}
		
		var margin = type == 'vertical' ? node.style.marginTop : node.style.marginLeft;
		var contentSize = type == 'vertical' ? el.clientHeight : el.clientWidth;
		var scrollSize = type == 'vertical' ? node.clientHeight : node.clientWidth;
		margin = margin == "" ? 0 : parseInt(margin);
		var maxSize = contentSize - scrollSize;
		var position = margin - diff;
		position = position < maxSize ? maxSize : position;
		position = position > 0 ? 0 : position;
		if(type == 'vertical') {
			node.style.marginTop = position + 'px';
		} else {
			node.style.marginLeft = position + 'px';
		}
		scroll.positionY = event.pageY;
		scroll.positionX = event.pageX;
		
		if($a.isFunc(scroll.onScrollMove)) {
			scroll.onScrollMove(event);
		}
	};
	
	$mt.scrollEnd = function(event, type) {
		var el = event.currentTarget;
		var scroll = el._scroll[type];
		delete scroll.positionY;
		delete scroll.positionX;
		if($a.isFunc(scroll.onScrollEnd)) {
			scroll.onScrollEnd(event);
		}
	};
	
	/**
	 * swipe a node
	 * obj {
	 * 	 node - HTMLElement 
	 *   type - horizontal | vertical - default horizontal
	 *   minSpeed - default 1
	 *   startAfter - default 20
	 *   onSwipeStart
	 *   onSwipeMove 
	 *   onSwipeEnd
	 *   callback - called after swipe when conditions match
	 * }
	 */
	$mt.swipe = function(attrs) {
		if( ! attrs.node instanceof HTMLElement) throw 'no node defined';
		if(attrs.startAfter == undefined) attrs.startAfter = 20;
		if(attrs.minSpeed == undefined) attrs.minSpeed = 1;
		if(attrs.type == undefined) attrs.type = 'horizontal';
		
		var el = attrs.node;
		delete attrs.node;
		if(el._swipe == undefined) el._swipe = {};
		if(el._swipe[attrs.type] == undefined) el._swipe[attrs.type] = attrs;

		$mt.bind(el, 'touchstart', $mt.swipeStart, true, attrs.type);
		$mt.bind(el, 'touchmove', $mt.swipeMove, true, attrs.type);
		$mt.bind(el, 'touchend', $mt.swipeEnd, true, attrs.type);
	};
	
	$mt.unswipe = function(node, type) {
		$mt.unbind(node, 'touchstart', $mt.swipeStart, true, type);
		$mt.unbind(node, 'touchmove', $mt.swipeMove, true, type);
		$mt.unbind(node, 'touchend', $mt.swipeEnd, true, type);
	}
	
	$mt.swipeStart = function(event, type) {
		var el = event.currentTarget;
		var swipe = el._swipe[type];
		swipe.tsStart = Date.now();
		swipe.startPoint = event;
		if($a.isFunc(swipe.onSwipeStart)) {
			swipe.onSwipeStart(event);
		}
	};
	
	$mt.swipeMove = function(event, type) {
		var el = event.currentTarget;
		var swipe = el._swipe[type];
		if($a.isFunc(swipe.onSwipeMove)) {
			swipe.onSwipeMove(event);
		}
	};
	
	$mt.swipeEnd = function(event, type) {
		var el = event.currentTarget;
	  
		var swipe = el._swipe[type];
		
		if($a.isFunc(swipe.onSwipeEnd)) {
			swipe.onSwipeEnd(event);
		}
		
		var xdiff = swipe.startPoint.pageX - event.pageX;
		var ydiff = swipe.startPoint.pageY - event.pageY;
		if((Math.abs(ydiff) > Math.abs(xdiff) && type == 'horizontal') || (Math.abs(ydiff) < Math.abs(xdiff) && type == 'vertical')) {
		  swipe.startPoint = null;
			return;
		}
		if(Math.abs(xdiff) > swipe.startAfter || Math.abs(ydiff) > swipe.startAfter) {
			if(type == 'horizontal') {
			  swipe.callback(xdiff > 0 ? 1 : -1);
			} else if(type == 'vertical') {
			  swipe.callback(ydiff > 0 ? 1 : -1);
			}
		}
		swipe.startPoint = null;
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
	
	$mt.elementCounter = 0;
	
	// handlers: touchStartCallbackStart, touchStartCallbackEnd, touchMoveCallbackStart, touchMoveCallbackEnd, touchEndCallbackStart, touchEndCallbackEnd
	// $mt.moveGesture(element, {gestureMoveCallbackEnd: function(event) {alert(event.rotation;)}});
	$mt.registerMove = function(element, handlers, move_object) {
		if(element._move_handlers != undefined) return;
		element._move_handlers = handlers;
		element._move_object = move_object || element;
		$mt.bind(element, 'touchstart', $mt.touchStart);
		$mt.bind(element, 'touchmove', $mt.touchMove);
		$mt.bind(element, 'touchend', $mt.touchEnd);
		$mt.bind(element, 'touchcancel', $mt.touchEnd);
	};
	
	$mt.unregisterMove = function(element) {
		$mt.unbind(element, 'touchstart', $mt.touchStart);
		$mt.unbind(element, 'touchmove', $mt.touchMove);
		$mt.unbind(element, 'touchend', $mt.touchEnd);
		$mt.unbind(element, 'touchcancel', $mt.touchEnd);
		delete element._move_handlers;
		delete element._move_object;
	};
	
	$mt.touchStart = function(event) {
		var el = event.currentTarget;
		if($a.isObj(el._move_handlers) && $a.isFunc(el._move_handlers.touchStartCallbackStart)) {
			el._move_handlers.touchStartCallbackStart(event);
		}
		
		event.preventDefault();
		el.style.zIndex = $mt.elementCounter += 1;
		el.touchX = event.pageX;
	  el.touchY = event.pageY;
		el.touchSID = event.streamId;
		
		if($a.isObj(el._move_handlers) && $a.isFunc(el._move_handlers.touchStartCallbackEnd)) {
			el._move_handlers.touchStartCallbackEnd(event);
		}
	};
	
	$mt.touchMove = function(event) {
		var el = event.currentTarget;
		if($a.isObj(el._move_handlers) && $a.isFunc(el._move_handlers.touchMoveCallbackStart)) {
			el._move_handlers.touchMoveCallbackStart(event);
		}
		
		if(el.gesture || el.touchSID != event.streamId || (isNaN(el.touchX) || isNaN(el.touchY)) || el.touchX == undefined || el.touchY == undefined) {
			return;
		}

		var translate = $a.transform(el._move_object, 'translate');
		var translateX = translate.x + (event.pageX - el.touchX);
		var translateY = translate.y + (event.pageY - el.touchY);
		$a.requestAnimationFrame(function() {
			$a.transform(el._move_object, 'translate', translateX, translateY);
		});
		
		el.touchX = event.pageX;
		el.touchY = event.pageY;
		
		if($a.isObj(el._move_handlers) && $a.isFunc(el._move_handlers.touchMoveCallbackEnd)) {
			el._move_handlers.touchMoveCallbackEnd(event);
		}
	};
	
	$mt.touchEnd = function(event) {
		var el = event.currentTarget;
		if(event.streamId != el.touchSID) return;
		
		if($a.isObj(el._move_handlers) && $a.isFunc(el._move_handlers.touchEndCallbackStart)) {
			el._move_handlers.touchEndCallbackStart(event);
		}
		
		delete el.touchX;
		delete el.touchY;
		delete el.touchSID;
		
		if($a.isObj(el._move_handlers) && $a.isFunc(el._move_handlers.touchEndCallbackEnd)) {
			el._move_handlers.touchEndCallbackEnd(event);
		}
	};
	
	// handlers: gestureStartCallbackStart, gestureStartCallbackEnd, gestureMoveCallbackStart, gestureMoveCallbackEnd, gestureEndCallbackStart, gestureEndCallbackEnd
	// $mt.registerGesture(element, {gestureMoveCallbackEnd: function(event) {alert(event.rotation;)}});
	$mt.registerGesture = function(element, handlers) {
		if(element._move_handlers != undefined) return;
		element._move_handlers = handlers;
		$mt.bind(element, 'gesturestart', $mt.gestureStart);
		$mt.bind(element, 'gesturechange', $mt.gestureChange);
		$mt.bind(element, 'gestureend', $mt.gesturteEnd);
	};
	
	$mt.unregisterGesture = function(element, rotate, scale, handlers) {
		if(handlers == undefined) handlers = {};
		handlers.rotate = rotate || false;
		handlers.scale = scale || false;
	};
	
	$mt.gestureStart = function(event, data) {
		var el = event.currentTarget;
		if($a.isObj(el._gesture_handlers) && $a.isFunc(el._gesture_handlers.gestureStartCallbackStart)) {
			el._gesture_handlers.gestureStartCallbackStart(event);
		}
		
		el.scale = $a.transform(el, 'scale').x || 1;
		el.rotation = $a.transform(el, 'rotate').x || 0;
		el.gesture = true;
		
		if($a.isObj(el._gesture_handlers) && $a.isFunc(el._gesture_handlers.gestureStartCallbackEnd)) {
			data.gestureStartCallbackEnd(event);
		}
	};
	
	$mt.gestureChange = function(event) {
		var el = event.currentTarget;
		if($a.isObj(el._gesture_handlers) && $a.isFunc(el._gesture_handlers.gestureStartCallbackStart)) {
			el._gesture_handlers.gestureStartCallbackStart(event);
		}
		
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
		
		if($a.isObj(el._gesture_handlers) && $a.isFunc(el._gesture_handlers.gestureStartCallbackEnd)) {
			el._gesture_handlers.gestureStartCallbackEnd(event, rot, scaleRes);
		}
		el.running = false;
	};
	
	$mt.gestureEnd = function(event, data) {
		var el = event.currentTarget;
		if($a.isObj(el._gesture_handlers) && $a.isFunc(el._gesture_handlers.gestureEndCallbackStart)) {
			el._gesture_handlers.gestureEndCallbackStart(event);
		}
		
		el.scale = undefined;
		el.rotation = undefined;
		delete el.gesture;
		
		if($a.isObj(el._gesture_handlers) && $a.isFunc(el._gesture_handlers.gestureEndCallbackEnd)) {
			el._gesture_handlers.gestureEndCallbackEnd(event);
		}
	};
	
	$mt.escapeElement = function(element) {
	  var func = function(evt){evt.preventDefault();return false;};
		element.onclick = func;
		element.onmousedown = func;
		element.onmousemove = func;
		element.onmouseup = func;
		element.onmouseover = func;
		element.onmouseout = func;
		element.onmouseenter = func;
		element.onmouseleave = func;
	};
	
	var EmulateTouch = {
		_mapping: {touch: 'click', touchstart: 'mousedown', touchmove: 'mousemove', touchend: 'mouseup', doubletouch: 'dblclick'},
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