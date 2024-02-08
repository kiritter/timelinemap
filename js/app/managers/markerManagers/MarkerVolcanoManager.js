(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.MarkerVolcanoManager = class MarkerVolcanoManager {
        constructor(gaChannel, mapBoth, globalState) {
            this.gaChannel = gaChannel;
            this.mapBoth = mapBoth;
            this.globalState = globalState;

            this.list = [
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_YUSHI, url: 'geojson/01_timelines/16a_volcano.geojson'},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_JOMON, url: 'geojson/01_timelines/26a_volcano.geojson'},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_SEKKI, url: 'geojson/01_timelines/36a_volcano.geojson'},
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_EARTH, url: 'geojson/01_timelines/96a_volcano.geojson'},
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
            var layerName = 'volcano';
            var callbacks = {
                'tooltipContentCallback': MarkerVolcanoManager._buildTooltipContent,
                'tooltipCalcAbsoluteDivPosCallback': MyApp.UtilLeafletTooltipAbsoluteDivPos.calcAbsoluteDivPos,
                'popupContentCallback': null,
            };
            var options = {
                shouldCircleMarker: false,
                shouldTooltip: true,
                tooltipNames: {className: 'tooltip-volcano', geZoom: 'geZoom', direction: 'direction'},
                shouldPopup: false,
                isCustomIconMarker: true,
                customIconUrl: 'images/volcano.png',
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
                content = MarkerVolcanoManager._buildTooltipContentWithoutUrl(properties);
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
