//     any.core.js @VERSION@
//     (c) 2011 Philip Lehmann, Lukas Westermann, at-point ag
//     any.js is freely distributable under the MIT license.
//     Portions of any.js are inspired or borrowed from Underscore.js,
//     Prototype and jQuery.
//     For all details and documentation:
//     TODO: gh-pages


(function($mt) {
	var root = this;
	
	var MOZTouch = {};
	
	$mt.registerBindHandler(MOZTouch, $a.FIREFOX);
	
	MOZTouch._data = {};
	MOZTouch._sids = {};
	MOZTouch._streamIds = [];
	MOZTouch.touchEvents = {
			touchstart: 'MozTouchDown', 
			touchmove: 'MozTouchMove', 
			touchend: 'MozTouchUp', 
			gesturestart: 'MozTouchDown', 
			gesturechange: 'MozTouchMove', 
			gestureend:'MozTouchUp', 
			touch_hidden_start: 'MozTouchDown', 
			touch_hidden_move: 'MozTouchMove',
			touch_hidden_end: 'MozTouchUp'
	};
	
	MOZTouch.bind = function(node, event, callback, useCapture, data) {
		event = event.toLowerCase();
		switch(event) {
			case 'touch':
				$a.bind(node, 'moztouchdown', function(ev) {return this.touch_start(ev, callback, data)}, useCapture);
				$a.bind(node, 'moztouchmove', function(ev) {return this.touch_move(ev, callback, data)}, useCapture);
				$a.bind(node, 'moztouchup', function(ev) {return this.touch_end(ev, callback, data)}, useCapture);
			break;
			case 'touchstart':
				$a.bind(node, 'moztouchdown', function(ev) {return this.touchDown(ev, callback, data)}, useCapture);
			break;
			case 'touchmove':
				$a.bind(node, 'moztouchmove', function(ev) { return this.touchMove(ev, callback, data)}, useCapture);
			break;
			case 'touchend':
				$a.bind(node, 'moztouchup', function(ev) {return this.touchUp(ev, callback, data)}, useCapture);
			break;
			case 'touchcancel':
				$a.bind(node, 'moztouchcancel', function(ev) {return this.touchCancel(ev, callback, data)}, useCapture);
			break;
			case 'gesturestart':
				MOZTouch.bind(node, 'touchstart', function(ev) {return this.gestureStart(ev, callback, data)}, useCapture);
			break;
			case 'gesturechange':
				MOZTouch.bind(node, 'touchmove', function(ev) {return this.gestureChange(ev, callback, data)}, useCapture);
			break;
			case 'gestureend':
				MOZTouch.bind(node, 'touchend', function(ev) {return this.gestureEnd(ev, callback, data)}, useCapture);
				MOZTouch.bind(node, 'touchcancel', function(ev) {return this.gestureEnd(ev, callback, data)}, useCapture);
			break;
			default:
				$a.bind(node, event, callback, useCapture, data);
			break;
		}
	};
	
	MOZTouch.unbind = function(node, event, callback, useCapture) {
		event = event.toLowerCase();
		switch(event) {
			case 'touch':
				$a.unbind(node, 'moztouchdown', function(ev) {return this.touch_start(ev, callback, data)}, useCapture);
				$a.unbind(node, 'moztouchmove', function(ev) {return this.touch_move(ev, callback, data)}, useCapture);
				$a.unbind(node, 'moztouchup', function(ev) {return this.touch_end(ev, callback, data)}, useCapture);
			break;
			case 'touchstart':
				console.debug('use mt moz');
				$a.unbind(node, 'moztouchdown', function(ev) {return this.touchDown(ev, callback, data)}, useCapture);
			break;
			case 'touchmove':
				$a.unbind(node, 'moztouchmove', function(ev) { return this.touchMove(ev, callback, data)}, useCapture);
			break;
			case 'touchend':
				$a.unbind(node, 'moztouchup', function(ev) {return this.touchUp(ev, callback, data)}, useCapture);
			break;
			case 'touchcancel':
				$a.unbind(node, 'moztouchcancel', function(ev) {return this.touchCancel(ev, callback, data)}, useCapture);
			break;
			case 'gesturestart':
				MOZTouch.unbind(node, 'touchstart', function(ev) {return this.gestureStart(ev, callback, data)}, useCapture);
			break;
			case 'gesturechange':
				MOZTouch.unbind(node, 'touchmove', function(ev) {return this.gestureChange(ev, callback, data)}, useCapture);
			break;
			case 'gestureend':
				MOZTouch.unbind(node, 'touchend', function(ev) {return this.gestureEnd(ev, callback, data)}, useCapture);
				MOZTouch.unbind(node, 'touchcancel', function(ev) {return this.gestureEnd(ev, callback, data)}, useCapture);
			break;
			default:
				$a.unbind(node, event, callback, useCapture, data);
			break;
		}
	};
	
	MOZTouch.touch_start = function(event, callback, data) {
		
	};
	
	MOZTouch.touch_move = function(event, callback, data) {
		
	};
	
	MOZTouch.touch_end = function(event, callback, data) {
		
	};
	
	MOZTouch.touchDown = function(event, callback, data) {
		console.debug('test');
		var mt = MOZTouch.getObjectByNamespace(event.currentTarget, 'touch');
		mt.event = event;
		mt.timer = window.setTimeout(MOZTouch.touchTimerCancel, mt);
		callback(event, data);
	};
	
	MOZTouch.touchMove = function(event, callback, data) {
		var mt = MOZTouch.getObjectByNamespace(event.currentTarget, 'touch');
		mt.event = event;
		if(mt.timer) {
			window.clearTimer(mt.timer);
			mt.timer = window.setTimeout(MOZTouch.touchTimerCancel, mt);
		}
		
		return callback(event, data);
	};
	
	MOZTouch.touchUp = function(event, callback, data) {
		var mt = MOZTouch.getObjectByNamespace(event.currentTarget, 'touch');
		if(mt.timer) {
			window.clearTimer(mt.timer);
		}
		mt = {};
		
		callback(event, data);
	};
	
	MOZTouch.touchCancel = function(event, callback, data) {
		var mt = MOZTouch.getObjectByNamespace(event.currentTarget, 'touch');
		if(mt.timer) {
			window.clearTimer(mt.timer);
		}
		mt = {};
		
		return callback(event, data);
	};
	
	MOZTouch.touchTimerCancel = function(mt) {
		var evt = document.createEvent("TouchEvents");
		evt.initMouseEvent("moztouchcancel", true, true, window, 0, mt.event.clientX, mt.event.clientY, mt.event.pageX, mt.event.pageY, false, false, false, false, 0, null);
		evt.currentTarget = mt.event.currentTarget;
		mt.event.target.dispatchEvent(evt);
	}
	
	MOZTouch.sidCleanup = function(ns, sid) {
		
	};
	
	MOZTouch.gestureStart = function(event, callback, data) {
		var mt = MOZTouch.getObjectByNamespace(event.currentTarget, 'gesture');
		
		MOZTouch.sidCleanup(mt, event.streamId);
  	MOZTouch._sids[event.streamId] = el;
  	
  	if(mt.paths == undefined) {
			mt.paths = {};
		}
  	mt.paths[event.streamId] = [];
  	mt.paths[event.streamId].push([event.pageX, event.pageY]);
  	
  	var sids = [];
  	for (var sid in mt.paths) {
  		sids.push(sid);
  	}
  	
  	if (sids.length > 1) {
  		var calc = MOZTouch._calculate_for_event(mt.paths[sids[0]], mt.paths[sids[1]], mt);
			if(calc.scale != mt.scale || calc.rotation != mt.rotation) {
				mt.scale = event.scale = calc.scale;
	  		mt.rotation = event.rotation = calc.rotation;
				return callback(event, data);
			}
  	}
	};
	
	MOZTouch.gestureChange = function(event, callback, data) {
		var mt = MOZTouch.getObjectByNamespace(event.currentTarget, 'gesture');
		
  	if( ! MOZTouch._sids[event.streamId]) MOZTouch._sids[event.streamId] = el;
  	
  	if(mt.paths == undefined) {
			mt.paths = {};
		}
  	if(mt.paths[event.streamId] == undefined) mt.paths[event.streamId] = [];
  	mt.paths[event.streamId].push([event.pageX, event.pageY]);
  	
  	var sids = [];
  	for (var sid in mt.paths) {
  		sids.push(sid);
  	}
  	
  	if (sids.length > 1) {
  		var calc = MOZTouch._calculate_for_event(mt.paths[sids[0]], mt.paths[sids[1]], mt);
			if(calc.scale != mt.scale || calc.rotation != mt.rotation) {
				mt.scale = event.scale = calc.scale;
	  		mt.rotation = event.rotation = calc.rotation;
				return callback(event, data);
			}
  	}
	};
	
	MOZTouch.gestureEnd = function(event, callback, data) {
		var mt = MOZTouch.getObjectByNamespace(event.currentTarget, 'gesture');
		
  	if( ! MOZTouch._sids[event.streamId]) MOZTouch._sids[event.streamId] = el;
  	
  	if(mt.paths == undefined) {
			mt.paths = {};
		}
  	mt.paths[event.streamId] = [];
  	mt.paths[event.streamId].push([event.pageX, event.pageY]);
  	
  	var sids = [];
  	for (var sid in mt.paths) {
  		sids.push(sid);
  	}
  	
  	if (sids.length > 1) {
  		var calc = MOZTouch._calculate_for_event(mt.paths[sids[0]], mt.paths[sids[1]], mt);
			if(calc.scale != mt.scale || calc.rotation != mt.rotation) {
				mt.scale = event.scale = calc.scale;
	  		mt.rotation = event.rotation = calc.rotation;
				return callback(event, data);
			}
  	}
		MOZTouch.sidCleanup(mt, event.streamId);
		mt = null;
	};
	
	MOZTouch.getObjectByNamespace = function(htmlNode, namespace) {
		if( ! htmlNode.mozTouch ) htmlNode.mozTouch = {};
		if( ! htmlNode.mozTouch[namespace] ) htmlNode.mozTouch[namespace] = {};
		
		return htmlNode.mozTouch[namespace];
	};
	
	/**
	 * helper function for _calculate_rotation_for_event
	 * 
	 * @param {Integer} x1
	 * @param {Integer} y1
	 */
	MOZTouch._q = function(x1, y1) {
	  if (x1 < 0 && y1 > 0) { return 1; } else if (x1 < 0 && y1 < 0) { return 2; } else if (x1 > 0 && y1 < 0) { return 3; }
	  return 0;
	};

	/**
	 * calculate rotation in degrees since event start 0 - 360
	 * 
	 * @param {Object} event
	 * @return {Integer}
	 */
	MOZTouch._calculate_for_event = function(path1, path2, mt) {
		// A(x1|y1) und B(x2|y2) = Touch start
		var x1 = path1[0][0];
		var y1 = path1[0][1];
		var x2 = path2[0][0];
		var y2 = path2[0][1];
		var AB_x = x2 - x1;
		var AB_y = y2 - y1;
		if(mt.rotationCalc == undefined) {
			// Vektor AB
			var sqrt = Math.sqrt(AB_x * AB_x + AB_y * AB_y)
			mt.rotationCalc = {
					sqrt: sqrt,
					arc_eh: Math.acos(AB_y / sqrt)
			};

			return {'rotation': 0, 'scale': 1};
		}

		var x3 = path1[path1.length - 1][0];
		var y3 = path1[path1.length - 1][1];
		var x4 = path2[path2.length - 1][0];
		var y4 = path2[path2.length - 1][1];

		// C(x3|y3) und D(x4|y3) = Current touch point
		// Vektor CD
		var CD_x = x4 - x3;
		var CD_y = y4 - y3;
		var sqrt = Math.sqrt(CD_x * CD_x + CD_y * CD_y);
		var ort = (AB_x * CD_x + AB_y * CD_y) / (mt.rotationCalc.sqrt * sqrt);
		//console.log('ort:' + ort + ' x1: ' + x1 + ' y1: ' + y1 + ' x2: ' + x2 + ' y2: ' + y2 + ' x3: ' + x3 + ' y3: ' + y3 + ' x4: ' + x4 + ' y4: ' + y4);

		var deg = Math.acos(ort) / 0.017453292519943295; //Math.PI * 180.0;

		// Adjust degrees for quadrant, to get absolute rotation, better solution anyone!?
		// Is it correct!?

		// Get quadrant for point, 0 based!
		var arc_eh_y = mt.rotationCalc.arc_eh;
		var x_rot = 0;
		if(AB_x >= 0) {
			x_rot = CD_x * Math.cos(arc_eh_y) - CD_y * Math.sin(arc_eh_y);
		} else {
		  x_rot = CD_x * Math.cos(arc_eh_y) + CD_y * Math.sin(arc_eh_y);
		}

		if(x_rot > 0) { deg = deg * -1; }

		//console.log("AB = (%d|%d), b = %d; CD = (%d|%d), b = %d", AB_x, AB_y, mt.rotationCalc.sqrt, CD_x, CD_y, sqrt);
		scale = (sqrt / mt.rotationCalc.sqrt);
		if(isNaN(deg)) deg = 0;
		if(isNaN(scale)) scale = 0;

		//scale /= 2;

		return {'rotation': deg, 'scale': scale};
	};
})(this.$mt);