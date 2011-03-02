// any.js 0.0.1 (rev:6d6a979)
// (c) 2011 Philip Lehmann, Lukas Westermann, at-point ag
// any.js is freely distributable under the MIT license.
// Portions of any.js are inspired or borrowed from Underscore.js,
// Prototype and jQuery.
// For all details and documentation:
// TODO: gh-pages
(function(){var b={};this._MTMozTouch=b;b.bind=function(){};b.unbind=function(){}})(this._anyNoConflict);(function(){var b={};this._MTWebkitTouch=b;b.bind=function(){};b.unbind=function(){}})(this._anyNoConflict);(function(){var b={};this._MTEmulateTouch=b;b.bind=function(){};b.unbind=function(){}})(this._anyNoConflict);
(function(b){var g=this,a={};b.mt=a;a.VERSION="0.0.1";a.TOUCH_EVENTS=["touchstart","touchmove","touchend","gesturestart","gesturechange","gestureend"];a.support={touch:false,mozTouch:false};a.backend=null;a.bind=function(d,c,e,f){a.backend&&a.TOUCH_EVENTS.indexOf(c)!=-1?a.backend.bind(d,c,e,f):b.bind(d,c,e,f)};a.unbind=function(d,c,e,f){a.backend&&a.TOUCH_EVENTS.indexOf(c)!=-1?a.backend.unbind(d,c,e,f):b.unbind(d,c,e,f)};a.emulate=function(){a.backend=g._MTEmulateTouch};if(a.support.touch)a.backend=
a.support.mozTouch?g._MTMozTouch:g._MTWebkitTouch})(this._anyNoConflict);
