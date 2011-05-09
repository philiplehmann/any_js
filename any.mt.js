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
		
		if(attrs.node._scroll == undefined) attrs.node._scroll = {};
		if(attrs.node._scroll[attrs.type] == undefined) attrs.node._scroll[attrs.type] = {};
		attrs.node._scroll[attrs.type].attrs = attrs;

		$mt.bind(attrs.node, 'touchstart', $mt.scrollStart, false, {type: attrs.type, func: 'start'});
		$mt.bind(attrs.node, 'touchmove', $mt.scrollMove, false, {type: attrs.type, func: 'move'});
		$mt.bind(attrs.node, 'touchend', $mt.scrollEnd, false, {type: attrs.type, func: 'end'});
	};
	
	$mt.unscroll = function(node, type) {
		var node = attrs.node;
		$mt.unbind(node, 'touchstart', $mt.scrollStart, false, {type: type, func: 'start'});
		$mt.unbind(node, 'touchmove', $mt.scrollMove, false, {type: type, func: 'move'});
		$mt.unbind(node, 'touchend', $mt.scrollEnd, false, {type: type, func: 'end'});
	};
	
	$mt.scrollStart = function(event, data) {
		var el = event.currentTarget;
		if(el._scroll == undefined) el._scroll = {};
		if(el._scroll[data.type] == undefined) el._scroll[data.type] = {};
		var scroll = el._scroll[data.type];
		scroll.positionY = event.pageY;
		scroll.positionX = event.pageX;
		scroll.sid = event.streamId;
		if($a.isFunc(scroll.attrs.onScrollStart)) {
			scroll.attrs.onScrollStart(event);
		}
	};
	
	$mt.scrollMove = function(event, data) {
		var el = event.currentTarget;
		if(el._scroll == undefined) el._scroll = {};
		if(el._scroll[data.type] == undefined) el._scroll[data.type] = {};
		var scroll = el._scroll[data.type];
		var scrollNode = scroll.attrs.node;
		var node = scrollNode.children[0];
		if(scroll.sid != event.streamId) return;
		
		/*if(Math.abs(scroll.positionY - event.pageY) < Math.abs(scroll.positionX - event.pageX)) {
			return;
		}*/
		
		var diff = 0;
		if(data.type == 'vertical') {
			diff = scroll.positionY - event.pageY;
		} else {
			diff = scroll.positionX - event.pageX;
		}
		if(diff == 0) {
			return;
		}
		
		var margin = data.type == 'vertical' ? node.style.marginTop : node.style.marginLeft;
		var contentSize = data.type == 'vertical' ? scrollNode.clientHeight : scrollNode.clientWidth;
		var scrollSize = data.type == 'vertical' ? node.clientHeight : node.clientWidth;
		margin = margin == "" ? 0 : parseInt(margin);
		var maxSize = contentSize - scrollSize;
		var position = margin - diff;
		
		position = position < maxSize ? maxSize : position;
		position = position > 0 ? 0 : position;
		
		if(data.type == 'vertical') {
			node.style.marginTop = position + 'px';
		} else {
			node.style.marginLeft = position + 'px';
		}
		scroll.positionY = event.pageY;
		scroll.positionX = event.pageX;
		
		if($a.isFunc(scroll.attrs.onScrollMove)) {
			scroll.attrs.onScrollMove(event);
		}
	};
	
	$mt.scrollEnd = function(event, data) {
		var el = event.currentTarget;
		if(el._scroll == undefined) el._scroll = {};
		if(el._scroll[data.type] == undefined) el._scroll[data.type] = {};
		var scroll = el._scroll[data.type];
		if($a.isFunc(scroll.attrs.onScrollEnd)) {
			scroll.attrs.onScrollEnd(event);
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
	 *   onSwipeMove, 
	 *   onSwipeEnd
	 * }
	 */
	$mt.swipe = function(attrs) {
		if( ! attrs.node instanceof HTMLElement) throw 'no node defined';
		if(attrs.startAfter == undefined) attrs.startAfter = 20;
		if(attrs.minSpeed == undefined) attrs.minSpeed = 1;
		if(attrs.type == undefined) attrs.type = 'horizontal';
		
		if(attrs.node._swipe == undefined) attrs.node._swipe = {};
		if(attrs.node._swipe[attrs.type] == undefined) attrs.node._swipe[attrs.type] = {};
		attrs.node._swipe[attrs.type].attrs = attrs;

		var type = {type: attrs.type};

		$mt.bind(attrs.node, 'touchstart', $mt.swipeStart, false, type);
		$mt.bind(attrs.node, 'touchmove', $mt.swipeMove, false, type);
		$mt.bind(attrs.node, 'touchend', $mt.swipeEnd, false, type);
	};
	
	$mt.unswipe = function(node, type) {
		$mt.unbind(node, 'touchstart', $mt.swipeStart, false, {type: type, func: 'start'});
		$mt.unbind(node, 'touchmove', $mt.swipeMove, false, {type: type, func: 'move'});
		$mt.unbind(node, 'touchend', $mt.swipeEnd, false, {type: type, func: 'end'});
	}
	
	$mt.swipeStart = function(event, data) {
		var el = event.currentTarget;
		if(el._swipe == undefined) el._swipe = {};
		if(el._swipe[data.type] == undefined) el._swipe[data.type] = {};
		var swipe = el._swipe[data.type];
		swipe.tsStart = Date.now();
		if($a.isFunc(swipe.attrs.onSwipeStart)) {
			swipe.attrs.onSwipeStart(event);
		}
	};
	
	$mt.swipeMove = function(event, data) {
		var el = event.currentTarget;
		if(el._swipe == undefined) el._swipe = {};
		if(el._swipe[data.type] == undefined) el._swipe[data.type] = {};
		var swipe = el._swipe[data.type];
		if($a.isFunc(swipe.attrs.onSwipeMove)) {
			swipe.attrs.onSwipeMove(event);
		}
	};
	
	$mt.swipeEnd = function(event, data) {
		var el = event.currentTarget;
		if(el._swipe == undefined) el._swipe = {};
		if(el._swipe[data.type] == undefined) el._swipe[data.type] = {};
		var swipe = el._swipe[data.type];
		if($a.isFunc(swipe.attrs.onSwipeEnd)) {
			swipe.attrs.onSwipeEnd(event);
		}
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
	$mt.registerMove = function(element, handlers) {
		if(element._move_handlers != undefined) return;
		element._move_handlers = handlers;
		$mt.bind(element, 'touchstart', $mt.touchStart);
		$mt.bind(element, 'touchmove', $mt.touchMove);
		$mt.bind(element, 'touchend', $mt.touchEnd);
	};
	
	$mt.unregisterMove = function(element) {
		$mt.unbind(element, 'touchstart', $mt.touchStart);
		$mt.unbind(element, 'touchmove', $mt.touchMove);
		$mt.unbind(element, 'touchend', $mt.touchEnd);
		delete element._move_handlers;
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

		var translate = $a.transform(el, 'translate');
		var translateX = translate.x + (event.pageX - el.touchX);
		var translateY = translate.y + (event.pageY - el.touchY);
		$a.requestAnimationFrame(function() {
			$a.transform(el, 'translate', translateX, translateY);
		});
		
		el.touchX = event.pageX;
		el.touchY = event.pageY;
		
		if($a.isObj(el._move_handlers) && $a.isFunc(el._move_handlers.touchMoveCallbackEnd)) {
			el._move_handlers.touchMoveCallbackEnd(event);
		}
	};
	
	$mt.touchEnd = function(event) {
		var el = event.currentTarget;
		if($a.isObj(el._move_handlers) && $a.isFunc(el._move_handlers.touchEndCallbackStart)) {
			el._move_handlers.touchEndCallbackStart(event);
		}
		
		if(event.streamId != el.touchSID) return;
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
		element.onclick = function(event){return false;};
		element.onmousedown = function(event){return false;};
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