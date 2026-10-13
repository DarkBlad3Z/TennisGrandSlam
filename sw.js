/* Grand Slam Tracker — offline support.
 *
 * Strategy:
 *   index.html / navigations -> network first, cache as fallback.
 *     So when you push a new version to GitHub, the next online visit gets it;
 *     with no signal you still get the last copy that loaded.
 *   icons, manifest          -> cache first (they rarely change).
 *
 * Bump CACHE below whenever you deploy, so old files get cleaned out.
 */
"use strict";

var CACHE = "slam-tracker-v1";

var SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/favicon.svg",
  "./icons/favicon.ico",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE)
      // addAll fails the whole install if any single file 404s, so add individually
      .then(function (c) {
        return Promise.all(SHELL.map(function (u) {
          return c.add(new Request(u, { cache: "reload" }))["catch"](function (err) {
            console.warn("[sw] could not precache", u, err && err.message);
          });
        }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          return k === CACHE ? null : caches["delete"](k);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;

  // only handle our own GETs
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  var isDoc = req.mode === "navigate" ||
              (req.headers.get("accept") || "").indexOf("text/html") !== -1;

  if (isDoc) {
    // network first: always prefer a freshly deployed page
    e.respondWith(
      fetch(req)
        .then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
          return res;
        })
        ["catch"](function () {
          return caches.match(req).then(function (hit) {
            return hit || caches.match("./index.html") || caches.match("./");
          });
        })
    );
    return;
  }

  // everything else: cache first, then network
  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      });
    })
  );
});
