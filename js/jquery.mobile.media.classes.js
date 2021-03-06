/*
* jQuery Mobile Framework : resolution and CSS media query related helpers and behavior
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function( $, undefined ) {

var $window = $( window ),
	$html = $( "html" ),

	//media-query-like width breakpoints, which are translated to classes on the html element
	resolutionBreakpoints = [ 320, 480, 768, 1024 ];

/*
	private function for adding/removing breakpoint classes to HTML element for faux media-query support
	It does not require media query support, instead using JS to detect screen width > cross-browser support
	This function is called on orientationchange, resize, and mobileinit, and is bound via the 'htmlclass' event namespace
*/
function detectResolutionBreakpoints() {
	var currWidth = $window.width(),
		minPrefix = "min-width-",
		maxPrefix = "max-width-",
		minBreakpoints = [],
		maxBreakpoints = [],
		unit = "px",
		breakpointClasses;

	$html.removeClass( minPrefix + resolutionBreakpoints.join(unit + " " + minPrefix) + unit + " " +
		maxPrefix + resolutionBreakpoints.join( unit + " " + maxPrefix) + unit );

	$.each( resolutionBreakpoints, function( i, breakPoint ) {
		if( currWidth >= breakPoint ) {
			minBreakpoints.push( minPrefix + breakPoint + unit );
		}
		if( currWidth <= breakPoint ) {
			maxBreakpoints.push( maxPrefix + breakPoint + unit );
		}
	});

	if ( minBreakpoints.length ) {
		breakpointClasses = minBreakpoints.join(" ");
	}
	if ( maxBreakpoints.length ) {
		breakpointClasses += " " +  maxBreakpoints.join(" ");
	}

	$html.addClass( breakpointClasses );
};

/* $.mobile.addResolutionBreakpoints method:
	pass either a number or an array of numbers and they'll be added to the min/max breakpoint classes
	Examples:
		$.mobile.addResolutionBreakpoints( 500 );
		$.mobile.addResolutionBreakpoints( [500, 1200] );
*/
$.mobile.addResolutionBreakpoints = function( newbps ) {
	if( $.type( newbps ) === "array" ){
		resolutionBreakpoints = resolutionBreakpoints.concat( newbps );
	} else {
		resolutionBreakpoints.push( newbps );
	}

	resolutionBreakpoints.sort(function( a, b ) {
		return a - b;
	});

	detectResolutionBreakpoints();
};

/* add classes to HTML element and set handlers to update those on orientationchange and resize */	
$window.bind( "orientationchange.htmlclass throttledresize.htmlclass", function( event ) {

	// add orientation class to HTML element on flip/resize.
	if ( event.orientation ) {
		$html.removeClass( "portrait landscape" ).addClass( event.orientation );
	}

	// add classes to HTML element for min/max breakpoints
	detectResolutionBreakpoints();
});

/* Manually trigger an orientationchange event when the dom ready event fires.
	This will ensure that any viewport meta tag that may have been injected
	has taken effect already, allowing us to properly calculate the width of the
	document.
*/
$(function() {
	//trigger event manually
	$window.trigger( "orientationchange.htmlclass" );
});

})(jQuery);