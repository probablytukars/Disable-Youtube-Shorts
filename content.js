'use strict';
var oldHref = document.location.href;
window.onload = function() {
	var bodyList = document.querySelector("body")
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	if (MutationObserver) {
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function() {
				if (oldHref != document.location.href) {
					oldHref = document.location.href;
					onURLChange(document.location.href)
				}
			})
		})
	}
	var config = {childList: true, subtree: true};
	observer.observe(bodyList, config);
}
function onURLChange(newurl) {
	if (newurl.includes("/shorts/")) {
		var video_link = newurl.split('/')
		var length = video_link.length
		var link = "/watch?v=" + video_link[length-1]
		window.location.replace(window.location.origin + link)
	}
}
onURLChange(document.location.href)
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
		if (MutationObserver) {
			const observer = new MutationObserver(mutations => {
				if (document.querySelector(selector)) {
					resolve(document.querySelector(selector));
					observer.disconnect();
				}
			});
			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		}
        
    });
}
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
	if (href.includes("/watch?v=")) {
		var root = anchor.closest('ytd-video-renderer')
		if (root) {if (root.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style=DEFAULT]')) {anchor.onclick = () => void 0}}
	}
	if (href.includes("/shorts/")) {
		var video_link = href.split('/')
		var length = video_link.length
		var link = "/watch?v=" + video_link[length-1]
		anchor.href = link
		anchor.onclick = function(event) {
			event.preventDefault()
			anchor.href = link
			window.location.replace(window.location.origin + link)
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
	var anchors = document.querySelectorAll('a');
	for (var i = 0; i < anchors.length; i++) {updateShortsAnchor(anchors[i])}
}
var numberOfUpdates = 0;
var maxUpdates = 200
function recordNodeUpdate() {numberOfUpdates++; if (numberOfUpdates > maxUpdates - 1) {updateBody() ; numberOfUpdates = 0}; lastElementUpdate = Date.now()}
observeDOM(document.body, function(m){m.forEach(record => record.addedNodes.length & record.addedNodes.forEach(recordNodeUpdate))})
updateBody()
waitForElm('#endpoint[title=Shorts]').then((elm) => {
	elm.onclick = function(event) {
		event.preventDefault()
		window.location.replace(window.location.origin + "/hashtag/shorts")
	}
})
