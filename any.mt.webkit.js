(function($a) {
  // ## Common variables
  //
  // These are used to simplify working in the anonymous
  // function and provide access to stuff like `window`.

  // Access root object, `window` in the browser or `global` on a server
  var root = this;
  
  // Internal save object, so we can asume `MTWebkitTouch` is available in
  // our context.  
  var MTWebkitTouch = {};
  
  // Export MTMozTouch object.
  root._MTWebkitTouch = MTWebkitTouch;
  
  MTWebkitTouch.bind = function() { /* TODO */ };
  MTWebkitTouch.unbind = function() { /* TODO */ };
  
})(this._anyNoConflict);