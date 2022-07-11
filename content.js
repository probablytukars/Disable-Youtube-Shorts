'use strict'
function getMutationObserver() {
	var mutObserver = window.MutationObserver || window.WebKitMutationObserver;
	return mutObserver
}
function createObserver(callback, where, search) {
	var mutobs = getMutationObserver()
	var observer = new mutobs(callback)
	observer.observe(where, search)
	return observer
}
function onURLChange() {
	var newurl = document.location.href
	if (newurl.includes("/shorts/")) {
		var videoLink = newurl.split('/')
		window.location.replace(window.location.origin + "/watch?v=" + videoLink[videoLink.length-1])
	}
}
function onWindowLoad() {
	var lastHref = document.location.href
	window.onload = function () {
		createObserver((m) => {
			m.forEach(function() {
				if (lastHref != document.location.href) {
					lastHref = document.location.href
					onURLChange()
				}
			})
		}, document.body, {childList:true, subtree:true})
	}
}
function waitForElm(selector) {
	return new Promise(resolve => {
		if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
		var observer = createObserver((m) => {
			if (document.querySelector(selector)) {
				resolve(document.querySelector(selector));
				observer.disconnect();
			}
		}, document.body, {childList:true, subtree:true})
	})
}
function updateBody() {
	var anchors = document.querySelectorAll('a');
	for (var i = 0; i < anchors.length; i++) {
		var anchor = anchors[i]
		var href = anchor.href;
		if (href.includes("/watch?v=")) {
			var root = anchor.closest('ytd-video-renderer')
			if (root) {
				if (root.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style=DEFAULT]')) {
					anchor.onclick = () => void 0
				}
			}
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
}
function recordNodeUpdates(maxUpdates, callback) {
	var numberOfUpdates = 0
	createObserver((m) => {
		m.forEach(record => {numberOfUpdates += record.addedNodes.length})
		if (numberOfUpdates > maxUpdates - 1) {updateBody(); numberOfUpdates = 0; callback()}
	}, document.body, {childList:true, subtree:true})
}
if (getMutationObserver()) {
	const maxUpdates = 200
	var lastElementUpdate = 0
	var lastIntervalUpdate = 0;
	onURLChange(); onWindowLoad()
	updateBody()
	recordNodeUpdates(maxUpdates, () => {lastElementUpdate = Date.now()})
	setInterval(()=>{
		var elTime = Date.now() - lastElementUpdate
		var inTime = Date.now() - lastIntervalUpdate
		if (elTime > 1 && inTime > elTime) {
			lastIntervalUpdate = Date.now()
			updateBody()
		}
	}, 500)
	waitForElm('#endpoint[title=Shorts]').then((elm) => {
		elm.onclick = function(event) {
			event.preventDefault()
			window.location.replace(window.location.origin + "/hashtag/shorts")
		}
	})
}