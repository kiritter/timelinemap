(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.EachPolygonManager = class EachPolygonManager {
        constructor(gaChannel, mapBoth, globalState, layerName, url, isLazyLoad) {
            this.gaChannel = gaChannel;
            this.mapBoth = mapBoth;
            this.globalState = globalState;
            this.layerName = layerName;
            this.isLazyLoad = isLazyLoad;
            this.callbacks = {};
            this.options = {
                geometryType: 'MultiPolygon',
                color: '#FF0',
                weight: 1,
            };

            this.list = [
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_YUSHI, url: url},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_JOMON, url: url},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_SEKKI, url: url},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_EARTH, url: url},
            ];

            var isAsyncPublish = true;
            this.lazyLoadChannel = new MyApp.MyChannel(isAsyncPublish);

            this.coreManagerByKey = this._createCoreManagerMap();
        }

        _createCoreManagerMap() {
            var coreManagerByKey = new Map();
            var self = this;
            this.list.forEach((el) => {
                var coreManager = self._createCoreManager(el.timeRangeType, el.url);
                coreManagerByKey.set(`${el.timeRangeType}`, coreManager);
            });
            return coreManagerByKey;
        }
        _createCoreManager(targetTimeRangeType, targetUrl) {
            var layerName = this.layerName;
            var coreManager = new MyApp.PolygonCoreManager(this.gaChannel, this.mapBoth, this.globalState, layerName, this.callbacks, this.options, targetTimeRangeType, targetUrl, this.isLazyLoad, this.lazyLoadChannel);
            return coreManager;
        }

        async init() {
            var promiseList = [];
            for (var [key, coreManager] of this.coreManagerByKey) {
                promiseList.push(coreManager.init());
            }
            await Promise.all(promiseList);
        }

        redraw(selectedTimeRangeType) {
            for (var [key, coreManager] of this.coreManagerByKey) {
                coreManager.clearLayers();
            }

            var currentTimeRangeType = selectedTimeRangeType;
            var targetCoreManager = this.coreManagerByKey.get(`${currentTimeRangeType}`);
            targetCoreManager.redrawLayers();
        }

    };

}(this));
