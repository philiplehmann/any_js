//     any.js @VERSION@
//     (c) 2011 Philip Lehmann, Lukas Westermann, at-point ag
//     any.js is freely distributable under the MIT license.
//     Portions of any.js are inspired or borrowed from Underscore.js,
//     Prototype and jQuery.
//     For all details and documentation:
//     TODO: gh-pages

(function($a) {
  // ## Common variables
  //
  
  // Is either `window` or `global` server object.
  var root = this;
  
  // Internal save object, so we can asume `$mt` is available in
  // our context.
  var $mt = {};

  // Export our methods as `$a` in `root` (i.e. `window`).
  $a.mt = $mt;

  // Current version
  $mt.VERSION = '0.0.1';
		
	// List of known touch events, any other events are directly passed to `$a.bind`.
	$mt.TOUCH_EVENTS = ['touchstart', 'touchmove', 'touchend', 'gesturestart', 'gesturechange', 'gestureend'];
	
	// Browser feature detection
	$mt.support = { touch: false, mozTouch: false };
	
	// Currently used backend.
	$mt.backend = null;
	
	$mt.bind = function(node, event, callback, useCapture) {
		if ($mt.backend && $mt.TOUCH_EVENTS.indexOf(event) != -1) $mt.backend.bind(node, event, callback, useCapture);
		else $a.bind(node, event, callback, useCapture);
	};
	
	$mt.unbind = function(node, event, callback, useCapture) {
		if ($mt.backend && $mt.TOUCH_EVENTS.indexOf(event) != -1) $mt.backend.unbind(node, event, callback, useCapture);
		else $a.unbind(node, event, callback, useCapture);		
	};

  $mt.emulate = function() {
    $mt.backend = root._MTEmulateTouch;
  };

  // check for touch support
  $mt.support.mozTouch = $a._supportsEvent('moztouchstart');
  $mt.support.touch = $a._supportsEvent('touchstart') || $mt.support.mozTouch;

  // set default backend
	if ($mt.support.touch) {
	  $mt.backend = $mt.support.mozTouch ? root._MTMozTouch : root._MTWebkitTouch;
	}
	
})(this._anyNoConflict);