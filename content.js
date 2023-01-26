"use strict";

const shortVideoRegex = /\/shorts\/([^\/]+)/;

function getMutationObserver() {
  return window.MutationObserver || window.WebKitMutationObserver;
}

function createObserver(callback, where, search) {
  const mutObserver = getMutationObserver();
  const observer = new mutObserver(callback);
  observer.observe(where, search);
  return observer;
}

function onURLChange() {
  const newURL = document.location.href;
  const match = newURL.match(shortVideoRegex);
  if (match) {
    const videoId = match[1];
    window.location.replace(`${window.location.origin}/watch?v=${videoId}`);
  }
}

function updateLinks() {
  const anchors = document.querySelectorAll("a");
  for (const anchor of anchors) {
    const href = anchor.href;
    const match = href.match(shortVideoRegex);
    if (match) {
      const videoId = match[1];
      anchor.href = `/watch?v=${videoId}`;
      anchor.onclick = function (event) {
        event.preventDefault();
        window.location.replace(`${window.location.origin}/watch?v=${videoId}`);
      };
    }
  }
}

if (getMutationObserver()) {
  onURLChange();
  updateLinks();
  createObserver(
    () => {
      updateLinks();
    },
    document.body,
    { childList: true, subtree: true }
  );
}
