(function($a) {
  // ## Common variables
  //
  // These are used to simplify working in the anonymous
  // function and provide access to stuff like `window`.

  // Access root object, `window` in the browser or `global` on a server
  var root = this;
  
  // Internal save object, so we can asume `MTMozTouch` is available in
  // our context.  
  var MTMozTouch = {};
  
  // Export MTMozTouch object.
  root._MTMozTouch = MTMozTouch;
  
  MTMozTouch.bind = function() { /* TODO */ };
  MTMozTouch.unbind = function() { /* TODO */ };
  
})(this._anyNoConflict);