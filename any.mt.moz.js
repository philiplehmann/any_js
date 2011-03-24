//     any.core.js @VERSION@
//     (c) 2011 Philip Lehmann, Lukas Westermann, at-point ag
//     any.js is freely distributable under the MIT license.
//     Portions of any.js are inspired or borrowed from Underscore.js,
//     Prototype and jQuery.
//     For all details and documentation:
//     TODO: gh-pages


(function($a, $mt) {
	
	var MOZTouch = {};
	$a.ready(function() {
		$mt.registerBindHandler(MOZTouch, $a.FIREFOX);
	});
	
	MOZTouch._data = {};
	MOZTouch._sids = {};
	MOZTouch._streamIds = [];
	
	MOZTouch.bind = function(node, event, callback, useCapture, data) {
		data = $a.extend(data, {mozCallback: callback});
		event = event.toLowerCase();
		switch(event) {
			case 'touch':
				$a.bind(node, 'MozTouchDown', MOZTouch.touch_start, useCapture);
				$a.bind(node, 'MozTouchMove', MOZTouch.touch_move, useCapture);
				$a.bind(node, 'MozTouchUp', MOZTouch.touch_end, useCapture, data);
			break;
			case 'touchstart':
				$a.bind(node, 'MozTouchDown', MOZTouch.touchDown, useCapture, data);
			break;
			case 'touchmove':
				$a.bind(node, 'MozTouchMove', MOZTouch.touchMove, useCapture, data);
			break;
			case 'touchend':
				$a.bind(node, 'MozTouchUp', MOZTouch.touchUp, useCapture, data);
			break;
			case 'touchcancel':
				$a.bind(node, 'MozTouchCancel', MOZTouch.touchCancel, useCapture, data);
			break;
			case 'gesturestart':
				MOZTouch.bind(node, 'touchstart', MOZTouch.gestureStart, useCapture, data);
			break;
			case 'gesturechange':
				MOZTouch.bind(node, 'touchmove', MOZTouch.gestureChange, useCapture, data);
			break;
			case 'gestureend':
				MOZTouch.bind(node, 'touchend', MOZTouch.gestureEnd, useCapture, data);
				MOZTouch.bind(node, 'touchcancel', MOZTouch.gestureEnd, useCapture, data);
			break;
			default:
				$a.bind(node, event, callback, useCapture, data);
			break;
		}
	};
	
	MOZTouch.unbind = function(node, event, callback, useCapture, data) {
		data = $a.extend(data, {mozCallback: callback});
		event = event.toLowerCase();
		switch(event) {
			case 'touch':
				$a.unbind(node, 'MozTouchDown', MOZTouch.touch_start, useCapture);
				$a.unbind(node, 'MozTouchMove', MOZTouch.touch_move, useCapture);
				$a.unbind(node, 'MozTouchUp', MOZTouch.touch_end, useCapture, data);
			break;
			case 'touchstart':
				$a.unbind(node, 'MozTouchDown', MOZTouch.touchDown, useCapture, data);
			break;
			case 'touchmove':
				$a.unbind(node, 'MozTouchMove', MOZTouch.touchMove, useCapture, data);
			break;
			case 'touchend':
				$a.unbind(node, 'MozTouchUp', MOZTouch.touchUp, useCapture, data);
			break;
			case 'touchcancel':
				$a.unbind(node, 'MozTouchCancel', MOZTouch.touchCancel, useCapture, data);
			break;
			case 'gesturestart':
				MOZTouch.unbind(node, 'touchstart', MOZTouch.gestureStart, useCapture, data);
			break;
			case 'gesturechange':
				MOZTouch.unbind(node, 'touchmove', MOZTouch.gestureChange, useCapture, data);
			break;
			case 'gestureend':
				MOZTouch.unbind(node, 'touchend', MOZTouch.gestureEnd, useCapture, data);
				MOZTouch.unbind(node, 'touchcancel', MOZTouch.gestureEnd, useCapture, data);
			break;
			default:
				$a.unbind(node, event, callback, useCapture, data);
			break;
		}
	};
	
	MOZTouch.touch_start = function(event) {
		var mt = MOZTouch.getObjectByNamespace(event.currentTarget, 'click');
		mt.count = 0;
		mt.event = event;
	};
	
	MOZTouch.touch_move = function(event) {
		var mt = MOZTouch.getObjectByNamespace(event.currentTarget, 'click');
		mt.count++;
	};
	
	MOZTouch.touch_end = function(event, data) {
		var mt = MOZTouch.getObjectByNamespace(event.currentTarget, 'click');
		if(mt.count < 50 && Math.abs(mt.event.pageX - event.pageX) < 20 && Math.abs(mt.event.pageY - event.pageY) < 20) {
			return data.mozCallback(event, data);
		}
	};
	
	MOZTouch.touchDown = function(event, data) {
		var mt = MOZTouch.getObjectByNamespace(event.currentTarget, 'touch');
		mt.event = event;
		mt.timer = window.setTimeout(MOZTouch.touchTimerCancel, 1000, mt);
		return data.mozCallback(event, data);
	};
	
	MOZTouch.touchMove = function(event, data) {
		var mt = MOZTouch.getObjectByNamespace(event.currentTarget, 'touch');
		mt.event = event;
		if(mt.timer) {
			window.clearTimeout(mt.timer);
			mt.timer = window.setTimeout(MOZTouch.touchTimerCancel, 1000, mt);
		}
		
		return data.mozCallback(event, data);
	};
	
	MOZTouch.touchUp = function(event, data) {
		var mt = MOZTouch.getObjectByNamespace(event.currentTarget, 'touch');
		if(mt.timer) {
			window.clearTimeout(mt.timer);
			mt.timer = null;
		}
		mt = {};
		
		return data.mozCallback(event, data);
	};
	
	MOZTouch.touchCancel = function(event, data) {
		var mt = MOZTouch.getObjectByNamespace(event.currentTarget, 'touch');
		if(mt.timer) {
			window.clearTimeout(mt.timer);
			mt.timer = null;
		}
		mt = {};
		
		return data.mozCallback(event, data);
	};
	
	MOZTouch.touchTimerCancel = function(mt) {
		//var evt = document.createEvent("TouchEvent");
		//evt.initEvent("MozTouchCancel", true, true); // , window, 0, mt.event.clientX, mt.event.clientY, mt.event.pageX, mt.event.pageY, false, false, false, false, 0, null
		//evt.currentTarget = mt.event.currentTarget;
		//console.debug(mt);
		//mt.event.target.dispatchEvent(mt.event);
	}
	
	MOZTouch.sidCleanup = function(sid) {
		if( ! MOZTouch._sids[sid]) return;
		var mt = MOZTouch.getObjectByNamespace(MOZTouch._sids[sid], 'gesture');
		if( ! mt) return;
		delete mt.paths[sid];
		delete MOZTouch._sids[sid];
	};
	
	MOZTouch.gestureStart = function(event, data) {
		var mt = MOZTouch.getObjectByNamespace(event.currentTarget, 'gesture');
		
		MOZTouch.sidCleanup(event.streamId);
  	MOZTouch._sids[event.streamId] = event.currentTarget;
  	
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
				return data.mozCallback(event, data);
			}
  	}
	};
	
	MOZTouch.gestureChange = function(event, data) {
		var mt = MOZTouch.getObjectByNamespace(event.currentTarget, 'gesture');
		
  	if( ! MOZTouch._sids[event.streamId]) MOZTouch._sids[event.streamId] = event.currentTarget;
  	
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
				return data.mozCallback(event, data);
			}
  	}
	};
	
	MOZTouch.gestureEnd = function(event, data) {
		var mt = MOZTouch.getObjectByNamespace(event.currentTarget, 'gesture');
		
  	if( ! MOZTouch._sids[event.streamId]) MOZTouch._sids[event.streamId] = event.currentTarget;
  	
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
				MOZTouch.sidCleanup(event.streamId);
				return data.mozCallback(event, data);
			}
  	}
		MOZTouch.sidCleanup(event.streamId);
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
})(this._anyNoConflict, this._anyMtNoConflict);