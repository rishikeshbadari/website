/* Art cache — localStorage API cache + IndexedDB image blob cache */
var ArtCache = (function () {

    // Content hash drives cache invalidation for both stores
    var dataHash = (function () {
        var str = JSON.stringify(artData);
        var h = 5381;
        for (var i = 0; i < str.length; i++) {
            h = ((h << 5) + h) + str.charCodeAt(i);
            h = h & h;
        }
        return (h >>> 0).toString(36);
    })();

    // --- API response cache (localStorage) ---

    var artCache = (function () {
        var PREFIX = 'artcache_';
        var key = PREFIX + dataHash;
        var store = null;

        try { store = JSON.parse(localStorage.getItem(key)); } catch (e) {}
        if (!store || typeof store !== 'object') store = { music: {}, movies: {} };

        // Evict stale cache entries from other data versions
        try {
            for (var i = localStorage.length - 1; i >= 0; i--) {
                var k = localStorage.key(i);
                if (k && k.slice(0, PREFIX.length) === PREFIX && k !== key) {
                    localStorage.removeItem(k);
                }
            }
        } catch (e) {}

        var saveTimer;
        function scheduleSave() {
            clearTimeout(saveTimer);
            saveTimer = setTimeout(function () {
                try { localStorage.setItem(key, JSON.stringify(store)); } catch (e) {}
            }, 500);
        }

        return {
            get: function (type, idx, field) {
                var entry = store[type] && store[type][idx];
                return entry ? entry[field] : undefined;
            },
            set: function (type, idx, field, value) {
                if (!store[type]) store[type] = {};
                if (!store[type][idx]) store[type][idx] = {};
                store[type][idx][field] = value;
                scheduleSave();
            }
        };
    })();

    // --- Image blob cache (IndexedDB) ---

    var imgCache = (function () {
        var DB = 'artImgCache';
        var STORE = 'imgs';
        var PREFIX = 'img_';
        var db = null;

        function open(cb) {
            if (db) { cb(db); return; }
            var req = indexedDB.open(DB, 1);
            req.onupgradeneeded = function (e) {
                var d = e.target.result;
                if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE);
            };
            req.onsuccess = function (e) { db = e.target.result; cb(db); };
            req.onerror = function () { cb(null); };
        }

        function makeKey(type, idx) { return PREFIX + dataHash + '_' + type + '_' + idx; }

        // Evict entries from stale data versions
        open(function (d) {
            if (!d) return;
            var tx = d.transaction(STORE, 'readwrite');
            var s = tx.objectStore(STORE);
            var req = s.getAllKeys();
            req.onsuccess = function () {
                req.result.forEach(function (k) {
                    if (k.indexOf(PREFIX) === 0 && k.indexOf(PREFIX + dataHash) !== 0) s.delete(k);
                });
            };
        });

        return {
            get: function (type, idx, cb) {
                open(function (d) {
                    if (!d) { cb(null); return; }
                    var req = d.transaction(STORE, 'readonly').objectStore(STORE).get(makeKey(type, idx));
                    req.onsuccess = function () { cb(req.result ? URL.createObjectURL(req.result) : null); };
                    req.onerror = function () { cb(null); };
                });
            },
            set: function (type, idx, blob) {
                open(function (d) {
                    if (!d) return;
                    d.transaction(STORE, 'readwrite').objectStore(STORE).put(blob, makeKey(type, idx));
                });
            }
        };
    })();

    function loadImageWithCache(type, idx, url, img) {
        imgCache.get(type, idx, function (blobUrl) {
            img.onload = function () { img.classList.add('loaded'); };
            if (blobUrl) {
                img.src = blobUrl;
            } else {
                fetch(url)
                    .then(function (res) { return res.blob(); })
                    .then(function (blob) {
                        imgCache.set(type, idx, blob);
                        img.src = URL.createObjectURL(blob);
                    })
                    .catch(function () { img.src = url; });
            }
        });
    }

    return { artCache: artCache, imgCache: imgCache, dataHash: dataHash, loadImageWithCache: loadImageWithCache };

})();
