(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.MarkerEventArtManager = class MarkerEventArtManager {
        static EVENT_TYPE = 2;

        constructor(gaChannel, mapBoth, globalState) {
            this.gaChannel = gaChannel;
            this.mapBoth = mapBoth;
            this.globalState = globalState;

            this.list = [
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_YUSHI, url: 'geojson/01_timelines/15a_event.geojson'},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_JOMON, url: 'geojson/01_timelines/25a_event.geojson'},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_SEKKI, url: 'geojson/01_timelines/35a_event.geojson'},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_EARTH, url: 'geojson/01_timelines/95a_event.geojson'},
            ];

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
            var layerName = 'event_art';
            var callbacks = {
                'tooltipContentCallback': MarkerEventArtManager._buildTooltipContent,
                'tooltipCalcAbsoluteDivPosCallback': MyApp.UtilLeafletTooltipAbsoluteDivPos.calcAbsoluteDivPos,
                'popupContentCallback': null,
                'filterGeojsonPredicate': MarkerEventArtManager._filterGeojsonPredicate,
            };
            var options = {
                shouldCircleMarker: false,
                shouldTooltip: true,
                tooltipNames: {className: 'tooltip-event-art', geZoom: 'geZoom', direction: 'direction'},
                shouldPopup: false,
                isCustomIconMarker: true,
                customIconUrl: 'images/event_art.png',
            };
            var coreManager = new MyApp.MarkerCoreManager(this.gaChannel, this.mapBoth, this.globalState, layerName, callbacks, options, targetTimeRangeType, targetUrl);
            return coreManager;
        }

        async init() {
            var promiseList = [];
            for (var [key, coreManager] of this.coreManagerByKey) {
                promiseList.push(coreManager.init());
            }
            await Promise.all(promiseList);
        }
        initAdd() {
            for (var [key, coreManager] of this.coreManagerByKey) {
                coreManager.initAdd();
            }
        }

        static _buildTooltipContent(properties) {
            var content;
                content = MarkerEventArtManager._buildTooltipContentWithoutUrl(properties);
            return content;
        }

        static _buildTooltipContentWithoutUrl(properties) {
            var content = `
<div>
    <div>${properties.dispYear}</div>
    <div>${properties.eventName}</div>
</div>
<div class="tooltip-absolute-div">
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
            if (properties.eventType === MarkerEventArtManager.EVENT_TYPE) {
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
