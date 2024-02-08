(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.MarkerGlobalEventManager = class MarkerGlobalEventManager {
        constructor(gaChannel, mapBoth, globalState) {
            this.gaChannel = gaChannel;
            this.mapBoth = mapBoth;
            this.globalState = globalState;

            this.list = [
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_YUSHI, url: 'geojson/01_timelines/19a_global_event.geojson'},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_JOMON, url: 'geojson/01_timelines/29a_global_event.geojson'},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_SEKKI, url: 'geojson/01_timelines/39a_global_event.geojson'},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_EARTH, url: 'geojson/01_timelines/99a_global_event.geojson'},
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
            var layerName = 'global_event';
            var callbacks = {
                'tooltipContentCallback': MarkerGlobalEventManager._buildTooltipContent,
                'tooltipCalcAbsoluteDivPosCallback': MyApp.UtilLeafletTooltipAbsoluteDivPos.calcAbsoluteDivPos,
                'popupContentCallback': null,
            };
            var options = {
                shouldCircleMarker: false,
                shouldTooltip: true,
                tooltipNames: {className: 'tooltip-global', geZoom: 'geZoom', direction: 'direction'},
                shouldPopup: false,
                isCustomIconMarker: true,
                customIconUrl: 'images/global_event.png',
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
