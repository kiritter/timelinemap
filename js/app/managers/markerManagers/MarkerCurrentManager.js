(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.MarkerCurrentManager = class MarkerCurrentManager {
        static currentYear = MarkerCurrentManager._getCurrentYear();

        constructor(gaChannel, mapBoth, globalState) {
            this.gaChannel = gaChannel;
            this.mapBoth = mapBoth;
            this.globalState = globalState;

            this.list = [
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_YUSHI, url: 'geojson/01_timelines/10a_current.geojson'},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_JOMON, url: 'geojson/01_timelines/20a_current.geojson'},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_SEKKI, url: 'geojson/01_timelines/30a_current.geojson'},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_EARTH, url: 'geojson/01_timelines/90a_current.geojson'},
            ];

            this.coreManagerByKey = this._createCoreManagerMap();
        }

        static _getCurrentYear() {
            var now = new Date();
            var currentYear = now.getFullYear();
            return currentYear;
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
            var layerName = '';
            var callbacks = {
                'tooltipContentCallback': MarkerCurrentManager._buildTooltipContent,
                'popupContentCallback': null,
                'filterGeojsonPredicate': MarkerCurrentManager._filterGeojsonPredicate,
            };
            var options = {
                shouldCircleMarker: true,
                circleMarkerColNames: {radius: 'circleMarkerRadius', color: 'circleMarkerColor', isFill: 'circleMarkerIsFill'},
                shouldTooltip: true,
                tooltipNames: {className: 'tooltip-current', geZoom: 'geZoom', direction: 'direction'},
                shouldPopup: false,
            };
            var coreManager = new MyApp.MarkerCoreManager(this.gaChannel, this.mapBoth, this.globalState, layerName, callbacks, options, targetTimeRangeType, targetUrl);
            return coreManager;
        }

        async init(isInitAdd) {
            var promiseList = [];
            for (var [key, coreManager] of this.coreManagerByKey) {
                promiseList.push(coreManager.init(isInitAdd));
            }
            await Promise.all(promiseList);
        }
        initAdd() {
            for (var [key, coreManager] of this.coreManagerByKey) {
                coreManager.initAdd();
            }
        }

        static _buildTooltipContent(properties) {
            var content = `
<div>
    <div>${properties.dispYear}</div>
    <div class="tooltip-current-name">${properties.eventName}</div>
    <div class="desc-content">${properties.desc}</div>
</div>
`;
            return content;
        }

        static _buildPopupContent(properties) {
            var content = `
`;
            return content;
        }

        static _filterGeojsonPredicate(properties) {
            if (properties.typeId === MyApp.globalState.const.TIME_RANGE_TYPE_EARTH) {
                if (properties.year === 0) {
                    return true;
                }
                return false;
            }

            if (properties.year === MarkerCurrentManager.currentYear) {
                return true;
            }
            return false;
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
