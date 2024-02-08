L.GridLayer.TileCanvas.Cache = L.GridLayer.TileCanvas.extend({

    _myGetKey: function(z, x, y) {
        var key = `${this._MY_CACHE_NAME}-${z}/${x}/${y}`;
        return key;
    },

    myHasCache: async function(z, x, y) {
        var key = this._myGetKey(z, x, y);
        var exists = await this._cacheRepo.exists(key)
        return exists;
    },

    initialize: function(options) {
        this._MY_LAYER_NAME = options.myLayerName;
        this._MY_CACHE_NAME = options.myCacheName;

        L.GridLayer.TileCanvas.prototype.initialize.call(this, options);

        this._cacheRepo = options.myCacheRepo;

        var self = this;
        this.on('tile-image-loaded', function(event) {
            var key = self._myGetKey(event.coords.z, event.coords.x, event.coords.y);
            createImageBitmap(event.tileCanvas)
                .then((bitmap) => {
                    if (self._MY_LAYER_NAME !== 'osm') {
                    }
                    self._cacheRepo.save(key, bitmap);
                })
                .catch((err) => {
                    console.error(`[${self._MY_LAYER_NAME}]`, err);
                });
        });

    },

    _myDrawToCanvas: function(tileCanvas, coords, myTileUrl) {
        var key = this._myGetKey(coords.z, coords.x, coords.y);
        var self = this;
        this._cacheRepo.findBy(key)
            .then((bitmap) => {
                if (bitmap) {
                    if (self._MY_LAYER_NAME !== 'osm') {
                    }
                    var ctx = tileCanvas.getContext('2d');
                    ctx.drawImage(bitmap, 0, 0);
                    return;
                }else{
                    L.GridLayer.TileCanvas.prototype._myDrawToCanvas.call(self, tileCanvas, coords, myTileUrl);
                }
            });
    },

});

L.gridLayer.tileCanvas.cache = function(options) {
    return new L.GridLayer.TileCanvas.Cache(options);
};
