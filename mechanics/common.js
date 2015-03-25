/**
 * this file is meant to contain common function definitions used throughout the code
 */

// math.abs is linked to abs for speed
var abs = Math.abs;

/**
 * [getParameterByName description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}