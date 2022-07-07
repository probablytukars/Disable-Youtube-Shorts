'use strict';
var observeDOM = (function(){
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	return function( obj, callback ){
		if( !obj || obj.nodeType !== 1 ) return;
		if( MutationObserver ){
			var mutationObserver = new MutationObserver(callback)
			mutationObserver.observe( obj, { childList:true, subtree:true })
			return mutationObserver
		}
		else if( window.addEventListener ){
			obj.addEventListener('DOMNodeInserted', callback, false)
			obj.addEventListener('DOMNodeRemoved', callback, false)
		}
	}
})()
function updateShortsAnchor(anchor) {
	var href = anchor.href;
	if (href.includes("/shorts/")) {
		var video_link = href.split('/')
		var length = video_link.length
		anchor.href = "/watch?v="+video_link[length-1]
		anchor.onclick = function(event) {
			event.preventDefault()
			anchor.href = "/watch?v="+video_link[length-1]
			window.location.replace(window.location.origin + "/watch?v="+video_link[length-1])
		}
	}
}
var lastElementUpdate = 0;
var lastIntervalUpdate = 0;
setInterval(function() {
	var elTime = Date.now() - lastElementUpdate
	var inTime = Date.now() - lastIntervalUpdate
	if (elTime > 1 && inTime > elTime) {
		lastIntervalUpdate = Date.now()
		updateBody()
	}
}, 500)
function updateBody() {
	var shorts_overlay = document.querySelectorAll("ytd-thumbnail-overlay-time-status-renderer[overlay-style=SHORTS]")
	for (var i = 0; i < shorts_overlay.length; ++i) {
		shorts_overlay[i].style.cssText = "background-color: #a66 !important"
		shorts_overlay[i].querySelector("yt-icon.ytd-thumbnail-overlay-time-status-renderer").style.cssText = "color: black !important"
	}
	var anchors = document.getElementsByTagName('a');
	for (var i = 0; i < anchors.length; ++i) {updateShortsAnchor(anchors[i])}
}

var numberOfUpdates = 0;
function recordNodeUpdate() {numberOfUpdates++; if (numberOfUpdates > 100) {updateBody() ; numberOfUpdates = 0}; lastElementUpdate = Date.now()} //prevent performance degredation

observeDOM(document.body, function(m){m.forEach(record => record.addedNodes.length & record.addedNodes.forEach(recordNodeUpdate))})
updateBody()