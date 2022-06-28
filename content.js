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

function processNode(node) {
	if (node.tagName == "A") {updateShortsAnchor(node)}
	else if (node.tagName == "ytd-thumbnail-overlay-time-status-renderer".toUpperCase() && node.getAttribute("overlay-style") == "SHORTS") {node.style.display = "none"}
}

observeDOM(document.body, function(m){m.forEach(record => record.addedNodes.length & record.addedNodes.forEach(processNode))})

function updateBody() {
	var shorts_overlay = document.querySelectorAll("ytd-thumbnail-overlay-time-status-renderer[overlay-style=SHORTS]")
	for (var i = 0; i < shorts_overlay.length; ++i) {
		if (shorts_overlay[i].getAttribute("overlay-style") == "SHORTS") {
			shorts_overlay[i].style.display = "none"
		}
	}
	var anchors = document.getElementsByTagName('a');
	for (var i = 0; i < anchors.length; ++i) {updateShortsAnchor(anchors[i])}
}
updateBody()